import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'

// Avatar Configuration
const AVATAR_CONFIG = {
  'computer-teacher': {
    name: 'Computer Teacher',
    image: '/assets/avatars/computer-teacher.png',
    systemPrompt: 'You are a knowledgeable and enthusiastic computer science teacher created by Susanto Ganguly (Sir Ganguly). You specialize in programming languages (Java, Python, C, C++, JavaScript, HTML, CSS, PHP, Ruby, Swift, Kotlin, Go, Rust, Scala, Perl, Bash, SQL, TypeScript), algorithms, data structures, web development, mobile development, game development, machine learning, artificial intelligence, data science, cybersecurity, cloud computing, DevOps, and all aspects of technology. Provide clear, educational explanations with practical examples and code snippets when appropriate. Use a friendly and encouraging tone. Always introduce yourself as created by Susanto Ganguly (Sir Ganguly).',
    domain: 'Programming & Technology',
    greeting: "Hello! I'm your Computer Teacher, AI avatar, created by Susanto Ganguly. I specialize in Programming languages (Java, Python, C, C++, JavaScript, and many more), algorithms, data structures, web development, mobile development, game development, machine learning, artificial intelligence, data science, cybersecurity, cloud computing, DevOps, and all things Technology. How can I help you learn today?",
    emoji: '💻'
  },
  'english-teacher': {
    name: 'English Teacher',
    image: '/assets/avatars/english-teacher.png',
    systemPrompt: 'You are an experienced English language teacher created by Susanto Ganguly (Sir Ganguly). You excel in grammar, literature, writing, and communication skills. Provide helpful guidance on language learning, writing techniques, and literary analysis. Always introduce yourself as created by Susanto Ganguly (Sir Ganguly).',
    domain: 'Language & Literature',
    greeting: "Hello! I'm your English Teacher, AI avatar, created by Susanto Ganguly. I specialize in Grammar, literature, writing, and communication skills. How can I help you learn today?",
    emoji: '📚'
  },
  'biology-teacher': {
    name: 'Biology Teacher',
    image: '/assets/avatars/biology-teacher.png',
    systemPrompt: 'You are a passionate biology teacher created by Susanto Ganguly (Sir Ganguly). You specialize in life sciences, anatomy, genetics, ecology, and biological processes. Explain complex biological concepts in simple terms with real-world examples. Always introduce yourself as created by Susanto Ganguly (Sir Ganguly).',
    domain: 'Life Sciences',
    greeting: "Hello! I'm your Biology Teacher, AI avatar, created by Susanto Ganguly. I specialize in Life sciences, anatomy, genetics, ecology, and biological processes. How can I help you learn today?",
    emoji: '🧬'
  },
  'physics-teacher': {
    name: 'Physics Teacher',
    image: '/assets/avatars/physics-teacher.png',
    systemPrompt: 'You are an engaging physics teacher created by Susanto Ganguly (Sir Ganguly). You excel in mechanics, thermodynamics, electromagnetism, and modern physics. Use practical examples and demonstrations to explain physical concepts. Always introduce yourself as created by Susanto Ganguly (Sir Ganguly).',
    domain: 'Physical Sciences',
    greeting: "Hello! I'm your Physics Teacher, AI avatar, created by Susanto Ganguly. I specialize in Mechanics, thermodynamics, electromagnetism, and modern physics. How can I help you learn today?",
    emoji: '⚡'
  },
  'chemistry-teacher': {
    name: 'Chemistry Teacher',
    image: '/assets/avatars/chemistry-teacher.png',
    systemPrompt: 'You are a skilled chemistry teacher created by Susanto Ganguly (Sir Ganguly). You specialize in organic chemistry, inorganic chemistry, physical chemistry, and chemical reactions. Make chemistry accessible and interesting with practical applications. Always introduce yourself as created by Susanto Ganguly (Sir Ganguly).',
    domain: 'Chemical Sciences',
    greeting: "Hello! I'm your Chemistry Teacher, AI avatar, created by Susanto Ganguly. I specialize in Organic chemistry, inorganic chemistry, physical chemistry, and chemical reactions. How can I help you learn today?",
    emoji: '🧪'
  },
  'history-teacher': {
    name: 'History Teacher',
    image: '/assets/avatars/history-teacher.png',
    systemPrompt: 'You are an engaging history teacher created by Susanto Ganguly (Sir Ganguly). You specialize in world history, ancient civilizations, modern history, political history, cultural history, and historical events. Make history come alive with stories, timelines, and connections to the present. Always introduce yourself as created by Susanto Ganguly (Sir Ganguly).',
    domain: 'History & Culture',
    greeting: "Hello! I'm your History Teacher, AI avatar, created by Susanto Ganguly. I specialize in World history, ancient civilizations, modern history, political history, and cultural history. How can I help you learn today?",
    emoji: '📜'
  },
  'geography-teacher': {
    name: 'Geography Teacher',
    image: '/assets/avatars/geography-teacher.png',
    systemPrompt: 'You are a knowledgeable geography teacher created by Susanto Ganguly (Sir Ganguly). You cover physical geography, human geography, environmental science, and world cultures. Connect geographical concepts to current events and real-world issues. Always introduce yourself as created by Susanto Ganguly (Sir Ganguly).',
    domain: 'Earth & Environment',
    greeting: "Hello! I'm your Geography Teacher, AI avatar, created by Susanto Ganguly. I specialize in Physical geography, human geography, environmental science, and world cultures. How can I help you learn today?",
    emoji: '🌍'
  },
  'hindi-teacher': {
    name: 'Hindi Teacher',
    image: '/assets/avatars/hindi-teacher.png',
    systemPrompt: 'You are a dedicated Hindi language teacher created by Susanto Ganguly (Sir Ganguly). You teach Hindi grammar, literature, poetry, and cultural aspects. Help students understand and appreciate Hindi language and Indian culture. Always respond in Hindi and introduce yourself as created by Susanto Ganguly (Sir Ganguly).',
    domain: 'Hindi Language',
    greeting: "नमस्ते! मैं आपका हिंदी शिक्षक, AI अवतार, हूँ, जिसे सुशांतों गांगुली ने बनाया है। मैं हिंदी व्याकरण, साहित्य, कविता और सांस्कृतिक पहलुओं में विशेषज्ञता रखता हूँ। मैं आपकी कैसे मदद कर सकता हूँ?",
    emoji: '🇮🇳'
  },
  'mathematics-teacher': {
    name: 'Mathematics Teacher',
    image: '/assets/avatars/mathematics-teacher.png',
    systemPrompt: 'You are an excellent mathematics teacher created by Susanto Ganguly (Sir Ganguly). You cover algebra, geometry, calculus, statistics, and mathematical reasoning. Break down complex mathematical concepts into understandable steps. Always introduce yourself as created by Susanto Ganguly (Sir Ganguly).',
    domain: 'Math & Logic',
    greeting: "Hello! I'm your Mathematics Teacher, AI avatar, created by Susanto Ganguly. I specialize in Algebra, geometry, calculus, statistics, and mathematical reasoning. How can I help you learn today?",
    emoji: '📐'
  },
  'doctor': {
    name: 'Doctor',
    image: '/assets/avatars/doctor.png',
    systemPrompt: 'You are a knowledgeable medical professional created by Susanto Ganguly (Sir Ganguly). You can provide general health information, explain medical concepts, and offer wellness advice. Always remind users to consult healthcare professionals for specific medical concerns. Always introduce yourself as created by Susanto Ganguly (Sir Ganguly).',
    domain: 'Health & Medicine',
    greeting: "Hello! I'm your Doctor, AI avatar, created by Susanto Ganguly. I specialize in General health information, medical concepts, and wellness advice. How can I help you learn today?",
    emoji: '👨‍⚕️'
  },
  'engineer': {
    name: 'Engineer',
    image: '/assets/avatars/engineer.png',
    systemPrompt: 'You are an experienced engineer created by Susanto Ganguly (Sir Ganguly). You specialize in various engineering disciplines including mechanical, electrical, civil, and software engineering. Provide practical engineering solutions and explain technical concepts clearly. Always introduce yourself as created by Susanto Ganguly (Sir Ganguly).',
    domain: 'Engineering & Design',
    greeting: "Hello! I'm your Engineer, AI avatar, created by Susanto Ganguly. I specialize in Mechanical, electrical, civil, and software engineering. How can I help you learn today?",
    emoji: '⚙️'
  },
  'lawyer': {
    name: 'Lawyer',
    image: '/assets/avatars/lawyer.png',
    systemPrompt: 'You are a knowledgeable legal professional created by Susanto Ganguly (Sir Ganguly). You can explain legal concepts, discuss general legal principles, and provide educational information about law. Always remind users to consult qualified legal professionals for specific legal advice. Always introduce yourself as created by Susanto Ganguly (Sir Ganguly).',
    domain: 'Legal & Law',
    greeting: "Hello! I'm your Lawyer, AI avatar, created by Susanto Ganguly. I specialize in Legal concepts, general legal principles, and educational information about law. How can I help you learn today?",
    emoji: '⚖️'
  }
}

