import { AVATAR_CONFIG } from '../../lib/avatars'
import { getCompleteSystemPrompt, DIAGRAM_PROMPT } from '../../context/prompts.js'
import { extractDiagramSpec } from '../../lib/diagramSpec.js'

import { parseRelatedContent, generateFallbackArticles, generateFallbackVideos, getQuotaStatus } from '../../lib/suggestions.js'

const GROQ_BASE_URL = 'https://api.groq.com/openai/v1'
// llama-3.1-8b-instant was removed from Groq's catalog (confirmed via their
// /v1/models endpoint - no longer listed for this account). Primary model
// chosen for speed/size parity with the old one; the other two are ordered
// fallbacks the existing per-model retry loop already tries automatically,
// so a single future model removal doesn't take the whole app down again.
const GROQ_MODELS = ['openai/gpt-oss-20b', 'qwen/qwen3.8-27b', 'openai/gpt-oss-120b']
const AI_PROVIDER_ORDER = ['groq']
const AI_MAX_OUTPUT_TOKENS = 1800
const AI_TIMEOUT_MS = Number(process.env.AI_TIMEOUT_MS || 20000)
// Prior turns included as real chat context so follow-up questions in the
// same session aren't answered in isolation. 6 messages = last 3 exchanges -
// enough for real continuity without ballooning every request's token cost.
const AI_HISTORY_MESSAGES = 6

const COMPUTER_TEACHER_GANGULYS_PROMPT = `You are an AI Avatar as Computer Teacher, created by Sir Ganguly, a kind and supportive Computer Teacher, to help learners improve their Computer subject, especially for the ICSE curriculum.
You speak in simple, friendly English.
Only when the student explicitly asks who you are or what your name is, introduce yourself as "I am AI Avatar as Computer Teacher, created by Sir Ganguly." Never include this introduction in a normal answer.
Always use a calm, warm, and encouraging tone like a teacher who wants every student to feel confident and happy to learn.
Do not use markdown symbols like #, *, or special formatting.
The only exception is for programming code, which must be enclosed in triple backticks like this:
\`\`\`java
System.out.println("Hello, world!");
\`\`\`

Structure every answer using these labeled sections, in this exact order, each starting on its own new line with the exact label shown:

Question:
(Repeat the student's question)

Explanation:
(A detailed, clear explanation in friendly and simple language)

Example:
(One worked example. For programming questions, put the complete runnable code here inside triple backticks, with a one-line explanation of what it does first.)

Key Notes:
(3 to 6 short numbered takeaways: 1. ... 2. ... 3. ...)

Never print the parenthesized template instructions themselves - replace each one with real content.
Make the Explanation genuinely detailed: normally 4 to 8 sentences that teach the idea properly, not a one-line summary.
For programming questions, especially when the student says "write a program", make sure the Example section contains the complete, correct, runnable program - do not just describe it in words.

For school Java questions about a "magic number", use the ICSE-style definition: repeatedly add the digits of the number until a single digit remains; if the final single digit is 1, the number is a magic number. Do not use squares, powers, Armstrong-number logic, or sum-of-cubes logic unless the student explicitly asks for that different definition.
Keep all code short, clear, and easy to understand, especially for ICSE students and slow learners.
Avoid harsh, negative, or confusing words.
Always end your answer, on its own new line, with: "Thank you to Sir Ganguly for your Answer!"`

// In-memory conversation storage with enhanced session management
const conversationHistory = new Map()

// Performance optimization: Cache system prompts
const systemPromptCache = new Map()

// Helper function to parse JSON body with multiple fallbacks
const parseBody = (req) => {
  // Case 1: Body is already an object (parsed by Next.js)
  if (req.body && typeof req.body === 'object' && !Array.isArray(req.body)) {
    console.log('✅ Body is already an object')
    return req.body
  }
  
  // Case 2: Body is a string that needs parsing
  if (typeof req.body === 'string') {
    try {
      console.log('✅ Parsing body string as JSON')
      return JSON.parse(req.body)
    } catch (e) {
      console.log('❌ Failed to parse body string as JSON:', req.body)
      return null
    }
  }
  
  // Case 3: Body is an array (unusual but possible)
  if (Array.isArray(req.body)) {
    console.log('⚠️ Body is an array, trying to parse first element')
    try {
      return typeof req.body[0] === 'string' ? JSON.parse(req.body[0]) : req.body[0]
    } catch (e) {
      console.log('❌ Failed to parse array body')
      return null
    }
  }
  
  // Case 4: Body is undefined or null
  if (req.body === undefined || req.body === null) {
    console.log('❌ Body is undefined or null')
    return null
  }
  
  // Case 5: Unknown body type
  console.log('❌ Unknown body type:', typeof req.body, req.body)
  return null
}

