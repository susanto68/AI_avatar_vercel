import { AVATAR_CONFIG } from '../../lib/avatars'
import { getCompleteSystemPrompt } from '../../context/prompts.js'
import { GoogleGenerativeAI } from '@google/generative-ai'
import OpenAI from 'openai'

// Initialize AI clients
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const GEMINI_MODELS = (process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite,gemini-2.5-flash,gemini-flash-latest')
  .split(',')
  .map((model) => model.trim())
  .filter(Boolean)

const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini'
const AI_MAX_OUTPUT_TOKENS = Number(process.env.AI_MAX_OUTPUT_TOKENS || 300)
const AI_TIMEOUT_MS = Number(process.env.AI_TIMEOUT_MS || 7000)
const AI_HISTORY_LIMIT = Number(process.env.AI_HISTORY_LIMIT || 2)

// In-memory conversation storage with enhanced session management
const conversationHistory = new Map()
const sessionContexts = new Map()

// Performance optimization: Cache system prompts
const systemPromptCache = new Map()

// Comprehensive offline knowledge base for all avatars
const OFFLINE_KNOWLEDGE_BASE = {
  'biology-teacher': {
    'brain': {
      title: "The Human Brain",
      content: `The brain is the command center of the human body, controlling all our thoughts, movements, and bodily functions. It's made up of billions of nerve cells called neurons that communicate through electrical and chemical signals.

**Key Facts:**
• Weight: About 3 pounds (1.4 kg)
• Neurons: Approximately 86 billion
• Energy Usage: 20% of body's total energy
• Functions: Memory, learning, emotions, behavior control

**Main Parts:**
1. **Cerebrum** - Thinking, voluntary actions, memory
2. **Cerebellum** - Balance, coordination, fine motor skills
3. **Brainstem** - Basic life functions (breathing, heart rate)

**Interesting Facts:**
• The brain can process information at 268 mph
• It generates enough electricity to power a light bulb
• New neural connections form when you learn something new`,
      keywords: ['brain', 'nervous system', 'neurons', 'cerebrum', 'cerebellum', 'brainstem']
    },
    'cell': {
      title: "Cells: Building Blocks of Life",
      content: `Cells are the basic building blocks of all living things. They are microscopic structures that carry out all the functions necessary for life.

**What are Cells?**
• The smallest unit of life
• All living organisms are made of cells
• Human body contains trillions of cells
• Each cell has a specific function

**Cell Structure:**
1. **Cell Membrane** - Protects and controls what enters/exits
2. **Nucleus** - Contains genetic material (DNA)
3. **Cytoplasm** - Gel-like substance where reactions occur
4. **Organelles** - Specialized structures for specific tasks

**Types of Cells:**
• **Nerve cells** - Transmit electrical signals
• **Muscle cells** - Enable movement
• **Blood cells** - Transport oxygen and nutrients
• **Skin cells** - Provide protection`,
      keywords: ['cell', 'cells', 'nucleus', 'membrane', 'cytoplasm', 'organelles']
    },
    'heart': {
      title: "The Human Heart",
      content: `The heart is a muscular organ that pumps blood throughout the body, delivering oxygen and nutrients to all cells.

**Heart Facts:**
• Size: About the size of your fist
• Weight: 8-10 ounces (250-300 grams)
• Beats: 60-100 times per minute at rest
• Daily beats: Over 100,000 times

**Heart Structure:**
1. **Four Chambers:**
   - Right atrium and ventricle
   - Left atrium and ventricle
2. **Valves** - Prevent blood from flowing backward
3. **Muscle tissue** - Contracts to pump blood

**Blood Flow:**
• Deoxygenated blood → Right side → Lungs
• Oxygenated blood → Left side → Body`,
      keywords: ['heart', 'blood', 'circulation', 'pump', 'chambers', 'valves']
    },
    'default': {
      title: "Biology Fundamentals",
      content: `Biology is the study of living organisms and their interactions with each other and their environment. It covers everything from tiny cells to complex ecosystems.

**Key Areas in Biology:**
1. **Cell Biology** - Studying the basic units of life
2. **Genetics** - Understanding how traits are inherited
3. **Ecology** - Examining how organisms interact with their environment
4. **Evolution** - Studying how species change over time
5. **Human Anatomy** - Understanding the human body structure

**Why Study Biology?**
• Understand how your body works
• Learn about diseases and treatments
• Appreciate the diversity of life
• Make informed health decisions
• Contribute to scientific discoveries`,
      keywords: ['biology', 'life', 'organisms', 'cells', 'genetics', 'ecology']
    }
  },
  'physics-teacher': {
    'motion': {
      title: "Motion and Forces",
      content: `Motion is the change in position of an object over time. It's one of the fundamental concepts in physics that helps us understand how things move.

**Types of Motion:**
1. **Linear Motion** - Moving in a straight line
2. **Circular Motion** - Moving in a circle
3. **Oscillatory Motion** - Back and forth movement
4. **Random Motion** - Unpredictable movement

**Key Concepts:**
• **Speed** - How fast something moves (distance/time)
• **Velocity** - Speed with direction
• **Acceleration** - How quickly velocity changes
• **Force** - What causes motion to change

**Newton's Laws of Motion:**
1. **First Law** - Objects stay at rest or in motion unless acted upon by a force
2. **Second Law** - Force = mass × acceleration
3. **Third Law** - For every action, there's an equal and opposite reaction`,
      keywords: ['motion', 'movement', 'speed', 'velocity', 'acceleration', 'force', 'newton']
    },
    'energy': {
      title: "Forms of Energy",
      content: `Energy is the ability to do work or cause change. It's a fundamental concept in physics that comes in many forms.

**Types of Energy:**
1. **Kinetic Energy** - Energy of motion
   • Moving car, falling ball, flowing water
2. **Potential Energy** - Stored energy
   • Stretched rubber band, raised object, compressed spring
3. **Thermal Energy** - Heat energy
   • Hot coffee, warm air, steam
4. **Electrical Energy** - Energy from electric charges
   • Lightning, batteries, power lines
5. **Chemical Energy** - Energy stored in chemical bonds
   • Food, gasoline, explosives

**Energy Conservation:**
• Energy cannot be created or destroyed
• It only changes from one form to another
• Total energy in a system remains constant`,
      keywords: ['energy', 'kinetic', 'potential', 'thermal', 'electrical', 'chemical']
    },
    'light': {
      title: "Light and Optics",
      content: `Light is a form of electromagnetic radiation that we can see. It travels in straight lines and can be reflected, refracted, and absorbed.

**Properties of Light:**
• **Speed** - 186,000 miles per second (300,000 km/s)
• **Wavelength** - Determines color
• **Intensity** - Determines brightness

**Light Behavior:**
1. **Reflection** - Light bounces off surfaces
2. **Refraction** - Light bends when passing through different materials
3. **Absorption** - Light is absorbed by materials
4. **Diffraction** - Light bends around obstacles

**Colors of Light:**
• White light contains all colors
• Primary colors: Red, Blue, Green
• Mixing colors creates new colors`,
      keywords: ['light', 'optics', 'reflection', 'refraction', 'color', 'wavelength']
    },
    'default': {
      title: "Physics Fundamentals",
      content: `Physics is the study of matter, energy, and their interactions. It helps us understand how the universe works at both the smallest and largest scales.

**Main Branches of Physics:**
1. **Mechanics** - Motion, forces, and energy
2. **Thermodynamics** - Heat and energy transfer
3. **Electromagnetism** - Electricity and magnetism
4. **Optics** - Light and vision
5. **Quantum Physics** - Behavior of very small particles

**Why Study Physics?**
• Understand how the world works
• Develop problem-solving skills
• Apply to engineering and technology
• Explore the mysteries of the universe
• Make scientific discoveries`,
      keywords: ['physics', 'matter', 'energy', 'forces', 'motion', 'universe']
    }
  },
  'chemistry-teacher': {
    'acid': {
      title: "Acids and Bases",
      content: `Acids and bases are important chemical compounds that have opposite properties and are found everywhere in our daily lives.

**What are Acids?**
• Substances that release hydrogen ions (H+) in water
• Taste sour (like lemon juice)
• Turn blue litmus paper red
• Conduct electricity when dissolved in water

**What are Bases?**
• Substances that release hydroxide ions (OH-) in water
• Taste bitter and feel slippery
• Turn red litmus paper blue
• Also conduct electricity when dissolved

**Common Examples:**
• **Acids:** Lemon juice, vinegar, stomach acid, battery acid
• **Bases:** Soap, baking soda, ammonia, drain cleaner

**pH Scale:**
• 0-6: Acidic
• 7: Neutral (water)
• 8-14: Basic`,
      keywords: ['acid', 'acids', 'base', 'bases', 'ph', 'hydrogen', 'hydroxide']
    },
    'reaction': {
      title: "Chemical Reactions",
      content: `A chemical reaction is a process where substances (reactants) transform into new substances (products). It involves breaking and forming chemical bonds.

**Types of Chemical Reactions:**
1. **Synthesis** - Two or more substances combine
2. **Decomposition** - One substance breaks down into simpler substances
3. **Single Replacement** - One element replaces another
4. **Double Replacement** - Two elements switch places
5. **Combustion** - Substance reacts with oxygen, producing heat and light

**Signs of a Chemical Reaction:**
• Color change
• Gas production (bubbles)
• Temperature change
• Formation of a solid (precipitate)
• Odor change

**Examples:**
• Rusting of iron
• Burning of wood
• Baking a cake
• Photosynthesis`,
      keywords: ['reaction', 'chemical', 'reactants', 'products', 'bonds', 'synthesis']
    },
    'element': {
      title: "Chemical Elements",
      content: `Elements are pure substances made of only one type of atom. They are the building blocks of all matter in the universe.

**Element Facts:**
• There are 118 known elements
• Elements are organized in the periodic table
• Each element has unique properties
• Elements can combine to form compounds
• Some elements are naturally occurring, others are synthetic

**Types of Elements:**
1. **Metals** - Good conductors of heat and electricity
2. **Nonmetals** - Poor conductors, often gases
3. **Metalloids** - Properties between metals and nonmetals

**Common Elements:**
• **Hydrogen (H)** - Most abundant element in universe
• **Carbon (C)** - Basis of all life
• **Oxygen (O)** - Essential for breathing
• **Iron (Fe)** - Important for blood and tools`,
      keywords: ['element', 'elements', 'atom', 'atoms', 'periodic table', 'metal']
    },
    'default': {
      title: "Chemistry Basics",
      content: `Chemistry is the study of matter, its properties, and the changes it undergoes. It's often called the "central science" because it connects physics and biology.

**Key Areas in Chemistry:**
1. **Atomic Structure** - Understanding atoms and molecules
2. **Chemical Bonding** - How atoms connect to form compounds
3. **Reactions** - How substances change into new substances
4. **Solutions** - Mixtures and concentrations
5. **Organic Chemistry** - Carbon-based compounds

**Why Study Chemistry?**
• Understand the composition of materials
• Learn about medicines and drugs
• Develop new materials and technologies
• Solve environmental problems
• Make informed decisions about products`,
      keywords: ['chemistry', 'matter', 'atoms', 'molecules', 'compounds', 'reactions']
    }
  }
}

// Helper function to parse related content from AI response
const parseRelatedContent = (contentText, type) => {
  if (!contentText || typeof contentText !== 'string') return []
  
  const lines = contentText.split('\n').filter(line => line.trim())
  const items = []
  
  for (const line of lines) {
    if (line.includes(':')) {
      const parts = line.split(':')
      if (parts.length >= 2) {
        const title = parts[0].trim()
        const rest = parts.slice(1).join(':').trim()
        
        if (type === 'article') {
          // Parse "Title: Description - ThumbnailURL - URL" format
          const urlMatch = rest.match(/\s*-\s*(https?:\/\/[^\s]+)/)
          if (urlMatch) {
            const beforeUrl = rest.replace(/\s*-\s*https?:\/\/[^\s]+/, '').trim()
            const thumbnailMatch = beforeUrl.match(/\s*-\s*(https?:\/\/[^\s]+)/)
            if (thumbnailMatch) {
              const description = beforeUrl.replace(/\s*-\s*https?:\/\/[^\s]+/, '').trim()
              items.push({
                title: title,
                description: description || 'Learn more about this topic',
                thumbnailUrl: thumbnailMatch[1],
                url: urlMatch[1]
              })
            } else {
              // Fallback: no thumbnail provided
              const description = beforeUrl.trim()
              items.push({
                title: title,
                description: description || 'Learn more about this topic',
                thumbnailUrl: null,
                url: urlMatch[1]
              })
            }
          }
        } else if (type === 'video') {
          // Parse "Title: Description - Duration - ThumbnailURL - URL" format
          const urlMatch = rest.match(/\s*-\s*(https?:\/\/[^\s]+)/)
          if (urlMatch) {
            const beforeUrl = rest.replace(/\s*-\s*https?:\/\/[^\s]+/, '').trim()
            const thumbnailMatch = beforeUrl.match(/\s*-\s*(https?:\/\/[^\s]+)/)
            if (thumbnailMatch) {
              const beforeThumbnail = beforeUrl.replace(/\s*-\s*https?:\/\/[^\s]+/, '').trim()
              const durationMatch = beforeThumbnail.match(/\s*-\s*(\d{1,2}:\d{2})/)
              if (durationMatch) {
                const description = beforeThumbnail.replace(/\s*-\s*\d{1,2}:\d{2}/, '').trim()
                items.push({
                  title: title,
                  description: description || 'Watch this educational video',
                  duration: durationMatch[1],
                  thumbnailUrl: thumbnailMatch[1],
                  url: urlMatch[1]
                })
              }
            } else {
              // Fallback: no thumbnail provided
              const beforeThumbnail = beforeUrl.trim()
              const durationMatch = beforeThumbnail.match(/\s*-\s*(\d{1,2}:\d{2})/)
              if (durationMatch) {
                const description = beforeThumbnail.replace(/\s*-\s*\d{1,2}:\d{2}/, '').trim()
                items.push({
                  title: title,
                  description: description || 'Watch this educational video',
                  duration: durationMatch[1],
                  thumbnailUrl: null,
                  url: urlMatch[1]
                })
              }
            }
          }
        }
      }
    }
  }
  
  return items.slice(0, type === 'article' ? 4 : 3) // Limit articles to 4, videos to 3
}

const getSuggestionTopic = (avatarType, prompt = '', answer = '') => {
  const text = `${prompt} ${answer}`.toLowerCase()
  const topicMap = {
    'computer-teacher': [
      ['javascript', ['javascript', ' js ', 'node']],
      ['css', ['css', 'style', 'stylesheet']],
      ['html', ['html', 'tag', 'web page']],
      ['react', ['react', 'component', 'jsx']],
      ['python', ['python']],
      ['java programming', ['java ', 'oops', 'class', 'object']],
      ['data structures', ['array', 'stack', 'queue', 'linked list', 'tree', 'algorithm']]
    ],
    'mathematics-teacher': [
      ['algebra', ['algebra', 'equation', 'variable']],
      ['geometry', ['geometry', 'triangle', 'circle', 'angle']],
      ['calculus', ['calculus', 'derivative', 'integral']],
      ['statistics', ['statistics', 'probability', 'mean', 'median']]
    ],
    'english-teacher': [
      ['english grammar', ['grammar', 'tense', 'verb', 'noun']],
      ['writing skills', ['writing', 'essay', 'paragraph']],
      ['english literature', ['literature', 'poem', 'story']]
    ],
    'biology-teacher': [
      ['cell biology', ['cell', 'nucleus', 'membrane']],
      ['genetics', ['genetic', 'dna', 'gene']],
      ['photosynthesis', ['photosynthesis', 'chlorophyll']],
      ['human anatomy', ['heart', 'brain', 'body', 'organ']]
    ],
    'physics-teacher': [
      ['force and motion', ['force', 'motion', 'newton', 'speed']],
      ['energy', ['energy', 'kinetic', 'potential']],
      ['electricity', ['electricity', 'current', 'voltage']],
      ['light and optics', ['light', 'reflection', 'refraction']]
    ],
    'chemistry-teacher': [
      ['chemical reactions', ['reaction', 'reactant', 'product']],
      ['periodic table', ['periodic', 'element', 'atom']],
      ['acids and bases', ['acid', 'base', 'ph']]
    ],
    'history-teacher': [
      ['world history', ['world war', 'history', 'civilization']],
      ['indian history', ['india', 'ashoka', 'mughal', 'freedom']]
    ],
    'geography-teacher': [
      ['physical geography', ['mountain', 'river', 'earth', 'landform']],
      ['climate and weather', ['climate', 'weather', 'rainfall']]
    ],
    'hindi-teacher': [
      ['hindi grammar', ['व्याकरण', 'grammar', 'संज्ञा', 'क्रिया']],
      ['hindi writing', ['लेखन', 'निबंध', 'पत्र']],
      ['hindi literature', ['कविता', 'कहानी', 'साहित्य']]
    ],
    doctor: [
      ['nutrition and health', ['food', 'nutrition', 'diet', 'eat']],
      ['exercise and fitness', ['exercise', 'fitness', 'workout']],
      ['first aid', ['first aid', 'injury', 'wound']]
    ],
    engineer: [
      ['engineering design', ['design', 'engineering', 'structure']],
      ['mechanical engineering', ['machine', 'mechanical', 'gear']],
      ['electrical engineering', ['circuit', 'electrical', 'voltage']]
    ],
    lawyer: [
      ['legal rights', ['rights', 'law', 'legal']],
      ['constitution', ['constitution', 'fundamental rights']],
      ['consumer law', ['consumer', 'complaint']]
    ]
  }

  const matches = topicMap[avatarType] || []
  const matched = matches.find(([, keywords]) => keywords.some((keyword) => text.includes(keyword)))
  if (matched) return matched[0]

  const fallbackTopic = {
    'computer-teacher': 'programming basics',
    'mathematics-teacher': 'mathematics basics',
    'english-teacher': 'english learning',
    'biology-teacher': 'biology basics',
    'physics-teacher': 'physics basics',
    'chemistry-teacher': 'chemistry basics',
    'history-teacher': 'history basics',
    'geography-teacher': 'geography basics',
    'hindi-teacher': 'hindi learning',
    doctor: 'health basics',
    engineer: 'engineering basics',
    lawyer: 'legal basics'
  }

  return fallbackTopic[avatarType] || 'learning basics'
}

const buildSearchUrl = (baseUrl, query) => `${baseUrl}${encodeURIComponent(query)}`

// Helper function to generate fallback articles
const generateFallbackArticles = (avatarType, prompt = '', answer = '') => {
  const topic = getSuggestionTopic(avatarType, prompt, answer)
  const fallbackArticles = {
    'computer-teacher': [
              { title: `Learn ${topic}`, description: `Clear article resources about ${topic}.`, url: buildSearchUrl("https://developer.mozilla.org/en-US/search?q=", topic) },
              { title: `${topic} Tutorial`, description: `Beginner-friendly tutorial for ${topic}.`, url: buildSearchUrl("https://www.w3schools.com/search/search.php?q=", topic) },
              { title: `${topic} Practice`, description: `Practice and examples for ${topic}.`, url: buildSearchUrl("https://www.khanacademy.org/search?page_search_query=", topic) }
    ],
    'mathematics-teacher': [
              { title: `Learn ${topic}`, description: `Step-by-step math resources about ${topic}.`, url: buildSearchUrl("https://www.khanacademy.org/search?page_search_query=", topic) },
              { title: `${topic} Explained`, description: `Simple explanations and examples for ${topic}.`, url: buildSearchUrl("https://www.mathsisfun.com/search/search.php?query=", topic) },
              { title: `${topic} Practice`, description: `Practice problems related to ${topic}.`, url: buildSearchUrl("https://www.google.com/search?q=", `${topic} math practice`) }
    ],
    'english-teacher': [
              { title: `Learn ${topic}`, description: `Useful article resources about ${topic}.`, url: buildSearchUrl("https://www.grammarly.com/blog/search/", topic) },
              { title: `${topic} Guide`, description: `Trusted writing and English guidance for ${topic}.`, url: buildSearchUrl("https://owl.purdue.edu/search.html?q=", topic) },
              { title: `${topic} Examples`, description: `Examples and explanations for ${topic}.`, url: buildSearchUrl("https://www.google.com/search?q=", `${topic} English examples`) }
    ],
    'biology-teacher': [
              { title: `Learn ${topic}`, description: `Biology article resources about ${topic}.`, url: buildSearchUrl("https://www.khanacademy.org/search?page_search_query=", topic) },
              { title: `${topic} Overview`, description: `Simple science explanations for ${topic}.`, url: buildSearchUrl("https://www.britannica.com/search?query=", topic) },
              { title: `${topic} Notes`, description: `Student-friendly notes on ${topic}.`, url: buildSearchUrl("https://www.google.com/search?q=", `${topic} biology notes`) }
    ],
    'physics-teacher': [
              { title: `Learn ${topic}`, description: `Physics resources about ${topic}.`, url: buildSearchUrl("https://www.khanacademy.org/search?page_search_query=", topic) },
              { title: `${topic} Explained`, description: `Student-friendly explanations for ${topic}.`, url: buildSearchUrl("https://www.physicsclassroom.com/search?search=", topic) },
              { title: `${topic} Practice`, description: `Examples and practice for ${topic}.`, url: buildSearchUrl("https://www.google.com/search?q=", `${topic} physics practice`) }
    ],
    'chemistry-teacher': [
              { title: `Learn ${topic}`, description: `Chemistry resources about ${topic}.`, url: buildSearchUrl("https://www.khanacademy.org/search?page_search_query=", topic) },
              { title: `${topic} Guide`, description: `Reliable chemistry guide for ${topic}.`, url: buildSearchUrl("https://www.rsc.org/search?query=", topic) },
              { title: `${topic} Examples`, description: `Examples and notes for ${topic}.`, url: buildSearchUrl("https://www.google.com/search?q=", `${topic} chemistry notes`) }
    ],
    'history-teacher': [
              { title: "World History", description: "Major historical events", url: "https://www.khanacademy.org/humanities/world-history" },
              { title: "Ancient Civilizations", description: "Early human societies", url: "https://www.khanacademy.org/humanities/ancient-art-civilizations" },
              { title: "Modern History", description: "Recent historical developments", url: "https://www.khanacademy.org/humanities/us-history" }
    ],
    'geography-teacher': [
              { title: "Physical Geography", description: "Earth's natural features", url: "https://www.khanacademy.org/humanities/geography" },
              { title: "World Maps", description: "Understanding global geography", url: "https://www.nationalgeographic.org/maps/" },
              { title: "Climate & Weather", description: "Atmospheric conditions", url: "https://www.khanacademy.org/science/weather-and-climate" }
    ],
    'hindi-teacher': [
              { title: "Hindi Grammar", description: "हिंदी व्याकरण के नियम", url: "https://www.hindigranth.com/" },
              { title: "Hindi Literature", description: "हिंदी साहित्य का अध्ययन", url: "https://www.hindisahitya.com/" },
              { title: "Hindi Writing", description: "हिंदी लेखन कौशल", url: "https://www.hindigranth.com/" }
    ],
    'doctor': [
              { title: "Health Basics", description: "Fundamental health concepts", url: "https://www.mayoclinic.org/healthy-lifestyle" },
              { title: "Nutrition Guide", description: "Healthy eating principles", url: "https://www.nutrition.gov/" },
              { title: "Exercise & Fitness", description: "Physical activity guidelines", url: "https://www.cdc.gov/physicalactivity/index.html" }
    ],
    'engineer': [
              { title: "Engineering Basics", description: "Fundamental engineering concepts", url: "https://www.khanacademy.org/science/engineering" },
              { title: "Mechanical Engineering", description: "Machines and mechanisms", url: "https://www.khanacademy.org/science/mechanical-engineering" },
              { title: "Electrical Engineering", description: "Circuits and electronics", url: "https://www.khanacademy.org/science/electrical-engineering" }
    ],
    'lawyer': [
              { title: "Legal Basics", description: "Fundamental legal concepts", url: "https://www.law.cornell.edu/" },
              { title: "Constitutional Law", description: "Understanding the constitution", url: "https://constitutioncenter.org/" },
              { title: "Civil Rights", description: "Individual rights and freedoms", url: "https://www.aclu.org/" }
    ]
  }
  
  const genericArticles = [
    { title: `Learn ${topic}`, description: `Article resources directly related to ${topic}.`, url: buildSearchUrl("https://www.google.com/search?q=", `${topic} student article`) },
    { title: `${topic} Notes`, description: `Student-friendly notes and examples for ${topic}.`, url: buildSearchUrl("https://www.google.com/search?q=", `${topic} notes for students`) },
    { title: `${topic} Practice`, description: `Practice questions and explanations for ${topic}.`, url: buildSearchUrl("https://www.google.com/search?q=", `${topic} practice questions`) }
  ]

  return fallbackArticles[avatarType] || genericArticles
}

// Helper function to generate fallback videos
const generateFallbackVideos = (avatarType, prompt = '', answer = '') => {
  const topic = getSuggestionTopic(avatarType, prompt, answer)
  const youtubeSearch = buildSearchUrl("https://www.youtube.com/results?search_query=", `${topic} tutorial for students`)
  const fallbackVideos = {
    'computer-teacher': [
      { title: `${topic} Video Tutorial`, description: `Watch videos related to ${topic}.`, duration: "Search", url: youtubeSearch },
      { title: `${topic} for Beginners`, description: `Beginner-friendly videos for ${topic}.`, duration: "Search", url: buildSearchUrl("https://www.youtube.com/results?search_query=", `${topic} beginner tutorial`) }
    ],
    'mathematics-teacher': [
      { title: `${topic} Video Lesson`, description: `Video lessons related to ${topic}.`, duration: "Search", url: youtubeSearch },
      { title: `${topic} Practice Videos`, description: `Practice videos for ${topic}.`, duration: "Search", url: buildSearchUrl("https://www.youtube.com/results?search_query=", `${topic} solved examples`) }
    ],
    'english-teacher': [
      { title: `${topic} Video Lesson`, description: `Video lessons related to ${topic}.`, duration: "Search", url: youtubeSearch },
      { title: `${topic} Examples`, description: `Examples and practice videos for ${topic}.`, duration: "Search", url: buildSearchUrl("https://www.youtube.com/results?search_query=", `${topic} English lesson`) }
    ],
    'biology-teacher': [
      { title: `${topic} Video Lesson`, description: `Biology videos related to ${topic}.`, duration: "Search", url: youtubeSearch },
      { title: `${topic} Animation`, description: `Visual explanation videos for ${topic}.`, duration: "Search", url: buildSearchUrl("https://www.youtube.com/results?search_query=", `${topic} biology animation`) }
    ],
    'physics-teacher': [
      { title: `${topic} Video Lesson`, description: `Physics videos related to ${topic}.`, duration: "Search", url: youtubeSearch },
      { title: `${topic} Examples`, description: `Solved examples for ${topic}.`, duration: "Search", url: buildSearchUrl("https://www.youtube.com/results?search_query=", `${topic} physics examples`) }
    ],
    'chemistry-teacher': [
      { title: `${topic} Video Lesson`, description: `Chemistry videos related to ${topic}.`, duration: "Search", url: youtubeSearch },
      { title: `${topic} Examples`, description: `Examples and experiments for ${topic}.`, duration: "Search", url: buildSearchUrl("https://www.youtube.com/results?search_query=", `${topic} chemistry examples`) }
    ],
    'history-teacher': [
      { title: "World History Overview", description: "Major historical events", duration: "17:25", url: "https://www.youtube.com/watch?v=Yocja_N5s1I" },
      { title: "Ancient Civilizations", description: "Early human societies", duration: "20:10", url: "https://www.youtube.com/watch?v=8ZtInClXe1Q" }
    ],
    'geography-teacher': [
      { title: "Physical Geography", description: "Earth's natural features", duration: "16:45", url: "https://www.youtube.com/watch?v=7DjsD7Hcd9U" },
      { title: "World Geography", description: "Global geographical features", duration: "18:20", url: "https://www.youtube.com/watch?v=0RRVV4Diomg" }
    ],
    'hindi-teacher': [
      { title: "हिंदी व्याकरण", description: "Basic Hindi grammar rules", duration: "14:15", url: "https://www.youtube.com/watch?v=7DjsD7Hcd9U" },
      { title: "हिंदी लेखन", description: "Hindi writing skills", duration: "16:50", url: "https://www.youtube.com/watch?v=0RRVV4Diomg" }
    ],
    'doctor': [
      { title: "Health Basics", description: "Fundamental health concepts", duration: "15:30", url: "https://www.youtube.com/watch?v=7DjsD7Hcd9U" },
      { title: "Nutrition Guide", description: "Healthy eating principles", duration: "18:45", url: "https://www.youtube.com/watch?v=0RRVV4Diomg" }
    ],
    'engineer': [
      { title: "Engineering Fundamentals", description: "Basic engineering concepts", duration: "16:20", url: "https://www.youtube.com/watch?v=7DjsD7Hcd9U" },
      { title: "Mechanical Engineering", description: "Machines and mechanisms", duration: "19:15", url: "https://www.youtube.com/watch?v=0RRVV4Diomg" }
    ],
    'lawyer': [
      { title: "Legal Basics", description: "Fundamental legal concepts", duration: "17:40", url: "https://www.youtube.com/watch?v=7DjsD7Hcd9U" },
      { title: "Constitutional Law", description: "Understanding the constitution", duration: "20:25", url: "https://www.youtube.com/watch?v=0RRVV4Diomg" }
    ]
  }
  
  const genericVideos = [
    { title: `${topic} Video Lesson`, description: `Video lessons directly related to ${topic}.`, duration: "Search", url: youtubeSearch },
    { title: `${topic} Explained`, description: `Simple explanation videos for ${topic}.`, duration: "Search", url: buildSearchUrl("https://www.youtube.com/results?search_query=", `${topic} explained for students`) }
  ]

  return fallbackVideos[avatarType] || genericVideos
}

// Helper function to get quota status information
const getQuotaStatus = () => {
  return {
    message: "Free tier limit reached",
    details: "You've used all 50 free API calls for today",
    resetTime: "Resets at midnight (UTC)",
    alternatives: [
      "Explore the suggested educational resources below",
      "Try again tomorrow when the quota resets",
      "Consider upgrading to a paid plan for unlimited access"
    ]
  }
}

// Enhanced intelligent fallback that searches the offline knowledge base
const generateIntelligentFallback = (avatarType, prompt) => {
  // First, try to find a specific match in the offline knowledge base
  const avatarKnowledge = OFFLINE_KNOWLEDGE_BASE[avatarType]
  if (avatarKnowledge) {
    const promptLower = prompt.toLowerCase()
    
    // Search for specific topic matches
    for (const [topic, knowledge] of Object.entries(avatarKnowledge)) {
      if (topic !== 'default') {
        // Check if any keywords match the prompt
        const hasKeywordMatch = knowledge.keywords.some(keyword => 
          promptLower.includes(keyword)
        )
        
        if (hasKeywordMatch) {
          return knowledge.content
        }
      }
    }
    
    // Return default knowledge for the avatar
    return avatarKnowledge.default.content
  }
  
  // Fallback to the original intelligent responses if no offline knowledge
  const fallbackResponses = {
    'computer-teacher': {
      'javascript': `JavaScript is a programming language used to make websites interactive. HTML gives a page structure, CSS gives it style, and JavaScript adds behavior.

Key JavaScript ideas include:
• Variables - store values like names, numbers, and settings
• Functions - reusable blocks of code
• Events - actions like clicks, typing, or page loading
• DOM manipulation - changing page content with code
• APIs - sending and receiving data from servers

Example:
\`\`\`javascript
function greet(name) {
  return "Hello, " + name + "!";
}

console.log(greet("Student"));
\`\`\`

JavaScript is used in frontend apps with React and Next.js, backend servers with Node.js, mobile apps, browser extensions, and many automation tools.`,
      'html': `HTML stands for HyperText Markup Language. It gives a web page its structure by describing headings, paragraphs, links, images, forms, and other content.

Key HTML concepts include:
• Elements - building blocks like headings, buttons, and inputs
• Tags - markup such as <h1>, <p>, and <button>
• Attributes - extra information like href, src, class, and id
• Semantic HTML - meaningful tags that improve accessibility and SEO

Example:
\`\`\`html
<h1>My Page</h1>
<p>Welcome to my website.</p>
<button>Click me</button>
\`\`\``,
      'css': `CSS stands for Cascading Style Sheets. It controls how a web page looks, including colors, spacing, fonts, layout, and responsive design.

Key CSS concepts include:
• Selectors - choose which elements to style
• Properties - define styles like color, margin, and display
• Flexbox and Grid - create layouts
• Media queries - adapt designs for mobile and desktop
• Animations - add motion and transitions

Example:
\`\`\`css
button {
  background: blue;
  color: white;
  padding: 12px 16px;
}
\`\`\``,
      'react': `React is a JavaScript library for building user interfaces. It lets developers create reusable components and update the screen efficiently when data changes.

Key React concepts include:
• Components - reusable UI pieces
• Props - data passed into components
• State - data that changes over time
• Hooks - functions like useState and useEffect
• JSX - HTML-like syntax inside JavaScript

Example:
\`\`\`javascript
import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
\`\`\``,
      'default': `Computer science is the study of computers, software, data, and problem-solving. It teaches you how to write programs, build applications, understand algorithms, and create technology.

Key areas in computer science include:
• Programming - writing instructions for computers
• Web development - building websites and apps
• Data structures - organizing information efficiently
• Algorithms - step-by-step problem solving
• Databases - storing and retrieving data
• AI and automation - making systems smarter

You can ask me about JavaScript, HTML, CSS, React, Next.js, Python, Java, algorithms, debugging, or how to build a project.`
    },
    'biology-teacher': {
      'brain': `The brain is the command center of the human body, controlling all our thoughts, movements, and bodily functions. It's made up of billions of nerve cells called neurons that communicate through electrical and chemical signals.

Key facts about the brain:
• It weighs about 3 pounds (1.4 kg)
• Contains approximately 86 billion neurons
• Uses 20% of the body's total energy
• Controls memory, learning, emotions, and behavior
• Protected by the skull and cerebrospinal fluid

The brain has three main parts: the cerebrum (thinking and voluntary actions), cerebellum (balance and coordination), and brainstem (basic life functions like breathing and heart rate).`,
      'cell': `Cells are the basic building blocks of all living things. They are microscopic structures that carry out all the functions necessary for life.

Key facts about cells:
• All living organisms are made of cells
• Human body contains trillions of cells
• Cells have different shapes and sizes for different functions
• Each cell contains organelles that perform specific tasks
• Cells can reproduce and repair themselves`,
      'default': `Biology is the study of living organisms and their interactions with each other and their environment. It covers everything from tiny cells to complex ecosystems.

Key areas in biology include:
• Cell biology - studying the basic units of life
• Genetics - understanding how traits are inherited
• Ecology - examining how organisms interact with their environment
• Evolution - studying how species change over time
• Human anatomy - understanding the human body structure`
    },
    'physics-teacher': {
      'motion': `Motion is the change in position of an object over time. It's one of the fundamental concepts in physics that helps us understand how things move.

Key concepts in motion:
• Speed - how fast something moves
• Velocity - speed with direction
• Acceleration - how quickly velocity changes
• Force - what causes motion to change
• Newton's Laws - the rules that govern motion`,
      'energy': `Energy is the ability to do work or cause change. It's a fundamental concept in physics that comes in many forms.

Types of energy include:
• Kinetic energy - energy of motion
• Potential energy - stored energy
• Thermal energy - heat energy
• Electrical energy - energy from electric charges
• Chemical energy - energy stored in chemical bonds`,
      'default': `Physics is the study of matter, energy, and their interactions. It helps us understand how the universe works at both the smallest and largest scales.

Key areas in physics include:
• Mechanics - motion and forces
• Thermodynamics - heat and energy
• Electromagnetism - electricity and magnetism
• Optics - light and vision
• Quantum physics - behavior of very small particles`
    },
    'chemistry-teacher': {
      'reaction': `A chemical reaction is a process where substances (reactants) transform into new substances (products). It involves breaking and forming chemical bonds.

Key concepts in chemical reactions:
• Reactants - starting materials
• Products - ending materials
• Chemical equations - balanced formulas
• Energy changes - exothermic vs endothermic
• Catalysts - substances that speed up reactions`,
      'element': `Elements are pure substances made of only one type of atom. They are the building blocks of all matter in the universe.

Key facts about elements:
• There are 118 known elements
• Elements are organized in the periodic table
• Each element has unique properties
• Elements can combine to form compounds
• Some elements are naturally occurring, others are synthetic`,
      'default': `Chemistry is the study of matter, its properties, and the changes it undergoes. It's often called the "central science" because it connects physics and biology.

Key areas in chemistry include:
• Atomic structure - understanding atoms and molecules
• Chemical bonding - how atoms connect
• Reactions - how substances change
• Solutions - mixtures and concentrations
• Organic chemistry - carbon-based compounds`
    },
    'mathematics-teacher': {
      'algebra': `Algebra is a branch of mathematics that uses letters and symbols to represent numbers and quantities in formulas and equations.

Key concepts in algebra:
• Variables - letters that represent unknown values
• Equations - mathematical statements with equals signs
• Solving - finding the value of variables
• Functions - relationships between variables
• Polynomials - expressions with multiple terms`,
      'geometry': `Geometry is the study of shapes, sizes, positions, and dimensions of objects. It helps us understand the world around us.

Key concepts in geometry:
• Points, lines, and planes
• Angles and measurements
• Triangles, circles, and polygons
• Area and perimeter
• Volume and surface area`,
      'default': `Mathematics is the study of numbers, quantities, shapes, and patterns. It's a fundamental tool used in science, engineering, and everyday life.

Key areas in mathematics include:
• Arithmetic - basic operations with numbers
• Algebra - using letters and symbols
• Geometry - studying shapes and space
• Calculus - rates of change and accumulation
• Statistics - collecting and analyzing data`
    },
    'english-teacher': {
      'grammar': `Grammar is the set of rules that govern how words are used to form sentences. It helps us communicate clearly and effectively.

Key grammar concepts include:
• Parts of speech (nouns, verbs, adjectives)
• Sentence structure and punctuation
• Subject-verb agreement
• Tenses and verb forms
• Proper word usage`,
      'writing': `Writing is the process of creating text to communicate ideas, stories, or information. Good writing is clear, organized, and engaging.

Key writing skills include:
• Planning and organization
• Clear and concise language
• Proper grammar and punctuation
• Engaging introductions and conclusions
• Revising and editing`,
      'default': `English is a rich and complex language used for communication, literature, and learning. It has evolved over centuries and is now one of the most widely spoken languages.

Key areas in English include:
• Grammar - rules for using words correctly
• Vocabulary - building word knowledge
• Reading comprehension - understanding written text
• Writing - expressing ideas clearly
• Literature - appreciating written works`
    }
  }
  
  // Get the specific avatar responses
  const avatarConfig = AVATAR_CONFIG[avatarType]
  const genericAvatarFallback = {
    default: avatarConfig
      ? `${avatarConfig.name} can help you with ${avatarConfig.domain}. Please ask your question again with a little more detail, and I will explain it step by step with simple examples.`
      : 'Please ask your question again with a little more detail, and I will explain it step by step with simple examples.'
  }
  const avatarResponses = fallbackResponses[avatarType] || genericAvatarFallback
  
  // Check if we have a specific response for the prompt
  const promptLower = prompt.toLowerCase()
  for (const [key, response] of Object.entries(avatarResponses)) {
    if (key !== 'default' && promptLower.includes(key)) {
      return response
    }
  }
  
  // Return default response for the avatar
  return avatarResponses.default || genericAvatarFallback.default
}

// Helper function to parse JSON body with multiple fallbacks
const parseBody = (req) => {
  // Case 1: Body is already an object (parsed by Next.js)
  if (req.body && typeof req.body === 'object' && !Array.isArray(req.body)) {
    console.log('✅ Body is already an object')
    return req.body
  }
  
  // Case 2: Body is a string that needs parsing
  if (typeof req.body === 'string') {
    try {
      console.log('✅ Parsing body string as JSON')
      return JSON.parse(req.body)
    } catch (e) {
      console.log('❌ Failed to parse body string as JSON:', req.body)
      return null
    }
  }
  
  // Case 3: Body is an array (unusual but possible)
  if (Array.isArray(req.body)) {
    console.log('⚠️ Body is an array, trying to parse first element')
    try {
      return typeof req.body[0] === 'string' ? JSON.parse(req.body[0]) : req.body[0]
    } catch (e) {
      console.log('❌ Failed to parse array body')
      return null
    }
  }
  
  // Case 4: Body is undefined or null
  if (req.body === undefined || req.body === null) {
    console.log('❌ Body is undefined or null')
    return null
  }
  
  // Case 5: Unknown body type
  console.log('❌ Unknown body type:', typeof req.body, req.body)
  return null
}

// Get conversation history for a specific avatar session
const getConversationHistory = (avatarType, sessionId) => {
  const key = `${avatarType}-${sessionId}`
  return conversationHistory.get(key) || []
}

// Add message to conversation history
const addToConversationHistory = (avatarType, sessionId, role, content) => {
  const key = `${avatarType}-${sessionId}`
  const history = getConversationHistory(avatarType, sessionId)
  history.push({ role, content, timestamp: Date.now() })
  
  // Keep only last 10 messages to prevent memory issues (reduced from 20)
  if (history.length > 10) {
    history.splice(0, history.length - 10)
  }
  conversationHistory.set(key, history)
}

// Get or create session context for Gemini with performance optimization
const getSessionContext = (avatarType, sessionId) => {
  const key = `${avatarType}-${sessionId}`
  if (!sessionContexts.has(key)) {
    sessionContexts.set(key, genAI.getGenerativeModel({ model: GEMINI_MODELS[0] }).startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 2048, // Reduced from 4096 for faster responses
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      },
    }))
  }
  return sessionContexts.get(key)
}

