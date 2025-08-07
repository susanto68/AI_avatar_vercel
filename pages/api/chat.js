import { readFileSync } from 'fs';
import { join } from 'path';

// Load once at cold start from the project root api/ folder
let SYSTEM_PROMPT_TEMPLATE;
try {
  SYSTEM_PROMPT_TEMPLATE = readFileSync(
    join(process.cwd(), 'api', 'system_prompt.txt'),
    'utf8'
  ).trim();
} catch (error) {
  console.error('Error loading system prompt template:', error);
  SYSTEM_PROMPT_TEMPLATE = "You are a helpful AI assistant created by Susanto Ganguly (Sir Ganguly). Provide clear, educational responses.";
}

// Input validation and filtering
function validateInput(input) {
  if (!input || typeof input !== 'string') {
    return false;
  }
  
  const offensiveWords = [
    'bad', 'stupid', 'idiot', 'dumb', 'hate', 'terrible', 'awful', 'horrible',
    'useless', 'worthless', 'kill', 'die', 'death', 'suicide', 'abuse', 'abusive',
    'fuck', 'shit', 'bitch', 'ass', 'damn', 'hell', 'crap', 'piss'
  ];
  
  const lowerInput = input.toLowerCase();
  
  // Check for offensive words
  for (const word of offensiveWords) {
    if (lowerInput.includes(word)) {
      return false;
    }
  }
  
  // Check for excessive negativity
  const negativeWords = ['no', 'not', 'never', 'can\'t', 'won\'t', 'don\'t', 'doesn\'t'];
  const negativeCount = negativeWords.filter(word => lowerInput.includes(word)).length;
  
  if (negativeCount > 3) {
    return false;
  }
  
  return true;
}

