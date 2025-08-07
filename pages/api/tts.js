// Gemini TTS API endpoint
// This endpoint converts text to speech using Gemini's Flash TTS model
// Returns base64-encoded MP3 audio data

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed. Only POST requests are accepted.',
      method: req.method 
    })
  }

  try {
    const { text } = req.body || {}

    // Validate required fields
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ 
        error: 'Missing or invalid text. Please provide a valid text string.',
        received: { text }
      })
    }

    // Check for Gemini API key
    const geminiApiKey = process.env.GEMINI_API_KEY
    if (!geminiApiKey) {
      console.error('GEMINI_API_KEY not found in environment variables')
      return res.status(500).json({ 
        error: 'TTS service configuration error. Please try again later.'
      })
    }

    // Prepare the request body for Gemini TTS
    const requestBody = {
      responseModality: "audio",
      speechConfig: {
        voice: {
          name: "en-US-Standard-A"
        },
        audioEncoding: "MP3"
      },
      prompt: text
    }

    console.log('🎤 Calling Gemini TTS API with text:', text.substring(0, 50) + '...')

    // Call Gemini TTS API
    const geminiResponse = await fetch(
      `https://api.ai.google/v1/models/gemini-2.5-flash-preview-tts:generate?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      }
    )

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.json().catch(() => ({}))
      console.error('Gemini TTS API error:', errorData)
      
      // Handle specific error cases
      if (geminiResponse.status === 400) {
        return res.status(400).json({ 
          error: 'Invalid text provided for TTS conversion.'
        })
      } else if (geminiResponse.status === 401) {
        return res.status(500).json({ 
          error: 'TTS service authentication error. Please try again later.'
        })
      } else if (geminiResponse.status === 429) {
        return res.status(429).json({ 
          error: 'TTS service rate limit exceeded. Please try again in a moment.'
        })
      } else {
        throw new Error(`Gemini TTS API error: ${geminiResponse.status}`)
      }
    }

    const data = await geminiResponse.json()
    
    // Extract audio content from response
    const audioContent = data.audioContent

    if (!audioContent) {
      throw new Error('No audio content received from Gemini TTS API')
    }

    console.log('✅ Gemini TTS API call successful, audio content received')

    // Return the base64 audio content
    return res.status(200).json({
      audio: audioContent,
      success: true
    })

  } catch (error) {
    console.error('TTS API Error:', error)
    
    // Return user-friendly error response
    let errorMessage = 'TTS service temporarily unavailable. Please try again later.'
    
    if (error.message.includes('network') || error.message.includes('fetch')) {
      errorMessage = 'Network error during TTS conversion. Please check your internet connection.'
    } else if (error.message.includes('timeout')) {
      errorMessage = 'TTS request timed out. Please try again.'
    } else if (error.message.includes('audio')) {
      errorMessage = 'Audio generation failed. Please try again.'
    }
    
    return res.status(500).json({
      error: errorMessage,
      success: false
    })
  }
}
