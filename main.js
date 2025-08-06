// Avatar Configuration with Sir Ganguly Attribution
const AVATAR_CONFIG = {
  'computer-teacher': {
    name: 'Computer Teacher',
    image: 'assets/avatars/computer-teacher.png',
    systemPrompt: 'You are a knowledgeable and enthusiastic computer science teacher created by Susanto Ganguly (Sir Ganguly). You specialize in programming languages (Java, Python, C, C++, JavaScript, HTML, CSS, PHP, Ruby, Swift, Kotlin, Go, Rust, Scala, Perl, Bash, SQL, TypeScript), algorithms, data structures, web development, mobile development, game development, machine learning, artificial intelligence, data science, cybersecurity, cloud computing, DevOps, and all aspects of technology. Provide clear, educational explanations with practical examples and code snippets when appropriate. Use a friendly and encouraging tone. Always introduce yourself as created by Susanto Ganguly (Sir Ganguly).',
    domain: 'Programming & Technology',
    greeting: "Hello! I'm your Computer Teacher, AI avatar, created by Susanto Ganguly. I specialize in Programming languages (Java, Python, C, C++, JavaScript, and many more), algorithms, data structures, web development, mobile development, game development, machine learning, artificial intelligence, data science, cybersecurity, cloud computing, DevOps, and all things Technology. How can I help you learn today?"
  },
  'english-teacher': {
    name: 'English Teacher',
    image: 'assets/avatars/english-teacher.png',
    systemPrompt: 'You are an experienced English language teacher created by Susanto Ganguly (Sir Ganguly). You excel in grammar, literature, writing, and communication skills. Provide helpful guidance on language learning, writing techniques, and literary analysis. Always introduce yourself as created by Susanto Ganguly (Sir Ganguly).',
    domain: 'Language & Literature',
    greeting: "Hello! I'm your English Teacher, AI avatar, created by Susanto Ganguly. I specialize in Grammar, literature, writing, and communication skills. How can I help you learn today?"
  },
  'biology-teacher': {
    name: 'Biology Teacher',
    image: 'assets/avatars/biology-teacher.png',
    systemPrompt: 'You are a passionate biology teacher created by Susanto Ganguly (Sir Ganguly). You specialize in life sciences, anatomy, genetics, ecology, and biological processes. Explain complex biological concepts in simple terms with real-world examples. Always introduce yourself as created by Susanto Ganguly (Sir Ganguly).',
    domain: 'Life Sciences',
    greeting: "Hello! I'm your Biology Teacher, AI avatar, created by Susanto Ganguly. I specialize in Life sciences, anatomy, genetics, ecology, and biological processes. How can I help you learn today?"
  },
  'physics-teacher': {
    name: 'Physics Teacher',
    image: 'assets/avatars/physics-teacher.png',
    systemPrompt: 'You are an engaging physics teacher created by Susanto Ganguly (Sir Ganguly). You excel in mechanics, thermodynamics, electromagnetism, and modern physics. Use practical examples and demonstrations to explain physical concepts. Always introduce yourself as created by Susanto Ganguly (Sir Ganguly).',
    domain: 'Physical Sciences',
    greeting: "Hello! I'm your Physics Teacher, AI avatar, created by Susanto Ganguly. I specialize in Mechanics, thermodynamics, electromagnetism, and modern physics. How can I help you learn today?"
  },
  'chemistry-teacher': {
    name: 'Chemistry Teacher',
    image: 'assets/avatars/chemistry-teacher.png',
    systemPrompt: 'You are a skilled chemistry teacher created by Susanto Ganguly (Sir Ganguly). You specialize in organic chemistry, inorganic chemistry, physical chemistry, and chemical reactions. Make chemistry accessible and interesting with practical applications. Always introduce yourself as created by Susanto Ganguly (Sir Ganguly).',
    domain: 'Chemical Sciences',
    greeting: "Hello! I'm your Chemistry Teacher, AI avatar, created by Susanto Ganguly. I specialize in Organic chemistry, inorganic chemistry, physical chemistry, and chemical reactions. How can I help you learn today?"
  },
  'history-teacher': {
    name: 'History Teacher',
    image: 'assets/avatars/history-teacher.png',
    systemPrompt: 'You are an engaging history teacher created by Susanto Ganguly (Sir Ganguly). You specialize in world history, ancient civilizations, modern history, political history, cultural history, and historical events. Make history come alive with stories, timelines, and connections to the present. Always introduce yourself as created by Susanto Ganguly (Sir Ganguly).',
    domain: 'History & Culture',
    greeting: "Hello! I'm your History Teacher, AI avatar, created by Susanto Ganguly. I specialize in World history, ancient civilizations, modern history, political history, and cultural history. How can I help you learn today?"
  },
  'geography-teacher': {
    name: 'Geography Teacher',
    image: 'assets/avatars/geography-teacher.png',
    systemPrompt: 'You are a knowledgeable geography teacher created by Susanto Ganguly (Sir Ganguly). You cover physical geography, human geography, environmental science, and world cultures. Connect geographical concepts to current events and real-world issues. Always introduce yourself as created by Susanto Ganguly (Sir Ganguly).',
    domain: 'Earth & Environment',
    greeting: "Hello! I'm your Geography Teacher, AI avatar, created by Susanto Ganguly. I specialize in Physical geography, human geography, environmental science, and world cultures. How can I help you learn today?"
  },
  'hindi-teacher': {
    name: 'Hindi Teacher',
    image: 'assets/avatars/hindi-teacher.png',
    systemPrompt: 'You are a dedicated Hindi language teacher created by Susanto Ganguly (Sir Ganguly). You teach Hindi grammar, literature, poetry, and cultural aspects. Help students understand and appreciate Hindi language and Indian culture. Always respond in Hindi and introduce yourself as created by Susanto Ganguly (Sir Ganguly).',
    domain: 'Hindi Language',
    greeting: "नमस्ते! मैं आपका हिंदी शिक्षक, AI अवतार, हूँ, जिसे सुशांतों गांगुली ने बनाया है। मैं हिंदी व्याकरण, साहित्य, कविता और सांस्कृतिक पहलुओं में विशेषज्ञता रखता हूँ। मैं आपकी कैसे मदद कर सकता हूँ?"
  },
  'mathematics-teacher': {
    name: 'Mathematics Teacher',
    image: 'assets/avatars/mathematics-teacher.png',
    systemPrompt: 'You are an excellent mathematics teacher created by Susanto Ganguly (Sir Ganguly). You cover algebra, geometry, calculus, statistics, and mathematical reasoning. Break down complex mathematical concepts into understandable steps. Always introduce yourself as created by Susanto Ganguly (Sir Ganguly).',
    domain: 'Math & Logic',
    greeting: "Hello! I'm your Mathematics Teacher, AI avatar, created by Susanto Ganguly. I specialize in Algebra, geometry, calculus, statistics, and mathematical reasoning. How can I help you learn today?"
  },
  'doctor': {
    name: 'Doctor',
    image: 'assets/avatars/doctor.png',
    systemPrompt: 'You are a knowledgeable medical professional created by Susanto Ganguly (Sir Ganguly). You can provide general health information, explain medical concepts, and offer wellness advice. Always remind users to consult healthcare professionals for specific medical concerns. Always introduce yourself as created by Susanto Ganguly (Sir Ganguly).',
    domain: 'Health & Medicine',
    greeting: "Hello! I'm your Doctor, AI avatar, created by Susanto Ganguly. I specialize in General health information, medical concepts, and wellness advice. How can I help you learn today?"
  },
  'engineer': {
    name: 'Engineer',
    image: 'assets/avatars/engineer.png',
    systemPrompt: 'You are an experienced engineer created by Susanto Ganguly (Sir Ganguly). You specialize in various engineering disciplines including mechanical, electrical, civil, and software engineering. Provide practical engineering solutions and explain technical concepts clearly. Always introduce yourself as created by Susanto Ganguly (Sir Ganguly).',
    domain: 'Engineering & Design',
    greeting: "Hello! I'm your Engineer, AI avatar, created by Susanto Ganguly. I specialize in Mechanical, electrical, civil, and software engineering. How can I help you learn today?"
  },
  'lawyer': {
    name: 'Lawyer',
    image: 'assets/avatars/lawyer.png',
    systemPrompt: 'You are a knowledgeable legal professional created by Susanto Ganguly (Sir Ganguly). You can explain legal concepts, discuss general legal principles, and provide educational information about law. Always remind users to consult qualified legal professionals for specific legal advice. Always introduce yourself as created by Susanto Ganguly (Sir Ganguly).',
    domain: 'Legal & Law',
    greeting: "Hello! I'm your Lawyer, AI avatar, created by Susanto Ganguly. I specialize in Legal concepts, general legal principles, and educational information about law. How can I help you learn today?"
  }
};

