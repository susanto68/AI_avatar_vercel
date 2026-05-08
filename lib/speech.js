// Enhanced Speech synthesis detection and TTS functionality with pause/resume support
// This module provides one-time detection of browser speech synthesis support
// and a unified speakText function with advanced controls

// Module-scoped variables for managing speech state
let isSpeaking = false
let isPaused = false
let currentUtterance = null
let currentAudioElement = null
let onCompleteCallback = null
let currentText = ''
let currentOptions = {}

// Initialize speech synthesis
export function initSynth() {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    console.warn('⚠️ Speech synthesis not supported in this environment')
    return false
  }

  try {
    // Chrome-specific workaround for voice loading
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.addEventListener('voiceschanged', () => {
        console.log('🎤 Voices loaded:', window.speechSynthesis.getVoices().length)
      })
    }

    // Set default speech properties
    window.speechSynthesis.cancel() // Clear any existing speech
    
    console.log('✅ Speech synthesis initialized successfully')
    return true
  } catch (error) {
    console.error('❌ Failed to initialize speech synthesis:', error)
    return false
  }
}

// Get current speaking state
export function getSpeakingState() {
  return {
    isSpeaking,
    isPaused,
    canPause: isSpeaking && !isPaused,
    canResume: isPaused,
    canStop: isSpeaking || isPaused,
    currentText,
    currentOptions
  }
}

// Get browser speech synthesis capability/status for test and debug pages
export function getSpeechStatus() {
  if (typeof window === 'undefined') {
    return {
      supported: false,
      initialized: false,
      voiceCount: 0,
      speaking: false,
      pending: false,
      paused: false,
      reason: 'Speech synthesis is only available in the browser'
    }
  }

  const synth = window.speechSynthesis
  if (!synth) {
    return {
      supported: false,
      initialized: false,
      voiceCount: 0,
      speaking: false,
      pending: false,
      paused: false,
      reason: 'window.speechSynthesis is not available'
    }
  }

  const voices = synth.getVoices()

  return {
    supported: true,
    initialized: true,
    voiceCount: voices.length,
    voices: voices.slice(0, 5).map((voice) => ({
      name: voice.name,
      lang: voice.lang,
      default: voice.default
    })),
    speaking: synth.speaking || isSpeaking,
    pending: synth.pending,
    paused: synth.paused || isPaused,
    currentText,
    currentOptions
  }
}

// Pause current speech
export function pauseSpeaking() {
  try {
    if (currentUtterance && window.speechSynthesis) {
      window.speechSynthesis.pause()
      isPaused = true
      console.log('⏸️ Speech paused')
      return true
    }
    return false
  } catch (error) {
    console.error('❌ Failed to pause speech:', error)
    return false
  }
}

// Resume paused speech
export function resumeSpeaking() {
  try {
    if (currentUtterance && window.speechSynthesis && isPaused) {
      window.speechSynthesis.resume()
      isPaused = false
      console.log('▶️ Speech resumed')
      return true
    }
    return false
  } catch (error) {
    console.error('❌ Failed to resume speech:', error)
    return false
  }
}

// Stop all speech
export function stopSpeaking() {
  try {
    // Stop speech synthesis
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
    
    // Stop audio element if playing
    if (currentAudioElement) {
      currentAudioElement.pause()
      currentAudioElement.currentTime = 0
      currentAudioElement = null
    }
    
    // Reset state
    isSpeaking = false
    isPaused = false
    currentUtterance = null
    onCompleteCallback = null
    currentText = ''
    currentOptions = {}
    
    console.log('⏹️ All speech stopped')
    return true
  } catch (error) {
    console.error('❌ Failed to stop speech:', error)
    return false
  }
}

// Clean text for speech - remove special characters that sound odd
function cleanTextForSpeech(text) {
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
    // Add pauses at periods for 1 second pause effect
    .replace(/\./g, '. ... ')      // Add extra dots for pause effect
    // Clean up multiple spaces
    .replace(/\s+/g, ' ')
    .trim()
}