// Call ChatGPT API
const callChatGPT = async (prompt, avatarType, sessionId) => {
  const systemPrompt = getCachedSystemPrompt(avatarType)
  const history = getConversationHistory(avatarType, sessionId).slice(-AI_HISTORY_LIMIT)
  
  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.map(msg => ({ role: msg.role, content: msg.content })),
    { role: 'user', content: prompt }
  ]

  const response = await openai.chat.completions.create({
    model: OPENAI_MODEL,
    messages: messages,
    max_tokens: AI_MAX_OUTPUT_TOKENS,
    temperature: 0.7,
  })

  return response.choices[0].message.content
}

// Call Gemini API
const callGemini = async (prompt, avatarType, sessionId) => {
  const systemPrompt = getCachedSystemPrompt(avatarType)
  const history = getConversationHistory(avatarType, sessionId).slice(-AI_HISTORY_LIMIT)
  
  const fullPrompt = `${systemPrompt}

Recent Conversation:
${history.map((msg) => `${msg.role}: ${msg.content}`).join('\n') || 'No previous messages.'}

User Question: ${prompt}

Answer quickly in 2-4 short bullet points or short paragraphs. Use simple words. Include one tiny code example only when necessary. Do not add long introductions or long resource lists.`

  const errors = []

  for (const modelName of GEMINI_MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          maxOutputTokens: AI_MAX_OUTPUT_TOKENS,
          temperature: 0.45,
          topP: 0.8,
          topK: 40,
        },
      })

      const result = await model.generateContent(fullPrompt)
      const text = result.response.text().trim()

      if (text) {
        return { text, modelName }
      }

      errors.push(`${modelName}: empty response`)
    } catch (error) {
      errors.push(`${modelName}: ${error.message}`)
    }
  }

  throw new Error(errors.join(' | '))
}