// Global Variables
let currentAvatar = null;
let recognition, utterance, isListening = false;
let isSpeaking = false;
let maleVoice = null;
let currentQuestion = '';
let currentAnswer = '';
let lastSpokenText = '';
let questionTimeout = null;
let speechSynthesisSupported = false;
let homePageGreetingPlayed = false;

// Mobile-specific variables
let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Check if speech synthesis is supported
function checkSpeechSynthesisSupport() {
  speechSynthesisSupported = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  
  if (!speechSynthesisSupported) {
    showSpeechErrorModal();
  }
  
  return speechSynthesisSupported;
}

// Show speech synthesis error modal
function showSpeechErrorModal() {
  const modal = document.getElementById('speechErrorModal');
  if (modal) {
    modal.style.display = 'flex';
  }
}

// Hide speech synthesis error modal
function hideSpeechErrorModal() {
  const modal = document.getElementById('speechErrorModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// Open browser functions
function openChrome() {
  const currentUrl = window.location.href;
  window.open(`googlechrome://navigate?url=${encodeURIComponent(currentUrl)}`, '_blank');
}

function openFirefox() {
  const currentUrl = window.location.href;
  window.open(`firefox://open-url?url=${encodeURIComponent(currentUrl)}`, '_blank');
}

function openSafari() {
  const currentUrl = window.location.href;
  window.open(`x-web-search://?${encodeURIComponent(currentUrl)}`, '_blank');
}

// Play home page greeting
function playHomePageGreeting() {
  if (homePageGreetingPlayed || !speechSynthesisSupported) return;
  
  const greetingText = "Welcome to AI Avatar Assistant! I'm created by Sir Ganguly to help you learn and grow. Choose any avatar to start your educational journey. Each avatar specializes in different subjects and will guide you with patience and care. Let's make learning fun and engaging together!";
  
  const utterance = new SpeechSynthesisUtterance(greetingText);
  utterance.rate = 0.8;
  utterance.pitch = 1.0;
  utterance.volume = 0.8;
  
  // Try to find a male voice
  const voices = speechSynthesis.getVoices();
  const maleVoice = voices.find(voice => 
    voice.lang.includes('en') && 
    (voice.name.includes('Male') || voice.name.includes('male') || voice.name.includes('David') || voice.name.includes('James'))
  );
  
  if (maleVoice) {
    utterance.voice = maleVoice;
  }
  
  utterance.onend = () => {
    homePageGreetingPlayed = true;
  };
  
  speechSynthesis.speak(utterance);
}

// Haptic feedback for mobile devices
function hapticFeedback(type = 'light') {
  if ('vibrate' in navigator) {
    switch (type) {
      case 'light':
        navigator.vibrate(50);
        break;
      case 'medium':
        navigator.vibrate(100);
        break;
      case 'heavy':
        navigator.vibrate(200);
        break;
      default:
        navigator.vibrate(50);
    }
  }
}

// Show notification with flash message
function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'error' ? '#f56565' : type === 'success' ? '#48bb78' : '#667eea'};
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 10000;
    font-family: 'Poppins', sans-serif;
    font-weight: 500;
    max-width: 300px;
    word-wrap: break-word;
    animation: slideInRight 0.3s ease-out;
    backdrop-filter: blur(10px);
  `;
  
  notification.textContent = message;
  
  // Add to body
  document.body.appendChild(notification);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease-out';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 5000);
  
  // Add CSS animations if not already present
  if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
      @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
}

// Check if response is long enough to show Q/A summary
function isLongResponse(text) {
  return text.split(' ').length > 10;
}

// Check if question is about the creator
function isCreatorQuestion(question) {
  const creatorKeywords = ['sir ganguly', 'susanto ganguly', 'creator', 'who made', 'who created', 'developer'];
  return creatorKeywords.some(keyword => question.toLowerCase().includes(keyword));
}

// Check if question is within the avatar's domain
function isDomainQuestion(question, avatarType) {
  const domainKeywords = {
    'computer-teacher': ['programming', 'code', 'computer', 'software', 'technology', 'java', 'python', 'javascript', 'html', 'css', 'algorithm', 'data structure', 'web development', 'mobile development', 'game development', 'machine learning', 'ai', 'artificial intelligence', 'data science', 'cybersecurity', 'cloud computing', 'devops'],
    'english-teacher': ['grammar', 'english', 'literature', 'writing', 'communication', 'poetry', 'novel', 'story', 'essay', 'vocabulary', 'pronunciation', 'reading', 'comprehension'],
    'biology-teacher': ['biology', 'cell', 'organism', 'ecosystem', 'genetics', 'evolution', 'anatomy', 'physiology', 'microbiology', 'botany', 'zoology', 'biochemistry', 'molecular biology'],
    'physics-teacher': ['physics', 'mechanics', 'thermodynamics', 'electromagnetism', 'optics', 'quantum', 'relativity', 'force', 'energy', 'motion', 'wave', 'particle', 'nuclear'],
    'chemistry-teacher': ['chemistry', 'chemical', 'reaction', 'molecule', 'atom', 'element', 'compound', 'acid', 'base', 'organic', 'inorganic', 'physical chemistry', 'biochemistry'],
    'history-teacher': ['history', 'historical', 'ancient', 'civilization', 'war', 'revolution', 'empire', 'kingdom', 'dynasty', 'archaeology', 'culture', 'heritage'],
    'geography-teacher': ['geography', 'geographical', 'map', 'continent', 'country', 'climate', 'weather', 'landform', 'ocean', 'mountain', 'river', 'population', 'demographics'],
    'hindi-teacher': ['hindi', 'हिंदी', 'व्याकरण', 'साहित्य', 'कविता', 'कहानी', 'नाटक', 'भाषा', 'शब्द', 'वाक्य'],
    'mathematics-teacher': ['math', 'mathematics', 'algebra', 'geometry', 'calculus', 'statistics', 'trigonometry', 'arithmetic', 'equation', 'formula', 'theorem', 'proof'],
    'doctor': ['health', 'medical', 'medicine', 'disease', 'symptom', 'treatment', 'anatomy', 'physiology', 'wellness', 'fitness', 'nutrition', 'mental health'],
    'engineer': ['engineering', 'mechanical', 'electrical', 'civil', 'software', 'design', 'construction', 'system', 'technology', 'innovation', 'prototype'],
    'lawyer': ['law', 'legal', 'justice', 'court', 'constitution', 'rights', 'contract', 'criminal', 'civil', 'legislation', 'regulation', 'policy']
  };
  
  const keywords = domainKeywords[avatarType] || [];
  return keywords.some(keyword => question.toLowerCase().includes(keyword));
}

// Initialize the application
function initializeApp() {
  // Check speech synthesis support
  checkSpeechSynthesisSupport();
  
  // Load theme
  loadTheme();
  
  // Setup event listeners
  setupEventListeners();
  
  // Hide loading screen after a short delay
  setTimeout(() => {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
      loadingScreen.classList.add('hidden');
      setTimeout(() => {
        loadingScreen.style.display = 'none';
        // Play home page greeting after loading
        setTimeout(() => {
          playHomePageGreeting();
        }, 500);
      }, 500);
    }
  }, 1500);
  
  // Initialize speech synthesis voices
  if (speechSynthesisSupported) {
    speechSynthesis.onvoiceschanged = () => {
      const voices = speechSynthesis.getVoices();
      maleVoice = voices.find(voice => 
        voice.lang.includes('en') && 
        (voice.name.includes('Male') || voice.name.includes('male') || voice.name.includes('David') || voice.name.includes('James'))
      );
    };
    
    // Trigger voices loading
    speechSynthesis.getVoices();
  }
  
  // Initialize speech recognition
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    initRecognition();
  } else {
    showNotification('Speech recognition not supported in this browser', 'error');
  }
  
  // Show online status
  if (navigator.onLine) {
    showNotification('Connected and ready!', 'success');
  }
}

// Setup all event listeners
function setupEventListeners() {
  // Avatar selection
  const avatarCards = document.querySelectorAll('.avatar-card');
  avatarCards.forEach(card => {
    card.addEventListener('click', () => {
      const avatarType = card.getAttribute('data-avatar');
      selectAvatar(avatarType);
    });
    
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const avatarType = card.getAttribute('data-avatar');
        selectAvatar(avatarType);
      }
    });
  });
  
  // Back button
  const backBtn = document.getElementById('backBtn');
  if (backBtn) {
    backBtn.addEventListener('click', showAvatarSelection);
  }
  
  // Bottom back button
  const bottomBackBtn = document.getElementById('bottomBackBtn');
  if (bottomBackBtn) {
    bottomBackBtn.addEventListener('click', showAvatarSelection);
  }
  
  // Theme toggle
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
  
  // Voice control buttons
  const startBtn = document.getElementById('startBtn');
  const stopBtn = document.getElementById('stopBtn');
  const talkBtn = document.getElementById('talkBtn');
  
  if (startBtn) startBtn.addEventListener('click', () => speakText(lastSpokenText));
  if (stopBtn) stopBtn.addEventListener('click', stopSpeech);
  if (talkBtn) talkBtn.addEventListener('click', startListening);
  
  // Copy buttons
  const copyQuestionBtn = document.getElementById('copyQuestionBtn');
  const copyAnswerBtn = document.getElementById('copyAnswerBtn');
  
  if (copyQuestionBtn) {
    copyQuestionBtn.addEventListener('click', () => {
      copyToClipboard(currentQuestion);
      showNotification('Question copied to clipboard!', 'success');
    });
  }
  
  if (copyAnswerBtn) {
    copyAnswerBtn.addEventListener('click', () => {
      copyToClipboard(currentAnswer);
      showNotification('Answer copied to clipboard!', 'success');
    });
  }
  
  // Speech error modal
  const closeSpeechModal = document.getElementById('closeSpeechModal');
  const openChromeBtn = document.getElementById('openChromeBtn');
  const openFirefoxBtn = document.getElementById('openFirefoxBtn');
  const openSafariBtn = document.getElementById('openSafariBtn');
  
  if (closeSpeechModal) {
    closeSpeechModal.addEventListener('click', hideSpeechErrorModal);
  }
  
  if (openChromeBtn) {
    openChromeBtn.addEventListener('click', () => {
      openChrome();
      hideSpeechErrorModal();
      showNotification('Opening in Chrome for better voice experience!', 'success');
    });
  }
  
  if (openFirefoxBtn) {
    openFirefoxBtn.addEventListener('click', () => {
      openFirefox();
      hideSpeechErrorModal();
      showNotification('Opening in Firefox for better voice experience!', 'success');
    });
  }
  
  if (openSafariBtn) {
    openSafariBtn.addEventListener('click', () => {
      openSafari();
      hideSpeechErrorModal();
      showNotification('Opening in Safari for better voice experience!', 'success');
    });
  }
  
  // Close modal when clicking outside
  const speechErrorModal = document.getElementById('speechErrorModal');
  if (speechErrorModal) {
    speechErrorModal.addEventListener('click', (e) => {
      if (e.target === speechErrorModal) {
        hideSpeechErrorModal();
      }
    });
  }
  
  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Escape key to go back
    if (e.key === 'Escape') {
      const avatarChat = document.getElementById('avatarChat');
      if (avatarChat && avatarChat.style.display !== 'none') {
        showAvatarSelection();
      }
    }
    
    // Space key to start/stop listening
    if (e.key === ' ' && !e.target.matches('input, textarea')) {
      e.preventDefault();
      if (isListening) {
        stopListening();
      } else {
        startListening();
      }
    }
  });
  
  // Online/offline detection
  window.addEventListener('online', () => {
    showNotification('Connection restored!', 'success');
  });
  
  window.addEventListener('offline', () => {
    showNotification('Connection lost. Some features may not work.', 'error');
  });
}

function selectAvatar(avatarType) {
  if (!AVATAR_CONFIG[avatarType]) {
    showNotification('Invalid avatar selected', 'error');
    return;
  }
  
  currentAvatar = avatarType;
  const config = AVATAR_CONFIG[avatarType];
  
  // Update UI
  const avatarName = document.getElementById('avatarName');
  const avatarDomain = document.getElementById('avatarDomain');
  const selectedAvatarImage = document.getElementById('selectedAvatarImage');
  const selectedAvatarFallback = document.getElementById('selectedAvatarFallback');
  
  if (avatarName) avatarName.textContent = config.name;
  if (avatarDomain) avatarDomain.textContent = config.domain;
  
  // Set avatar image with proper error handling
  if (selectedAvatarImage) {
    selectedAvatarImage.src = config.image;
    selectedAvatarImage.alt = config.name;
  }
  if (selectedAvatarFallback) {
    selectedAvatarFallback.textContent = getAvatarEmoji(avatarType);
  }
  
  // Show the image, hide fallback initially
  if (selectedAvatarImage) selectedAvatarImage.style.display = 'block';
  if (selectedAvatarFallback) selectedAvatarFallback.style.display = 'none';
  
  // Handle image load error
  if (selectedAvatarImage) {
    selectedAvatarImage.onerror = function() {
        selectedAvatarImage.style.display = 'none';
        selectedAvatarFallback.style.display = 'block';
        selectedAvatarFallback.textContent = getAvatarEmoji(avatarType);
    };
  }
  
  // Handle image load success
  if (selectedAvatarImage) {
    selectedAvatarImage.onload = function() {
        selectedAvatarImage.style.display = 'block';
        selectedAvatarFallback.style.display = 'none';
    };
  }
  
  // Store selection
  localStorage.setItem('lastAvatar', avatarType);
  
  // Show chat interface
  showChatInterface();
  
  // Clear voice window and show loading
  const voiceContent = document.getElementById('voiceContent');
  if (voiceContent) voiceContent.innerHTML = '<p class="voice-placeholder">Loading...</p>';
  
  // Hide Q/A summary
  const qaSummary = document.getElementById('qaSummary');
  if (qaSummary) qaSummary.style.display = 'none';
  
  showNotification(`Selected ${config.name}`, 'success');
  
  // Speak greeting after a short delay
  setTimeout(() => {
    speakGreeting(config.greeting);
  }, 1000);
  
  // Debug: Log avatar selection
  console.log('Avatar selected:', avatarType);
  console.log('Avatar image path:', config.image);
  console.log('Avatar greeting:', config.greeting);
}

function getAvatarEmoji(avatarType) {
  const emojiMap = {
    'computer-teacher': '💻',
    'english-teacher': '📚',
    'biology-teacher': '🧬',
    'physics-teacher': '⚡',
    'chemistry-teacher': '🧪',
    'history-teacher': '📜',
    'geography-teacher': '🌍',
    'hindi-teacher': '🇮🇳',
    'mathematics-teacher': '📐',
    'doctor': '👨‍⚕️',
    'engineer': '⚙️',
    'lawyer': '⚖️'
  };
  return emojiMap[avatarType] || '🎭';
}

function speakGreeting(greeting) {
  // Clear any existing timeout
  if (questionTimeout) {
    clearTimeout(questionTimeout);
  }
  
  // Display greeting with better styling
  const voiceContent = document.getElementById('voiceContent');
  if (voiceContent) voiceContent.innerHTML = `<p class="greeting-message">${greeting}</p>`;
  
  // Add a small delay before speaking to ensure display is updated
  setTimeout(() => {
    speakText(greeting);
  }, 200);
  
  // Show notification that avatar is ready
  showNotification('Avatar ready! You can start asking questions.', 'success');
}

function showChatInterface() {
  // Check if elements exist
  const avatarChat = document.getElementById('avatarChat');
  const avatarSelectionEl = document.getElementById('avatarSelection');
  
  if (!avatarChat || !avatarSelectionEl) {
    console.error('Required DOM elements not found');
    return;
  }
  
  // Ensure proper display states
  avatarSelectionEl.style.display = 'none';
  avatarChat.style.display = 'flex';
  
  // Focus management for accessibility
  setTimeout(() => {
    const talkBtn = document.getElementById('talkBtn');
    if (talkBtn) talkBtn.focus();
  }, 100);
  
  // Debug log
  console.log('Switched to chat interface for avatar:', currentAvatar);
}

function showAvatarSelection() {
  // Check if elements exist
  const avatarChat = document.getElementById('avatarChat');
  const avatarSelectionEl = document.getElementById('avatarSelection');
  
  if (!avatarChat || !avatarSelectionEl) {
    console.error('Required DOM elements not found');
    return;
  }
  
  // Stop any ongoing speech/listening gracefully
  if (isListening) {
    stopListening();
  }
  if (isSpeaking) {
    stopSpeech();
    // Give a small delay to allow speech to stop properly
    setTimeout(() => {
      // Ensure speech is completely stopped
      if ('speechSynthesis' in window) {
        try {
          speechSynthesis.cancel();
        } catch (error) {
          // Ignore errors from speech cancellation
        }
      }
    }, 100);
  }
  
  // Reset current avatar state
  currentAvatar = null;
  currentQuestion = '';
  currentAnswer = '';
  lastSpokenText = '';
  
  // Clear any timeouts
  if (questionTimeout) {
    clearTimeout(questionTimeout);
    questionTimeout = null;
  }
  
  // Reset UI completely
  const voiceContent = document.getElementById('voiceContent');
  if (voiceContent) voiceContent.innerHTML = '<p class="voice-placeholder">Click "Talk" to start your conversation...</p>';
  const qaSummary = document.getElementById('qaSummary');
  if (qaSummary) qaSummary.style.display = 'none';
  const statusEl = document.getElementById('status');
  if (statusEl) statusEl.textContent = '';
  
  // Reset avatar image and info
  const selectedAvatarImage = document.getElementById('selectedAvatarImage');
  const selectedAvatarFallback = document.getElementById('selectedAvatarFallback');
  
  if (selectedAvatarImage) {
    selectedAvatarImage.src = '';
    selectedAvatarImage.style.display = 'none';
  }
  if (selectedAvatarFallback) {
    selectedAvatarFallback.style.display = 'block';
    selectedAvatarFallback.textContent = '🎭';
  }
  
  const avatarName = document.getElementById('avatarName');
  const avatarDomain = document.getElementById('avatarDomain');
  if (avatarName) avatarName.textContent = 'AI Avatar';
  if (avatarDomain) avatarDomain.textContent = 'Subject Domain';
  
  // Hide chat interface
  avatarChat.style.display = 'none';
  
  // Simple and direct layout reset - show avatar selection
  avatarSelectionEl.style.display = 'flex';
  
  // Force immediate layout recalculation
  avatarSelectionEl.offsetHeight;
  
  // Ensure proper centering with simple CSS reset
  avatarSelectionEl.style.cssText = `
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: flex-start !important;
    text-align: center !important;
    width: 100% !important;
    max-width: 1200px !important;
    margin: 0 auto !important;
    padding: var(--space-6) !important;
    min-height: 100vh !important;
    box-sizing: border-box !important;
  `;
  
  // Reset header layout
  const header = avatarSelectionEl.querySelector('.selection-header');
  if (header) {
    header.style.cssText = `
      text-align: center !important;
      margin-bottom: var(--space-8) !important;
      width: 100% !important;
      max-width: 800px !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      justify-content: center !important;
      margin-left: auto !important;
      margin-right: auto !important;
    `;
  }
  
  // Reset grid layout
  const grid = avatarSelectionEl.querySelector('.avatar-grid');
  if (grid) {
    grid.style.cssText = `
      display: grid !important;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)) !important;
      gap: var(--space-6) !important;
      margin-top: var(--space-8) !important;
      width: 100% !important;
      max-width: 1200px !important;
      justify-items: center !important;
      align-items: start !important;
      margin-left: auto !important;
      margin-right: auto !important;
    `;
  }
  
  // Focus management
  setTimeout(() => {
    const firstCard = document.querySelector('.avatar-card');
    if (firstCard) firstCard.focus();
  }, 100);
  
  // Debug log
  console.log('Returned to avatar selection screen with simplified layout fix');
}

function processUserInput(message) {
  // Check if question is about creator
  if (isCreatorQuestion(message)) {
    const creatorResponse = "I was created by Susanto Ganguly — a passionate educator and software developer, known as Sir Ganguly, who builds AI tools to help students learn creatively.";
    displayResponse(message, creatorResponse);
    return;
  }
  
  // Check if question is in avatar's domain
  if (!isDomainQuestion(message, currentAvatar)) {
    const otherAvatars = {
      'computer-teacher': 'Computer',
      'english-teacher': 'English',
      'biology-teacher': 'Biology',
      'physics-teacher': 'Physics',
      'chemistry-teacher': 'Chemistry',
      'history-teacher': 'History',
      'geography-teacher': 'Geography',
      'hindi-teacher': 'Hindi',
      'mathematics-teacher': 'Mathematics',
      'doctor': 'Doctor',
      'engineer': 'Engineer',
      'lawyer': 'Lawyer'
    };
    
    const suggestedAvatar = otherAvatars[currentAvatar] || 'other';
    const domainResponse = `Interesting question! Though this isn't my subject, here's what I can share. You can also check with our ${suggestedAvatar} Teacher Avatar.`;
    
    // Still process the question but with a note
    processQuestionWithAPI(message, domainResponse);
    return;
  }
  
  // Process the question normally
  processQuestionWithAPI(message);
}

function processQuestionWithAPI(message, prefixResponse = '') {
  currentQuestion = message;
  const statusEl = document.getElementById('status');
  if (statusEl) statusEl.textContent = 'Processing...';
  
  // Call API
  fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: message,
      avatar: currentAvatar,
      systemPrompt: AVATAR_CONFIG[currentAvatar].systemPrompt
    })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    const fullResponse = prefixResponse ? `${prefixResponse} ${data.reply}` : data.reply;
    displayResponse(message, fullResponse);
  })
  .catch(error => {
    console.error('API Error:', error);
    const errorMessage = 'Failed to get response. Please try again.';
    displayResponse(message, errorMessage);
    const statusEl = document.getElementById('status');
    if (statusEl) statusEl.textContent = 'Error occurred';
    showNotification('Failed to get response. Please try again.', 'error');
  });
}

function displayResponse(question, response) {
  currentQuestion = question;
  currentAnswer = response;
  lastSpokenText = response;
  
  // Clear any existing timeout
  if (questionTimeout) {
    clearTimeout(questionTimeout);
  }
  
  // Update voice window with both question and answer
  const voiceContent = document.getElementById('voiceContent');
  if (voiceContent) {
    voiceContent.innerHTML = `
      <div class="conversation-display">
        <div class="question-display">
          <strong>You:</strong> ${question}
        </div>
        <div class="answer-display">
          <strong>Avatar:</strong> ${response}
        </div>
      </div>
    `;
  }
  
  // Show Q/A summary if response is long (more than 10 words)
  if (isLongResponse(response)) {
    const summaryQuestion = document.getElementById('summaryQuestion');
    const summaryAnswer = document.getElementById('summaryAnswer');
    if (summaryQuestion) summaryQuestion.textContent = question;
    if (summaryAnswer) summaryAnswer.textContent = response;
    const qaSummary = document.getElementById('qaSummary');
    if (qaSummary) qaSummary.style.display = 'block';
  } else {
    const qaSummary = document.getElementById('qaSummary');
    if (qaSummary) qaSummary.style.display = 'none';
  }
  
  const statusEl = document.getElementById('status');
  if (statusEl) statusEl.textContent = '';
  
  // Speak the response
  speakText(response);
}

function initRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    console.error('Speech recognition not supported');
    showNotification('Speech recognition not supported in this browser', 'error');
    return;
  }
  
  recognition = new SpeechRecognition();
  
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US'; // Default language, will be updated per avatar
  
  recognition.onstart = () => {
    isListening = true;
    const statusEl = document.getElementById('status');
    if (statusEl) statusEl.textContent = 'Listening...';
    hapticFeedback('medium');
    
    // Voice window is already cleared in startListening function
    console.log('Speech recognition started');
    
    if (isMobile) {
      showNotification('Listening...', 'info');
    }
  };
  
  recognition.onresult = async (event) => {
    const message = event.results[0][0].transcript;
    
    // Display the question immediately
    const voiceContent = document.getElementById('voiceContent');
    if (voiceContent) voiceContent.innerHTML = `<p class="user-question">${message}</p>`;
    
    // Show processing message after a short delay
    questionTimeout = setTimeout(() => {
      const voiceContent = document.getElementById('voiceContent');
      if (voiceContent) voiceContent.innerHTML = '<p class="processing-message">Processing...</p>';
    }, 2000);
    
    processUserInput(message);
  };
  
  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    isListening = false;
    const statusEl = document.getElementById('status');
    if (statusEl) statusEl.textContent = 'Error: ' + event.error;
    
    // Clear any existing timeout
    if (questionTimeout) {
      clearTimeout(questionTimeout);
    }
    
    // Reset voice window to placeholder
    const voiceContent = document.getElementById('voiceContent');
    if (voiceContent) voiceContent.innerHTML = '<p class="voice-placeholder">Click "Talk" to start your conversation...</p>';
    
    let errorMessage = 'Speech recognition error';
    switch (event.error) {
      case 'no-speech':
        errorMessage = 'No speech detected. Please try again.';
        break;
      case 'audio-capture':
        errorMessage = 'Microphone not found. Please check your microphone.';
        break;
      case 'not-allowed':
        errorMessage = 'Microphone access denied. Please allow microphone access.';
        break;
      case 'network':
        errorMessage = 'Network error. Please check your connection.';
        break;
    }
    
    showNotification(errorMessage, 'error');
  };
  
  recognition.onend = () => {
    isListening = false;
    const statusEl = document.getElementById('status');
    if (statusEl) statusEl.textContent = '';
  };
}

function speakText(text) {
  if (!('speechSynthesis' in window)) {
    showNotification('Speech synthesis not supported', 'error');
    return;
  }
  
  // Stop any existing speech and reset state
  if (isSpeaking) {
    try {
      speechSynthesis.cancel();
      isSpeaking = false; // Reset the flag after canceling
    } catch (error) {
      console.log('Speech synthesis already stopped');
      isSpeaking = false; // Ensure flag is reset
    }
  }
  
  // Clean text for speech and add natural pauses for better clarity
  const cleanText = text
    .replace(/[#?\"'`~!@$%^&*_+\-=\[\]{}|\\:;<>\/]/g, ' ') // Remove special characters but keep commas and parentheses
    .replace(/\./g, ' . ') // Add pause before and after full stops
    .replace(/[?!;:]/g, ' ') // Remove other punctuation but keep commas
    .replace(/\(/g, ' ( ') // Add spaces around opening parentheses
    .replace(/\)/g, ' ) ') // Add spaces around closing parentheses
    .replace(/,/g, ' , ') // Add spaces around commas for pauses
    .replace(/\s+/g, ' ') // Remove extra spaces
    .replace(/(\w+)/g, '$1 ') // Add space after each word for better articulation
    .trim();
  
  // Split text by sentences and punctuation for better pacing
  const sentences = cleanText.split(' . ').filter(sentence => sentence.trim().length > 0);
  
  // If we have multiple sentences, speak them with pauses
  if (sentences.length > 1) {
    speakSentencesWithPauses(sentences);
    return;
  }
  
  // For single sentences, check if we need to add pauses for commas, parentheses, and full stops
  if (cleanText.includes(' , ') || cleanText.includes(' ( ') || cleanText.includes(' ) ') || cleanText.includes(' . ')) {
    speakWithPunctuationPauses(cleanText);
    return;
  }
  
  utterance = new SpeechSynthesisUtterance(cleanText);
  
  // Set voice based on avatar
  if (currentAvatar === 'hindi-teacher') {
    const hindiVoice = speechSynthesis.getVoices().find(voice => 
      voice.lang.includes('hi') || voice.lang.includes('IN')
    );
    if (hindiVoice) {
      utterance.voice = hindiVoice;
    }
  } else if (maleVoice) {
    utterance.voice = maleVoice;
  }
  
  // Configure speech parameters for deep, calm male voice with clear articulation
  utterance.rate = 0.77; // 10% faster than 0.7 for better pace
  utterance.pitch = 0.7; // Deep voice
  utterance.volume = 1.0;
  
  utterance.text = cleanText;
  
  // Start speaking animation
  isSpeaking = true;
  const selectedAvatarImage = document.getElementById('selectedAvatarImage');
  if (selectedAvatarImage) selectedAvatarImage.classList.add('speaking');
  
  utterance.onstart = () => {
    const statusEl = document.getElementById('status');
    if (statusEl) statusEl.textContent = 'Speaking...';
    hapticFeedback('light');
  };
  
  utterance.onend = () => {
    isSpeaking = false;
    const statusEl = document.getElementById('status');
    if (statusEl) statusEl.textContent = '';
    const selectedAvatarImage = document.getElementById('selectedAvatarImage');
    if (selectedAvatarImage) selectedAvatarImage.classList.remove('speaking');
    hapticFeedback('success');
  };
  
  utterance.onerror = (event) => {
    console.error('Speech synthesis error:', event.error);
    isSpeaking = false;
    const statusEl = document.getElementById('status');
    if (statusEl) statusEl.textContent = '';
    const selectedAvatarImage = document.getElementById('selectedAvatarImage');
    if (selectedAvatarImage) selectedAvatarImage.classList.remove('speaking');
    
    // Don't show error notification for interruptions
    if (event.error !== 'interrupted') {
      showNotification('Speech synthesis error', 'error');
    }
  };
  
  speechSynthesis.speak(utterance);
}

