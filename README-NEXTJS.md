# AI Avatar Assistant - Next.js Version

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Environment Variables
Create a `.env.local` file in the root directory:
```bash
# Gemini AI API Key - Get yours from: https://ai.google.dev/
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Environment setting
NODE_ENV=development
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm start
```

## 🌟 Features

- ✅ **Next.js Full-Stack App** - Frontend and backend combined
- ✅ **12 AI Avatar Teachers** - Different subjects and specialties
- ✅ **Voice Recognition** - Web Speech API integration
- ✅ **Text-to-Speech** - Natural voice responses
- ✅ **Tailwind CSS** - Modern, responsive design
- ✅ **Chat Bubble UI** - Beautiful conversation interface
- ✅ **Dark/Light Mode** - Theme switching
- ✅ **Copy to Clipboard** - Easy sharing of responses
- ✅ **Mobile-First** - Optimized for all devices
- ✅ **Vercel Ready** - Perfect for deployment

## 🎭 Available Avatars

1. **Computer Teacher** - Programming & Technology
2. **English Teacher** - Language & Literature
3. **Biology Teacher** - Life Sciences
4. **Physics Teacher** - Physical Sciences
5. **Chemistry Teacher** - Chemical Sciences
6. **History Teacher** - History & Culture
7. **Geography Teacher** - Earth & Environment
8. **Hindi Teacher** - Hindi Language
9. **Mathematics Teacher** - Math & Logic
10. **Doctor** - Health & Medicine
11. **Engineer** - Engineering & Design
12. **Lawyer** - Legal & Law

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini AI API key | Yes |
| `NODE_ENV` | Environment mode | No |

## 📦 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add `GEMINI_API_KEY` in Vercel environment variables
4. Deploy automatically

### Other Platforms
The app works on any platform that supports Node.js 18+ and Next.js:
- Netlify
- Railway
- Render
- Heroku

## 🎨 Customization

- **Avatars**: Replace images in `/public/assets/avatars/`
- **Styling**: Modify Tailwind classes in components
- **Prompts**: Update avatar configurations in `/pages/index.js`
- **API**: Extend `/pages/api/chat.js` for new features

## 🤖 AI Integration

Uses Google Gemini AI with fallback to mock responses. The system:
- Validates user input for safety
- Checks domain relevance for each avatar
- Provides educational, positive responses
- Maintains conversation context

## 📱 Mobile Features

- Touch-friendly interface
- Haptic feedback (where supported)
- Offline notifications
- Responsive design
- Voice controls optimized for mobile

## 🔊 Voice Features

- **Speech Recognition**: Multiple languages supported
- **Text-to-Speech**: Natural voice synthesis
- **Language Support**: English and Hindi
- **Voice Selection**: Male voices preferred for consistency

## 🛠️ Technical Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS 3
- **AI**: Google Gemini AI
- **Speech**: Web Speech API
- **Deployment**: Vercel
- **Languages**: JavaScript, React

## 📄 License

MIT License - Created by Susanto Ganguly (Sir Ganguly)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support, email your questions or create an issue in the GitHub repository.

---

**Created with ❤️ by Susanto Ganguly (Sir Ganguly)**