// Clean up old sessions (older than 1 hour instead of 24 hours)
const cleanupOldSessions = () => {
  const now = Date.now()
  const oneHour = 60 * 60 * 1000 // 1 hour
  
  for (const [key, history] of conversationHistory.entries()) {
    if (history.length > 0) {
      const lastMessage = history[history.length - 1]
      if (now - lastMessage.timestamp > oneHour) {
        conversationHistory.delete(key)
        sessionContexts.delete(key)
      }
    }
  }
}

// Get cached system prompt for better performance
const getCachedSystemPrompt = (avatarType) => {
  if (!systemPromptCache.has(avatarType)) {
    const prompt = getCompleteSystemPrompt(avatarType)
    systemPromptCache.set(avatarType, prompt)
  }
  return systemPromptCache.get(avatarType)
}

export default async function handler(req, res) {
  // Set CORS headers for Vercel deployment
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // Enhanced logging for debugging
  console.log('=== API REQUEST DEBUG ===')
  console.log('Method:', req.method)
  console.log('URL:', req.url)
  console.log('Content-Type:', req.headers['content-type'])
  console.log('Environment check - GEMINI_API_KEY exists:', !!process.env.GEMINI_API_KEY)
  console.log('Vercel Environment:', process.env.VERCEL_ENV || 'local')
  console.log('========================')

  // Only allow POST requests
  if (req.method !== 'POST') {
    console.log('❌ Method not allowed:', req.method)
    return res.status(405).json({ 
      error: 'Method not allowed. Only POST requests are accepted.',
      method: req.method 
    })
  }

  try {
    // Clean up old sessions
    cleanupOldSessions()
    
    // Parse the request body
    const parsedBody = parseBody(req)
    console.log('Parsed Body:', parsedBody)
    
    const { prompt, avatarType, sessionId = 'default' } = parsedBody || {}

    // Enhanced validation with detailed error messages
    if (!parsedBody) {
      console.log('❌ Request body is missing or invalid')
      return res.status(400).json({ 
        error: 'Request body is missing or invalid. Please provide a valid JSON payload.',
        received: null,
        rawBody: req.body,
        bodyType: typeof req.body
      })
    }

    if (!prompt) {
      console.log('❌ Missing prompt field')
      return res.status(400).json({ 
        error: 'Missing prompt field. Please provide a prompt in the request body.',
        received: { prompt, avatarType, sessionId },
        rawBody: req.body,
        parsedBody: parsedBody
      })
    }

    if (typeof prompt !== 'string') {
      console.log('❌ Invalid prompt type:', typeof prompt)
      return res.status(400).json({ 
        error: 'Invalid prompt type. Prompt must be a string.',
        received: { prompt: typeof prompt, avatarType, sessionId },
        rawBody: req.body,
        parsedBody: parsedBody
      })
    }

    if (prompt.trim().length === 0) {
      console.log('❌ Empty prompt')
      return res.status(400).json({ 
        error: 'Prompt cannot be empty. Please provide a valid question or message.',
        received: { prompt, avatarType, sessionId },
        rawBody: req.body,
        parsedBody: parsedBody
      })
    }

    if (!avatarType) {
      console.log('❌ Missing avatarType field')
      return res.status(400).json({ 
        error: 'Missing avatarType field. Please provide an avatar type in the request body.',
        received: { prompt, avatarType, sessionId },
        rawBody: req.body,
        parsedBody: parsedBody
      })
    }

    if (typeof avatarType !== 'string') {
      console.log('❌ Invalid avatarType:', typeof avatarType)
      return res.status(400).json({ 
        error: 'Invalid avatarType. Avatar type must be a string.',
        received: { avatarType: typeof avatarType, sessionId },
        rawBody: req.body,
        parsedBody: parsedBody
      })
    }

    // Get avatar configuration
    const avatarConfig = AVATAR_CONFIG[avatarType]
    if (!avatarConfig) {
      console.log('❌ Invalid avatar type:', avatarType)
      return res.status(400).json({ 
        error: `Invalid avatar type: "${avatarType}". Please select a valid avatar.`,
        availableAvatars: Object.keys(AVATAR_CONFIG),
        received: { avatarType, sessionId }
      })
    }

    // Check for API keys
    const hasGeminiKey = !!process.env.GEMINI_API_KEY
    const hasOpenAIKey = !!process.env.OPENAI_API_KEY
    
    if (!hasGeminiKey && !hasOpenAIKey) {
      console.error('❌ No API keys found. Please set GEMINI_API_KEY or OPENAI_API_KEY environment variables')
      
      // Generate intelligent fallback response
      const fallbackResponse = generateIntelligentFallback(avatarType, prompt)
      const relatedArticles = generateFallbackArticles(avatarType, prompt, fallbackResponse)
      const relatedVideos = generateFallbackVideos(avatarType, prompt, fallbackResponse)
      
      return res.status(200).json({
        part1: `I apologize, but I'm currently unable to access my AI capabilities. ${fallbackResponse}`,
        part2: '',
        avatarType,
        sessionId,
        relatedArticles,
        relatedVideos,
        success: false,
        error: 'AI service configuration error - API keys missing',
        fallback: true
      })
    }

    console.log('🔑 Available APIs:', { 
      gemini: hasGeminiKey, 
      openai: hasOpenAIKey 
    })

    // Get conversation history for context (limited for faster responses)
    const history = getConversationHistory(avatarType, sessionId).slice(-AI_HISTORY_LIMIT)
    
    // Add user message to history
    addToConversationHistory(avatarType, sessionId, 'user', prompt)

    let aiResponse = ''
    let apiUsed = 'none'
    let apiError = null

    // Try APIs in order of preference (Gemini first, then ChatGPT)
    if (hasGeminiKey) {
      try {
        console.log('🤖 Trying Gemini API first...')
        const geminiResponse = await Promise.race([
          callGemini(prompt, avatarType, sessionId),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Gemini API timeout')), AI_TIMEOUT_MS)
          )
        ])
        aiResponse = geminiResponse.text
        apiUsed = `gemini:${geminiResponse.modelName}`
        console.log('✅ Gemini API success')
      } catch (error) {
        console.warn('⚠️ Gemini API failed:', error.message)
        apiError = error.message
      }
    }

    // Fallback to ChatGPT if Gemini failed or not available
    if (!aiResponse && hasOpenAIKey) {
      try {
        console.log('🤖 Trying ChatGPT API as fallback...')
        aiResponse = await Promise.race([
          callChatGPT(prompt, avatarType, sessionId),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('ChatGPT API timeout')), AI_TIMEOUT_MS)
          )
        ])
        apiUsed = 'chatgpt'
        console.log('✅ ChatGPT API success')
      } catch (error) {
        console.warn('⚠️ ChatGPT API failed:', error.message)
        apiError = error.message
      }
    }

    // If both APIs failed, use intelligent fallback
    if (!aiResponse) {
      console.log('🔄 Both APIs failed, using intelligent fallback')
      aiResponse = generateIntelligentFallback(avatarType, prompt)
      apiUsed = 'fallback'
    }

    if (!aiResponse) {
      console.error('❌ No response generated from any source')
      throw new Error('No response received from any AI service')
    }

    // Add AI response to history
    addToConversationHistory(avatarType, sessionId, 'assistant', aiResponse)

    // Parse the response into part1, part2, and related content
    let part1 = aiResponse
    let part2 = ''
    let relatedArticles = []
    let relatedVideos = []

    // Try to extract PART1 and PART2 from the response
    const part1Match = aiResponse.match(/PART1:\s*(.*?)(?=\s*PART2:|RELATED_ARTICLES:|RELATED_VIDEOS:|$)/is)
    const part2Match = aiResponse.match(/PART2:\s*(.*?)(?=\s*RELATED_ARTICLES:|RELATED_VIDEOS:|$)/is)
    const articlesMatch = aiResponse.match(/RELATED_ARTICLES:\s*(.*?)(?=\s*RELATED_VIDEOS:|$)/is)
    const videosMatch = aiResponse.match(/RELATED_VIDEOS:\s*(.*?)$/is)

    if (part1Match) {
      part1 = part1Match[1].trim()
    }

    if (part2Match) {
      part2 = part2Match[1].trim()
    }

    // Extract related articles
    if (articlesMatch) {
      const articlesText = articlesMatch[1].trim()
      relatedArticles = parseRelatedContent(articlesText, 'article')
    }

    // Extract related videos
    if (videosMatch) {
      const videosText = videosMatch[1].trim()
      relatedVideos = parseRelatedContent(videosText, 'video')
    }

    // If no explicit parts found, try to extract code blocks for part2
    if (!part2) {
      const codeBlockMatch = aiResponse.match(/```(\w+)?\n([\s\S]*?)```/g)
      if (codeBlockMatch) {
        part2 = codeBlockMatch.join('\n\n')
        // Remove code blocks from part1
        part1 = aiResponse.replace(/```(\w+)?\n([\s\S]*?)```/g, '').trim()
      }
    }

    // Clean up part1 (remove any remaining markers)
    part1 = part1.replace(/^(PART1:\s*)/i, '').trim()
    part2 = part2.replace(/^(PART2:\s*)/i, '').trim()

    // If part1 is empty, use the full response
    if (!part1) {
      part1 = aiResponse
    }

    // If no related content was extracted, generate fallback suggestions
    if (relatedArticles.length === 0) {
      relatedArticles = generateFallbackArticles(avatarType, prompt, part1)
    }
    if (relatedVideos.length === 0) {
      relatedVideos = generateFallbackVideos(avatarType, prompt, part1)
    }

    console.log('API Response generated successfully:', {
      part1Length: part1.length,
      part2Length: part2.length,
      avatarType,
      sessionId,
      apiUsed,
      historyLength: history.length + 2, // +2 for current user and AI messages
      articlesCount: relatedArticles.length,
      videosCount: relatedVideos.length
    })

    return res.status(200).json({
      part1,
      part2,
      avatarType,
      sessionId,
      relatedArticles,
      relatedVideos,
      success: true,
      apiUsed,
      apiError: apiError || null
    })

  } catch (error) {
    console.error('❌ API Error:', error)
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    
    // Parse request body for fallback
    const parsedBody = parseBody(req)
    const { avatarType, sessionId, prompt } = parsedBody || {}
    const avatarConfig = avatarType ? AVATAR_CONFIG[avatarType] : null
    
    let fallbackResponse = ''
    let errorType = 'Service temporarily unavailable'
    
    // Check for specific error types and provide better responses
    if (error.message && (error.message.includes('429') || error.message.includes('quota'))) {
      // Quota exceeded - provide helpful information
      errorType = 'API quota exceeded'
      const quotaInfo = getQuotaStatus()
      fallbackResponse = `I apologize, but I've reached my daily limit for AI responses. ${quotaInfo.message}

${quotaInfo.details}
${quotaInfo.resetTime}

However, I can still help you with educational resources! Here are some relevant articles and videos to learn about your topic.

${quotaInfo.alternatives[0]}
${quotaInfo.alternatives[1]}
${quotaInfo.alternatives[2]}`
    } else if (error.message && (error.message.includes('timeout') || error.message.includes('TIMEOUT'))) {
      // API timeout
      errorType = 'Request timeout'
      fallbackResponse = `I apologize, but the request took too long to process. This might be due to high demand or network issues.

Please try asking your question again in a moment, or explore the suggested resources below for immediate learning.`
    } else if (error.message && (error.message.includes('network') || error.message.includes('fetch') || error.message.includes('ECONNREFUSED') || error.message.includes('ENOTFOUND'))) {
      // Network error
      errorType = 'Network error'
      fallbackResponse = `I apologize, but there seems to be a network connection issue. Please check your internet connection and try again.

In the meantime, you can explore the suggested resources below to continue learning.`
    } else if (error.message && error.message.includes('API key')) {
      // API key error
      errorType = 'API configuration error'
      fallbackResponse = `I apologize, but there's a configuration issue with my AI service. Please try again later or explore the suggested resources below.`
    } else {
      // Generic error - use intelligent fallback
      errorType = 'Service temporarily unavailable'
      fallbackResponse = generateIntelligentFallback(avatarType, prompt)
    }
    
    // Generate fallback content for the specific avatar type
    const relatedArticles = generateFallbackArticles(avatarType, prompt, fallbackResponse)
    const relatedVideos = generateFallbackVideos(avatarType, prompt, fallbackResponse)
    
    return res.status(200).json({
      part1: fallbackResponse,
      part2: '',
      avatarType: avatarType || 'unknown',
      sessionId: sessionId || 'fallback',
      relatedArticles,
      relatedVideos,
      success: false,
      error: errorType,
      fallback: true
    })
  }
} 