function speakSentencesWithPauses(sentences) {
  let currentIndex = 0;
  
  function speakNextSentence() {
    if (currentIndex >= sentences.length) {
      // All sentences spoken
      isSpeaking = false;
      const statusEl = document.getElementById('status');
      if (statusEl) statusEl.textContent = '';
      const selectedAvatarImage = document.getElementById('selectedAvatarImage');
      if (selectedAvatarImage) selectedAvatarImage.classList.remove('speaking');
      hapticFeedback('success');
      return;
    }
    
    const sentence = sentences[currentIndex].trim();
    if (sentence.length === 0) {
      currentIndex++;
      speakNextSentence();
      return;
    }
    
    const utterance = new SpeechSynthesisUtterance(sentence);
    
    // Set voice based on avatar
    if (currentAvatar === 'hindi-teacher') {
      const hindiVoice = speechSynthesis.getVoices().find(voice => 
        voice.lang.includes('hi') || voice.lang.includes('IN')
      );
      if (hindiVoice) {
        utterance.voice = hindiVoice;
      }
    } else if (maleVoice) {
      utterance.voice = maleVoice;
    }
    
    // Configure speech parameters for deep, calm male voice with clear articulation
    utterance.rate = 0.77; // 10% faster than 0.7 for better pace
    utterance.pitch = 0.7; // Deep voice
    utterance.volume = 1.0;
    
    utterance.onstart = () => {
      if (currentIndex === 0) {
        const statusEl = document.getElementById('status');
        if (statusEl) statusEl.textContent = 'Speaking...';
        hapticFeedback('light');
        isSpeaking = true;
        const selectedAvatarImage = document.getElementById('selectedAvatarImage');
        if (selectedAvatarImage) selectedAvatarImage.classList.add('speaking');
      }
    };
    
    utterance.onend = () => {
      currentIndex++;
      // Add 1 second pause between sentences
      setTimeout(speakNextSentence, 1000);
    };
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      isSpeaking = false;
      const statusEl = document.getElementById('status');
      if (statusEl) statusEl.textContent = 'Speech error';
      const selectedAvatarImage = document.getElementById('selectedAvatarImage');
      if (selectedAvatarImage) selectedAvatarImage.classList.remove('speaking');
      showNotification('Speech synthesis error', 'error');
    };
    
    speechSynthesis.speak(utterance);
  }
  
  speakNextSentence();
}

