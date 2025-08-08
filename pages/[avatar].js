import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { AVATAR_CONFIG } from '../lib/avatars'
import { initSynth, speakText, stopSpeaking, testSpeech, getSpeechStatus } from '../lib/speech'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition'
import { generateContentSuggestions } from '../lib/contentSuggestions'
import AvatarDisplay from '../components/ChatInterface/AvatarDisplay'
import TextDisplay from '../components/ChatInterface/TextDisplay'
import CodeBox from '../components/ChatInterface/CodeBox'
import ArticleCarousel from '../components/ChatInterface/ArticleCarousel'
import YouTubeVideos from '../components/ChatInterface/YouTubeVideos'
import VoiceControls from '../components/VoiceControls/VoiceControls'
import BackButton from '../components/Navigation/BackButton'

export default function AvatarChat() {
  const router = useRouter()
  const { avatar } = router.query
  const [currentText, setCurrentText] = useState('')
  const [codeContent, setCodeContent] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [hasPlayedGreeting, setHasPlayedGreeting] = useState(false)
  const [showError, setShowError] = useState(false)
  const [apiError, setApiError] = useState(null)
  const [noSpeechDetected, setNoSpeechDetected] = useState(false)
  const [timeoutError, setTimeoutError] = useState(false)
  const [relatedArticles, setRelatedArticles] = useState([])
  const [relatedVideos, setRelatedVideos] = useState([])
  const greetingTimeoutRef = useRef(null)
  const speechTimeoutRef = useRef(null)
  const apiTimeoutRef = useRef(null)

  // Initialize speech synthesis detection on component mount
  useEffect(() => {
    initSynth()
  }, [])

  // State for speech synthesis status
  const [isSpeaking, setIsSpeaking] = useState(false)
  const { 
    startListening, 
    stopListening, 
    isListening, 
    transcript, 
    interimTranscript,
    resetTranscript,
    error: speechError,
    clearError: clearSpeechError,
    permissionStatus,
    checkPermission,
    isSupported: recognitionSupported
  } = useSpeechRecognition()

  // Get avatar configuration
  const avatarConfig = avatar ? AVATAR_CONFIG[avatar] : null

  // Auto-greeting on page load
  const playAvatarGreeting = () => {
    if (hasPlayedGreeting || !avatarConfig) return

    const greetingMessage = `You're now talking to ${avatarConfig.name}. I'm ready to help you learn about ${avatarConfig.domain.toLowerCase()}.`
    
    setIsSpeaking(true)
    speakText(greetingMessage, () => {
      setIsSpeaking(false)
      setHasPlayedGreeting(true)
    })
  }

  // Handle speech recognition result
  useEffect(() => {
    if (transcript && !isListening) {
      setCurrentText(transcript)
      setNoSpeechDetected(false) // Clear no speech error
      // Call API with transcript
      handleApiCall(transcript)
      resetTranscript()
    }
  }, [transcript, isListening])

  // Handle interim transcript display
  useEffect(() => {
    if (isListening && interimTranscript) {
      setCurrentText(interimTranscript)
      setNoSpeechDetected(false) // Clear no speech error when speech is detected
    }
  }, [interimTranscript, isListening])

  // Handle speech recognition errors
  useEffect(() => {
    if (speechError) {
      setShowError(true)
      
      // Handle specific speech recognition errors
      if (speechError.includes('no-speech') || speechError.includes('No speech detected')) {
        setNoSpeechDetected(true)
        const noSpeechMessage = "I didn't hear anything. Please try speaking again, or check if your microphone is working properly."
        setCurrentText(noSpeechMessage)
        setIsSpeaking(true)
        speakText(noSpeechMessage, () => setIsSpeaking(false))
      } else if (speechError.includes('not-allowed') || speechError.includes('permission')) {
        const permissionMessage = "Microphone access is required. Please allow microphone permissions in your browser settings and refresh the page."
        setCurrentText(permissionMessage)
        setIsSpeaking(true)
        speakText(permissionMessage, () => setIsSpeaking(false))
      } else if (speechError.includes('network') || speechError.includes('connection')) {
        const networkMessage = "Network connection issue detected. Please check your internet connection and try again."
        setCurrentText(networkMessage)
        setIsSpeaking(true)
        speakText(networkMessage, () => setIsSpeaking(false))
      } else {
        const genericMessage = "There was an issue with speech recognition. Please try again."
        setCurrentText(genericMessage)
        setIsSpeaking(true)
        speakText(genericMessage, () => setIsSpeaking(false))
      }
      
      // Auto-hide error after 8 seconds for speech errors
      const timer = setTimeout(() => {
        setShowError(false)
        clearSpeechError()
        setNoSpeechDetected(false)
      }, 8000)
      return () => clearTimeout(timer)
    }
  }, [speechError, clearSpeechError])

  // Check permissions on component mount
  useEffect(() => {
    if (avatarConfig) {
      checkPermission()
    }
  }, [avatarConfig, checkPermission])

  // Cleanup function for timeouts
  const clearAllTimeouts = () => {
    if (speechTimeoutRef.current) {
      clearTimeout(speechTimeoutRef.current)
      speechTimeoutRef.current = null
    }
    if (apiTimeoutRef.current) {
      clearTimeout(apiTimeoutRef.current)
      apiTimeoutRef.current = null
    }
  }

  // Real API call function with comprehensive error handling
  const handleApiCall = async (message) => {
    // Frontend validation
    if (!message || typeof message !== 'string') {
      const errorMessage = 'Please provide a valid question or message.'
      setCurrentText(errorMessage)
      setIsSpeaking(true)
      speakText(errorMessage, () => setIsSpeaking(false))
      return
    }

    if (message.trim().length === 0) {
      const errorMessage = 'Please provide a valid question or message.'
      setCurrentText(errorMessage)
      setIsSpeaking(true)
      speakText(errorMessage, () => setIsSpeaking(false))
      return
    }

    if (!avatar || typeof avatar !== 'string') {
      const errorMessage = 'Avatar configuration error. Please go back and select a valid avatar.'
      setCurrentText(errorMessage)
      setIsSpeaking(true)
      speakText(errorMessage, () => setIsSpeaking(false))
      return
    }

    setIsProcessing(true)
    setApiError(null)
    setCodeContent('')
    setRelatedArticles([])
    setRelatedVideos([])
    setTimeoutError(false)
    
    // Stop any ongoing speech when starting new API call
    stopSpeaking()
    clearAllTimeouts()
    
    try {
      // Set API timeout (30 seconds)
      const apiTimeoutPromise = new Promise((_, reject) => {
        apiTimeoutRef.current = setTimeout(() => {
          reject(new Error('Request timeout. Please try again.'))
        }, 30000)
      })

      const requestBody = {
        prompt: message,
        avatarType: avatar
      }
      
      console.log('🔗 Frontend: Making API request to /api/chat')
      console.log('🔗 Frontend: Request body:', requestBody)
      
      const fetchPromise = fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      // Race between fetch and timeout
      const response = await Promise.race([fetchPromise, apiTimeoutPromise])

      if (!response.ok) {
        let errorMessage = 'Server error occurred. Please try again.'
        
        // Try to get detailed error message from response
        try {
          const errorData = await response.json()
          if (errorData.error) {
            errorMessage = errorData.error
          }
        } catch (parseError) {
          // If we can't parse the error response, use status-based messages
          if (response.status === 400) {
            errorMessage = 'Invalid request. Please check your input and try again.'
          } else if (response.status === 404) {
            errorMessage = 'Avatar not found. Please select a valid avatar.'
          } else if (response.status === 500) {
            errorMessage = 'Server is temporarily unavailable. Please try again later.'
          } else if (response.status === 503) {
            errorMessage = 'AI service is currently busy. Please try again in a moment.'
          }
        }
        
        throw new Error(errorMessage)
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      // Handle the two-part response
      if (data.part1) {
        setCurrentText(data.part1)
        
        // Speak the response with a small delay to ensure UI updates first
        // speechTimeoutRef.current = setTimeout(() => {
          setIsSpeaking(true)
          speakText(data.part1, () => {
            setIsSpeaking(false)
            console.log('Finished speaking API response')
          })
        // }, 100)
      }

      if (data.part2) {
        setCodeContent(data.part2)
      }

      // Generate content suggestions based on the question and avatar type
      const suggestions = generateContentSuggestions(message, avatar)
      setRelatedArticles(suggestions.articles)
      setRelatedVideos(suggestions.videos)

    } catch (error) {
      console.error('API call error:', error)
      
      let userFriendlyMessage = 'I apologize, but I\'m having trouble processing your request right now. Please try again in a moment.'
      
      if (error.message.includes('timeout')) {
        setTimeoutError(true)
        userFriendlyMessage = 'The request took too long to process. Please try again, or try asking a shorter question.'
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        userFriendlyMessage = 'Network connection issue. Please check your internet connection and try again.'
      } else if (error.message.includes('avatar')) {
        userFriendlyMessage = 'Avatar configuration error. Please go back and select a different avatar.'
      } else if (error.message.includes('AI service') || error.message.includes('configuration')) {
        userFriendlyMessage = 'AI service is currently unavailable. Please try again later.'
      } else {
        setApiError(error.message)
      }
      
      setCurrentText(userFriendlyMessage)
      
      // Speak fallback response
      speechTimeoutRef.current = setTimeout(() => {
        setIsSpeaking(true)
        speakText(userFriendlyMessage, () => {
          setIsSpeaking(false)
          console.log('Finished speaking fallback response')
        })
      }, 100)
    } finally {
      setIsProcessing(false)
      clearAllTimeouts()
    }
  }

  // Initialize greeting
  useEffect(() => {
    if (avatarConfig) {
      greetingTimeoutRef.current = setTimeout(() => {
        playAvatarGreeting()
      }, 1000)
    }

    return () => {
      if (greetingTimeoutRef.current) {
        clearTimeout(greetingTimeoutRef.current)
      }
      clearAllTimeouts()
    }
  }, [avatarConfig])

  // Handle back navigation
  const handleBack = () => {
    // Stop any ongoing speech when navigating back
    stopSpeaking()
    clearAllTimeouts()
    router.push('/')
  }

  // Handle start listening with comprehensive error handling
  const handleStartListening = async () => {
    // Stop any ongoing speech when starting to listen
    stopSpeaking()
    clearAllTimeouts()
    setNoSpeechDetected(false)
    setApiError(null)
    setTimeoutError(false)
    
    // Check if speech recognition is supported
    if (!recognitionSupported) {
      const unsupportedMessage = "Speech recognition is not supported in your browser. Please use a modern browser like Chrome, Firefox, or Safari."
      setCurrentText(unsupportedMessage)
      setIsSpeaking(true)
      speakText(unsupportedMessage, () => setIsSpeaking(false))
      return
    }
    
    // Check permissions before starting
    if (permissionStatus === 'denied') {
      const permissionMessage = "Microphone access is required. Please allow microphone permissions in your browser settings and refresh the page."
      setCurrentText(permissionMessage)
      setIsSpeaking(true)
      speakText(permissionMessage, () => setIsSpeaking(false))
      return
    }
    
    const success = await startListening()
    if (!success) {
      setShowError(true)
      const errorMessage = "Failed to start speech recognition. Please try again or check your microphone settings."
      setCurrentText(errorMessage)
      setIsSpeaking(true)
      speakText(errorMessage, () => setIsSpeaking(false))
    }
  }

  // Handle stop listening
  const handleStopListening = () => {
    stopListening()
    
    // Check if no speech was detected
    if (!transcript && !interimTranscript) {
      setNoSpeechDetected(true)
      const noSpeechMessage = "I didn't hear anything. Please try speaking again, or check if your microphone is working properly."
      setCurrentText(noSpeechMessage)
      setIsSpeaking(true)
      speakText(noSpeechMessage, () => setIsSpeaking(false))
    }
  }

  // Handle stop speaking
  const handleStopSpeaking = () => {
    stopSpeaking()
    setIsSpeaking(false)
    clearAllTimeouts()
  }

  const handleTestSpeech = () => {
    console.log('🧪 Testing speech system...')
    const status = getSpeechStatus()
    console.log('📊 Current speech status:', status)
    testSpeech()
  }

  // Dismiss error
  const dismissError = () => {
    setShowError(false)
    clearSpeechError()
    setApiError(null)
    setNoSpeechDetected(false)
    setTimeoutError(false)
  }

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      stopSpeaking()
      clearAllTimeouts()
      if (greetingTimeoutRef.current) {
        clearTimeout(greetingTimeoutRef.current)
      }
    }
  }, [])

  // Show loading if avatar not found
  if (!avatar || !avatarConfig) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg mb-2">Loading avatar...</p>
          <p className="text-sm opacity-70">If this takes too long, please go back and try again.</p>
          <button 
            onClick={() => router.push('/')}
            className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative">
      <Head>
        <title>{avatarConfig.name} - AI Avatar Assistant</title>
        <meta name="description" content={`Chat with ${avatarConfig.name} about ${avatarConfig.domain}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Main scrollable content */}
      <div className="container mx-auto px-4 pb-32 flex flex-col min-h-screen"> {/* Added bottom padding for fixed button */}
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-6 pt-6">
          <BackButton onClick={handleBack} />
          <div className="text-center text-white">
            <h1 className="text-xl font-semibold">{avatarConfig.name}</h1>
            <p className="text-sm opacity-70">{avatarConfig.domain}</p>
          </div>
          <div className="w-12"></div> {/* Spacer for centering */}
        </div>

        {/* Error Banner */}
        {(showError && speechError) || apiError || noSpeechDetected || timeoutError ? (
          <div className="mb-6 bg-red-500/20 border border-red-400/30 rounded-lg p-4 text-red-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
                <span className="font-medium">
                  {noSpeechDetected ? "No speech detected" : 
                   timeoutError ? "Request timeout" :
                   apiError || speechError}
                </span>
              </div>
              <button
                onClick={dismissError}
                className="text-red-300 hover:text-red-100 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          </div>
        ) : null}

        {/* Permission Status */}
        {permissionStatus === 'denied' && (
          <div className="mb-6 bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-4 text-yellow-100">
            <div className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <span className="font-medium">
                Microphone access denied. Please allow microphone permissions in your browser settings and refresh the page.
              </span>
            </div>
          </div>
        )}

        {/* Browser Support Warning */}
        {!recognitionSupported && (
          <div className="mb-6 bg-orange-500/20 border border-orange-400/30 rounded-lg p-4 text-orange-100">
            <div className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <span className="font-medium">
                Speech recognition may not work in your browser. Please use Chrome, Firefox, or Safari for the best experience.
              </span>
            </div>
          </div>
        )}

        {/* Avatar Display */}
        <div className="mb-8">
          <AvatarDisplay 
            avatar={avatar} 
            config={avatarConfig} 
            isSpeaking={isSpeaking}
          />
        </div>

        {/* Content Area - Flex container for text and code */}
        <div className="flex flex-col flex-1">
          {/* Text Display */}
          <div className={`${codeContent && codeContent.trim() !== '' ? 'mb-6' : 'flex-1'}`}>
            <TextDisplay 
              text={currentText}
              isProcessing={isProcessing}
              avatarConfig={avatarConfig}
              isListening={isListening}
              interimTranscript={interimTranscript}
              noSpeechDetected={noSpeechDetected}
            />
          </div>

          {/* Code Box - Only render if codeContent exists */}
          {codeContent && codeContent.trim() !== '' && (
            <div className="mb-6">
              <CodeBox code={codeContent} />
            </div>
          )}
        </div>

        {/* Content Suggestions */}
        {relatedArticles.length > 0 && (
          <ArticleCarousel articles={relatedArticles} />
        )}
        
        {relatedVideos.length > 0 && (
          <YouTubeVideos videos={relatedVideos} />
        )}

        {/* Status Indicators */}
        <div className="text-center mb-6">
          {isListening && (
            <div className="inline-flex items-center gap-3 bg-green-500/30 text-green-100 px-6 py-3 rounded-full text-base font-semibold animate-pulse shadow-lg">
              <div className="w-4 h-4 bg-green-300 rounded-full animate-ping"></div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-bounce">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="23"/>
                <line x1="8" y1="23" x2="16" y2="23"/>
              </svg>
              <span className="font-bold">🎤 Listening... Speak now!</span>
            </div>
          )}
          
          {isSpeaking && (
            <div className="inline-flex items-center gap-3 bg-blue-500/30 text-blue-100 px-6 py-3 rounded-full text-base font-semibold animate-pulse shadow-lg">
              <div className="w-4 h-4 bg-blue-300 rounded-full animate-ping"></div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-bounce">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
              </svg>
              <span className="font-bold">🔊 Speaking...</span>
            </div>
          )}
          
          {isProcessing && (
            <div className="inline-flex items-center gap-3 bg-purple-500/30 text-purple-100 px-6 py-3 rounded-full text-base font-semibold animate-pulse shadow-lg">
              <div className="w-4 h-4 bg-purple-300 rounded-full animate-ping"></div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
              <span className="font-bold">🤔 Processing your question...</span>
            </div>
          )}
          
          {permissionStatus === 'denied' && (
            <div className="inline-flex items-center gap-3 bg-red-500/30 text-red-100 px-6 py-3 rounded-full text-base font-semibold shadow-lg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              <span className="font-bold">🚫 Microphone access denied</span>
            </div>
          )}

          {noSpeechDetected && (
            <div className="inline-flex items-center gap-3 bg-orange-500/30 text-orange-100 px-6 py-3 rounded-full text-base font-semibold shadow-lg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="23"/>
                <line x1="8" y1="23" x2="16" y2="23"/>
              </svg>
              <span className="font-bold">🔇 No speech detected</span>
            </div>
          )}

          {timeoutError && (
            <div className="inline-flex items-center gap-3 bg-yellow-500/30 text-yellow-100 px-6 py-3 rounded-full text-base font-semibold shadow-lg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12,6 12,12 16,14"/>
              </svg>
              <span className="font-bold">⏰ Request timeout</span>
            </div>
          )}
          
          {!isListening && !isSpeaking && !isProcessing && permissionStatus !== 'denied' && !noSpeechDetected && !timeoutError && (
            <div className="text-center">
              <p className="text-white/70 text-base mb-2 font-medium">
                🎤 Tap the button below to ask a question
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Debug Button - Temporary for testing */}
      <div className="fixed bottom-20 left-4 z-50">
        <button
          onClick={handleTestSpeech}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 12l2 2 4-4"/>
            <path d="M21 12c-1 0-2-1-2-2s1-2 2-2 2 1 2 2-1 2-2 2z"/>
            <path d="M3 12c1 0 2-1 2-2s-1-2-2-2-2 1-2 2 1 2 2 2z"/>
          </svg>
          Test Speech
        </button>
      </div>

      {/* Fixed Talk Button at Bottom Center */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        {isListening ? (
          <button
            onClick={handleStopListening}
            className="flex items-center gap-2 px-8 py-4 text-lg font-semibold bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-full shadow-2xl transform transition-all duration-200 hover:scale-105 active:scale-95 animate-pulse"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="6" y="6" width="12" height="12"/>
            </svg>
            Stop Listening
          </button>
        ) : isSpeaking ? (
          <button
            onClick={handleStopSpeaking}
            className="flex items-center gap-2 px-8 py-4 text-lg font-semibold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full shadow-2xl transform transition-all duration-200 hover:scale-105 active:scale-95 animate-pulse"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="6" y="6" width="12" height="12"/>
            </svg>
            Stop Speaking
          </button>
        ) : (
          <button
            onClick={handleStartListening}
            disabled={isProcessing || permissionStatus === 'denied' || !recognitionSupported}
            className={`flex items-center gap-2 px-8 py-4 text-lg font-semibold rounded-full shadow-2xl transform transition-all duration-200 ${
              isProcessing || permissionStatus === 'denied' || !recognitionSupported
                ? 'bg-gray-500 text-gray-300 cursor-not-allowed opacity-50' 
                : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white hover:scale-105 active:scale-95'
            }`}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" y1="19" x2="12" y2="23"/>
              <line x1="8" y1="23" x2="16" y2="23"/>
            </svg>
            {permissionStatus === 'denied' ? 'Permission Required' : 
             !recognitionSupported ? 'Not Supported' : 'Talk'}
          </button>
        )}
      </div>
    </div>
  )
}

// import { useState, useEffect, useRef } from 'react'
// import { useRouter } from 'next/router'
// import Head from 'next/head'
// import { AVATAR_CONFIG } from '../lib/avatars'
// import { initSynth, speakText, stopSpeaking, getSpeechStatus } from '../lib/speech'
// import { useSpeechRecognition } from '../hooks/useSpeechRecognition'
// import AvatarDisplay from '../components/ChatInterface/AvatarDisplay'
// import TextDisplay from '../components/ChatInterface/TextDisplay'
// import CodeBox from '../components/ChatInterface/CodeBox'
// import VoiceControls from '../components/VoiceControls/VoiceControls'
// import BackButton from '../components/Navigation/BackButton'

// export default function AvatarChat() {
//   const router = useRouter()
//   const { avatar } = router.query
//   const [currentText, setCurrentText] = useState('')
//   const [codeContent, setCodeContent] = useState('')
//   const [isProcessing, setIsProcessing] = useState(false)
//   const [hasPlayedGreeting, setHasPlayedGreeting] = useState(false)
//   const [showError, setShowError] = useState(false)
//   const [apiError, setApiError] = useState(null)
//   const [noSpeechDetected, setNoSpeechDetected] = useState(false)
//   const [timeoutError, setTimeoutError] = useState(false)

//   // Initialize speech synthesis detection on component mount
//   useEffect(() => {
//     initSynth()
//   }, [])

//   // Speech recognition hook
//   const { 
//     startListening, 
//     stopListening, 
//     isListening, 
//     transcript, 
//     interimTranscript,
//     resetTranscript,
//     error: speechError,
//     clearError: clearSpeechError,
//     permissionStatus,
//     checkPermission,
//     isSupported: recognitionSupported
//   } = useSpeechRecognition()

//   // Avatar config
//   const avatarConfig = avatar ? AVATAR_CONFIG[avatar] : null

//   // Auto-greeting
//   const playAvatarGreeting = () => {
//     if (hasPlayedGreeting || !avatarConfig) return
//     const greetingMessage = `You're now talking to ${avatarConfig.name}. I'm ready to help you learn about ${avatarConfig.domain.toLowerCase()}.`
//     setHasPlayedGreeting(true)
//     console.log('🔈 Playing greeting:', greetingMessage)
//     speakText(greetingMessage, () => {
//       console.log('🔈 Greeting finished')
//     })
//   }

//   // When transcript arrives
//   useEffect(() => {
//     if (transcript && !isListening) {
//       setCurrentText(transcript)
//       setNoSpeechDetected(false)
//       handleApiCall(transcript)
//       resetTranscript()
//     }
//   }, [transcript, isListening, resetTranscript])

//   // Interim display
//   useEffect(() => {
//     if (isListening && interimTranscript) {
//       setCurrentText(interimTranscript)
//       setNoSpeechDetected(false)
//     }
//   }, [interimTranscript, isListening])

//   // Speech recognition errors
//   useEffect(() => {
//     if (!speechError) return
//     setShowError(true)
//     let message = "There was an issue with speech recognition. Please try again."
//     if (speechError.includes('no-speech')) {
//       setNoSpeechDetected(true)
//       message = "I didn't hear anything. Please try again."
//     } else if (speechError.includes('permission')) {
//       message = "Microphone access is required. Please allow permissions."
//     }
//     setCurrentText(message)
//     console.log('🛑 Speech recognition error:', speechError)
//     speakText(message, () => setShowError(false))
//   }, [speechError])

//   // Check permission once
//   useEffect(() => {
//     if (avatarConfig) checkPermission()
//   }, [avatarConfig, checkPermission])

//   // Clear any timeouts (now only used for API)
//   const clearAllTimeouts = () => {
//     console.log('🗑️ Clearing all timeouts')
//     // (no speechTimeoutRef any more)
//   }

//   // Main API call
//   const handleApiCall = async (message) => {
//     setIsProcessing(true)
//     setApiError(null)
//     setCodeContent('')
//     setNoSpeechDetected(false)
//     setTimeoutError(false)

//     stopSpeaking()
//     clearAllTimeouts()

//     try {
//       // 30s timeout race
//       const timeoutPromise = new Promise((_, rej) =>
//         setTimeout(() => rej(new Error('timeout')), 30000)
//       )
//       const fetchPromise = fetch('/api/chat', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ prompt: message, avatarType: avatar })
//       })
//       const response = await Promise.race([fetchPromise, timeoutPromise])

//       if (!response.ok) {
//         throw new Error(`Server responded ${response.status}`)
//       }
//       const data = await response.json()
//       console.log('✅ API responded:', data)

//       // Part 1
//       if (data.part1) {
//         setCurrentText(data.part1)
//         console.log('🔈 Speaking API Part 1:', data.part1)
//         speakText(data.part1, () => console.log('🔈 Finished speaking API Part 1'))
//       }

//       // Part 2
//       if (data.part2) {
//         setCodeContent(data.part2)
//       }

//     } catch (err) {
//       console.error('❌ API error:', err)
//       const userMsg = err.message === 'timeout'
//         ? 'The request timed out. Please try again.'
//         : 'Sorry, something went wrong. Please try again.'
//       setCurrentText(userMsg)
//       setApiError(userMsg)
//       speakText(userMsg, () => console.log('🔈 Finished speaking error message'))
//     } finally {
//       setIsProcessing(false)
//     }
//   }

//   // Greeting on mount
//   useEffect(() => {
//     if (avatarConfig) {
//       const t = setTimeout(playAvatarGreeting, 1000)
//       return () => clearTimeout(t)
//     }
//   }, [avatarConfig])

//   // Back navigation
//   const handleBack = () => {
//     stopSpeaking()
//     clearAllTimeouts()
//     router.push('/')
//   }

//   // Start listening
//   const handleStartListening = async () => {
//     stopSpeaking()
//     clearAllTimeouts()
//     setNoSpeechDetected(false)
//     setApiError(null)
//     setTimeoutError(false)

//     if (!recognitionSupported) {
//       const msg = "Speech recognition is not supported."
//       setCurrentText(msg)
//       speakText(msg)
//       return
//     }
//     if (permissionStatus === 'denied') {
//       const msg = "Microphone permission denied."
//       setCurrentText(msg)
//       speakText(msg)
//       return
//     }
//     const ok = await startListening()
//     if (!ok) {
//       const msg = "Failed to start speech recognition."
//       setCurrentText(msg)
//       speakText(msg)
//     }
//   }

//   // Stop listening
//   const handleStopListening = () => {
//     stopListening()
//     if (!transcript && !interimTranscript) {
//       setNoSpeechDetected(true)
//       const msg = "I didn't hear anything. Please try again."
//       setCurrentText(msg)
//       speakText(msg)
//     }
//   }

//   // Stop speaking
//   const handleStopSpeaking = () => {
//     stopSpeaking()
//   }

//   // Test speech helper
//   const handleTestSpeech = () => {
//     console.log('🧪 Speech status:', getSpeechStatus())
//   }

//   // Dismiss error banner
//   const dismissError = () => {
//     setShowError(false)
//     clearSpeechError()
//     setApiError(null)
//     setNoSpeechDetected(false)
//     setTimeoutError(false)
//   }

//   // Cleanup on unmount
//   useEffect(() => () => {
//     stopSpeaking()
//     clearAllTimeouts()
//   }, [])

//   // Loading state
//   if (!avatar || !avatarConfig) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-white bg-gradient-to-br from-blue-900 to-indigo-900">
//         <div className="text-center">
//           <div className="spinner mb-4"></div>
//           <p>Loading avatar...</p>
//           <button onClick={() => router.push('/')} className="mt-4 text-blue-300">Go Back</button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen relative bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
//       <Head>
//         <title>{avatarConfig.name} – AI Avatar</title>
//       </Head>

//       <div className="container mx-auto px-4 pb-32 flex flex-col">
//         <div className="flex items-center justify-between pt-6 mb-6">
//           <BackButton onClick={handleBack} />
//           <div className="text-center text-white">
//             <h1 className="text-xl font-semibold">{avatarConfig.name}</h1>
//             <p className="text-sm opacity-70">{avatarConfig.domain}</p>
//           </div>
//           <div className="w-12" />
//         </div>

//         {showError && (
//           <div className="mb-6 p-4 bg-red-500/20 rounded-lg text-red-100">
//             <div className="flex justify-between">
//               <span>{apiError || speechError}</span>
//               <button onClick={dismissError}>✕</button>
//             </div>
//           </div>
//         )}

//         <AvatarDisplay avatar={avatar} config={avatarConfig} />

//         <div className="flex-1 flex flex-col">
//           <TextDisplay text={currentText} isProcessing={isProcessing} />
//           {codeContent && <CodeBox code={codeContent} />}
//         </div>

//         <VoiceControls
//           isListening={isListening}
//           isSpeaking={false}
//           isProcessing={isProcessing}
//           onStart={handleStartListening}
//           onStopListening={handleStopListening}
//           onStopSpeaking={handleStopSpeaking}
//         />
//       </div>

//       {/* Fixed Talk Button */}
//       <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
//         {isListening ? (
//           <button onClick={handleStopListening} className="btn-red">Stop</button>
//         ) : (
//           <button onClick={handleStartListening} className="btn-blue">Talk</button>
//         )}
//       </div>

//       {/* Debug */}
//       <div className="fixed top-4 right-4">
//         <button onClick={handleTestSpeech} className="text-white">Test Speech</button>
//       </div>
//     </div>
//   )
// }
