// Curated list of high-quality, high-speed Unsplash educational images for all 16 teacher roles
const THUMBNAIL_MAP = {
  'computer-teacher': [
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=320&q=80',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=320&q=80',
    'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=320&q=80'
  ],
  'mathematics-teacher': [
    'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=320&q=80',
    'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=320&q=80',
    'https://images.unsplash.com/photo-1453733190148-c44698c265f8?w=320&q=80'
  ],
  'applied-mathematics-teacher': [
    'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=320&q=80',
    'https://images.unsplash.com/photo-1453733190148-c44698c265f8?w=320&q=80',
    'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=320&q=80'
  ],
  'physics-teacher': [
    'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=320&q=80',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=320&q=80',
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=320&q=80'
  ],
  'chemistry-teacher': [
    'https://images.unsplash.com/photo-1532187863486-abf9d39d66e8?w=320&q=80',
    'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=320&q=80',
    'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=320&q=80'
  ],
  'biology-teacher': [
    'https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?w=320&q=80',
    'https://images.unsplash.com/photo-1476051508984-7485dbd8df95?w=320&q=80',
    'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=320&q=80'
  ],
  'english-teacher': [
    'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=320&q=80',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=320&q=80',
    'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=320&q=80'
  ],
  'history-teacher': [
    'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=320&q=80',
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=320&q=80',
    'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=320&q=80'
  ],
  'geography-teacher': [
    'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=320&q=80',
    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=320&q=80',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=320&q=80'
  ],
  'hindi-teacher': [
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=320&q=80',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=320&q=80',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=320&q=80'
  ],
  'doctor': [
    'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=320&q=80',
    'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=320&q=80',
    'https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?w=320&q=80'
  ],
  'engineer': [
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=320&q=80',
    'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=320&q=80',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=320&q=80'
  ],
  'lawyer': [
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=320&q=80',
    'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=320&q=80',
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=320&q=80'
  ],
  'accountancy-teacher': [
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=320&q=80',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=320&q=80',
    'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=320&q=80'
  ],
  'business-studies-teacher': [
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=320&q=80',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=320&q=80',
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=320&q=80'
  ],
  'economics-teacher': [
    'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=320&q=80',
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=320&q=80',
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=320&q=80'
  ]
}

const getThumbnailUrl = (avatarType, index) => {
  const list = THUMBNAIL_MAP[avatarType] || THUMBNAIL_MAP['computer-teacher']
  return list[index % list.length]
}

// Helper function to parse related content from AI response
export const parseRelatedContent = (contentText, type, avatarType = 'computer-teacher') => {
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
                thumbnailUrl: getThumbnailUrl(avatarType, items.length),
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
                  thumbnailUrl: getThumbnailUrl(avatarType, items.length + 10),
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

export const getSuggestionTopic = (avatarType, prompt = '', answer = '') => {
  const questionText = String(prompt || '').toLowerCase()
  const answerText = String(answer || '').toLowerCase()
  const hasKeyword = (text, keyword) => {
    const escaped = keyword.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    return new RegExp(`(^|\\W)${escaped}(\\W|$)`, 'i').test(text)
  }
  const topicMap = {
    'computer-teacher': [
      ['artificial intelligence', ['artificial intelligence', 'ai', 'machine learning']],
      ['javascript', ['javascript', ' js ', 'node']],
      ['css', ['css', 'style', 'stylesheet']],
      ['html', ['html', 'tag', 'web page']],
      ['react', ['react', 'component', 'jsx']],
      ['python', ['python']],
      ['java programming', ['java', 'oops']],
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
  const matched =
    matches.find(([, keywords]) => keywords.some((keyword) => hasKeyword(questionText, keyword))) ||
    matches.find(([, keywords]) => keywords.some((keyword) => hasKeyword(answerText, keyword)))
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

export const buildSearchUrl = (baseUrl, query) => `${baseUrl}${encodeURIComponent(query)}`

// Helper function to generate fallback articles
export const generateFallbackArticles = (avatarType, prompt = '', answer = '') => {
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

  const list = fallbackArticles[avatarType] || genericArticles
  return list.map((item, idx) => ({
    ...item,
    thumbnailUrl: item.thumbnailUrl || getThumbnailUrl(avatarType, idx)
  }))
}

// Helper function to generate fallback videos
export const generateFallbackVideos = (avatarType, prompt = '', answer = '') => {
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

  const list = fallbackVideos[avatarType] || genericVideos
  return list.map((item, idx) => {
    let thumb = item.thumbnailUrl
    if (!thumb && item.url && item.url.includes('youtube.com/watch')) {
      const match = item.url.match(/[?&]v=([^&#]+)/)
      if (match) {
        thumb = `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg`
      }
    }
    if (!thumb) {
      thumb = getThumbnailUrl(avatarType, idx + 10)
    }
    return {
      ...item,
      thumbnailUrl: thumb
    }
  })
}

// Helper function to get quota status information
export const getQuotaStatus = () => {
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