function speakWithPunctuationPauses(text) {
  // Split text by commas, parentheses, and full stops to add pauses
  const parts = text.split(/( , | \( | \) | \. )/).filter(part => part.trim().length > 0);
  let currentIndex = 0;
  
  function speakNextPart() {
    if (currentIndex >= parts.length) {
      // All parts spoken
      isSpeaking = false;
      const statusEl = document.getElementById('status');
      if (statusEl) statusEl.textContent = '';
      const selectedAvatarImage = document.getElementById('selectedAvatarImage');
      if (selectedAvatarImage) selectedAvatarImage.classList.remove('speaking');
      hapticFeedback('success');
      return;
    }
    
    const part = parts[currentIndex].trim();
    if (part.length === 0) {
      currentIndex++;
      speakNextPart();
      return;
    }
    
    const utterance = new SpeechSynthesisUtterance(part);
    
    // Set voice based on avatar
    if (currentAvatar === 'hindi-teacher') {
      const hindiVoice = speechSynthesis.getVoices().find(voice => 
        voice.lang.includes('hi') || voice.lang.includes('IN')
      );
      if (hindiVoice) {
        utterance.voice = hindiVoice;
      }
    } else if (maleVoice) {
      utterance.voice = maleVoice;
    }
    
    // Configure speech parameters
    utterance.rate = 0.77;
    utterance.pitch = 0.7;
    utterance.volume = 1.0;
    
    utterance.onstart = () => {
      if (currentIndex === 0) {
        const statusEl = document.getElementById('status');
        if (statusEl) statusEl.textContent = 'Speaking...';
        hapticFeedback('light');
        isSpeaking = true;
        const selectedAvatarImage = document.getElementById('selectedAvatarImage');
        if (selectedAvatarImage) selectedAvatarImage.classList.add('speaking');
      }
    };
    
    utterance.onend = () => {
      currentIndex++;
      // Add 0.5 second pause for commas, parentheses, and full stops
      const nextPart = parts[currentIndex];
      const pauseTime = (nextPart === ' , ' || nextPart === ' ( ' || nextPart === ' ) ' || nextPart === ' . ') ? 500 : 0;
      setTimeout(speakNextPart, pauseTime);
    };
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      isSpeaking = false;
      const statusEl = document.getElementById('status');
      if (statusEl) statusEl.textContent = 'Speech error';
      const selectedAvatarImage = document.getElementById('selectedAvatarImage');
      if (selectedAvatarImage) selectedAvatarImage.classList.remove('speaking');
      showNotification('Speech synthesis error', 'error');
    };
    
    speechSynthesis.speak(utterance);
  }
  
  speakNextPart();
}