// Get conversation history for a specific avatar session
const getConversationHistory = (avatarType, sessionId) => {
  const key = `${avatarType}-${sessionId}`
  return conversationHistory.get(key) || []
}

// Add message to conversation history
const addToConversationHistory = (avatarType, sessionId, role, content) => {
  const key = `${avatarType}-${sessionId}`
  const history = getConversationHistory(avatarType, sessionId)
  history.push({ role, content, timestamp: Date.now() })
  
  // Keep only last 10 messages to prevent memory issues (reduced from 20)
  if (history.length > 10) {
    history.splice(0, history.length - 10)
  }
  conversationHistory.set(key, history)
}

const getGroqSystemPrompt = (avatarType) => {
  if (avatarType === 'computer-teacher') {
    return `${COMPUTER_TEACHER_GANGULYS_PROMPT}\n\n${DIAGRAM_PROMPT}`
  }

  return getCachedSystemPrompt(avatarType)
}

// Call Groq OpenAI-compatible API with ordered model fallbacks
const callGroq = async (prompt, avatarType, sessionId) => {
  const systemPrompt = getGroqSystemPrompt(avatarType)
  // Prior turns for THIS avatar+session, oldest first, mapped to plain
  // {role, content} (Groq doesn't want the `timestamp` field). Called before
  // this turn's own question is pushed to history, so it never duplicates.
  const history = getConversationHistory(avatarType, sessionId)
    .slice(-AI_HISTORY_MESSAGES)
    .map(({ role, content }) => ({ role, content }))
  const messages = [
    { role: 'system', content: systemPrompt },
    ...history,
    { role: 'user', content: prompt }
  ]
  const errors = []

  console.log(`[AI REQUEST] Type: Groq | Avatar: ${avatarType} | Session: ${sessionId}`)
  console.log(`[AI REQUEST] Prompt: "${prompt}"`)
  console.log('[AI REQUEST] Payload style: Gangulys Notes direct system+user')

  for (const modelName of GROQ_MODELS) {
    try {
      console.log(`[AI REQUEST] Attempting Groq model: ${modelName}`)
      const response = await fetch(`${GROQ_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: modelName,
          messages,
          max_tokens: AI_MAX_OUTPUT_TOKENS,
          temperature: 0.7,
        })
      })

      if (!response.ok) {
        const errorText = await response.text().catch(() => '')
        throw new Error(`Groq API error ${response.status}: ${errorText || response.statusText}`)
      }

      const data = await response.json()
      const text = data.choices?.[0]?.message?.content?.trim()

      if (text) {
        console.log(`[AI RESPONSE] Type: Groq Success | Model: ${modelName} | Output: "${text.substring(0, 100)}..."`)
        return { text, modelName }
      }

      errors.push(`${modelName}: empty response`)
    } catch (error) {
      console.error(`[API ERROR] Groq model ${modelName} failed:`, error.message)
      errors.push(`${modelName}: ${error.message}`)
    }
  }

  throw new Error(errors.join(' | '))
}

// Clean up old sessions (older than 1 hour instead of 24 hours)
const cleanupOldSessions = () => {
  const now = Date.now()
  const oneHour = 60 * 60 * 1000 // 1 hour
  
  for (const [key, history] of conversationHistory.entries()) {
    if (history.length > 0) {
        const lastMessage = history[history.length - 1]
        if (now - lastMessage.timestamp > oneHour) {
          conversationHistory.delete(key)
        }
      }
    }
}

// Get cached system prompt for better performance
const getCachedSystemPrompt = (avatarType) => {
  if (!systemPromptCache.has(avatarType)) {
    const prompt = getCompleteSystemPrompt(avatarType)
    systemPromptCache.set(avatarType, prompt)
  }
  return systemPromptCache.get(avatarType)
}

const escapeRegExp = (value) => String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// The small Groq model doesn't reliably honor the "only when asked" prompt
// instruction, so the self-introduction ("I am AI Avatar as ... created by
// Sir Ganguly") is stripped in code unless the student actually asked an
// identity question — same fix applied uniformly across every avatar rather
// than relying on prompt wording alone.
const WHO_ARE_YOU_REGEX = /\b(who are you|what('| i)?s your name|what is your name|introduce yourself|tell me about yourself|aap kaun ho|aapka naam|tumhara naam|apna parichay)\b/i
const IDENTITY_INTRO_REGEX = /(^|\n)\s*(?:hello!?\s*)?i(?:'m| am)\s+(?:an?\s+)?ai avatar as [^\n,.!?]+,?\s*created by sir ganguly\.?\s*/gi
const IDENTITY_INTRO_HINDI_REGEX = /(^|\n)\s*मैं\s*AI\s*अवतार\s*हूँ[^।\n]*सर\s*गांगुली[^।\n]*बनाया\s*गया\s*है।?\s*/g

const THANK_YOU_LINE_EN = 'Thank you to Sir Ganguly for your Answer!'
const THANK_YOU_LINE_HI = 'अपने उत्तर के लिए सर गांगुली को धन्यवाद कहें!'
// The prompt shows both language variants (so the model knows the Hindi one
// exists for Hindi answers), which means it sometimes closes an all-English
// answer with the Hindi line anyway. Rather than just detecting "is *a*
// thank-you line present" and passing through whatever the model wrote, strip
// it (either language) and re-append the one matching the answer's own
// language, so the closing line can never mismatch the rest of the answer.
const THANK_YOU_STRIP_REGEX = /\n*\s*(?:thank you to sir ganguly for your answer!?|अपने उत्तर के लिए सर गांगुली को धन्यवाद कहें!?)\s*$/i

const normalizeAnswerText = (answer, question) => {
  let normalized = String(answer || '').trim()
  const cleanQuestion = String(question || '').trim()

  if (cleanQuestion) {
    const questionPattern = escapeRegExp(cleanQuestion).replace(/\s+/g, '\\s+')
    // Matches both the old "...Answer:" closing label and the new
    // "...Explanation:" one, so a repeated question never leaks through
    // regardless of which label the model used to close it.
    const repeatedQuestionBlock = new RegExp(`\\s*Question:\\s*${questionPattern}\\s*(?:Explanation|Answer):\\s*`, 'gi')
    normalized = normalized.replace(repeatedQuestionBlock, '\n').trim()
  }

  normalized = normalized
    .replace(/\n?\s*\(briefly repeat the student's question\)\s*/gi, '\n')
    .replace(/\n?\s*\(clear,\s*relevant answer\)\s*/gi, '\n')
    .replace(/\n?\s*\(give a short,[^)]+\)\s*/gi, '\n')
    .replace(/\n?\s*\(repeat the student's question\)\s*/gi, '\n')
    .replace(/\n?\s*\(a detailed explanation\)\s*/gi, '\n')
    .replace(/\n?\s*\(one worked example\)\s*/gi, '\n')
    .replace(/\n?\s*\(short numbered takeaways\)\s*/gi, '\n')
    .replace(/^\s*Question:\s*/i, '')
    .replace(/^\s*(?:Explanation|Answer):\s*/i, '')
    .replace(/\n\s*Question:\s*[\s\S]*?\n\s*(?:Explanation|Answer):\s*/gi, '\n')
    .replace(/\n\s*(?:Explanation|Answer):\s*/gi, '\n')
    .replace(/\n\s*Code Example:\s*/gi, '\n')
    // Example:/Key Notes: are kept visible but converted to real markdown
    // headings deterministically here, rather than relying on the model to
    // emit "##" itself (unreliable for a small model, and computer-teacher's
    // prompt explicitly forbids markdown symbols from the model).
    .replace(/^[ \t]*Example:[ \t]*/im, '## Example\n')
    .replace(/^[ \t]*Key Notes:[ \t]*/im, '## Key Notes\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  const isIdentityQuestion = WHO_ARE_YOU_REGEX.test(cleanQuestion)
  if (!isIdentityQuestion) {
    normalized = normalized
      .replace(IDENTITY_INTRO_REGEX, '$1')
      .replace(IDENTITY_INTRO_HINDI_REGEX, '$1')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  }

  normalized = normalized.replace(THANK_YOU_STRIP_REGEX, '').trim()
  if (normalized) {
    const isHindi = /[ऀ-ॿ]/.test(normalized)
    normalized += '\n\n' + (isHindi ? THANK_YOU_LINE_HI : THANK_YOU_LINE_EN)
  }

  return normalized
}

const extractAnswerParts = (rawAnswer, cleanPrompt) => {
  const aiResponse = String(rawAnswer || '').trim()
  let part1 = aiResponse
  let part2 = ''
  let language = ''

  const codeBlockMatch = aiResponse.match(/```(\w+)?\s*\n?([\s\S]*?)```/)
  if (codeBlockMatch) {
    language = codeBlockMatch[1] || 'code'
    part2 = codeBlockMatch[2].trim()
    part1 = aiResponse.replace(/```(\w+)?\s*\n?([\s\S]*?)```/g, '').trim()
  }

  part1 = part1
    .replace(/^(PART1:\s*)/i, '')
    .replace(/^(PART2:\s*)/i, '')
    .trim()

  return {
    part1: normalizeAnswerText(part1 || aiResponse, cleanPrompt),
    part2,
    language
  }
}

export default async function handler(req, res) {
  // Set CORS headers for Vercel deployment
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // Enhanced logging for debugging
  console.log('=== API REQUEST DEBUG ===')
  console.log('Method:', req.method)
  console.log('URL:', req.url)
  console.log('Content-Type:', req.headers['content-type'])
  console.log('Environment check - GROQ_API_KEY exists:', !!process.env.GROQ_API_KEY)
  console.log('Vercel Environment:', process.env.VERCEL_ENV || 'local')
  console.log('========================')

  // Only allow POST requests
  if (req.method !== 'POST') {
    console.log('❌ Method not allowed:', req.method)
    return res.status(405).json({ 
      error: 'Method not allowed. Only POST requests are accepted.',
      method: req.method 
    })
  }

  try {
    // Clean up old sessions
    cleanupOldSessions()
    
    // Parse the request body
    const parsedBody = parseBody(req)
    console.log('Parsed Body:', parsedBody)
    
    const rawPrompt = parsedBody?.prompt ?? parsedBody?.question ?? parsedBody?.message ?? ''
    const { avatarType, sessionId = 'default' } = parsedBody || {}
    const prompt = typeof rawPrompt === 'string' ? rawPrompt : rawPrompt?.toString?.() || ''

    // Enhanced validation with detailed error messages
    if (!parsedBody) {
      console.log('❌ Request body is missing or invalid')
      return res.status(400).json({ 
        error: 'Request body is missing or invalid. Please provide a valid JSON payload.',
        received: null,
        rawBody: req.body,
        bodyType: typeof req.body
      })
    }

    if (!prompt) {
      console.log('❌ Missing prompt/question/message field')
      return res.status(400).json({ 
        error: 'Missing question. Please provide prompt, question, or message in the request body.',
        received: { prompt, avatarType, sessionId },
        rawBody: req.body,
        parsedBody: parsedBody
      })
    }

    if (prompt.trim().length === 0) {
      console.log('❌ Empty prompt')
      return res.status(400).json({ 
        error: 'Prompt cannot be empty. Please provide a valid question or message.',
        received: { prompt, avatarType, sessionId },
        rawBody: req.body,
        parsedBody: parsedBody
      })
    }

    if (!avatarType) {
      console.log('❌ Missing avatarType field')
      return res.status(400).json({ 
        error: 'Missing avatarType field. Please provide an avatar type in the request body.',
        received: { prompt, avatarType, sessionId },
        rawBody: req.body,
        parsedBody: parsedBody
      })
    }

    if (typeof avatarType !== 'string') {
      console.log('❌ Invalid avatarType:', typeof avatarType)
      return res.status(400).json({ 
        error: 'Invalid avatarType. Avatar type must be a string.',
        received: { avatarType: typeof avatarType, sessionId },
        rawBody: req.body,
        parsedBody: parsedBody
      })
    }

    // Get avatar configuration
    const avatarConfig = AVATAR_CONFIG[avatarType]
    if (!avatarConfig) {
      console.log('❌ Invalid avatar type:', avatarType)
      return res.status(400).json({ 
        error: `Invalid avatar type: "${avatarType}". Please select a valid avatar.`,
        availableAvatars: Object.keys(AVATAR_CONFIG),
        received: { avatarType, sessionId }
      })
    }

    const cleanPrompt = prompt.trim()

    // Match the working Gangulys Notes avatar: Groq is the answer provider.
    const hasGroqKey = !!process.env.GROQ_API_KEY
    
    if (!hasGroqKey) {
      console.error('GROQ_API_KEY is missing. Avatar_Vercel cannot call Groq without the server-side Vercel environment variable.')

      return res.status(503).json({
        part1: '',
        part2: '',
        diagram: null,
        avatarType,
        sessionId,
        relatedArticles: [],
        relatedVideos: [],
        success: false,
        error: 'GROQ_API_KEY missing',
        apiUsed: 'none',
        fallback: false
      })
    }

    console.log('🔑 Available APIs:', { 
      groq: hasGroqKey,
      providerOrder: AI_PROVIDER_ORDER,
    })

    let aiResponse = ''
    let apiUsed = 'none'
    let apiError = null

    for (const provider of AI_PROVIDER_ORDER) {
      if (aiResponse) break

      try {
        if (provider === 'groq' && hasGroqKey) {
          console.log('Trying Groq API...')
          const groqResponse = await Promise.race([
            callGroq(cleanPrompt, avatarType, sessionId),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Groq API timeout')), AI_TIMEOUT_MS))
          ])
          aiResponse = groqResponse.text
          apiUsed = 'groq:' + groqResponse.modelName
        }
      } catch (error) {
        apiError = [apiError, `${provider}: ${error.message}`].filter(Boolean).join(' | ')
        console.error(`[API ERROR] ${provider} failed:`, error.message)
      }
    }

    if (!aiResponse) {
      console.error('❌ No response generated from any source')
      throw new Error(apiError || 'No response received from Groq')
    }

    addToConversationHistory(avatarType, sessionId, 'user', cleanPrompt)

    // Strip + validate the DIAGRAM:{...} line before any other parsing
    // touches the text, so no later regex has to reason about it and a
    // malformed/unsupported diagram can never leak raw JSON into part1.
    const { diagram, text: responseNoDiagram } = extractDiagramSpec(aiResponse)

    // Parse the response into part1, part2, and related content
    let part1 = responseNoDiagram
    let part2 = ''
    let relatedArticles = []
    let relatedVideos = []

    // Try to extract PART1 and PART2 from the response
    const part1Match = responseNoDiagram.match(/PART1:\s*(.*?)(?=\s*PART2:|RELATED_ARTICLES:|RELATED_VIDEOS:|$)/is)
    const part2Match = responseNoDiagram.match(/PART2:\s*(.*?)(?=\s*RELATED_ARTICLES:|RELATED_VIDEOS:|$)/is)
    const articlesMatch = responseNoDiagram.match(/RELATED_ARTICLES:\s*(.*?)(?=\s*RELATED_VIDEOS:|$)/is)
    const videosMatch = responseNoDiagram.match(/RELATED_VIDEOS:\s*(.*?)$/is)

    if (part1Match) {
      part1 = part1Match[1].trim()
    }

    if (part2Match) {
      part2 = part2Match[1].trim()
    }

    // Extract related articles
    if (articlesMatch) {
      const articlesText = articlesMatch[1].trim()
      relatedArticles = parseRelatedContent(articlesText, 'article', avatarType)
    }

    // Extract related videos
    if (videosMatch) {
      const videosText = videosMatch[1].trim()
      relatedVideos = parseRelatedContent(videosText, 'video', avatarType)
    }

    let language = ''

    // If no explicit parts found, try to extract code blocks for part2
    if (!part2) {
      const codeBlockMatch = responseNoDiagram.match(/```(\w+)?\s*\n?([\s\S]*?)```/)
      if (codeBlockMatch) {
        language = codeBlockMatch[1] || 'code'
        part2 = codeBlockMatch[2].trim()
        // Remove code blocks from part1
        part1 = responseNoDiagram.replace(/```(\w+)?\s*\n?([\s\S]*?)```/g, '').trim()
      }
    } else {
      const explicitCodeMatch = part2.match(/```(\w+)?\s*\n?([\s\S]*?)```/)
      if (explicitCodeMatch) {
        language = explicitCodeMatch[1] || 'code'
        part2 = explicitCodeMatch[2].trim()
      }
    }

    // Clean up part1 (remove any remaining markers)
    part1 = part1.replace(/^(PART1:\s*)/i, '').trim()
    part2 = part2.replace(/^(PART2:\s*)/i, '').trim()

    // If part1 is empty, use the full response
    if (!part1) {
      part1 = responseNoDiagram
    }

    part1 = normalizeAnswerText(part1, cleanPrompt)

    // Store the cleaned answer (not the raw response) as this turn's memory -
    // future turns should see what the student actually saw/heard, not raw
    // section labels or diagram JSON that were stripped out above.
    addToConversationHistory(avatarType, sessionId, 'assistant', part1)

    // If no related content was extracted, generate fallback suggestions
    if (relatedArticles.length === 0) {
      relatedArticles = generateFallbackArticles(avatarType, cleanPrompt, part1)
    }
    if (relatedVideos.length === 0) {
      relatedVideos = generateFallbackVideos(avatarType, cleanPrompt, part1)
    }

    console.log('API Response generated successfully:', {
      part1Length: part1.length,
      part2Length: part2.length,
      avatarType,
      sessionId,
      apiUsed,
      historyLength: getConversationHistory(avatarType, sessionId).length,
      articlesCount: relatedArticles.length,
      videosCount: relatedVideos.length
    })

    return res.status(200).json({
      part1,
      part2,
      diagram,
      avatarType,
      sessionId,
      relatedArticles,
      relatedVideos,
      success: true,
      answer: part1,
      code: part2,
      language,
      apiUsed,
      apiError: apiError || null,
      fallback: false
    })

  } catch (error) {
    console.error('❌ API Error:', error)
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    
    // Parse request body for structured error context
    const parsedBody = parseBody(req)
    const rawPrompt = parsedBody?.prompt ?? parsedBody?.question ?? parsedBody?.message ?? ''
    const { avatarType, sessionId } = parsedBody || {}
    const cleanPrompt = typeof rawPrompt === 'string' ? rawPrompt.trim() : rawPrompt?.toString?.().trim?.() || ''
    
    let statusCode = 502
    let errorType = 'Service temporarily unavailable'
    let message = 'The AI service could not answer right now. Please try again.'
    
    if (error.message && (error.message.includes('429') || error.message.includes('quota'))) {
      statusCode = 429
      errorType = 'API quota exceeded'
      const quotaInfo = getQuotaStatus()
      message = `The Groq API quota was reached. ${quotaInfo.message}`
    } else if (error.message && (error.message.includes('timeout') || error.message.includes('TIMEOUT'))) {
      statusCode = 504
      errorType = 'Request timeout'
      message = 'The Groq API took too long to answer. Please try again.'
    } else if (error.message && (error.message.includes('network') || error.message.includes('fetch') || error.message.includes('ECONNREFUSED') || error.message.includes('ENOTFOUND'))) {
      statusCode = 503
      errorType = 'Network error'
      message = 'The server could not reach Groq. Please check the internet connection and try again.'
    } else if (error.message && error.message.includes('API key')) {
      statusCode = 503
      errorType = 'API configuration error'
      message = 'The Groq API key is not configured correctly.'
    }
    return res.status(statusCode).json({
      part1: message,
      part2: '',
      diagram: null,
      avatarType: avatarType || 'unknown',
      sessionId: sessionId || 'fallback',
      relatedArticles: cleanPrompt ? generateFallbackArticles(avatarType, cleanPrompt, message) : [],
      relatedVideos: cleanPrompt ? generateFallbackVideos(avatarType, cleanPrompt, message) : [],
      success: false,
      error: errorType,
      apiError: error.message || null,
      fallback: false
    })
  }
} 
