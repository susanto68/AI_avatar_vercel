import { AVATAR_CONFIG } from '../../lib/avatars'
import { getCompleteSystemPrompt } from '../../context/prompts.js'
import { GoogleGenerativeAI } from '@google/generative-ai'
import OpenAI from 'openai'

import { generateIntelligentFallback } from '../../context/offlineKnowledge.js'
import { parseRelatedContent, generateFallbackArticles, generateFallbackVideos, getQuotaStatus } from '../../lib/suggestions.js'

// Initialize AI clients
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY || 'missing-groq-api-key',
  baseURL: process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1',
})

// Valid Gemini model names (updated May 2026)
const GEMINI_MODELS = (process.env.GEMINI_MODEL || 'gemini-1.5-flash,gemini-1.5-pro,gemini-pro')
  .split(',')
  .map((model) => model.trim())
  .filter(Boolean)

const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini'
const GROQ_MODELS = (process.env.GROQ_MODEL || 'llama-3.1-8b-instant,llama-3.3-70b-versatile')
  .split(',')
  .map((model) => model.trim())
  .filter(Boolean)
const AI_MAX_OUTPUT_TOKENS = Number(process.env.AI_MAX_OUTPUT_TOKENS || 500)
const AI_TIMEOUT_MS = Number(process.env.AI_TIMEOUT_MS || 10000)
const AI_HISTORY_LIMIT = Number(process.env.AI_HISTORY_LIMIT || 2)

// In-memory conversation storage with enhanced session management
const conversationHistory = new Map()
const sessionContexts = new Map()

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

// Get or create session context for Gemini with performance optimization
const getSessionContext = (avatarType, sessionId) => {
  const key = `${avatarType}-${sessionId}`
  if (!sessionContexts.has(key)) {
    sessionContexts.set(key, genAI.getGenerativeModel({ model: GEMINI_MODELS[0] }).startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 2048, // Reduced from 4096 for faster responses
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      },
    }))
  }
  return sessionContexts.get(key)
}

// Call ChatGPT API
const callChatGPT = async (prompt, avatarType, sessionId) => {
  const systemPrompt = getCachedSystemPrompt(avatarType)
  const history = getConversationHistory(avatarType, sessionId).slice(-AI_HISTORY_LIMIT)
  
  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.map(msg => ({ role: msg.role, content: msg.content })),
    { role: 'user', content: prompt }
  ]

  console.log(`[AI REQUEST] Type: ChatGPT | Avatar: ${avatarType} | Session: ${sessionId}`)
  console.log(`[AI REQUEST] Prompt: "${prompt}"`)
  console.log(`[AI REQUEST] History Length: ${history.length} messages`)

  try {
    const response = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: messages,
      max_tokens: AI_MAX_OUTPUT_TOKENS,
      temperature: 0.7,
    })

    const text = response.choices[0].message.content
    console.log(`[AI RESPONSE] Type: ChatGPT Success | Model: ${OPENAI_MODEL} | Output: "${text.substring(0, 100)}..."`)
    return text
  } catch (error) {
    console.error(`[API ERROR] ChatGPT failed:`, error.message)
    throw error
  }
}

