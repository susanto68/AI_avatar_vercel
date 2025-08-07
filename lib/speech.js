// Speech synthesis detection and TTS functionality with Gemini fallback
// This module provides one-time detection of browser speech synthesis support
// and a unified speakText function that falls back to Gemini TTS when needed

// Module-scoped variable to track speech synthesis support
let synthesizerSupported = false
let detectionComplete = false
let currentAudioElement = null // Track current audio element for Gemini TTS

/**
 * Initialize speech synthesis detection
 * This function should be called once when the app loads
 * It checks if the browser supports speech synthesis and has voices available
 */
export function initSynth() {
  // Prevent multiple initializations
  if (detectionComplete) {
    console.log('🎤 Speech synthesis detection already completed')
    return
  }

  console.log('🔍 Initializing speech synthesis detection...')

  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    console.log('❌ Speech synthesis not available (SSR environment)')
    synthesizerSupported = false
    detectionComplete = true
    return
  }

  // Check if speechSynthesis API exists
  if (!('speechSynthesis' in window)) {
    console.log('❌ Speech synthesis not supported in this browser')
    synthesizerSupported = false
    detectionComplete = true
    return
  }

  // Check if SpeechSynthesisUtterance exists
  if (!('SpeechSynthesisUtterance' in window)) {
    console.log('❌ SpeechSynthesisUtterance not supported in this browser')
    synthesizerSupported = false
    detectionComplete = true
    return
  }

  // Try to get voices immediately
  try {
    const voices = window.speechSynthesis.getVoices()
    
    if (voices && voices.length > 0) {
      console.log(`✅ Speech synthesis supported with ${voices.length} voices available`)
      synthesizerSupported = true
      detectionComplete = true
    } else {
      // Voices might not be loaded yet, attach a one-time listener
      console.log('⏳ Voices not loaded yet, waiting for voiceschanged event...')
      
      const handleVoicesChanged = () => {
        const voices = window.speechSynthesis.getVoices()
        if (voices && voices.length > 0) {
          console.log(`✅ Speech synthesis supported with ${voices.length} voices available`)
          synthesizerSupported = true
        } else {
          console.log('❌ No voices available for speech synthesis')
          synthesizerSupported = false
        }
        
        detectionComplete = true
        // Remove the listener after it fires
        window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged)
      }
      
      window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged)
      
      // Set a timeout in case the event never fires
      setTimeout(() => {
        if (!detectionComplete) {
          console.log('⏰ Timeout waiting for voices, assuming speech synthesis not available')
          synthesizerSupported = false
          detectionComplete = true
          window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged)
        }
      }, 5000) // 5 second timeout
    }
  } catch (error) {
    console.error('❌ Error during speech synthesis detection:', error)
    synthesizerSupported = false
    detectionComplete = true
  }
}

/**
 * Unified speakText function that uses native speech synthesis or falls back to Gemini TTS
 * @param {string} text - The text to speak
 * @param {Function} onComplete - Optional callback when speaking is complete
 */
export async function speakText(text, onComplete) {
  console.log('🎤 Attempting to speak text:', text ? text.substring(0, 50) + '...' : 'null/empty')
  console.log('🎤 Speech synthesis supported:', synthesizerSupported)
  
  // Early validation
  if (!text || typeof text !== 'string') {
    console.warn('⚠️ SpeechSynthesis Warning: Invalid text provided:', text)
    if (onComplete) onComplete()
    return
  }

  // Use native speech synthesis if supported
  if (synthesizerSupported) {
    console.log('🎤 Using native speech synthesis')
    
    try {
      // Stop any existing speech
      if (window.speechSynthesis.speaking) {
        console.log('🛑 Stopping existing speech before starting new one')
        window.speechSynthesis.cancel()
      }

      const utterance = new window.SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1.0
      utterance.volume = 0.8

      // Select a pleasant voice if available
      try {
        const voices = window.speechSynthesis.getVoices()
        console.log('🎤 Available voices:', voices.map(v => `${v.name} (${v.lang})`))
        
        const preferredVoice = voices.find(voice => 
          voice.name.includes('Female') || 
          voice.name.includes('Samantha') || 
          voice.name.includes('Alex') ||
          voice.lang.startsWith('en')
        )
        
        if (preferredVoice) {
          utterance.voice = preferredVoice
          console.log('🎤 Selected voice:', preferredVoice.name, preferredVoice.lang)
        } else if (voices.length > 0) {
          utterance.voice = voices[0]
          console.log('🎤 Using default voice:', voices[0].name, voices[0].lang)
        }
      } catch (voiceError) {
        console.warn('⚠️ Could not select voice:', voiceError)
      }

      // Event handlers
      utterance.onstart = () => {
        console.log('🎤 Native speech started')
      }
      
      utterance.onend = () => {
        console.log('🎤 Native speech completed successfully')
        if (onComplete) onComplete()
      }
      
      utterance.onerror = (error) => {
        console.error('❌ Native speech synthesis error:', error)
        if (onComplete) onComplete()
      }

      // Speak the text
      window.speechSynthesis.speak(utterance)
      console.log('✅ Native speech synthesis initiated successfully')
      
    } catch (error) {
      console.error('❌ Native speech synthesis failed:', error)
      // Fall through to Gemini TTS
      await useGeminiTTS(text, onComplete)
    }
  } else {
    // Use Gemini TTS fallback
    console.log('🎤 Using Gemini TTS fallback')
    await useGeminiTTS(text, onComplete)
  }
}

