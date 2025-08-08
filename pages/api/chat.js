import { AVATAR_CONFIG } from '../../lib/avatars'

export default async function handler(req, res) {
  // Enhanced logging for debugging
  console.log('=== API REQUEST DEBUG ===')
  console.log('Method:', req.method)
  console.log('URL:', req.url)
  console.log('Headers:', JSON.stringify(req.headers, null, 2))
  console.log('Body:', JSON.stringify(req.body, null, 2))
  console.log('Environment check - GEMINI_API_KEY exists:', !!process.env.GEMINI_API_KEY)
  console.log('Environment check - GEMINI_API_KEY length:', process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.length : 0)
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
    // Log the incoming request for debugging
    console.log('API Request received:', {
      method: req.method,
      headers: req.headers['content-type'],
      body: req.body
    })

    const { prompt, avatarType } = req.body || {}

    // Enhanced validation with detailed error messages
    if (!req.body) {
      console.log('❌ Request body is missing')
      return res.status(400).json({ 
        error: 'Request body is missing. Please provide a valid JSON payload.',
        received: null
      })
    }

    if (!prompt) {
      console.log('❌ Missing prompt field')
      return res.status(400).json({ 
        error: 'Missing prompt field. Please provide a prompt in the request body.',
        received: { prompt, avatarType }
      })
    }

    if (typeof prompt !== 'string') {
      console.log('❌ Invalid prompt type:', typeof prompt)
      return res.status(400).json({ 
        error: 'Invalid prompt type. Prompt must be a string.',
        received: { prompt: typeof prompt, avatarType }
      })
    }

    if (prompt.trim().length === 0) {
      console.log('❌ Empty prompt')
      return res.status(400).json({ 
        error: 'Prompt cannot be empty. Please provide a valid question or message.',
        received: { prompt, avatarType }
      })
    }

    if (!avatarType) {
      console.log('❌ Missing avatarType field')
      return res.status(400).json({ 
        error: 'Missing avatarType field. Please provide an avatar type in the request body.',
        received: { prompt, avatarType }
      })
    }

    if (typeof avatarType !== 'string') {
      console.log('❌ Invalid avatarType:', typeof avatarType)
      return res.status(400).json({ 
        error: 'Invalid avatarType. Avatar type must be a string.',
        received: { prompt, avatarType: typeof avatarType }
      })
    }

    // Get avatar configuration
    const avatarConfig = AVATAR_CONFIG[avatarType]
    if (!avatarConfig) {
      console.log('❌ Invalid avatar type:', avatarType)
      return res.status(400).json({ 
        error: `Invalid avatar type: "${avatarType}". Please select a valid avatar.`,
        availableAvatars: Object.keys(AVATAR_CONFIG),
        received: { avatarType }
      })
    }

    // Check for Gemini API key
    const geminiApiKey = process.env.GEMINI_API_KEY
    if (!geminiApiKey) {
      console.error('❌ GEMINI_API_KEY not found in environment variables')
      return res.status(500).json({ 
        error: 'AI service configuration error. Please try again later.',
        fallback: true
      })
    }

    console.log('✅ GEMINI_API_KEY found, length:', geminiApiKey.length)

    // Log successful validation
    console.log('API Request validated successfully:', {
      prompt: prompt.substring(0, 100) + (prompt.length > 100 ? '...' : ''),
      avatarType,
      avatarName: avatarConfig.name
    })

    // Construct the combined prompt
    const combinedPrompt = `${avatarConfig.systemPrompt}

User Question: ${prompt}

Please provide your response in the following format:
PART1: [Your main response here - this will be spoken and displayed as text]
PART2: [Code examples or technical content here - this will be displayed in a code box]

If no code is needed, leave PART2 empty.`

    console.log('🔗 Calling Gemini API...')

    // Call Gemini API
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: combinedPrompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1000,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    })

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.json().catch(() => ({}))
      console.error('❌ Gemini API error:', errorData)
      throw new Error(`Gemini API error: ${geminiResponse.status}`)
    }

    const data = await geminiResponse.json()
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()

    if (!aiResponse) {
      console.error('❌ No response received from AI service')
      throw new Error('No response received from AI service')
    }

    // Parse the response into part1 and part2
    let part1 = aiResponse
    let part2 = ''

    // Try to extract PART1 and PART2 from the response
    const part1Match = aiResponse.match(/PART1:\s*(.*?)(?=\s*PART2:|$)/is)
    const part2Match = aiResponse.match(/PART2:\s*(.*?)$/is)

    if (part1Match) {
      part1 = part1Match[1].trim()
    }

    if (part2Match) {
      part2 = part2Match[1].trim()
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

    // Clean up part1 (remove any remaining PART1/PART2 markers)
    part1 = part1.replace(/^(PART1:\s*)/i, '').trim()
    part2 = part2.replace(/^(PART2:\s*)/i, '').trim()

    // If part1 is empty, use the full response
    if (!part1) {
      part1 = aiResponse
    }

    console.log('API Response generated successfully:', {
      part1Length: part1.length,
      part2Length: part2.length,
      avatarType
    })

    return res.status(200).json({
      part1,
      part2,
      avatarType,
      success: true
    })

  } catch (error) {
    console.error('❌ API Error:', error)
    
    // Return fallback response for errors
    const { avatarType } = req.body || {}
    const avatarConfig = avatarType ? AVATAR_CONFIG[avatarType] : null
    
    const fallbackResponse = `I apologize, but I'm having trouble processing your request right now. Please try again in a moment.`
    
    return res.status(200).json({
      part1: fallbackResponse,
      part2: '',
      avatarType,
      success: false,
      error: 'Service temporarily unavailable'
    })
  }
} 