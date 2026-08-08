import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { AVATAR_CONFIG } from '../lib/avatars'
import { initSynth, speakText, stopSpeaking, unlockAudio } from '../lib/speech'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition'
import { usePWA } from '../hooks/usePWA'
import AvatarDisplay from '../components/ChatInterface/AvatarDisplay'
import TextDisplay from '../components/ChatInterface/TextDisplay'
import CodeBox from '../components/ChatInterface/CodeBox'
import ArticleCarousel from '../components/ChatInterface/ArticleCarousel'
import YouTubeVideos from '../components/ChatInterface/YouTubeVideos'
import VoiceFallback from '../components/VoiceControls/VoiceFallback'
import { ERROR_MESSAGES, UI_TEXT, getAvatarGreeting } from '../context/constant.js'
import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary'
import TextDisplayFallback from '../components/ChatInterface/TextDisplayFallback'
import WhatsAppButton from '../components/WhatsApp/WhatsAppButton'
import VisitorCounter from '../components/VisitorCounter/VisitorCounter'

const AVATAR_VOICE_HANDOFF_KEY = 'sirgangulyAvatarVoiceHandoff'

export default function AvatarChat() {
  const router = useRouter()
  const { avatar } = router.query

  const { isPWASupported, isInstalled, updateAvailable, updateApp, isOnline } = usePWA()

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

  // ── State ──────────────────────────────────────────────────────────────────
  const [currentText, setCurrentText]       = useState('')
  const [questionText, setQuestionText]     = useState('')
  const [lastQuestion, setLastQuestion]     = useState('')
  const [isSpeaking, setIsSpeaking]         = useState(false)
  const [isPaused, setIsPaused]             = useState(false)
  const [isProcessing, setApiProcessing]    = useState(false)
  const [apiError, setApiError]             = useState(null)
  const [codeContent, setCodeContent]       = useState('')
  const [codeLanguage, setCodeLanguage]     = useState('code')
  const [relatedArticles, setRelatedArticles] = useState([])
  const [relatedVideos, setRelatedVideos]   = useState([])
  const [showError, setShowError]           = useState(false)
  const [greetingReady, setGreetingReady]   = useState(false)
  const [greetingPlayed, setGreetingPlayed] = useState(false)
  const [userInteracted, setUserInteracted] = useState(false)
  const [isOffline, setIsOffline]           = useState(false)
  const [sessionId]                         = useState(
    `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  )

  const allTimeoutsRef = useRef([])
  const avatarConfig = AVATAR_CONFIG[avatar] || null

  const buildReadableAnswerText = useCallback((question, answer) => {
    return String(answer || '').trim()
  }, [])

  const addTimeout = useCallback((fn, delay) => {
    const id = setTimeout(fn, delay)
    allTimeoutsRef.current.push(id)
    return id
  }, [])

  const clearAllTimeouts = useCallback(() => {
    allTimeoutsRef.current.forEach(clearTimeout)
    allTimeoutsRef.current = []
  }, [])

  // ── Offline detection ──────────────────────────────────────────────────────
  useEffect(() => {
    const up = () => setIsOffline(false)
    const dn = () => setIsOffline(true)
    setIsOffline(!navigator.onLine)
    window.addEventListener('online', up)
    window.addEventListener('offline', dn)
    return () => { window.removeEventListener('online', up); window.removeEventListener('offline', dn) }
  }, [])

  // ── Init speech on mount ───────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window !== 'undefined') initSynth()
  }, [])

  useEffect(() => {
    if (!avatar || typeof window === 'undefined') return

    try {
      const handoffAvatar = sessionStorage.getItem(AVATAR_VOICE_HANDOFF_KEY)
      if (handoffAvatar === avatar) {
        sessionStorage.removeItem(AVATAR_VOICE_HANDOFF_KEY)
        unlockAudio()
        setUserInteracted(true)
      }
    } catch (_) {}
  }, [avatar])

  // ── Unlock audio + mark interaction on FIRST user click/tap ───────────────
  // We play the greeting synchronously inside the first user gesture click/tap
  // handler to ensure Chrome's autoplay policy is successfully bypassed.
  const handleFirstInteraction = useCallback(() => {
    if (userInteracted) return
    console.log('👆 First user interaction detected!')
    
    // 1. Unlock audio
    unlockAudio()
    setUserInteracted(true)
    
    // 2. Play greeting synchronously
    if (!greetingPlayed) {
      // Resolve avatar type synchronously from location path to bypass Next.js router query lag
      const pathAvatar = typeof window !== 'undefined' 
        ? window.location.pathname.replace(/^\/|\/$/g, '').split('/').pop() 
        : ''
      const config = AVATAR_CONFIG[pathAvatar]
      
      if (config) {
        const greeting = getAvatarGreeting(pathAvatar, config)
        console.log('🎤 Playing greeting synchronously inside gesture (path resolved):', greeting)
        setGreetingPlayed(true)
        setIsSpeaking(true)
        setIsPaused(false)
        speakText(greeting, () => {
          setIsSpeaking(false)
          setIsPaused(false)
        }, { avatarType: pathAvatar })
      }
    }
  }, [userInteracted, greetingPlayed])

  useEffect(() => {
    const handle = () => {
      handleFirstInteraction()
    }
    window.addEventListener('click',      handle, { once: true })
    window.addEventListener('touchstart', handle, { once: true })
    return () => {
      window.removeEventListener('click',      handle)
      window.removeEventListener('touchstart', handle)
    }
  }, [handleFirstInteraction])

  // ── Prepare greeting text once avatarConfig is available ──────────────────
  useEffect(() => {
    if (avatarConfig && avatar && !greetingReady) {
      const greeting = getAvatarGreeting(avatar, avatarConfig)
      setCurrentText(greeting)
      setGreetingReady(true)
    }
  }, [avatarConfig, avatar, greetingReady])

  // ── Play greeting ONLY after first user interaction (Fallback / Sync backup) ──
  useEffect(() => {
    if (!greetingReady || greetingPlayed || !userInteracted || !avatarConfig || !avatar) return
    const greeting = getAvatarGreeting(avatar, avatarConfig)
    console.log('🎤 Playing greeting via fallback useEffect')
    setGreetingPlayed(true)
    setIsSpeaking(true)
    setIsPaused(false)
    speakText(greeting, () => {
      setIsSpeaking(false)
      setIsPaused(false)
    }, { avatarType: avatar })
  }, [greetingReady, greetingPlayed, userInteracted, avatarConfig, avatar])

  // ── Back navigation ────────────────────────────────────────────────────────
  const handleBack = useCallback(() => {
    stopSpeaking()
    clearAllTimeouts()
    router.push('/')
  }, [clearAllTimeouts, router])

  // ── Copy answer ────────────────────────────────────────────────────────────
  const handleCopyAnswer = async () => {
    const parts = []
    if (lastQuestion.trim()) parts.push(`Question:\n${lastQuestion.trim()}`)
    if (currentText.trim())  parts.push(`Answer:\n${currentText.trim()}`)
    if (codeContent.trim())  parts.push(`Code:\n${codeContent.trim()}`)
    if (!parts.length) { alert('No content to copy'); return }
    try {
      await navigator.clipboard.writeText(parts.join('\n\n'))
      alert('Copied to clipboard!')
    } catch { alert('Could not copy. Please select and copy manually.') }
  }

  // ── PLAY button — speak current answer ────────────────────────────────────
  // This is always inside a click handler → user gesture guaranteed
  const handlePlay = () => {
    if (!currentText.trim()) return
    unlockAudio()    // re-unlock in case session expired (safe to call multiple times)
    stopSpeaking()
    setIsSpeaking(true)
    setIsPaused(false)
    speakText(buildReadableAnswerText(lastQuestion, currentText), () => {
      setIsSpeaking(false)
      setIsPaused(false)
    }, { avatarType: avatar })
  }

  // ── STOP button ────────────────────────────────────────────────────────────
  const handleStop = () => {
    stopSpeaking()
    setIsSpeaking(false)
    setIsPaused(false)
  }

  // ── Start voice listening ──────────────────────────────────────────────────
  const handleStartListening = async () => {
    unlockAudio()   // synchronous unlock on this click
    stopSpeaking()
    setIsSpeaking(false)
    setIsPaused(false)
    setQuestionText('')
    resetTranscript()
    clearSpeechError()
    setShowError(false)
    try { await startListening({ lang: avatar === 'hindi-teacher' ? 'hi-IN' : 'en-IN' }) }
    catch (e) { console.error('Mic error:', e); setShowError(true) }
  }

  // ── API call ───────────────────────────────────────────────────────────────
  const handleApiCall = useCallback(async (prompt) => {
    if (!prompt?.trim() || !avatarConfig) return
    const cleanPrompt = prompt.trim()
    setLastQuestion(cleanPrompt)
    setQuestionText(cleanPrompt)
    setApiProcessing(true)
    setApiError(null)
    setShowError(false)

    if (!navigator.onLine) {
      const message = 'You are offline. Please check your internet connection and try again.'
      setCurrentText(message)
      setCodeContent('')
      setCodeLanguage('code')
      setRelatedArticles([])
      setRelatedVideos([])
      setApiError(message)
      setShowError(true)
      setApiProcessing(false)
      return
    }

    const attemptFetch = async (retry = 0) => {
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: cleanPrompt,
            prompt: cleanPrompt,
            message: cleanPrompt,
            avatarType: avatar,
            sessionId
          }),
          signal: AbortSignal.timeout(30000)
        })

        if (res.status === 429 && retry < 2) {
          const after = parseInt(res.headers.get('Retry-After') || '5', 10) * 1000
          await new Promise(r => setTimeout(r, after))
          return attemptFetch(retry + 1)
        }

        const data = await res.json()
        if (!res.ok || data.success === false || data.fallback) {
          throw new Error(data.error || `HTTP ${res.status}`)
        }

        const responseText = data.part1 || data.reply || 'No response. Please try again.'

        setCurrentText(responseText)
        setCodeContent(data.part2 || '')
        setCodeLanguage(data.language || 'code')
        setRelatedArticles(data.relatedArticles || [])
        setRelatedVideos(data.relatedVideos || [])

        // ── Auto-speak the response ──────────────────────────────────────
        // unlockAudio() was called on the original button click,
        // so the audio context is already unlocked.
        setIsSpeaking(true)
        setIsPaused(false)
        speakText(buildReadableAnswerText(cleanPrompt, responseText), () => {
          setIsSpeaking(false)
          setIsPaused(false)
        }, { avatarType: avatar })

      } catch (err) {
        if (retry < 2 && (err.name === 'TypeError' || err.name === 'AbortError')) {
          await new Promise(r => setTimeout(r, 2000))
          return attemptFetch(retry + 1)
        }
        const message = err.name === 'AbortError'
          ? 'Request timed out. Please try again.'
          : (!navigator.onLine
            ? 'You are offline. Please check your internet connection and try again.'
            : err.message || 'Could not reach the server. Please try again.')

        console.error('Avatar chat API failed:', err)
        stopSpeaking()
        setIsSpeaking(false)
        setIsPaused(false)
        setCurrentText(message)
        setCodeContent('')
        setCodeLanguage('code')
        setRelatedArticles([])
        setRelatedVideos([])
        setApiError(message)
        setShowError(true)
      }
    }

    try { await attemptFetch() }
    finally { setApiProcessing(false) }
  }, [avatar, avatarConfig, sessionId, buildReadableAnswerText])

  // ── Text submit ────────────────────────────────────────────────────────────
  const handleTextSubmit = useCallback((text) => {
    if (!text?.trim() || isProcessing || isListening) return
    unlockAudio()   // unlock on this click
    handleApiCall(text)
  }, [handleApiCall, isProcessing, isListening])

  // ── Auto-submit voice transcript ───────────────────────────────────────────
  useEffect(() => {
    const q = transcript?.trim()
    if (q && !isProcessing) {
      setQuestionText(q)
      clearSpeechError()
      resetTranscript()
      handleApiCall(q)
    }
  }, [transcript, isProcessing, resetTranscript, clearSpeechError, handleApiCall])

  // ── Speech recognition errors ──────────────────────────────────────────────
  useEffect(() => {
    if (!speechError) return
    setShowError(true)
    const t = setTimeout(() => {
      setShowError(false)
      clearSpeechError()
    }, 8000)
    return () => clearTimeout(t)
  }, [speechError, clearSpeechError])

  // ── Cleanup ────────────────────────────────────────────────────────────────
  useEffect(() => () => { stopSpeaking(); clearAllTimeouts() }, [clearAllTimeouts])

  // ── Loading state ──────────────────────────────────────────────────────────
  if (!avatar || !avatarConfig) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg mb-4">Loading avatar...</p>
          <button onClick={() => router.push('/')} className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20">
            ← Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{avatarConfig.name} - AI Avatar Assistant</title>
        <meta name="description" content={`Chat with ${avatarConfig.name} about ${avatarConfig.domain}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <VoiceFallback onVoiceSupportChange={(s) => console.log('Voice support:', s)}>
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-x-hidden">
          <WhatsAppButton />
          <VisitorCounter />

          {/* Offline banner */}
          {isOffline && (
            <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white text-center text-xs py-1.5 font-semibold">
              ⚠️ You are offline — limited responses only
            </div>
          )}

          {/* Audio nudge — before first interaction */}
          {false && !userInteracted && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-yellow-400 text-gray-900 text-sm font-bold px-5 py-2.5 rounded-full shadow-2xl animate-bounce cursor-pointer"
              onClick={handleFirstInteraction}>
              👆 Tap here to enable voice &amp; audio
            </div>
          )}

          <div className="container mx-auto px-3 pb-20 flex flex-col min-h-screen">
            
            {/* Unified Navigation Header Bar */}
            <div className="flex items-center justify-between gap-2 py-4 pl-[128px] sm:pl-[150px] border-b border-white/10 mb-4">
              <button 
                onClick={handleBack}
                aria-label="Back to home"
                title="Back to home"
                className="flex items-center gap-1.5 px-3.5 py-2 bg-white/95 text-gray-900 hover:bg-white text-xs sm:text-sm font-extrabold rounded-xl transition-all shadow-md active:scale-95 hover:scale-105 border border-purple-200"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-purple-600">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Back to home
              </button>
              
              <div className="text-right text-white">
                <h1 className="text-sm sm:text-base md:text-lg font-black tracking-tight leading-none mb-1">{avatarConfig.name}</h1>
                <p className="text-[10px] sm:text-xs font-semibold opacity-75">{avatarConfig.domain}</p>
              </div>
            </div>

            {/* Avatar */}
            <div className="flex justify-center mb-3">
              <AvatarDisplay avatar={avatar} config={avatarConfig} isSpeaking={isSpeaking} />
            </div>

            {/* Control buttons */}
            <div className="flex flex-wrap justify-center items-center gap-2 mb-3 px-2">

              {/* PLAY / STOP */}
              {isSpeaking ? (
                <button onClick={handleStop}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold text-xs sm:text-sm bg-red-600 hover:bg-red-700 text-white transition-all shadow-md hover:scale-105">
                  <span className="text-base">⏹</span> STOP
                </button>
              ) : (
                <button onClick={handlePlay} disabled={!currentText}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold text-xs sm:text-sm bg-green-600 hover:bg-green-700 text-white transition-all shadow-md hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed">
                  <span className="text-base">▶️</span> PLAY
                </button>
              )}

              {/* COPY */}
              <button onClick={handleCopyAnswer} disabled={!lastQuestion && !currentText}
                className="flex items-center gap-1.5 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold text-xs sm:text-sm transition-all shadow-md hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed">
                <span className="text-base">📋</span> COPY
              </button>

              {/* ASK (voice) */}
              <button
                onClick={() => isListening ? stopListening() : handleStartListening()}
                disabled={isProcessing}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold text-sm sm:text-base transition-all shadow-lg hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed ${
                  isListening
                    ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                    : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white'
                }`}>
                <span className="text-lg">🎤</span>
                {isListening ? 'STOP' : 'ASK'}
              </button>
            </div>

            {/* Text input */}
            <div className="px-2 mb-3">
              <div className="relative">
                <textarea
                  value={questionText}
                  onChange={e => setQuestionText(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      if (questionText.trim() && !isProcessing && !isListening) handleTextSubmit(questionText)
                    }
                  }}
                  placeholder={isListening
                    ? '🎤 Listening... Speak now'
                    : `Ask ${avatarConfig.name} anything about ${avatarConfig.domain}...`}
                  disabled={isProcessing}
                  rows={1}
                  className={`w-full px-4 py-3 pr-20 backdrop-blur-md border-2 rounded-xl shadow-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 disabled:opacity-50 min-h-[50px] max-h-[120px] ${
                    isListening ? 'bg-green-50 border-green-400 animate-pulse' : 'bg-white/95 border-white/40'
                  }`}
                  onInput={e => {
                    e.target.style.height = 'auto'
                    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
                  }}
                />
                <button
                  onClick={() => { if (questionText.trim() && !isProcessing && !isListening) handleTextSubmit(questionText) }}
                  disabled={!questionText.trim() || isProcessing || isListening}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white text-xs font-bold disabled:opacity-40 transition-all hover:scale-105">
                  {isProcessing
                    ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : 'SEND'}
                </button>
              </div>
              <p className="mt-1 text-center text-xs text-white/60">
                {isListening ? '🎤 Speak — auto-submits when you stop' : '💡 Type + Enter / SEND, or 🎤 ASK for voice'}
              </p>
            </div>

            {/* Status strip */}
            <div className="text-center mb-2 min-h-[36px] space-y-1">
              {isListening && (
                <div className="inline-flex items-center gap-2 bg-green-500/30 text-green-100 px-4 py-1.5 rounded-full text-sm font-semibold animate-pulse backdrop-blur-md border border-green-400/30">
                  <div className="w-2.5 h-2.5 bg-green-300 rounded-full animate-ping" />
                  🎤 Listening...
                </div>
              )}
              {isSpeaking && !isListening && (
                <div className="inline-flex items-center gap-2 bg-blue-500/30 text-blue-100 px-4 py-1.5 rounded-full text-sm font-semibold animate-pulse backdrop-blur-md border border-blue-400/30">
                  <div className="w-2.5 h-2.5 bg-blue-300 rounded-full animate-ping" />
                  🔊 Speaking...
                </div>
              )}
              {isProcessing && (
                <div className="inline-flex items-center gap-2 bg-purple-500/30 text-purple-100 px-4 py-1.5 rounded-full text-sm font-semibold animate-pulse backdrop-blur-md border border-purple-400/30">
                  <div className="w-2.5 h-2.5 bg-purple-300 rounded-full animate-spin" />
                  🤔 Thinking...
                </div>
              )}
              {showError && !isProcessing && !isListening && (
                <div className="inline-flex items-center gap-2 bg-red-500/30 text-red-100 px-4 py-1.5 rounded-full text-sm backdrop-blur-md border border-red-400/30">
                  ❌ {apiError || speechError || 'Something went wrong.'}
                  <button onClick={() => { setShowError(false); clearSpeechError(); setApiError(null) }}
                    className="ml-1 font-bold text-lg leading-none hover:text-white">×</button>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 space-y-3">
              {currentText && (
                <div className="break-words animate-fadeIn">
                  <ErrorBoundary fallback={<TextDisplayFallback text={currentText} />}>
                    <TextDisplay text={currentText} isProcessing={isProcessing} avatarConfig={avatarConfig} isListening={isListening} lastQuestion={lastQuestion} />
                  </ErrorBoundary>
                </div>
              )}
              {codeContent && (
                <div className="animate-fadeIn"><CodeBox code={codeContent} language={codeLanguage} /></div>
              )}
              {relatedArticles.length > 0 && (
                <div className="animate-fadeIn"><ArticleCarousel articles={relatedArticles} /></div>
              )}
              {relatedVideos.length > 0 && (
                <div className="animate-fadeIn"><YouTubeVideos videos={relatedVideos} /></div>
              )}
              {!currentText && !isProcessing && !isListening && (
                <div className="flex flex-col items-center justify-center py-10 text-white/50 text-center">
                  <div className="text-5xl mb-3 animate-bounce">{avatarConfig.emoji}</div>
                  <p className="text-sm">Ask a question by voice or text to begin learning!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </VoiceFallback>
    </>
  )
}
