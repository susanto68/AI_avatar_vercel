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

  const speakText = (text, onComplete) => {
    console.log('🎤 Attempting to speak text:', text ? text.substring(0, 50) + '...' : 'null/empty')
    
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

      const utterance = new window.SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1.0
      utterance.volume = 0.8

      console.log('🎤 Created utterance with settings:', {
        rate: utterance.rate,
        pitch: utterance.pitch,
        volume: utterance.volume,
        textLength: text.length
      })

      // Select a pleasant voice if available
      try {
        const voices = window.speechSynthesis.getVoices()
        console.log('🎤 Available voices:', voices.length)
        
        const preferredVoice = voices.find(voice => 
          voice.name.includes('Female') || 
          voice.name.includes('Samantha') || 
          voice.name.includes('Alex') ||
          voice.lang.startsWith('en')
        )
        
        if (preferredVoice) {
          utterance.voice = preferredVoice
          console.log('🎤 Selected voice:', preferredVoice.name, preferredVoice.lang)
        } else {
          console.log('🎤 Using default voice (no preferred voice found)')
        }
      } catch (voiceError) {
        console.warn('⚠️ SpeechSynthesis Warning: Could not select voice:', voiceError)
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
        console.error('❌ SpeechSynthesis Error Event:', {
          error: error.error,
          message: error.message,
          name: error.name
        })
        
        let errorMessage = 'Speech synthesis error occurred'
        
        switch (error.error) {
          case 'canceled':
            errorMessage = 'Speech was cancelled'
            break
          case 'interrupted':
            errorMessage = 'Speech was interrupted'
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
        
        setError(errorMessage)
        setIsSpeaking(false)
        if (onComplete) onComplete()
      }

      // Attempt to speak
      console.log('🎤 Attempting to speak utterance...')
      window.speechSynthesis.speak(utterance)
      utteranceRef.current = utterance
      
      console.log('✅ Speech synthesis initiated successfully')
      
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