function stopSpeech() {
  if ('speechSynthesis' in window) {
    try {
      speechSynthesis.cancel();
    } catch (error) {
      console.log('Speech synthesis already stopped or interrupted');
    }
  }
  isSpeaking = false;
  const statusEl = document.getElementById('status');
  if (statusEl) statusEl.textContent = '';
  const selectedAvatarImage = document.getElementById('selectedAvatarImage');
  if (selectedAvatarImage) selectedAvatarImage.classList.remove('speaking');
}

function startListening() {
  if (!recognition) {
    showNotification('Speech recognition not available', 'error');
    return;
  }
  
  if (isListening) {
    showNotification('Already listening...', 'info');
    return;
  }
  
  // Clear any existing timeout
  if (questionTimeout) {
    clearTimeout(questionTimeout);
  }
  
  // Clear previous conversation and show listening state
  const voiceContent = document.getElementById('voiceContent');
  if (voiceContent) {
    voiceContent.innerHTML = '<p class="listening-message">Listening...</p>';
  }
  
  // Hide Q/A summary when starting new conversation
  const qaSummary = document.getElementById('qaSummary');
  if (qaSummary) qaSummary.style.display = 'none';
  
  // Update recognition language based on avatar
  if (currentAvatar === 'hindi-teacher') {
    recognition.lang = 'hi-IN';
  } else {
    recognition.lang = 'en-US';
  }
  
  try {
    recognition.start();
  } catch (error) {
    console.error('Error starting speech recognition:', error);
    showNotification('Failed to start voice recognition', 'error');
  }
}