function isDomainQuestion(question, avatarType) {
  if (!question || typeof question !== 'string' || !avatarType || typeof avatarType !== 'string') {
    return false;
  }
  
  const domainKeywords = {
    'computer-teacher': ['programming', 'code', 'computer', 'software', 'algorithm', 'data structure', 'technology', 'coding', 'developer', 'program', 'app', 'website', 'database', 'api', 'framework', 'java', 'python', 'c++', 'c#', 'javascript', 'html', 'css', 'php', 'ruby', 'swift', 'kotlin', 'go', 'rust', 'scala', 'perl', 'bash', 'sql', 'typescript', 'react', 'angular', 'vue', 'node.js', 'django', 'flask', 'spring', 'dotnet', 'android', 'ios', 'machine learning', 'artificial intelligence', 'data science', 'web development', 'mobile development', 'game development', 'cybersecurity', 'cloud computing', 'devops', 'docker', 'kubernetes', 'git', 'agile', 'scrum'],
    'english-teacher': ['grammar', 'english', 'language', 'writing', 'literature', 'poetry', 'essay', 'vocabulary', 'sentence', 'paragraph', 'story', 'novel', 'poem'],
    'biology-teacher': ['biology', 'cell', 'organism', 'gene', 'dna', 'evolution', 'ecosystem', 'species', 'plant', 'animal', 'human', 'body', 'organ', 'tissue'],
    'physics-teacher': ['physics', 'force', 'energy', 'motion', 'gravity', 'electricity', 'magnetism', 'wave', 'particle', 'atom', 'molecule', 'velocity', 'acceleration'],
    'chemistry-teacher': ['chemistry', 'chemical', 'molecule', 'atom', 'reaction', 'compound', 'element', 'acid', 'base', 'solution', 'mixture', 'organic', 'inorganic'],
    'history-teacher': ['history', 'historical', 'ancient', 'civilization', 'empire', 'war', 'battle', 'kingdom', 'dynasty', 'revolution', 'independence', 'culture', 'tradition', 'heritage', 'archaeology', 'timeline', 'era', 'period', 'century', 'decade', 'year'],
    'geography-teacher': ['geography', 'map', 'country', 'continent', 'ocean', 'mountain', 'river', 'climate', 'weather', 'population', 'culture', 'environment'],
    'hindi-teacher': ['hindi', 'हिंदी', 'व्याकरण', 'साहित्य', 'कविता', 'कहानी', 'निबंध', 'शब्द', 'वाक्य', 'परिच्छेद'],
    'mathematics-teacher': ['math', 'mathematics', 'algebra', 'geometry', 'calculus', 'equation', 'formula', 'number', 'calculation', 'problem', 'solve', 'statistics'],
    'doctor': ['health', 'medical', 'disease', 'symptom', 'treatment', 'medicine', 'doctor', 'patient', 'hospital', 'body', 'organ', 'surgery'],
    'engineer': ['engineering', 'design', 'build', 'construct', 'mechanical', 'electrical', 'civil', 'software', 'system', 'project', 'technical'],
    'lawyer': ['law', 'legal', 'court', 'justice', 'right', 'contract', 'agreement', 'lawyer', 'attorney', 'case', 'legal advice', 'regulation']
  };
  
  const keywords = domainKeywords[avatarType] || [];
  const lowerQuestion = question.toLowerCase();
  
  // Check for general questions that should be allowed
  const generalQuestions = [
    'hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening',
    'how are you', 'who are you', 'what is your name', 'introduce yourself',
    'tell me about yourself', 'what can you do', 'help', 'thanks', 'thank you'
  ];
  
  // Check if it's a general question first
  if (generalQuestions.some(gq => lowerQuestion.includes(gq))) {
    return true; // Allow general questions to pass through
  }
  
  // Then check for domain-specific keywords
  return keywords.some(keyword => lowerQuestion.includes(keyword));
}

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed. Only POST requests are accepted.',
      method: req.method 
    });
  }

  try {
    // Safely access request body
    const { message, avatar, avatarType, systemPrompt } = req.body || {};
    
    // Use avatarType if avatar is not provided (for backward compatibility)
    const selectedAvatar = avatar || avatarType;
    
    // DEBUG: Log incoming request
    console.log('=== API DEBUG START ===');
    console.log('Incoming request:', { message, avatar, avatarType, selectedAvatar });
    console.log('GEMINI_API_KEY exists:', !!process.env.GEMINI_API_KEY);
    console.log('GEMINI_API_KEY length:', process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.length : 0);
    
    // Validate required fields
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ 
        error: 'Missing or invalid message. Please provide a valid message string.',
        received: { message, avatar, avatarType }
      });
    }

    if (!selectedAvatar || typeof selectedAvatar !== 'string') {
      return res.status(400).json({ 
        error: 'Missing or invalid avatar type. Please provide a valid avatar type.',
        received: { message, avatar, avatarType }
      });
    }

    // Validate input
    if (!validateInput(message)) {
      console.log('DEBUG: Input validation failed');
      return res.status(200).json({ 
        reply: "I'm here to help positively. Please ask constructive questions only." 
      });
    }

    // Check if question is in avatar's domain
    const isDomain = isDomainQuestion(message, selectedAvatar);
    console.log('DEBUG: Domain question check:', { message, selectedAvatar, isDomain });
    
    if (!isDomain) {
      const domainKeywords = {
        'computer-teacher': ['programming', 'code', 'computer', 'software', 'algorithm', 'data structure', 'technology', 'coding', 'developer', 'program', 'app', 'website', 'database', 'api', 'framework', 'java', 'python', 'c++', 'c#', 'javascript', 'html', 'css', 'php', 'ruby', 'swift', 'kotlin', 'go', 'rust', 'scala', 'perl', 'bash', 'sql', 'typescript', 'react', 'angular', 'vue', 'node.js', 'django', 'flask', 'spring', 'dotnet', 'android', 'ios', 'machine learning', 'artificial intelligence', 'data science', 'web development', 'mobile development', 'game development', 'cybersecurity', 'cloud computing', 'devops', 'docker', 'kubernetes', 'git', 'agile', 'scrum'],
        'english-teacher': ['grammar', 'english', 'language', 'writing', 'literature', 'poetry', 'essay', 'vocabulary', 'sentence', 'paragraph', 'story', 'novel', 'poem'],
        'biology-teacher': ['biology', 'cell', 'organism', 'gene', 'dna', 'evolution', 'ecosystem', 'species', 'plant', 'animal', 'human', 'body', 'organ', 'tissue'],
        'physics-teacher': ['physics', 'force', 'energy', 'motion', 'gravity', 'electricity', 'magnetism', 'wave', 'particle', 'atom', 'molecule', 'velocity', 'acceleration'],
        'chemistry-teacher': ['chemistry', 'chemical', 'molecule', 'atom', 'reaction', 'compound', 'element', 'acid', 'base', 'solution', 'mixture', 'organic', 'inorganic'],
        'history-teacher': ['history', 'historical', 'ancient', 'civilization', 'empire', 'war', 'battle', 'kingdom', 'dynasty', 'revolution', 'independence', 'culture', 'tradition', 'heritage', 'archaeology', 'timeline', 'era', 'period', 'century', 'decade', 'year'],
        'geography-teacher': ['geography', 'map', 'country', 'continent', 'ocean', 'mountain', 'river', 'climate', 'weather', 'population', 'culture', 'environment'],
        'hindi-teacher': ['hindi', 'हिंदी', 'व्याकरण', 'साहित्य', 'कविता', 'कहानी', 'निबंध', 'शब्द', 'वाक्य', 'परिच्छेद'],
        'mathematics-teacher': ['math', 'mathematics', 'algebra', 'geometry', 'calculus', 'equation', 'formula', 'number', 'calculation', 'problem', 'solve', 'statistics'],
        'doctor': ['health', 'medical', 'disease', 'symptom', 'treatment', 'medicine', 'doctor', 'patient', 'hospital', 'body', 'organ', 'surgery'],
        'engineer': ['engineering', 'design', 'build', 'construct', 'mechanical', 'electrical', 'civil', 'software', 'system', 'project', 'technical'],
        'lawyer': ['law', 'legal', 'court', 'justice', 'right', 'contract', 'agreement', 'lawyer', 'attorney', 'case', 'legal advice', 'regulation']
      };
      
      const keywords = domainKeywords[selectedAvatar] || [];
      const keywordList = keywords.slice(0, 5).join(', '); // Show first 5 keywords
      
      // Safely use replace method
      const avatarName = selectedAvatar ? selectedAvatar.replace('-teacher', ' teacher').replace('-', ' ') : selectedAvatar;
      
      console.log('DEBUG: Returning domain mismatch response');
      console.log('=== API DEBUG END ===');
      return res.status(200).json({ 
        reply: `I can teach you about ${keywordList}. Please ask me questions related to these topics!` 
      });
    }

    // Check if Gemini API key is available
    if (!process.env.GEMINI_API_KEY) {
      console.log('DEBUG: No GEMINI_API_KEY found, using mock response');
      // Provide mock responses based on avatar type
      const mockResponses = getMockResponses(selectedAvatar);
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      console.log('DEBUG: Mock response selected:', randomResponse.substring(0, 100) + '...');
      console.log('=== API DEBUG END ===');
      return res.status(200).json({ reply: randomResponse });
    }

    try {
      console.log('DEBUG: Attempting to call Gemini API...');
      // Try to use OpenAI with Gemini base URL
      let OpenAI;
      try {
        const openaiModule = await import('openai');
        OpenAI = openaiModule.default;
      } catch (importError) {
        console.error('Failed to import OpenAI:', importError);
        // Fallback to mock responses on import error
        const mockResponses = getMockResponses(selectedAvatar);
        const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
        return res.status(200).json({ reply: randomResponse });
      }
      
      // Initialize OpenAI client only when API key is available
      const openai = new OpenAI({
        apiKey: process.env.GEMINI_API_KEY,
        baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai'
      });

      // Use provided system prompt or fallback to template
      const finalSystemPrompt = systemPrompt || SYSTEM_PROMPT_TEMPLATE;
      
      const resp = await openai.chat.completions.create({
        model: 'gemini-2.5-flash',
        messages: [
          { role: 'system', content: finalSystemPrompt },
          { role: 'user', content: message.trim() }
        ],
        temperature: 0.6,
        max_tokens: 1100
      });

      const aiResponse = resp.choices[0]?.message?.content?.trim() || 'I apologize, but I couldn\'t generate a response at this time.';
      console.log('DEBUG: AI response generated successfully');
      console.log('=== API DEBUG END ===');
      res.status(200).json({ reply: aiResponse });
      
    } catch (err) {
      console.error('AI service error:', err);
      
      // Fallback to mock responses on API error
      const mockResponses = getMockResponses(selectedAvatar);
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      console.log('DEBUG: Using fallback mock response due to AI service error');
      console.log('=== API DEBUG END ===');
      res.status(200).json({ reply: randomResponse });
    }
    
  } catch (err) {
    console.error('API Error:', err);
    
    // Fallback to mock responses on any error
    const { avatar, avatarType } = req.body || {};
    const selectedAvatar = avatar || avatarType;
    const mockResponses = getMockResponses(selectedAvatar);
    const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
    
    res.status(200).json({ 
      reply: randomResponse,
      error: 'AI service temporarily unavailable, using fallback response.'
    });
  }
}

