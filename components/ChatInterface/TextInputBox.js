import { useState, useRef, useEffect, useCallback } from 'react'
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition'

export default function TextInputBox({ 
  onSubmit, 
  isProcessing, 
  placeholder = "Type your question here or use voice input...",
  className = "",
  value,
  onChange
}) {
  const [inputText, setInputText] = useState('')
  const [isVoiceMode, setIsVoiceMode] = useState(false)
  const textareaRef = useRef(null)
  
  const {
    startListening,
    stopListening,
    isListening,
    transcript,
    resetTranscript,
    error: speechError,
    clearError: clearSpeechError,
    permissionStatus,
    checkPermission,
    isSupported: recognitionSupported
  } = useSpeechRecognition()

  const displayText = value !== undefined ? value : inputText
  const updateInputText = useCallback((nextText) => {
    if (onChange) {
      onChange(nextText)
    } else {
      setInputText(nextText)
    }
  }, [onChange])

  // Handle transcript updates
  useEffect(() => {
    if (transcript && isListening) {
      // Show real-time transcript in text area while listening
      updateInputText(transcript)
    } else if (transcript && !isListening) {
      // Final transcript - keep it in text area and don't auto-submit
      updateInputText(transcript)
      setIsVoiceMode(false)
      // Don't auto-submit, let user review and manually submit
    }
  }, [transcript, isListening, updateInputText])

  // Clear input when starting new voice session
  const handleVoiceToggle = async () => {
    if (isListening) {
      // Stop listening
      await stopListening()
      setIsVoiceMode(false)
    } else {
      // Start listening - clear previous input
      updateInputText('')
      try {
        if (!recognitionSupported) {
          alert('Speech recognition not supported in this browser')
          return
        }

        if (permissionStatus === 'denied') {
          alert('Microphone permission denied. Please enable it in your browser settings.')
          return
        }

        resetTranscript()
        await startListening()
        setIsVoiceMode(true)
      } catch (error) {
        console.error('Failed to start listening:', error)
        alert('Failed to start voice input: ' + error.message)
      }
    }
  }

  // Handle form submission
  const handleSubmit = (text = null) => {
    const textToSubmit = text || displayText.trim()
    if (textToSubmit && !isProcessing) {
      onSubmit(textToSubmit)
      updateInputText('')
      resetTranscript()
    }
  }

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [displayText])

  return (
    <div className={`w-full ${className}`}>
      {/* Text Input Area */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={displayText}
          onChange={(e) => updateInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={isListening ? "🎤 Listening... Speak now" : placeholder}
          disabled={isProcessing}
          className={`w-full px-4 py-3 pr-12 backdrop-blur-md border-2 rounded-xl shadow-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed min-h-[50px] max-h-[120px] ${
            isListening 
              ? 'bg-green-50 border-green-400 animate-pulse' 
              : 'bg-white/95 border-white/40'
          }`}
          rows={1}
        />
        
        {/* Voice Button */}
        <button
          onClick={handleVoiceToggle}
          disabled={isProcessing}
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-all duration-200 ${
            isListening
              ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
              : 'bg-blue-500 hover:bg-blue-600 text-white hover:scale-105'
          } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
          title={isListening ? 'Stop voice input' : 'Start voice input'}
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            className={isListening ? 'animate-pulse' : ''}
          >
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
            <line x1="12" y1="19" x2="12" y2="23"/>
            <line x1="8" y1="23" x2="16" y2="23"/>
          </svg>
        </button>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center mt-3">
        <button
          onClick={() => handleSubmit()}
          disabled={!displayText.trim() || isProcessing}
          className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
            displayText.trim() && !isProcessing
              ? 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg hover:scale-105'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing...
            </div>
          ) : (
            'Send Question'
          )}
        </button>
      </div>

      {/* Status Messages */}
      <div className="mt-2 text-center">
        {isListening && (
          <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            Listening... Speak now
          </div>
        )}
        
        {isVoiceMode && !isListening && (
          <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            Voice input ready
          </div>
        )}

        {speechError && (
          <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-sm">
            <span>❌ {speechError}</span>
            <button
              onClick={clearSpeechError}
              className="text-red-400 hover:text-red-200"
              title="Clear error"
            >
              ×
            </button>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-2 text-center text-xs text-white/60">
        {isListening ? (
          "🎤 Speak your question - it will appear in the text box above"
        ) : (
          "💡 Type your question or click the microphone to use voice input"
        )}
      </div>
    </div>
  )
}