function stopListening() {
  if (recognition && isListening) {
    recognition.stop();
  }
}

function cleanup() {
  if (recognition) {
    recognition.stop();
  }
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();
  }
  if (questionTimeout) {
    clearTimeout(questionTimeout);
  }
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  
  // Update theme toggle button
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    const sunIcon = themeToggle.querySelector('.sun-icon');
    const moonIcon = themeToggle.querySelector('.moon-icon');
    
    if (newTheme === 'dark') {
      sunIcon.style.opacity = '0';
      moonIcon.style.opacity = '1';
    } else {
      sunIcon.style.opacity = '1';
      moonIcon.style.opacity = '0';
    }
  }
}

function loadTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  // Update theme toggle button
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    const sunIcon = themeToggle.querySelector('.sun-icon');
    const moonIcon = themeToggle.querySelector('.moon-icon');
    
    if (savedTheme === 'dark') {
      sunIcon.style.opacity = '0';
      moonIcon.style.opacity = '1';
    } else {
      sunIcon.style.opacity = '1';
      moonIcon.style.opacity = '0';
    }
  }
}

function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      showNotification('Copied to clipboard!', 'success');
      hapticFeedback('success');
    }).catch(() => {
      showNotification('Failed to copy', 'error');
    });
  } else {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      showNotification('Copied to clipboard!', 'success');
      hapticFeedback('success');
    } catch (err) {
      showNotification('Failed to copy', 'error');
    }
    document.body.removeChild(textArea);
  }
}

function showOfflineMessage() {
  showNotification('You are offline. Some features may not work.', 'error');
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Page is hidden, stop any ongoing speech/listening
    if (isListening) stopListening();
    if (isSpeaking) stopSpeech();
  }
});

// Handle beforeunload to cleanup
window.addEventListener('beforeunload', cleanup);

// Handle online/offline status
function isOnline() {
  return navigator.onLine;
} 