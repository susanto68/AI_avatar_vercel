export default function TextDisplay({ text, isProcessing, avatarConfig, isListening, interimTranscript, noSpeechDetected }) {
  const displayText = isListening && interimTranscript ? interimTranscript : text
  const isInterim = isListening && interimTranscript

  return (
    <div className="bg-white/90 backdrop-blur-md text-gray-800 rounded-2xl p-6 border border-white/30 shadow-lg min-h-[120px] flex items-center justify-center">
      {isProcessing ? (
        <div className="text-center">
          <div className="inline-flex items-center gap-3 text-purple-600 animate-pulse">
            <div className="w-4 h-4 bg-purple-500 rounded-full animate-ping"></div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
            </svg>
            <span className="font-semibold">Processing your question...</span>
          </div>
        </div>
      ) : noSpeechDetected ? (
        <div className="text-center">
          <div className="inline-flex items-center gap-3 text-orange-600 mb-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" y1="19" x2="12" y2="23"/>
              <line x1="8" y1="23" x2="16" y2="23"/>
            </svg>
            <span className="font-semibold">No speech detected</span>
          </div>
          <p className="text-gray-600 text-sm">
            I didn't hear anything. Please try speaking again, or check if your microphone is working properly.
          </p>
        </div>
      ) : displayText ? (
        <div className="w-full">
          {/* Interim transcript indicator */}
          {isInterim && (
            <div className="flex items-center justify-center gap-2 mb-3 text-green-600 text-sm font-medium">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Listening...</span>
            </div>
          )}
          
          <p className={`text-base leading-relaxed whitespace-pre-wrap text-center ${isInterim ? 'text-gray-600 italic' : ''}`}>
            {displayText}
            {isInterim && (
              <span className="inline-block w-1 h-4 bg-green-500 ml-1 animate-pulse"></span>
            )}
          </p>
        </div>
      ) : (
        <div className="text-center text-gray-500">
          <p className="text-base">
            👋 Welcome! I'm ready to help you learn.<br/>
            Tap the <strong>Talk</strong> button to ask me anything about {avatarConfig?.domain.toLowerCase()}!
          </p>
        </div>
      )}
    </div>
  )
}
