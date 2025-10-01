import { useState, useEffect, useRef } from 'react'

export const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [error, setError] = useState(null)
  const utteranceRef = useRef(null)

  // Comprehensive speech synthesis detection
  const detectSpeechSynthesisSupport = () => {
    console.log('🔍 Detecting Speech Synthesis Support...')
    
    // Check if window object exists
    if (typeof window === 'undefined') {
      console.error('❌ SpeechSynthesis Error: Window object not available (SSR environment)')
      return { supported: false, reason: 'Window object not available (SSR environment)' }
    }

    // Check if speechSynthesis exists
    if (!('speechSynthesis' in window)) {
      console.error('❌ SpeechSynthesis Error: speechSynthesis not supported in this browser')
      return { supported: false, reason: 'SpeechSynthesis not supported' }
    }

    // Check if SpeechSynthesisUtterance exists
    if (!('SpeechSynthesisUtterance' in window)) {
      console.error('❌ SpeechSynthesis Error: SpeechSynthesisUtterance not supported in this browser')
      return { supported: false, reason: 'SpeechSynthesisUtterance not supported' }
    }

    // Check if speechSynthesis object is accessible
    try {
      const synthesis = window.speechSynthesis
      if (!synthesis) {
        console.error('❌ SpeechSynthesis Error: speechSynthesis object is null or undefined')
        return { supported: false, reason: 'SpeechSynthesis object not accessible' }
      }
    } catch (error) {
      console.error('❌ SpeechSynthesis Error: Cannot access speechSynthesis object:', error)
      return { supported: false, reason: 'Cannot access speechSynthesis object' }
    }

    // Test if we can create an utterance
    try {
      const testUtterance = new window.SpeechSynthesisUtterance('test')
      if (!testUtterance) {
        console.error('❌ SpeechSynthesis Error: Cannot create SpeechSynthesisUtterance instance')
        return { supported: false, reason: 'Cannot create SpeechSynthesisUtterance' }
      }
    } catch (error) {
      console.error('❌ SpeechSynthesis Error: Failed to create test utterance:', error)
      return { supported: false, reason: 'Failed to create SpeechSynthesisUtterance' }
    }

    // Check if audio context is supported (for audio playback capability)
    try {
      if (!('AudioContext' in window) && !('webkitAudioContext' in window)) {
        console.warn('⚠️ SpeechSynthesis Warning: AudioContext not supported - audio playback may be limited')
      }
    } catch (error) {
      console.warn('⚠️ SpeechSynthesis Warning: Cannot check AudioContext support:', error)
    }

    console.log('✅ Speech Synthesis Support Detected Successfully')
    return { supported: true, reason: 'Fully supported' }
  }

  useEffect(() => {
    const detection = detectSpeechSynthesisSupport()
    setIsSupported(detection.supported)
    
    if (!detection.supported) {
      setError(detection.reason)
      console.error(`🚫 Speech Synthesis Disabled: ${detection.reason}`)
    } else {
      console.log('🎤 Speech Synthesis Ready for Use')
    }
  }, [])

  // Clean text for speech synthesis by removing or replacing special characters
  const cleanTextForSpeech = (text) => {
    if (!text || typeof text !== 'string') return text
    
    return text
      // Remove markdown formatting characters
      .replace(/\*/g, ' ')           // Remove asterisks (*)
      .replace(/#/g, ' ')            // Remove hash symbols (#)
      .replace(/`/g, ' ')            // Remove backticks (`)
      .replace(/~/g, ' ')            // Remove tildes (~)
      .replace(/_/g, ' ')            // Remove underscores (_)
      .replace(/\[/g, ' ')           // Remove square brackets [
      .replace(/\]/g, ' ')           // Remove square brackets ]
      .replace(/\{/g, ' ')           // Remove curly braces {
      .replace(/\}/g, ' ')           // Remove curly braces }
      .replace(/\|/g, ' ')           // Remove pipe symbols |
      .replace(/\\/g, ' ')           // Remove backslashes
      .replace(/</g, ' ')            // Remove less than <
      .replace(/>/g, ' ')            // Remove greater than >
      .replace(/&/g, ' and ')        // Replace & with "and"
      .replace(/@/g, ' at ')         // Replace @ with "at"
      .replace(/\$/g, ' dollar ')    // Replace $ with "dollar"
      .replace(/\+/g, ' plus ')      // Replace + with "plus"
      .replace(/=/g, ' equals ')     // Replace = with "equals"
      .replace(/"/g, ' ')            // Remove double quotes
      .replace(/'/g, ' ')            // Remove single quotes
      .replace(/'/g, ' ')            // Remove curly apostrophe
      .replace(/'/g, ' ')            // Remove curly apostrophe
      .replace(/"/g, ' ')            // Remove curly double quotes
      .replace(/"/g, ' ')            // Remove curly double quotes
      .replace(/:/g, '. ')           // Replace colons with periods
      // Add pauses at periods for 1 second pause effect
      .replace(/\./g, '. ... ')      // Add extra dots for pause effect
      // Clean up multiple spaces
      .replace(/\s+/g, ' ')
      .trim()
  }

  // Function to select the appropriate voice based on language and avatar type
  const selectVoice = (voices, language = "en", avatarType = null) => {
    if (!voices || voices.length === 0) {
      console.warn('⚠️ No voices available for selection')
      return null
    }

    let selectedVoice = null

    if (language === "hi" || avatarType === "hindi-teacher") {
      // Hindi deep male voice preference
      selectedVoice = voices.find(v => 
        v.name.includes("Google हिन्दी") && v.name.toLowerCase().includes("male")
      ) || voices.find(v => 
        v.name.includes("hi-IN-Standard-B")
      ) || voices.find(v => 
        v.lang === "hi-IN" && v.name.toLowerCase().includes("male")
      ) || voices.find(v => 
        v.lang === "hi-IN"
      )
      
      if (selectedVoice) {
        console.log('🎤 Selected Hindi voice:', selectedVoice.name, selectedVoice.lang)
      }
    } else {
      // English deep male voice preference
      selectedVoice = voices.find(v => 
        v.name.includes("Google UK English Male")
      ) || voices.find(v => 
        v.name.includes("en-GB-Standard-B")
      ) || voices.find(v => 
        v.lang === "en-GB" && v.name.toLowerCase().includes("male")
      ) || voices.find(v => 
        v.lang === "en-GB"
      ) || voices.find(v => 
        v.lang.startsWith("en") && v.name.toLowerCase().includes("male")
      )
      
      if (selectedVoice) {
        console.log('🎤 Selected English voice:', selectedVoice.name, selectedVoice.lang)
      }
    }

    // Fallback to first available voice if no preferred voice found
    if (!selectedVoice) {
      selectedVoice = voices[0]
      console.log('🎤 Using fallback voice:', selectedVoice.name, selectedVoice.lang)
    }

    return selectedVoice
  }

  const speakText = (text, language = "en", avatarType = null, onComplete) => {
    // Clean the text before speaking
    const cleanedText = cleanTextForSpeech(text)
    console.log('🎤 Attempting to speak text:', cleanedText ? cleanedText.substring(0, 50) + '...' : 'null/empty')
    console.log('🎤 Language:', language, 'Avatar Type:', avatarType)
    
    // Early validation
    if (!text || typeof text !== 'string') {
      console.warn('⚠️ SpeechSynthesis Warning: Invalid text provided:', text)
      if (onComplete) onComplete()
      return
    }

    if (!isSupported) {
      console.error('❌ SpeechSynthesis Error: Cannot speak - not supported')
      setError('SpeechSynthesis not supported')
      if (onComplete) onComplete()
      return
    }

    // Check if speechSynthesis is still available
    if (!window.speechSynthesis) {
      console.error('❌ SpeechSynthesis Error: speechSynthesis no longer available')
      setError('SpeechSynthesis no longer available')
      if (onComplete) onComplete()
      return
    }

    try {
      // Stop any existing speech
      if (isSpeaking) {
        console.log('🛑 Stopping existing speech before starting new one')
        window.speechSynthesis.cancel()
      }

      setIsSpeaking(true)
      setError(null)

      const utterance = new window.SpeechSynthesisUtterance(cleanedText)
      
      // Set voice characteristics for deep male voice and clarity
      utterance.pitch = 0.8  // Deep tone
      utterance.rate = 0.85  // Slower for clearer articulation (was 0.95)
      utterance.volume = 0.8

      console.log('🎤 Created utterance with settings:', {
        rate: utterance.rate,
        pitch: utterance.pitch,
        volume: utterance.volume,
        textLength: text.length
      })

      // Function to set voice and speak
      const setVoiceAndSpeak = () => {
        const voices = window.speechSynthesis.getVoices()
        console.log('🎤 Available voices:', voices.length)
        
        // Select appropriate voice based on language and avatar type
        const selectedVoice = selectVoice(voices, language, avatarType)
        
        if (selectedVoice) {
          utterance.voice = selectedVoice
          console.log('🎤 Final voice selection:', selectedVoice.name, selectedVoice.lang)
        }

        // Event handlers with detailed logging
        utterance.onstart = () => {
          console.log('🎤 Speech started successfully')
          setIsSpeaking(true)
          setError(null)
        }
        
        utterance.onend = () => {
          console.log('🎤 Speech completed successfully')
          setIsSpeaking(false)
          setError(null)
          if (onComplete) onComplete()
        }
        
        utterance.onpause = () => {
          console.log('⏸️ Speech paused')
        }
        
        utterance.onresume = () => {
          console.log('▶️ Speech resumed')
        }
        
        utterance.oncancel = () => {
          console.log('🛑 Speech cancelled')
          setIsSpeaking(false)
          setError(null)
          if (onComplete) onComplete()
        }
        
        utterance.onerror = (error) => {
          // Handle different types of speech synthesis errors
          let errorMessage = null
          let shouldLogError = true
          
          switch (error.error) {
            case 'canceled':
              // This is normal when speech is stopped intentionally
              errorMessage = null
              shouldLogError = false
              break
            case 'interrupted':
              // This is normal when new speech starts or page navigates
              errorMessage = null
              shouldLogError = false
              break
            case 'invalid-argument':
              errorMessage = 'Invalid text or settings provided'
              break
            case 'not-allowed':
              errorMessage = 'Audio playback blocked by browser'
              break
            case 'network':
              errorMessage = 'Network error during speech synthesis'
              break
            case 'synthesis-not-supported':
              errorMessage = 'Speech synthesis not supported'
              break
            case 'synthesis-failed':
              errorMessage = 'Speech synthesis failed'
              break
            case 'audio-busy':
              errorMessage = 'Audio system is busy'
              break
            case 'audio-hardware':
              errorMessage = 'Audio hardware error'
              break
            default:
              errorMessage = `Speech synthesis error: ${error.message || error.error}`
          }
          
          // Only log and set error for actual problems
          if (shouldLogError) {
            console.error('❌ SpeechSynthesis Error Event:', {
              error: error.error,
              message: error.message,
              name: error.name
            })
          } else {
            console.log('ℹ️ SpeechSynthesis Info:', {
              error: error.error,
              message: 'This is normal behavior'
            })
          }
          
          // Only set error state for actual problems
          if (errorMessage) {
            setError(errorMessage)
          }
          
          setIsSpeaking(false)
          if (onComplete) onComplete()
        }

        // Attempt to speak
        console.log('🎤 Attempting to speak utterance...')
        window.speechSynthesis.speak(utterance)
        utteranceRef.current = utterance
        
        console.log('✅ Speech synthesis initiated successfully')
      }

      // Check if voices are available immediately
      const voices = window.speechSynthesis.getVoices()
      if (voices.length > 0) {
        setVoiceAndSpeak()
      } else {
        // Voices may not be loaded immediately, wait for voiceschanged event
        console.log('⏳ Voices not loaded yet, waiting for voiceschanged event...')
        const handleVoicesChanged = () => {
          setVoiceAndSpeak()
          // Remove the listener after it fires to prevent multiple calls
          window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged)
        }
        window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged)
      }
      
    } catch (error) {
      console.error('❌ SpeechSynthesis Critical Error:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      })
      
      let errorMessage = 'Speech synthesis failed'
      
      if (error.name === 'TypeError') {
        errorMessage = 'SpeechSynthesis not supported'
      } else if (error.message.includes('not allowed') || error.message.includes('permission')) {
        errorMessage = 'Audio playback blocked by browser'
      } else if (error.message.includes('network') || error.message.includes('connection')) {
        errorMessage = 'Network error during speech synthesis'
      } else {
        errorMessage = `Speech synthesis error: ${error.message}`
      }
      
      setError(errorMessage)
      setIsSpeaking(false)
      if (onComplete) onComplete()
    }
  }

  const stopSpeaking = () => {
    console.log('🛑 Attempting to stop speech...')
    
    try {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel()
        console.log('✅ Speech stopped successfully')
      } else {
        console.warn('⚠️ SpeechSynthesis Warning: speechSynthesis not available for stopping')
      }
    } catch (error) {
      console.error('❌ SpeechSynthesis Error: Failed to stop speech:', error)
    }
    
    setIsSpeaking(false)
    setError(null)
  }

  const pauseSpeaking = () => {
    console.log('⏸️ Attempting to pause speech...')
    
    try {
      if (window.speechSynthesis) {
        window.speechSynthesis.pause()
        console.log('✅ Speech paused successfully')
      } else {
        console.warn('⚠️ SpeechSynthesis Warning: speechSynthesis not available for pausing')
      }
    } catch (error) {
      console.error('❌ SpeechSynthesis Error: Failed to pause speech:', error)
    }
  }

  const resumeSpeaking = () => {
    console.log('▶️ Attempting to resume speech...')
    
    try {
      if (window.speechSynthesis) {
        window.speechSynthesis.resume()
        console.log('✅ Speech resumed successfully')
      } else {
        console.warn('⚠️ SpeechSynthesis Warning: speechSynthesis not available for resuming')
      }
    } catch (error) {
      console.error('❌ SpeechSynthesis Error: Failed to resume speech:', error)
    }
  }

  return {
    speakText,
    stopSpeaking,
    pauseSpeaking,
    resumeSpeaking,
    isSpeaking,
    isSupported,
    error
  }
}