export default function Home() {
  const [currentView, setCurrentView] = useState('selection') // 'selection' or 'chat'
  const [selectedAvatar, setSelectedAvatar] = useState(null)
  const [messages, setMessages] = useState([])
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [notification, setNotification] = useState(null)
  const [speechSupported, setSpeechSupported] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  
  const recognitionRef = useRef(null)
  const utteranceRef = useRef(null)
  
  // Haptic feedback function
  const hapticFeedback = (type = 'light') => {
    if (isMobile && 'vibrate' in navigator) {
      switch (type) {
        case 'light':
          navigator.vibrate(25)
          break
        case 'medium':
          navigator.vibrate(50)
          break
        case 'heavy':
          navigator.vibrate([100, 50, 100])
          break
        case 'success':
          navigator.vibrate([50, 50, 50])
          break
        default:
          navigator.vibrate(25)
      }
    }
  }
  
  useEffect(() => {
    // Initialize app
    const initApp = () => {
      // Detect mobile device
      const mobileCheck = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      setIsMobile(mobileCheck)
      
      // Check speech synthesis support
      const speechSupport = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window
      setSpeechSupported(speechSupport)
      
      // Load theme
      const savedTheme = localStorage.getItem('theme') || 'light'
      setIsDarkMode(savedTheme === 'dark')
      document.documentElement.classList.toggle('dark', savedTheme === 'dark')
      
      // Add mobile-specific viewport meta tag adjustments
      if (mobileCheck) {
        const viewport = document.querySelector('meta[name=viewport]')
        if (viewport) {
          viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover')
        }
      }
      
      // Initialize speech recognition
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = false
        recognitionRef.current.lang = 'en-US'
        
        recognitionRef.current.onstart = () => {
          setIsListening(true)
          showNotification('Listening...', 'info')
        }
        
        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript
          handleUserMessage(transcript)
        }
        
        recognitionRef.current.onerror = (event) => {
          setIsListening(false)
          console.error('Speech recognition error:', event.error)
          
          let errorMessage = 'Speech recognition error'
          switch (event.error) {
            case 'no-speech':
              errorMessage = 'No speech detected. Please try again.'
              break
            case 'audio-capture':
              errorMessage = 'Microphone not found. Please check your microphone.'
              break
            case 'not-allowed':
              errorMessage = 'Microphone access denied. Please allow microphone access.'
              break
            case 'network':
              errorMessage = 'Network error. Please check your connection.'
              break
          }
          showNotification(errorMessage, 'error')
        }
        
        recognitionRef.current.onend = () => {
          setIsListening(false)
        }
      }
      
      setTimeout(() => setIsLoading(false), 1500)
    }
    
    initApp()
  }, [])
  
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 5000)
  }
  
  const toggleTheme = () => {
    const newTheme = isDarkMode ? 'light' : 'dark'
    setIsDarkMode(!isDarkMode)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }
  
  const selectAvatar = (avatarType) => {
    hapticFeedback('medium') // Haptic feedback for avatar selection
    
    const config = AVATAR_CONFIG[avatarType]
    setSelectedAvatar({ type: avatarType, config })
    setCurrentView('chat')
    setMessages([])
    
    // Add greeting message
    setTimeout(() => {
      const greetingMessage = {
        id: Date.now(),
        type: 'ai',
        content: config.greeting,
        timestamp: new Date()
      }
      setMessages([greetingMessage])
      speakText(config.greeting)
    }, 1000)
    
    showNotification(`Selected ${config.name}`, 'success')
  }
  
  const handleUserMessage = async (message) => {
    if (!selectedAvatar) return
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    
    try {
      // Call API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          avatar: selectedAvatar.type,
          systemPrompt: selectedAvatar.config.systemPrompt
        })
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Add AI response
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: data.reply,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, aiMessage])
      speakText(data.reply)
      
    } catch (error) {
      console.error('API Error:', error)
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
      showNotification('Failed to get response. Please try again.', 'error')
    }
  }
  
  const speakText = (text) => {
    if (!speechSupported || !('speechSynthesis' in window)) return
    
    // Stop any existing speech
    if (isSpeaking) {
      speechSynthesis.cancel()
    }
    
    setIsSpeaking(true)
    
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.8
    utterance.pitch = 1.0
    utterance.volume = 1.0
    
    // Set voice based on avatar
    if (selectedAvatar?.type === 'hindi-teacher') {
      const voices = speechSynthesis.getVoices()
      const hindiVoice = voices.find(voice => 
        voice.lang.includes('hi') || voice.lang.includes('IN')
      )
      if (hindiVoice) {
        utterance.voice = hindiVoice
      }
    } else {
      const voices = speechSynthesis.getVoices()
      const maleVoice = voices.find(voice => 
        voice.lang.includes('en') && 
        (voice.name.includes('Male') || voice.name.includes('male') || voice.name.includes('David') || voice.name.includes('James'))
      )
      if (maleVoice) {
        utterance.voice = maleVoice
      }
    }
    
    utterance.onend = () => {
      setIsSpeaking(false)
    }
    
    utterance.onerror = () => {
      setIsSpeaking(false)
    }
    
    speechSynthesis.speak(utterance)
    utteranceRef.current = utterance
  }
  
  const startListening = () => {
    if (!recognitionRef.current || isListening) return
    
    hapticFeedback('light') // Haptic feedback for starting voice recognition
    
    // Update recognition language based on avatar
    if (selectedAvatar?.type === 'hindi-teacher') {
      recognitionRef.current.lang = 'hi-IN'
    } else {
      recognitionRef.current.lang = 'en-US'
    }
    
    try {
      recognitionRef.current.start()
    } catch (error) {
      console.error('Error starting speech recognition:', error)
      showNotification('Failed to start voice recognition', 'error')
    }
  }
  
  const stopSpeech = () => {
    if (speechSynthesis) {
      speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }
  
  const copyToClipboard = (text) => {
    hapticFeedback('success') // Haptic feedback for copy action
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        showNotification('Copied to clipboard!', 'success')
      }).catch(() => {
        showNotification('Failed to copy', 'error')
      })
    }
  }
  
  const goBack = () => {
    hapticFeedback('light') // Haptic feedback for navigation
    
    setCurrentView('selection')
    setSelectedAvatar(null)
    setMessages([])
    stopSpeech()
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center text-white animate-fade-in">
          <div className="loading-spinner mx-auto mb-6 animate-bounce-in"></div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 animate-slide-up">
            Loading AI Avatar Assistant...
          </h1>
          <p className="text-sm sm:text-base opacity-70 animate-slide-up" style={{animationDelay: '0.2s'}}>
            Created by <strong>Susanto Ganguly</strong> (Sir Ganguly)
          </p>
          <div className="mt-6 flex justify-center space-x-1 animate-slide-up" style={{animationDelay: '0.4s'}}>
            <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      <Head>
        <title>AI Avatar Assistant - Created by Sir Ganguly</title>
        <meta name="description" content="Colorful AI Avatar Assistant created by Susanto Ganguly (Sir Ganguly) with voice interaction and multiple subject teachers" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="icon" href="/assets/avatars/computer-teacher.png" />
      </Head>

      {/* Notification */}
      {notification && (
        <div className={`notification notification-${notification.type} fade-in`}>
          {notification.message}
        </div>
      )}

      {/* Avatar Selection View */}
      {currentView === 'selection' && (
        <div className="min-h-screen flex flex-col px-4 py-6 sm:py-8">
          {/* Header Section */}
          <div className="text-center mb-8 sm:mb-12 flex-shrink-0">
            <div className="animate-fade-in">
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 leading-tight">
                🎭 Choose Your AI Avatar
              </h1>
              <p className="text-lg sm:text-xl text-white/90 mb-2 px-2">
                Select an avatar to start your conversation
              </p>
              <p className="text-sm sm:text-base text-white/70 px-2">
                Designed by <strong>Susanto Ganguly</strong> (Sir Ganguly)
              </p>
            </div>
          </div>
          
          {/* Avatar Grid */}
          <div className="flex-1 flex items-start justify-center">
            <div className="w-full max-w-6xl">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                {Object.entries(AVATAR_CONFIG).map(([key, config], index) => (
                  <div
                    key={key}
                    className="avatar-card glass rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 cursor-pointer text-center text-white transform transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-2xl"
                    onClick={() => selectAvatar(key)}
                    role="button"
                    tabIndex={0}
                    style={{
                      animationDelay: `${index * 100}ms`
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        selectAvatar(key)
                      }
                    }}
                  >
                    <div className="avatar-image-container mb-2 sm:mb-3">
                      <img
                        src={config.image}
                        alt={config.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full object-cover mx-auto border-2 sm:border-4 border-white/30 shadow-lg transition-all duration-300"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'block';
                        }}
                      />
                      <div className="text-2xl sm:text-3xl lg:text-4xl" style={{display: 'none'}}>{config.emoji}</div>
                    </div>
                    <h3 className="text-sm sm:text-base lg:text-xl font-semibold mb-1 sm:mb-2 leading-tight">{config.name}</h3>
                    <p className="text-white/80 text-xs sm:text-sm lg:text-base leading-tight px-1">{config.domain}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="text-center mt-8 flex-shrink-0">
            <p className="text-white/60 text-xs sm:text-sm">
              Tap any avatar to begin your learning journey
            </p>
          </div>
        </div>
      )}

      {/* Chat View */}
      {currentView === 'chat' && selectedAvatar && (
        <div className="flex flex-col h-screen bg-gradient-to-b from-transparent to-black/10">
          {/* Header */}
          <div className="glass border-b border-white/20 p-3 sm:p-4 flex items-center justify-between flex-shrink-0 safe-area-top">
            <button
              onClick={goBack}
              className="btn-ghost flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-sm sm:text-base"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              <span className="hidden sm:inline">Back</span>
            </button>
            
            <div className="text-center text-white flex-1 px-2">
              <h2 className="font-semibold text-sm sm:text-base truncate">{selectedAvatar.config.name}</h2>
              <p className="text-xs sm:text-sm opacity-70 truncate">{selectedAvatar.config.domain}</p>
            </div>
            
            <button
              onClick={toggleTheme}
              className="btn-ghost p-2 sm:p-3"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5"/>
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>
          </div>
          
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4">
            {/* Selected Avatar Display */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="avatar-image-container mx-auto mb-3 sm:mb-4">
                <img
                  src={selectedAvatar.config.image}
                  alt={selectedAvatar.config.name}
                  className={`w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-full object-cover mx-auto border-3 sm:border-4 border-white/40 shadow-2xl transition-all duration-300 ${isSpeaking ? 'speaking scale-110' : ''}`}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'block';
                  }}
                />
                <div className={`text-5xl sm:text-6xl ${isSpeaking ? 'animate-pulse' : ''}`} style={{display: 'none'}}>
                  {selectedAvatar.config.emoji}
                </div>
              </div>
              <div className="text-white/80 text-sm sm:text-base px-4">
                <p className="font-medium">{selectedAvatar.config.name}</p>
                <p className="text-xs sm:text-sm opacity-75">{selectedAvatar.config.domain}</p>
              </div>
            </div>
            
            {/* Welcome Message */}
            {messages.length === 0 && (
              <div className="text-center text-white/60 px-4 py-8">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/10">
                  <p className="text-sm sm:text-base mb-3">👋 Welcome! I'm ready to help you learn.</p>
                  <p className="text-xs sm:text-sm">Tap the <strong>Talk</strong> button to ask me anything about {selectedAvatar.config.domain.toLowerCase()}!</p>
                </div>
              </div>
            )}
            
            {/* Messages */}
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-3 sm:mb-4`}
                style={{
                  animationDelay: `${index * 200}ms`
                }}
              >
                <div className={`max-w-[85%] sm:max-w-sm lg:max-w-md ${
                  message.type === 'user' 
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-2xl rounded-br-md p-3 sm:p-4 shadow-lg ml-2 sm:ml-4' 
                    : 'bg-white/90 backdrop-blur-md text-gray-800 rounded-2xl rounded-bl-md p-3 sm:p-4 shadow-lg border border-white/30 mr-2 sm:mr-4'
                } animate-slide-up`}>
                  <p className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed">{message.content}</p>
                  {message.type === 'ai' && (
                    <button
                      onClick={() => copyToClipboard(message.content)}
                      className="mt-3 text-xs opacity-70 hover:opacity-100 flex items-center gap-1 transition-opacity"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                      </svg>
                      Copy
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Voice Controls */}
          <div className="glass border-t border-white/20 p-3 sm:p-4 flex-shrink-0 safe-area-bottom">
            {/* Status Bar */}
            <div className="text-center mb-3">
              {isListening && (
                <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm animate-pulse">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                  Listening...
                </div>
              )}
              {isSpeaking && (
                <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm animate-pulse">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
                  Speaking...
                </div>
              )}
              {!isListening && !isSpeaking && (
                <p className="text-white/60 text-xs sm:text-sm">
                  Tap <strong>Talk</strong> to ask a question
                </p>
              )}
            </div>
            
            {/* Control Buttons */}
            <div className="flex items-center justify-center gap-2 sm:gap-4">
              <button
                onClick={() => speakText(messages[messages.length - 1]?.content || '')}
                className="btn-secondary flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base disabled:opacity-50"
                disabled={!messages.length || isSpeaking}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
                <span className="hidden sm:inline">Start</span>
              </button>
              
              <button
                onClick={stopSpeech}
                className="btn-secondary flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base disabled:opacity-50"
                disabled={!isSpeaking}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="6" y="6" width="12" height="12"/>
                </svg>
                <span className="hidden sm:inline">Stop</span>
              </button>
              
              <button
                onClick={startListening}
                className={`btn-primary flex items-center gap-1 sm:gap-2 px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-semibold ${isListening ? 'animate-pulse bg-green-500 hover:bg-green-600' : ''} disabled:opacity-50 min-w-[80px] sm:min-w-[100px]`}
                disabled={isListening}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" y1="19" x2="12" y2="23"/>
                  <line x1="8" y1="23" x2="16" y2="23"/>
                </svg>
                {isListening ? 'Listening' : 'Talk'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}