// Speak text with improved flow control
export function speakText(text, onComplete, options = {}) {
  if (!text || typeof text !== 'string') {
    console.warn('⚠️ Invalid text for speech:', text)
    return false
  }

  try {
    // Clean the text before speaking
    const cleanedText = cleanTextForSpeech(text)
    console.log('🎤 Original text:', text.substring(0, 100))
    console.log('🎤 Cleaned text:', cleanedText.substring(0, 100))
    
    // Stop any existing speech to prevent overlaps
    stopSpeaking()
    
    // Small delay to ensure clean speech start
    setTimeout(() => {
      _startSpeaking(cleanedText, onComplete, options)
    }, 100)
    
    return true
  } catch (error) {
    console.error('❌ Failed to start speech:', error)
    return false
  }
}

// Internal function to start speaking
function _startSpeaking(text, onComplete, options = {}) {
  try {
    // Store current context
    currentText = text
    currentOptions = options
    onCompleteCallback = onComplete
    
    // Check if speech synthesis is available
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      _speakWithSynthesis(text, onComplete, options)
    } else {
      console.warn('⚠️ Speech synthesis not available, falling back to audio')
      _speakWithAudio(text, onComplete, options)
    }
  } catch (error) {
    console.error('❌ Failed to start speaking:', error)
    if (onComplete) onComplete()
  }
}

// Speak using Web Speech API
function _speakWithSynthesis(text, onComplete, options = {}) {
  try {
    // Create new utterance
    const utterance = new SpeechSynthesisUtterance(text)
    currentUtterance = utterance
    
    // Set voice properties (slightly slower for clarity)
    utterance.rate = options.rate || 0.85      // Slower speed (was 1.0)
    utterance.pitch = options.pitch || 1.0
    utterance.volume = options.volume || 1.0
    
    console.log('🎤 Speech settings: rate=' + utterance.rate + ', pitch=' + utterance.pitch)
    
    // Set voice if specified
    if (options.voice) {
      utterance.voice = options.voice
      } else {
      // Try to find a good default voice
      const voices = window.speechSynthesis.getVoices()
      const preferredVoice = voices.find(v => 
        v.lang.startsWith('en') && v.default
      ) || voices.find(v => 
        v.lang.startsWith('en')
      ) || voices[0]
      
      if (preferredVoice) {
        utterance.voice = preferredVoice
        console.log('🎤 Using voice:', preferredVoice.name)
      }
    }
    
    // Set event handlers
      utterance.onstart = () => {
        isSpeaking = true
      isPaused = false
      console.log('🎤 Speech started:', text.substring(0, 50) + '...')
      }
      
      utterance.onend = () => {
        isSpeaking = false
      isPaused = false
      currentUtterance = null
      console.log('✅ Speech completed')
      if (onComplete && typeof onComplete === 'function') {
        onComplete()
      }
    }
      
    utterance.onerror = (event) => {
      console.error('❌ Speech error:', event.error)
      isSpeaking = false
      isPaused = false
      currentUtterance = null
      if (onComplete && typeof onComplete === 'function') {
        onComplete()
      }
    }
      
        utterance.onpause = () => {
      isPaused = true
      console.log('⏸️ Speech paused')
        }
        
        utterance.onresume = () => {
      isPaused = false
      console.log('▶️ Speech resumed')
      }
      
    // Start speaking
        window.speechSynthesis.speak(utterance)
    
  } catch (error) {
    console.error('❌ Failed to create utterance:', error)
    if (onComplete && typeof onComplete === 'function') {
      onComplete()
    }
  }
}

// Fallback to audio (if needed)
function _speakWithAudio(text, onComplete, options = {}) {
  // This is a fallback - you can implement audio file playback here
  console.log('🔊 Audio fallback not implemented')
  if (onComplete) onComplete()
}

// Reinitialize speech synthesis
export function reinitSynth() {
  console.log('🔄 Reinitializing speech synthesis...')
  stopSpeaking()
  return initSynth()
}