/**
 * Use Gemini TTS to generate and play audio
 * @param {string} text - The text to convert to speech
 * @param {Function} onComplete - Optional callback when speaking is complete
 */
async function useGeminiTTS(text, onComplete) {
  try {
    console.log('🎤 Calling Gemini TTS API...')
    
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('❌ TTS API error:', response.status, errorData)
      throw new Error(`TTS API error: ${response.status}`)
    }

    const { audio } = await response.json()
    
    if (!audio) {
      throw new Error('No audio content received from TTS API')
    }

    console.log('🎤 Audio content received, length:', audio.length)

    // Convert base64 to audio blob and play
    const bytes = Uint8Array.from(atob(audio), c => c.charCodeAt(0))
    const blob = new Blob([bytes], { type: 'audio/mpeg' })
    const url = URL.createObjectURL(blob)
    
    // Stop any existing audio
    if (currentAudioElement) {
      currentAudioElement.pause()
      currentAudioElement.src = ''
      URL.revokeObjectURL(currentAudioElement.src)
    }
    
    const audioElement = new Audio(url)
    currentAudioElement = audioElement
    
    // Set audio properties
    audioElement.volume = 0.8
    audioElement.preload = 'auto'
    
    // Event handlers
    audioElement.onloadstart = () => {
      console.log('🎤 Gemini TTS audio loading started')
    }
    
    audioElement.oncanplay = () => {
      console.log('🎤 Gemini TTS audio can play')
    }
    
    audioElement.onplay = () => {
      console.log('🎤 Gemini TTS audio playback started')
    }
    
    audioElement.onended = () => {
      console.log('🎤 Gemini TTS audio completed successfully')
      URL.revokeObjectURL(url) // Clean up the blob URL
      currentAudioElement = null
      if (onComplete) onComplete()
    }
    
    audioElement.onerror = (error) => {
      console.error('❌ Gemini TTS audio playback error:', error)
      console.error('❌ Audio error details:', audioElement.error)
      URL.revokeObjectURL(url) // Clean up the blob URL
      currentAudioElement = null
      if (onComplete) onComplete()
    }
    
    // Try to play the audio
    try {
      await audioElement.play()
      console.log('✅ Gemini TTS audio playback initiated successfully')
    } catch (playError) {
      console.error('❌ Failed to play audio:', playError)
      // This might be due to autoplay policy - try to handle it gracefully
      if (playError.name === 'NotAllowedError') {
        console.log('⚠️ Autoplay blocked by browser policy')
        // We could show a message to the user here
      }
      URL.revokeObjectURL(url)
      currentAudioElement = null
      if (onComplete) onComplete()
    }
    
  } catch (error) {
    console.error('❌ Gemini TTS failed:', error)
    if (onComplete) onComplete()
  }
}

/**
 * Stop any ongoing speech (works for both native and Gemini TTS)
 */
export function stopSpeaking() {
  console.log('🛑 Attempting to stop speech...')
  
  try {
    // Stop native speech synthesis
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
      console.log('✅ Native speech stopped successfully')
    }
  } catch (error) {
    console.error('❌ Error stopping native speech:', error)
  }
  
  // Stop Gemini TTS audio
  if (currentAudioElement) {
    currentAudioElement.pause()
    currentAudioElement.src = ''
    currentAudioElement = null
    console.log('✅ Gemini TTS audio stopped successfully')
  }
}

// Export the detection status
export { synthesizerSupported }

/**
 * Get current speech synthesis status for debugging
 */
export function getSpeechStatus() {
  return {
    synthesizerSupported,
    detectionComplete,
    hasWindow: typeof window !== 'undefined',
    hasSpeechSynthesis: typeof window !== 'undefined' && 'speechSynthesis' in window,
    hasSpeechSynthesisUtterance: typeof window !== 'undefined' && 'SpeechSynthesisUtterance' in window,
    voicesCount: typeof window !== 'undefined' && window.speechSynthesis ? window.speechSynthesis.getVoices().length : 0,
    isSpeaking: typeof window !== 'undefined' && window.speechSynthesis ? window.speechSynthesis.speaking : false
  }
}

/**
 * Test function to verify speech synthesis is working
 * This can be called from the browser console for debugging
 */
export function testSpeech() {
  console.log('🧪 Testing speech synthesis...')
  const status = getSpeechStatus()
  console.log('📊 Speech status:', status)
  
  if (synthesizerSupported) {
    console.log('🎤 Testing native speech synthesis...')
    speakText('Hello, this is a test of the speech synthesis system.', () => {
      console.log('✅ Native speech test completed')
    })
  } else {
    console.log('🎤 Testing Gemini TTS fallback...')
    speakText('Hello, this is a test of the Gemini TTS system.', () => {
      console.log('✅ Gemini TTS test completed')
    })
  }
}
