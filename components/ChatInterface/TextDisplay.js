import { UI_TEXT, ERROR_MESSAGES, getTextDisplayWelcome } from '../../context/constant.js'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import ReactMarkdown to prevent hydration issues
const ReactMarkdown = dynamic(() => import('react-markdown'), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-gray-200 h-4 rounded"></div>
})

export default function TextDisplay({ text, isProcessing, avatarConfig, isListening, interimTranscript, noSpeechDetected }) {
  const [isClient, setIsClient] = useState(false)
  const [markdownError, setMarkdownError] = useState(false)
  
  const displayText = isListening && interimTranscript ? interimTranscript : text
  const isInterim = isListening && interimTranscript

  // Ensure client-side rendering to prevent hydration errors
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Handle markdown rendering errors gracefully
  const handleMarkdownError = (error) => {
    console.warn('Markdown rendering error:', error)
    setMarkdownError(true)
  }

  // Safe markdown rendering with error boundary
  const renderMarkdown = (content) => {
    if (!isClient || markdownError) {
      // Fallback to plain text if markdown fails or not on client
      return (
        <div className="prose prose-sm max-w-none text-center">
          <p className="whitespace-pre-wrap break-words overflow-wrap-anywhere text-gray-900 font-medium">{content}</p>
        </div>
      )
    }

    try {
      return (
        <div className="prose prose-sm max-w-none text-center">
          <ReactMarkdown 
            components={{
              // Customize markdown components for better mobile styling
              p: ({ children }) => <p className="mb-1.5 last:mb-0 whitespace-pre-wrap break-words overflow-wrap-anywhere text-gray-900 font-medium">{children}</p>,
              strong: ({ children }) => <strong className="font-bold text-gray-900 break-words overflow-wrap-anywhere">{children}</strong>,
              em: ({ children }) => <em className="italic text-gray-800 break-words overflow-wrap-anywhere">{children}</em>,
              code: ({ children, className }) => (
                <code className={`bg-gray-200 px-1.5 py-0.5 rounded text-xs sm:text-sm font-mono break-words overflow-wrap-anywhere text-gray-900 ${className || ''}`}>
                  {children}
                </code>
              ),
              pre: ({ children }) => (
                <pre className="bg-gray-200 p-2 rounded text-xs sm:text-sm font-mono overflow-x-auto break-words overflow-wrap-anywhere text-gray-900">
                  {children}
                </pre>
              ),
              ul: ({ children }) => <ul className="list-disc list-inside space-y-1 break-words overflow-wrap-anywhere text-gray-900">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 break-words overflow-wrap-anywhere text-gray-900">{children}</ol>,
              li: ({ children }) => <li className="text-left break-words overflow-wrap-anywhere text-gray-900">{children}</li>,
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-purple-400 pl-3 italic text-gray-800 break-words overflow-wrap-anywhere">
                  {children}
                </blockquote>
              ),
              h1: ({ children }) => <h1 className="text-lg sm:text-xl font-bold text-gray-900 mb-1.5 break-words overflow-wrap-anywhere">{children}</h1>,
              h2: ({ children }) => <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-1.5 break-words overflow-wrap-anywhere">{children}</h2>,
              h3: ({ children }) => <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 break-words overflow-wrap-anywhere">{children}</h3>,
              a: ({ href, children }) => (
                <a 
                  href={href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple-700 hover:text-purple-900 underline break-words overflow-wrap-anywhere font-medium"
                >
                  {children}
                </a>
              ),
            }}
            onError={handleMarkdownError}
          >
            {content}
          </ReactMarkdown>
        </div>
      )
    } catch (error) {
      handleMarkdownError(error)
      return (
        <div className="prose prose-sm max-w-none text-center">
          <p className="whitespace-pre-wrap break-words overflow-wrap-anywhere text-gray-900 font-medium">{content}</p>
        </div>
      )
    }
  }

  return (
    <div className="bg-white/95 backdrop-blur-md text-gray-900 rounded-xl p-4 sm:p-5 border-2 border-white/40 shadow-lg min-h-[100px] flex items-center justify-center">
      {isProcessing ? (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-purple-600 animate-pulse">
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-ping"></div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
            </svg>
            <span className="font-semibold text-sm sm:text-base">{UI_TEXT.STATUS.PROCESSING}</span>
          </div>
        </div>
      ) : noSpeechDetected ? (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-orange-600 mb-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" y1="19" x2="12" y2="23"/>
              <line x1="8" y1="23" x2="16" y2="23"/>
            </svg>
            <span className="font-semibold text-sm sm:text-base">{UI_TEXT.STATUS.NO_SPEECH}</span>
          </div>
          <p className="text-gray-600 text-xs sm:text-sm">
            {ERROR_MESSAGES.SPEECH.NO_SPEECH}
          </p>
        </div>
      ) : displayText ? (
        <div className="w-full">
          {/* Interim transcript indicator */}
          {isInterim && (
            <div className="flex items-center justify-center gap-2 mb-2 text-green-600 text-xs sm:text-sm font-medium">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>{UI_TEXT.STATUS.LISTENING}</span>
            </div>
          )}
          
          {/* Content rendering with proper hydration handling */}
          <div className={`text-sm sm:text-base leading-relaxed text-center ${isInterim ? 'text-gray-600 italic' : 'text-gray-900 font-medium'}`}>
            {isInterim ? (
              <p className="whitespace-pre-wrap break-words overflow-wrap-anywhere">
                {displayText}
                <span className="inline-block w-1 h-4 bg-green-500 ml-1 animate-pulse"></span>
              </p>
            ) : (
              renderMarkdown(displayText)
            )}
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500">
          <p className="text-sm sm:text-base">
            {getTextDisplayWelcome(avatarConfig?.domain)}
          </p>
        </div>
      )}
    </div>
  )
}
