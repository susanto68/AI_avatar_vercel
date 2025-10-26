# Vercel Deployment Guide for AI Avatar Assistant

## 🚀 Quick Deployment Steps

### 1. GitHub Repository Setup
✅ **Already Complete**: Your code is now pushed to [susanto68/AI_avatar_vercel](https://github.com/susanto68/AI_avatar_vercel)

### 2. Vercel Project Setup

#### Option A: Connect Existing Repository
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import from GitHub: `susanto68/AI_avatar_vercel`
4. Configure project settings

#### Option B: Deploy via Vercel CLI
```bash
npm i -g vercel
vercel login
vercel --prod
```

### 3. Environment Variables Configuration

**CRITICAL**: Set these environment variables in Vercel dashboard:

#### Required Environment Variables:
```bash
# Google Gemini API Key (Primary)
GEMINI_API_KEY=your_gemini_api_key_here

# OpenAI API Key (Fallback)
OPENAI_API_KEY=your_openai_api_key_here
```

#### How to Set Environment Variables in Vercel:
1. Go to your project dashboard
2. Click "Settings" tab
3. Click "Environment Variables"
4. Add each variable:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: Your actual Gemini API key
   - **Environment**: Production, Preview, Development
5. Repeat for `OPENAI_API_KEY`

### 4. API Keys Setup

#### Get Gemini API Key:
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the generated key

#### Get OpenAI API Key:
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in to your account
3. Click "Create new secret key"
4. Copy the generated key

## 🔧 Vercel Configuration

### Current Configuration (vercel.json):
```json
{
  "version": 2,
  "functions": {
    "pages/api/*.js": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ],
  "buildCommand": "npm run build",
  "outputDirectory": ".next"
}
```

## 🎯 New Features Deployed

### ✅ Text Input Box with Voice Capability
- Real-time voice transcription
- Visual feedback during voice input
- Review and edit before submission

### ✅ Dual API Integration
- **Primary**: Google Gemini API
- **Fallback**: OpenAI ChatGPT API
- Intelligent error handling and switching

### ✅ Enhanced User Experience
- Voice input displays in text box
- Visual indicators for all states
- Improved mobile responsiveness

## 🔍 Testing After Deployment

### 1. Basic Functionality Test
1. Visit your Vercel URL
2. Select an avatar (e.g., Computer Teacher)
3. Test text input: Type a question
4. Test voice input: Click microphone and speak
5. Verify response from AI

### 2. API Integration Test
1. Ask a question via text input
2. Check browser console for API logs
3. Verify response includes `apiUsed` field
4. Test fallback by temporarily disabling one API key

### 3. Voice Input Test
1. Click microphone button
2. Speak clearly: "What is JavaScript?"
3. Verify text appears in input box
4. Click "Send Question" to submit
5. Check AI response and speech synthesis

## 🐛 Troubleshooting

### Common Deployment Issues:

#### 1. Environment Variables Not Set
**Error**: "AI service configuration error - API keys missing"
**Solution**: 
- Check Vercel dashboard environment variables
- Ensure both `GEMINI_API_KEY` and `OPENAI_API_KEY` are set
- Redeploy after adding variables

#### 2. Build Failures
**Error**: Build process fails
**Solution**:
```bash
# Test build locally first
npm run build

# Check for TypeScript errors
npm run lint
```

#### 3. API Timeout Issues
**Error**: "Request timeout"
**Solution**:
- Current timeout is 30 seconds (configured in vercel.json)
- Check API key validity
- Verify network connectivity

#### 4. Speech Recognition Not Working
**Error**: Microphone access issues
**Solution**:
- Ensure HTTPS deployment (Vercel provides this automatically)
- Check browser permissions
- Test on different browsers

## 📊 Monitoring and Analytics

### Vercel Analytics
1. Enable Vercel Analytics in dashboard
2. Monitor page views and performance
3. Track API response times

### API Usage Monitoring
- Monitor Gemini API usage in Google AI Studio
- Monitor OpenAI API usage in OpenAI dashboard
- Set up usage alerts if needed

## 🔄 Continuous Deployment

### Automatic Deployments
- ✅ Connected to GitHub repository
- ✅ Auto-deploys on push to main branch
- ✅ Preview deployments for pull requests

### Manual Deployment
```bash
# Deploy specific branch
vercel --prod

# Deploy with specific environment
vercel --env production
```

## 🎉 Success Indicators

### ✅ Deployment Successful When:
1. Vercel build completes without errors
2. Environment variables are properly set
3. API endpoints respond correctly
4. Voice input works on HTTPS
5. Both text and voice input function properly
6. AI responses are generated successfully

### 🔗 Your Live Application
Once deployed, your application will be available at:
- **Production**: `https://ai-avatar-vercel.vercel.app`
- **Custom Domain**: (if configured)

## 📝 Post-Deployment Checklist

- [ ] Environment variables set in Vercel
- [ ] Build completed successfully
- [ ] Text input functionality working
- [ ] Voice input functionality working
- [ ] AI responses generating correctly
- [ ] Mobile responsiveness verified
- [ ] HTTPS working for speech recognition
- [ ] Error handling working properly

---

**Created by Sir Ganguly**  
_AI Avatar Assistant v2.0.0 - Enhanced with Dual API Integration_

## 🆘 Support

If you encounter any issues:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test API keys independently
4. Check browser console for errors
5. Review this troubleshooting guide

**GitHub Repository**: [susanto68/AI_avatar_vercel](https://github.com/susanto68/AI_avatar_vercel)  
**Live Application**: [ai-avatar-vercel.vercel.app](https://ai-avatar-vercel.vercel.app)