// Call Groq OpenAI-compatible API with ordered model fallbacks
const callGroq = async (prompt, avatarType, sessionId) => {
  const systemPrompt = getCachedSystemPrompt(avatarType)
  const history = getConversationHistory(avatarType, sessionId).slice(-AI_HISTORY_LIMIT)
  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.map(msg => ({ role: msg.role, content: msg.content })),
    { role: 'user', content: prompt }
  ]
  const errors = []

  console.log(`[AI REQUEST] Type: Groq | Avatar: ${avatarType} | Session: ${sessionId}`)
  console.log(`[AI REQUEST] Prompt: "${prompt}"`)
  console.log(`[AI REQUEST] History Length: ${history.length} messages`)

  for (const modelName of GROQ_MODELS) {
    try {
      console.log(`[AI REQUEST] Attempting Groq model: ${modelName}`)
      const response = await groq.chat.completions.create({
        model: modelName,
        messages,
        max_tokens: AI_MAX_OUTPUT_TOKENS,
        temperature: 0.7,
      })
      const text = response.choices?.[0]?.message?.content?.trim()

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

// Call Gemini API
const callGemini = async (prompt, avatarType, sessionId) => {
  const systemPrompt = getCachedSystemPrompt(avatarType)
  const history = getConversationHistory(avatarType, sessionId).slice(-AI_HISTORY_LIMIT)
  
  const fullPrompt = `${systemPrompt}

Recent Conversation:
${history.map((msg) => `${msg.role}: ${msg.content}`).join('\n') || 'No previous messages.'}

User Question: ${prompt}

Answer quickly in 2-4 short bullet points or short paragraphs. Use simple words. Include one tiny code example only when necessary. Do not add long introductions or long resource lists.`

  const errors = []

  console.log(`[AI REQUEST] Type: Gemini | Avatar: ${avatarType} | Session: ${sessionId}`)
  console.log(`[AI REQUEST] Prompt: "${prompt}"`)
  console.log(`[AI REQUEST] History Length: ${history.length} messages`)

  for (const modelName of GEMINI_MODELS) {
    try {
      console.log(`[AI REQUEST] Attempting Gemini model: ${modelName}`)
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          maxOutputTokens: AI_MAX_OUTPUT_TOKENS,
          temperature: 0.45,
          topP: 0.8,
          topK: 40,
        },
      })

      const result = await model.generateContent(fullPrompt)
      const text = result.response.text().trim()

      if (text) {
        console.log(`[AI RESPONSE] Type: Gemini Success | Model: ${modelName} | Output: "${text.substring(0, 100)}..."`)
        return { text, modelName }
      }

      errors.push(`${modelName}: empty response`)
    } catch (error) {
      console.error(`[API ERROR] Gemini model ${modelName} failed:`, error.message)
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
        sessionContexts.delete(key)
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
  console.log('Environment check - GEMINI_API_KEY exists:', !!process.env.GEMINI_API_KEY)
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
    
    const { prompt, avatarType, sessionId = 'default' } = parsedBody || {}

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
      console.log('❌ Missing prompt field')
      return res.status(400).json({ 
        error: 'Missing prompt field. Please provide a prompt in the request body.',
        received: { prompt, avatarType, sessionId },
        rawBody: req.body,
        parsedBody: parsedBody
      })
    }

    if (typeof prompt !== 'string') {
      console.log('❌ Invalid prompt type:', typeof prompt)
      return res.status(400).json({ 
        error: 'Invalid prompt type. Prompt must be a string.',
        received: { prompt: typeof prompt, avatarType, sessionId },
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

    // Check for API keys
    const hasGeminiKey = !!process.env.GEMINI_API_KEY
    const hasOpenAIKey = !!process.env.OPENAI_API_KEY
    const hasGroqKey = !!process.env.GROQ_API_KEY
    
    if (!hasGeminiKey && !hasOpenAIKey && !hasGroqKey) {
      console.error('No API keys found. Please set GEMINI_API_KEY, GROQ_API_KEY, or OPENAI_API_KEY environment variables')
      
      // Generate intelligent fallback response
      const fallbackResponse = generateIntelligentFallback(avatarType, prompt)
      const relatedArticles = generateFallbackArticles(avatarType, prompt, fallbackResponse)
      const relatedVideos = generateFallbackVideos(avatarType, prompt, fallbackResponse)
      
      return res.status(200).json({
        part1: `I apologize, but I'm currently unable to access my AI capabilities. ${fallbackResponse}`,
        part2: '',
        avatarType,
        sessionId,
        relatedArticles,
        relatedVideos,
        success: false,
        error: 'AI service configuration error - API keys missing',
        fallback: true
      })
    }

    console.log('🔑 Available APIs:', { 
      gemini: hasGeminiKey, 
      groq: hasGroqKey,
      openai: hasOpenAIKey 
    })

    // Get conversation history for context (limited for faster responses)
    const history = getConversationHistory(avatarType, sessionId).slice(-AI_HISTORY_LIMIT)
    
    // Add user message to history
    addToConversationHistory(avatarType, sessionId, 'user', prompt)

    let aiResponse = ''
    let apiUsed = 'none'
    let apiError = null

    // Try APIs: Groq first (fastest), then Gemini, then OpenAI as fallback
    // Try Groq first if available (llama-3.1-8b-instant — very fast)
    if (hasGroqKey && !aiResponse) {
      try {
        console.log('🤖 Trying Groq API (llama-3.1-8b-instant)...')
        const groqResponse = await Promise.race([
          callGroq(prompt, avatarType, sessionId),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Groq API timeout')), AI_TIMEOUT_MS)
          )
        ])
        aiResponse = groqResponse.text
        apiUsed = `groq:${groqResponse.modelName}`
        console.log('✅ Groq API success')
      } catch (error) {
        console.warn('⚠️ Groq API failed:', error.message)
        apiError = error.message
      }
    }

    // Fallback to Gemini if Groq failed or not available
    if (hasGeminiKey && !aiResponse) {
      try {
        console.log('🤖 Trying Gemini API...')
        const geminiResponse = await Promise.race([
          callGemini(prompt, avatarType, sessionId),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Gemini API timeout')), AI_TIMEOUT_MS)
          )
        ])
        aiResponse = geminiResponse.text
        apiUsed = `gemini:${geminiResponse.modelName}`
        console.log('✅ Gemini API success')
      } catch (error) {
        console.warn('⚠️ Gemini API failed:', error.message)
        apiError = error.message
      }
    }

    // Fallback to ChatGPT if Groq and Gemini failed or are not available
    if (!aiResponse && hasOpenAIKey) {
      try {
        console.log('🤖 Trying ChatGPT API as fallback...')
        aiResponse = await Promise.race([
          callChatGPT(prompt, avatarType, sessionId),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('ChatGPT API timeout')), AI_TIMEOUT_MS)
          )
        ])
        apiUsed = 'chatgpt'
        console.log('✅ ChatGPT API success')
      } catch (error) {
        console.warn('⚠️ ChatGPT API failed:', error.message)
        apiError = error.message
      }
    }

    // If all APIs failed, use intelligent fallback
    if (!aiResponse) {
      console.log('All APIs failed, using intelligent fallback')
      aiResponse = generateIntelligentFallback(avatarType, prompt)
      apiUsed = 'fallback'
    }

    if (!aiResponse) {
      console.error('❌ No response generated from any source')
      throw new Error('No response received from any AI service')
    }

    // Add AI response to history
    addToConversationHistory(avatarType, sessionId, 'assistant', aiResponse)

    // Parse the response into part1, part2, and related content
    let part1 = aiResponse
    let part2 = ''
    let relatedArticles = []
    let relatedVideos = []

    // Try to extract PART1 and PART2 from the response
    const part1Match = aiResponse.match(/PART1:\s*(.*?)(?=\s*PART2:|RELATED_ARTICLES:|RELATED_VIDEOS:|$)/is)
    const part2Match = aiResponse.match(/PART2:\s*(.*?)(?=\s*RELATED_ARTICLES:|RELATED_VIDEOS:|$)/is)
    const articlesMatch = aiResponse.match(/RELATED_ARTICLES:\s*(.*?)(?=\s*RELATED_VIDEOS:|$)/is)
    const videosMatch = aiResponse.match(/RELATED_VIDEOS:\s*(.*?)$/is)

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

    // If no explicit parts found, try to extract code blocks for part2
    if (!part2) {
      const codeBlockMatch = aiResponse.match(/```(\w+)?\n([\s\S]*?)```/g)
      if (codeBlockMatch) {
        part2 = codeBlockMatch.join('\n\n')
        // Remove code blocks from part1
        part1 = aiResponse.replace(/```(\w+)?\n([\s\S]*?)```/g, '').trim()
      }
    }

    // Clean up part1 (remove any remaining markers)
    part1 = part1.replace(/^(PART1:\s*)/i, '').trim()
    part2 = part2.replace(/^(PART2:\s*)/i, '').trim()

    // If part1 is empty, use the full response
    if (!part1) {
      part1 = aiResponse
    }

    // If no related content was extracted, generate fallback suggestions
    if (relatedArticles.length === 0) {
      relatedArticles = generateFallbackArticles(avatarType, prompt, part1)
    }
    if (relatedVideos.length === 0) {
      relatedVideos = generateFallbackVideos(avatarType, prompt, part1)
    }

    console.log('API Response generated successfully:', {
      part1Length: part1.length,
      part2Length: part2.length,
      avatarType,
      sessionId,
      apiUsed,
      historyLength: history.length + 2, // +2 for current user and AI messages
      articlesCount: relatedArticles.length,
      videosCount: relatedVideos.length
    })

    return res.status(200).json({
      part1,
      part2,
      avatarType,
      sessionId,
      relatedArticles,
      relatedVideos,
      success: true,
      apiUsed,
      apiError: apiError || null
    })

  } catch (error) {
    console.error('❌ API Error:', error)
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    
    // Parse request body for fallback
    const parsedBody = parseBody(req)
    const { avatarType, sessionId, prompt } = parsedBody || {}
    const avatarConfig = avatarType ? AVATAR_CONFIG[avatarType] : null
    
    let fallbackResponse = ''
    let errorType = 'Service temporarily unavailable'
    
    // Check for specific error types and provide better responses
    if (error.message && (error.message.includes('429') || error.message.includes('quota'))) {
      // Quota exceeded - provide helpful information
      errorType = 'API quota exceeded'
      const quotaInfo = getQuotaStatus()
      fallbackResponse = `I apologize, but I've reached my daily limit for AI responses. ${quotaInfo.message}

${quotaInfo.details}
${quotaInfo.resetTime}

However, I can still help you with educational resources! Here are some relevant articles and videos to learn about your topic.

${quotaInfo.alternatives[0]}
${quotaInfo.alternatives[1]}
${quotaInfo.alternatives[2]}`
    } else if (error.message && (error.message.includes('timeout') || error.message.includes('TIMEOUT'))) {
      // API timeout
      errorType = 'Request timeout'
      fallbackResponse = `I apologize, but the request took too long to process. This might be due to high demand or network issues.

Please try asking your question again in a moment, or explore the suggested resources below for immediate learning.`
    } else if (error.message && (error.message.includes('network') || error.message.includes('fetch') || error.message.includes('ECONNREFUSED') || error.message.includes('ENOTFOUND'))) {
      // Network error
      errorType = 'Network error'
      fallbackResponse = `I apologize, but there seems to be a network connection issue. Please check your internet connection and try again.

In the meantime, you can explore the suggested resources below to continue learning.`
    } else if (error.message && error.message.includes('API key')) {
      // API key error
      errorType = 'API configuration error'
      fallbackResponse = `I apologize, but there's a configuration issue with my AI service. Please try again later or explore the suggested resources below.`
    } else {
      // Generic error - use intelligent fallback
      errorType = 'Service temporarily unavailable'
      fallbackResponse = generateIntelligentFallback(avatarType, prompt)
    }
    
    // Generate fallback content for the specific avatar type
    const relatedArticles = generateFallbackArticles(avatarType, prompt, fallbackResponse)
    const relatedVideos = generateFallbackVideos(avatarType, prompt, fallbackResponse)
    
    return res.status(200).json({
      part1: fallbackResponse,
      part2: '',
      avatarType: avatarType || 'unknown',
      sessionId: sessionId || 'fallback',
      relatedArticles,
      relatedVideos,
      success: false,
      error: errorType,
      fallback: true
    })
  }
} 
