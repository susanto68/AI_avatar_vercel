import { useState, useEffect, useRef, useCallback } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import AvatarGrid from '../components/AvatarSelection/AvatarGrid'
import LoadingScreen from '../components/AvatarSelection/LoadingScreen'
import VoiceFallback from '../components/VoiceControls/VoiceFallback'
import { AVATAR_CONFIG } from '../lib/avatars'
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis'
import { speakText, initSynth, unlockAudio } from '../lib/speech'
import { WELCOME_MESSAGES, UI_TEXT } from '../context/constant.js'
import WhatsAppButton from '../components/WhatsApp/WhatsAppButton'
import VisitorCounter from '../components/VisitorCounter/VisitorCounter'
import SpaceBackground from '../components/SpaceBackground/SpaceBackground'

const HOME_WELCOME_KEY = 'sirgangulyAvatarHomeWelcomePlayed'
const AVATAR_VOICE_HANDOFF_KEY = 'sirgangulyAvatarVoiceHandoff'

export default function Home() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [hasPlayedWelcome, setHasPlayedWelcome] = useState(false)
  const [userInteracted, setUserInteracted] = useState(false)
  
  const welcomeTimeoutRef = useRef(null)
  const hasTriggeredWelcomeRef = useRef(false)

  const { speakText: hookSpeakText, isSpeaking } = useSpeechSynthesis()

  // Auto-greeting audio on load - only once per mount
  const playWelcomeGreeting = useCallback(() => {
    const alreadyPlayed = typeof window !== 'undefined' && localStorage.getItem(HOME_WELCOME_KEY) === 'true'
    if (alreadyPlayed) {
      localStorage.setItem(HOME_WELCOME_KEY, 'true')
      setHasPlayedWelcome(true)
      hasTriggeredWelcomeRef.current = true
      return
    }

    // Prevent duplicate plays on double-mount or strict mode
    if (hasTriggeredWelcomeRef.current) {
      console.log('🛑 Welcome already triggered, skipping')
      return
    }
    hasTriggeredWelcomeRef.current = true

    const welcomeMessage = WELCOME_MESSAGES.MAIN_PAGE
    console.log('🎤 Starting welcome message...')

    try {
      localStorage.setItem(HOME_WELCOME_KEY, 'true')
      setHasPlayedWelcome(true)
      
      // Use the imported speakText function with proper callback
      speakText(welcomeMessage, () => {
        console.log('✅ Welcome message completed successfully')
      }, { suppressBlockedError: true })
      
      console.log('🎤 Welcome message started')
    } catch (error) {
      console.warn('⚠️ Welcome message failed:', error)
      setHasPlayedWelcome(true)
    }
  }, [])

  // Handle avatar selection
  const handleAvatarSelect = (avatarType) => {
    try {
      unlockAudio()
      sessionStorage.setItem(AVATAR_VOICE_HANDOFF_KEY, avatarType)
    } catch (_) {}
    router.push(`/${avatarType}`)
  }

  // Initialize speech synthesis
  useEffect(() => {
    console.log('🎤 Initializing speech synthesis for main page')
    initSynth()
    
    // Force re-initialization after a short delay to ensure voices are loaded
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        const voices = window.speechSynthesis.getVoices()
        console.log('🎤 Voices loaded after delay:', voices?.length || 0)
        if (voices && voices.length > 0) {
          console.log('✅ Speech synthesis ready with voices')
        } else {
          console.log('⚠️ Still no voices, forcing re-initialization')
          // Force re-initialization
          window.speechSynthesis.getVoices()
        }
      }
    }, 2000)
    
    return () => clearTimeout(timer)
  }, [])

  // Handle first user interaction to play welcome greeting synchronously
  const handleFirstInteraction = useCallback(() => {
    if (userInteracted) return
    console.log('👆 First user interaction on Home page!')
    setUserInteracted(true)
    unlockAudio()

    // If it hasn't completed playing and is not currently speaking, trigger it
    if (!hasPlayedWelcome && !isSpeaking) {
      console.log('🎤 Autoplay was blocked/inactive. Triggering welcome greeting synchronously...')
      hasTriggeredWelcomeRef.current = false
      playWelcomeGreeting()
    }
  }, [userInteracted, hasPlayedWelcome, isSpeaking, playWelcomeGreeting])

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

  // Initialize app
  useEffect(() => {
    const initApp = () => {
      console.log('🚀 Initializing app...')
      const alreadyPlayed = localStorage.getItem(HOME_WELCOME_KEY) === 'true'
      setHasPlayedWelcome(alreadyPlayed)
      hasTriggeredWelcomeRef.current = alreadyPlayed

      // Simulate loading time for smooth experience
      setTimeout(() => {
        setIsLoading(false)
        console.log('📱 Loading complete, checking welcome message...')

        // Try to play welcome greeting automatically on load
        if (!hasTriggeredWelcomeRef.current) {
          console.log('🎤 Trying auto-play welcome greeting on load...')
          welcomeTimeoutRef.current = setTimeout(() => {
            playWelcomeGreeting()
          }, 500)
        }
      }, 1000)
    }

    initApp()

    // Cleanup timeout on unmount
    return () => {
      if (welcomeTimeoutRef.current) {
        clearTimeout(welcomeTimeoutRef.current)
        console.log('🧹 Cleaned up welcome timeout')
      }
    }
  }, [playWelcomeGreeting])

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <>
      <Head>
        <title>Avatar AI Assistant - Choose Your AI Teacher</title>
        <meta name="description" content="Interactive AI Avatar Assistant Created by Sir Ganguly. Choose from various AI teachers for personalized learning experiences." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* PWA Meta Tags */}
        <meta name="theme-color" content="#6366f1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Avatar AI" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#6366f1" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* PWA Icons */}
        <link rel="icon" type="image/png" sizes="32x32" href="/assets/icons/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/assets/icons/icon-16x16.png" />
        <link rel="apple-touch-icon" href="/assets/icons/icon-152x152.png" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      
      <VoiceFallback onVoiceSupportChange={(supported) => console.log('Voice support:', supported)}>
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative">
          <SpaceBackground />
          <div className="relative z-10">
          {/* WhatsApp Button */}
          <WhatsAppButton />
          <VisitorCounter />

          {/* Audio nudge — before first interaction */}
          {false && !userInteracted && !hasPlayedWelcome && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-yellow-400 text-gray-900 text-sm font-bold px-5 py-2.5 rounded-full shadow-2xl animate-bounce cursor-pointer"
              onClick={handleFirstInteraction}>
              👆 Tap here to enable voice &amp; audio
            </div>
          )}

          <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                {UI_TEXT.TITLES.MAIN_PAGE}
              </h1>
              <p className="text-xl text-white/80 mb-2">
                {UI_TEXT.TITLES.SUBTITLE}
              </p>
              <p className="text-sm text-white/60">
                {UI_TEXT.TITLES.CREATOR}
              </p>
            </div>

            {/* Explore Sir Ganguly AI Ecosystem Links Grid */}
            <div className="ecosystem-grid-container mx-auto mb-6 max-w-4xl">
              <h2 className="ecosystem-grid-title">Explore Sir Ganguly AI Ecosystem</h2>
              <div className="ecosystem-grid">
                <a href="https://sirganguly.com" className="sg-hero-btn sg-btn-home" target="_blank" rel="noopener noreferrer">
                  <span className="sg-btn-icon">🏠</span>
                  <span className="sg-btn-text">Home Portal</span>
                </a>
                <a href="https://ai.sirganguly.com" className="sg-hero-btn sg-btn-ai" target="_blank" rel="noopener noreferrer">
                  <span className="sg-btn-icon">🤖</span>
                  <span className="sg-btn-text">AI Teacher</span>
                </a>
                <a href="https://questions.sirganguly.com" className="sg-hero-btn sg-btn-questions" target="_blank" rel="noopener noreferrer">
                  <span className="sg-btn-icon">❓</span>
                  <span className="sg-btn-text">100 Question Bank</span>
                </a>
                <a href="https://books.sirganguly.com" className="sg-hero-btn sg-btn-books" target="_blank" rel="noopener noreferrer">
                  <span className="sg-btn-icon">📚</span>
                  <span className="sg-btn-text">Books Library</span>
                </a>
                <a href="https://career.sirganguly.com" className="sg-hero-btn sg-btn-career" target="_blank" rel="noopener noreferrer">
                  <span className="sg-btn-icon">🚀</span>
                  <span className="sg-btn-text">Career Placement</span>
                </a>
                <a href="https://mentor.sirganguly.com" className="sg-hero-btn sg-btn-mentor" target="_blank" rel="noopener noreferrer">
                  <span className="sg-btn-icon">🎯</span>
                  <span className="sg-btn-text">Meet Mentors</span>
                </a>
              </div>
            </div>

            {/* Speaking indicator */}
            {isSpeaking && (
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm animate-pulse">
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-ping"></div>
                  {UI_TEXT.STATUS.WELCOME_PLAYING}
                </div>
              </div>
            )}

            {/* Welcome status */}
            {hasPlayedWelcome && !isSpeaking && (
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-300 px-4 py-2 rounded-full text-sm">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  {UI_TEXT.STATUS.WELCOME_COMPLETED}
                </div>
              </div>
            )}

            {/* Avatar Grid */}
            <AvatarGrid 
              avatars={AVATAR_CONFIG} 
              onAvatarSelect={handleAvatarSelect}
            />

            {/* Poem */}
            <section className="mx-auto mt-12 max-w-4xl border-t border-white/20 pt-10 text-center text-white">
              <h2 className="mb-6 text-2xl font-semibold tracking-wide text-white md:text-4xl">
                Where the Mind is Without Fear
              </h2>
              <div className="mx-auto max-w-3xl whitespace-pre-line text-base leading-8 text-white/90 md:text-xl md:leading-10">
{`Where the mind is without fear and the head is held high;
Where knowledge is free;
Where the world has not been broken up into fragments by narrow domestic walls;
Where words come out from the depth of truth;
Where tireless striving stretches its arms towards perfection;
Where the clear stream of reason has not lost its way into the dreary desert sand of dead habit;
Where the mind is led forward by thee into ever-widening thought and action -
Into that heaven of freedom, my Father, let my country awake.`}
              </div>
              <p className="mt-6 text-lg font-semibold text-white/80 md:text-2xl">
                Rabindranath Tagore
              </p>
            </section>
          </div>
          </div>
        </div>
      </VoiceFallback>
    </>
  )
}
