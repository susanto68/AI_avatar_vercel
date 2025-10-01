export default function AvatarDisplay({ avatar, config, isSpeaking }) {
  return (
    <div className="text-center">
      <div className="relative inline-block">
        <div className={`relative p-3 rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border-2 transition-all duration-300 ${isSpeaking ? 'border-blue-400 scale-105 shadow-lg shadow-blue-500/50' : 'border-white/20'}`}>
          <img
            src={config.image}
            alt={config.name}
            className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full object-cover mx-auto border-3 shadow-xl transition-all duration-300 ${isSpeaking ? 'border-blue-400 animate-pulse' : 'border-white/40'}`}
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextElementSibling.style.display = 'block'
            }}
          />
          <div className={`text-5xl sm:text-6xl md:text-7xl ${isSpeaking ? 'animate-pulse' : ''}`} style={{display: 'none'}}>
            {config.emoji}
          </div>
          
          {/* Emoji Badge */}
          <div className={`absolute -bottom-1.5 -right-1.5 md:-bottom-2 md:-right-2 bg-white/95 backdrop-blur-sm rounded-full p-1.5 md:p-2 shadow-lg border-2 transition-all duration-300 ${isSpeaking ? 'border-blue-400 scale-110 animate-pulse' : 'border-white/50'}`}>
            <div className="text-lg md:text-xl">
              {config.emoji}
            </div>
          </div>
        </div>
        
        {/* Speaking indicator - More prominent */}
        {isSpeaking && (
          <>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full animate-ping"></div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full"></div>
          </>
        )}
      </div>
    </div>
  )
}
