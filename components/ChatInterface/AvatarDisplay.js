import { useState, useEffect } from 'react'

export default function AvatarDisplay({ avatar, config, isSpeaking }) {
  const [isBlinking, setIsBlinking] = useState(false)
  const [imgError, setImgError] = useState(false)

  // Autonomous eye blinking every 3-6 seconds
  useEffect(() => {
    const scheduleBlink = () => {
      const delay = 3000 + Math.random() * 3000 // 3-6 seconds
      return setTimeout(() => {
        setIsBlinking(true)
        setTimeout(() => setIsBlinking(false), 180) // blink duration ~180ms
      }, delay)
    }

    let timeoutId = scheduleBlink()
    const interval = setInterval(() => {
      clearTimeout(timeoutId)
      timeoutId = scheduleBlink()
    }, 6000)

    return () => {
      clearTimeout(timeoutId)
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="text-center select-none">
      <div className="relative inline-block">
        {/* Outer glow ring — pulses when speaking */}
        <div
          className={`absolute inset-0 rounded-full transition-all duration-500 pointer-events-none ${
            isSpeaking
              ? 'shadow-[0_0_0_4px_rgba(96,165,250,0.5),0_0_32px_8px_rgba(96,165,250,0.35)]'
              : 'shadow-[0_0_0_2px_rgba(255,255,255,0.1)]'
          }`}
        />

        {/* Avatar container with breathing / speaking animation */}
        <div
          className={`relative p-3 rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border-2 transition-all duration-300 ${
            isSpeaking
              ? 'border-blue-400 avatar-speaking'
              : 'border-white/20 avatar-breathing'
          }`}
        >
          {/* Avatar image — blink effect via scaleY on the img wrapper */}
          <div
            className={`relative transition-transform duration-100 ${
              isSpeaking ? 'avatar-idle' : ''
            }`}
          >
            {/* Eye blink overlay — covers just the eyes area at top of circle */}
            {isBlinking && (
              <div
                className="absolute top-0 left-0 right-0 z-10 rounded-t-full bg-current"
                style={{
                  height: '38%',
                  mixBlendMode: 'overlay',
                  opacity: 0.18,
                  pointerEvents: 'none',
                  borderRadius: '50% 50% 0 0'
                }}
              />
            )}

            {imgError ? (
              <div
                className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-800 to-purple-800 border-3 shadow-xl transition-all duration-300 text-5xl sm:text-6xl md:text-7xl ${
                  isSpeaking ? 'border-blue-400' : 'border-white/40'
                }`}
              >
                {config.emoji}
              </div>
            ) : (
              <img
                src={config.image}
                alt={config.name}
                className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full object-cover mx-auto border-3 shadow-xl transition-all duration-300 ${
                  isSpeaking ? 'border-blue-400' : 'border-white/40'
                }`}
                onError={() => setImgError(true)}
              />
            )}
          </div>

          {/* Mouth animation bar — visible and moving when speaking */}
          <div className="mt-1.5 flex justify-center">
            <div
              className={`flex items-end gap-0.5 transition-all duration-200 ${
                isSpeaking ? 'opacity-100' : 'opacity-0'
              }`}
              aria-hidden="true"
            >
              {[1, 2, 3, 2, 1].map((h, i) => (
                <div
                  key={i}
                  className="bg-blue-400 rounded-full w-1"
                  style={{
                    height: isSpeaking ? `${h * 4 + 2}px` : '4px',
                    animation: isSpeaking
                      ? `mouthMove ${0.25 + i * 0.07}s ease-in-out infinite alternate`
                      : 'none',
                    transition: 'height 0.15s ease'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Emoji Badge */}
          <div
            className={`absolute -bottom-1.5 -right-1.5 md:-bottom-2 md:-right-2 bg-white/95 backdrop-blur-sm rounded-full p-1.5 md:p-2 shadow-lg border-2 transition-all duration-300 ${
              isSpeaking ? 'border-blue-400 scale-110' : 'border-white/50'
            }`}
          >
            <div className="text-lg md:text-xl">{config.emoji}</div>
          </div>
        </div>

        {/* Speaking indicator dot */}
        {isSpeaking && (
          <>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full animate-ping opacity-75" />
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full" />
          </>
        )}
      </div>

      {/* Avatar name tag */}
      <div className="mt-2">
        <span
          className={`text-xs font-semibold px-3 py-0.5 rounded-full transition-all duration-300 ${
            isSpeaking
              ? 'bg-blue-500/40 text-blue-100 border border-blue-400/50'
              : 'bg-white/10 text-white/70 border border-white/20'
          }`}
        >
          {isSpeaking ? '🔊 Speaking...' : config.name}
        </span>
      </div>
    </div>
  )
}
