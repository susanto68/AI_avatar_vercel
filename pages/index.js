import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import AvatarGrid from '../components/AvatarSelection/AvatarGrid'
import LoadingScreen from '../components/AvatarSelection/LoadingScreen'
import { AVATAR_CONFIG } from '../lib/avatars'
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis'

export default function Home() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [hasPlayedWelcome, setHasPlayedWelcome] = useState(false)
  const welcomeTimeoutRef = useRef(null)
  
  const { speakText, isSpeaking } = useSpeechSynthesis()

  // Auto-greeting audio on load
  const playWelcomeGreeting = () => {
    if (hasPlayedWelcome) return

    const welcomeMessage = "Hi, welcome to this experiment! Choose your AI teacher to begin learning."
    
    speakText(welcomeMessage, () => {
      setHasPlayedWelcome(true)
    })
  }

  // Handle avatar selection
  const handleAvatarSelect = (avatarType) => {
    router.push(`/${avatarType}`)
  }

  // Initialize app
  useEffect(() => {
    const initApp = () => {
      // Simulate loading time for smooth experience
      setTimeout(() => {
        setIsLoading(false)
        
        // Play welcome greeting after loading
        welcomeTimeoutRef.current = setTimeout(() => {
          playWelcomeGreeting()
        }, 500)
      }, 1000)
    }
    
    initApp()

    // Cleanup timeout on unmount
    return () => {
      if (welcomeTimeoutRef.current) {
        clearTimeout(welcomeTimeoutRef.current)
      }
    }
  }, [])

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <Head>
        <title>AI Avatar Assistant - Choose Your Teacher</title>
        <meta name="description" content="Select your AI teacher to begin learning" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/assets/favicon.ico" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            🎓 Choose Your AI Teacher
          </h1>
          <p className="text-xl text-white/80 mb-2">
            Select an avatar to start your learning journey
          </p>
          <p className="text-sm text-white/60">
            Created by Susanto Ganguly (Sir Ganguly)
          </p>
        </div>

        {/* Speaking indicator */}
        {isSpeaking && (
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm animate-pulse">
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-ping"></div>
              🔊 Welcome message playing...
            </div>
          </div>
        )}

        {/* Avatar Grid */}
        <AvatarGrid 
          avatars={AVATAR_CONFIG} 
          onAvatarSelect={handleAvatarSelect}
        />

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-white/60 text-sm">
            Tap any avatar to begin your learning journey
          </p>
        </div>
      </div>
    </div>
  )
}