function getMockResponses(avatarType) {
  if (!avatarType || typeof avatarType !== 'string') {
    return [
      "Hello! I'm here to help you learn and explore, as designed by Susanto Ganguly (Sir Ganguly). What would you like to discuss?",
      "Great question! Let me help you understand this topic better, following Sir Ganguly's teaching methods.",
      "That's an interesting question! Here's what I can tell you about this, as created by Susanto Ganguly.",
      "I'm here to assist you with your learning journey, as designed by Sir Ganguly. What would you like to explore?"
    ];
  }

  const responses = {
    'computer-teacher': [
      "Great question! As a computer science teacher created by Susanto Ganguly (Sir Ganguly), I'd be happy to help you with programming concepts including Java, Python, C, C++, JavaScript, and many other languages. What specific topic would you like to explore?",
      "Excellent! Programming is all about problem-solving. Whether it's Java, Python, C++, or any other language, let me explain this concept in a way that's easy to understand, as designed by Sir Ganguly.",
      "That's a wonderful programming question! I can help you with Java, Python, C, C++, JavaScript, HTML, CSS, and many other programming languages. Let me break this down step by step for you, following the teaching methods developed by Susanto Ganguly.",
      "As your computer science teacher, created by Sir Ganguly, I'm here to guide you through programming challenges in any language - from Java and Python to C, C++, JavaScript, and beyond. What would you like to learn?"
    ],
    'english-teacher': [
      "What an interesting language question! Let me help you understand this English concept better, as designed by Susanto Ganguly (Sir Ganguly).",
      "Great writing question! Here's how we can improve your language skills, following the methods developed by Sir Ganguly.",
      "That's a wonderful literary analysis question. Let me share some insights with you, as created by Susanto Ganguly.",
      "As your English teacher, created by Sir Ganguly, I'm here to help you master the language. What would you like to explore?"
    ],
    'biology-teacher': [
      "Fascinating biology question! Let me explain this life science concept in simple terms, as designed by Susanto Ganguly (Sir Ganguly).",
      "That's a great question about living organisms! Here's what you need to know, following the teaching methods of Sir Ganguly.",
      "Excellent biology inquiry! Let me break down this biological process for you, as created by Susanto Ganguly.",
      "As your biology teacher, created by Sir Ganguly, I'm excited to help you understand life sciences. What interests you?"
    ],
    'physics-teacher': [
      "That's an excellent physics question! Let me explain this physical concept clearly, as designed by Susanto Ganguly (Sir Ganguly).",
      "Great question about the laws of nature! Here's how physics explains this phenomenon, following Sir Ganguly's teaching methods.",
      "Wonderful physics inquiry! Let me demonstrate this concept with practical examples, as created by Susanto Ganguly.",
      "As your physics teacher, created by Sir Ganguly, I'm here to help you understand the physical world. What would you like to explore?"
    ],
    'chemistry-teacher': [
      "That's a fascinating chemistry question! Let me explain this chemical concept step by step, as designed by Susanto Ganguly (Sir Ganguly).",
      "Great question about chemical reactions! Here's what's happening at the molecular level, following Sir Ganguly's methods.",
      "Excellent chemistry inquiry! Let me show you how this chemical process works, as created by Susanto Ganguly.",
      "As your chemistry teacher, created by Sir Ganguly, I'm excited to help you understand chemical sciences. What interests you?"
    ],
    'history-teacher': [
      "That's a fascinating history question! Let me bring this historical event to life for you, as designed by Susanto Ganguly (Sir Ganguly).",
      "Great question about the past! Here's what history tells us about this period, following Sir Ganguly's teaching methods.",
      "Excellent historical inquiry! Let me explain this historical concept with engaging stories, as created by Susanto Ganguly.",
      "As your history teacher, created by Sir Ganguly, I'm excited to help you explore the past and understand how it shapes our present. What would you like to learn?"
    ],
    'geography-teacher': [
      "That's an interesting geography question! Let me help you understand this Earth science concept, as designed by Susanto Ganguly (Sir Ganguly).",
      "Great question about our planet! Here's what geography tells us about this topic, following Sir Ganguly's teaching methods.",
      "Wonderful geography inquiry! Let me explain this environmental concept clearly, as created by Susanto Ganguly.",
      "As your geography teacher, created by Sir Ganguly, I'm here to help you explore our world. What would you like to learn?"
    ],
    'hindi-teacher': [
      "बहुत अच्छा प्रश्न! मैं आपकी हिंदी भाषा में मदद करने के लिए यहाँ हूँ, जैसा कि सुशांतों गांगुली (सर गांगुली) ने डिज़ाइन किया है।",
      "हिंदी भाषा के बारे में यह एक शानदार सवाल है! मुझे आपकी मदद करने में खुशी होगी, सर गांगुली के तरीकों का पालन करते हुए।",
      "यह एक बेहतरीन हिंदी प्रश्न है! आइए इसे सरल तरीके से समझते हैं, जैसा कि सुशांतों गांगुली ने बनाया है।",
      "मैं आपकी हिंदी शिक्षिका हूँ, जिसे सर गांगुली ने बनाया है, और आपकी भाषा सीखने में मदद करने के लिए तैयार हूँ।"
    ],
    'mathematics-teacher': [
      "That's an excellent math question! Let me help you solve this step by step, as designed by Susanto Ganguly (Sir Ganguly).",
      "Great mathematical thinking! Here's how we can approach this problem, following Sir Ganguly's teaching methods.",
      "Wonderful math inquiry! Let me break down this mathematical concept clearly, as created by Susanto Ganguly.",
      "As your mathematics teacher, created by Sir Ganguly, I'm here to help you master mathematical concepts. What would you like to explore?"
    ],
    'doctor': [
      "That's an important health question! Let me provide some general information about this topic, as designed by Susanto Ganguly (Sir Ganguly).",
      "Great health inquiry! Here's what you should know about this medical concept, following Sir Ganguly's methods.",
      "That's a thoughtful health question. Let me explain this in simple terms, as created by Susanto Ganguly.",
      "As a medical professional, created by Sir Ganguly, I'm here to provide general health information. Remember to consult healthcare providers for specific medical advice."
    ],
    'engineer': [
      "That's an excellent engineering question! Let me explain this technical concept clearly, as designed by Susanto Ganguly (Sir Ganguly).",
      "Great engineering inquiry! Here's how we can approach this technical challenge, following Sir Ganguly's methods.",
      "Wonderful engineering question! Let me break down this technical process for you, as created by Susanto Ganguly.",
      "As an engineer, created by Sir Ganguly, I'm here to help you understand technical concepts and problem-solving approaches."
    ],
    'lawyer': [
      "That's an interesting legal question! Let me provide some general information about this legal concept, as designed by Susanto Ganguly (Sir Ganguly).",
      "Great legal inquiry! Here's what you should know about this legal principle, following Sir Ganguly's methods.",
      "That's a thoughtful legal question. Let me explain this legal concept in simple terms, as created by Susanto Ganguly.",
      "As a legal professional, created by Sir Ganguly, I'm here to provide general legal information. Remember to consult qualified legal professionals for specific legal advice."
    ]
  };

  return responses[avatarType] || [
    "Hello! I'm here to help you learn and explore, as designed by Susanto Ganguly (Sir Ganguly). What would you like to discuss?",
    "Great question! Let me help you understand this topic better, following Sir Ganguly's teaching methods.",
    "That's an interesting question! Here's what I can tell you about this, as created by Susanto Ganguly.",
    "I'm here to assist you with your learning journey, as designed by Sir Ganguly. What would you like to explore?"
  ];
} 