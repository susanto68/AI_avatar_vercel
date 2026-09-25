import { useState, useEffect } from 'react'

// Phone numbers - WhatsApp format: country code + number (no spaces or special characters)
const PHONE_NUMBERS = [
  { number: '917004043422', label: 'Primary', countryCode: '+91', displayNumber: '7004043422' },
  { number: '919835379900', label: 'Secondary', countryCode: '+91', displayNumber: '9835379900' }
]

const PREFILLED_MESSAGE = 'Hi Sir Ganguly! I am a student using your AI Avatar teacher. I have a question - can you help me?'

const WIGGLE_EVERY_MS = 7000
const WIGGLE_DURATION_MS = 900
const BUBBLE_SHOW_AFTER_MS = 1200
const BUBBLE_HIDE_AFTER_MS = 7000

const getWhatsAppURL = (phoneNumber) =>
  `https://wa.me/${phoneNumber.replace(/[^\d]/g, '')}?text=${encodeURIComponent(PREFILLED_MESSAGE)}`

function WhatsAppIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
    </svg>
  )
}

export default function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isWiggling, setIsWiggling] = useState(false)
  const [showBubble, setShowBubble] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  // Brief wiggle every few seconds rather than a constant loop - catches the
  // eye without being distracting while a student is reading an answer.
  useEffect(() => {
    if (!isVisible) return undefined
    let stopTimer
    const interval = setInterval(() => {
      setIsWiggling(true)
      stopTimer = setTimeout(() => setIsWiggling(false), WIGGLE_DURATION_MS)
    }, WIGGLE_EVERY_MS)
    return () => { clearInterval(interval); clearTimeout(stopTimer) }
  }, [isVisible])

  // Invitation bubble appears on its own once, then only on hover - a
  // hover-only label never gets seen by someone who hasn't noticed the button.
  useEffect(() => {
    if (!isVisible) return undefined
    const showTimer = setTimeout(() => setShowBubble(true), BUBBLE_SHOW_AFTER_MS)
    const hideTimer = setTimeout(() => setShowBubble(false), BUBBLE_HIDE_AFTER_MS)
    return () => { clearTimeout(showTimer); clearTimeout(hideTimer) }
  }, [isVisible])

  if (!isVisible) return null

  const handleMainClick = () => {
    setShowBubble(false)
    if (PHONE_NUMBERS.length === 1) {
      window.open(getWhatsAppURL(PHONE_NUMBERS[0].number), '_blank', 'noopener,noreferrer')
    } else {
      setIsExpanded((open) => !open)
    }
  }

  return (
    // Bottom-right: the universal chat-widget spot, and the only corner clear
    // of other fixed UI (visitor counter + floating pet sit top-left, and page
    // headers/avatar titles are right-aligned along the top).
    <div className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-50">
      <div className="relative">
        <button
          onClick={handleMainClick}
          className={`
            group relative flex items-center justify-center
            w-14 h-14 sm:w-16 sm:h-16
            bg-gradient-to-br from-green-400 to-green-600
            hover:from-green-500 hover:to-green-700
            rounded-full shadow-lg shadow-green-900/40 hover:shadow-xl
            ring-4 ring-white/20
            transition-all duration-300 ease-in-out
            hover:scale-110 active:scale-95
          `}
          aria-label="Chat with Sir Ganguly on WhatsApp"
          aria-expanded={PHONE_NUMBERS.length > 1 ? isExpanded : undefined}
        >
          <WhatsAppIcon className={`w-7 h-7 sm:w-8 sm:h-8 text-white ${isWiggling ? 'whatsapp-wiggle' : ''}`} />

          {/* Pulse ring */}
          <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-25 pointer-events-none" />

          {/* Notification badge */}
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-bounce border-2 border-white pointer-events-none">
            1
          </span>

          {/* Invitation bubble: auto-shown once, then on hover */}
          {!isExpanded && (
            <span
              className={`
                absolute right-full mr-3 top-1/2 -translate-y-1/2
                bg-white text-gray-900 text-xs sm:text-sm font-semibold
                px-3 py-2 rounded-xl shadow-xl whitespace-nowrap pointer-events-none
                transition-opacity duration-300
                ${showBubble ? 'opacity-100 whatsapp-bubble-in' : 'opacity-0 group-hover:opacity-100'}
              `}
            >
              💬 Ask Sir Ganguly on WhatsApp
              <span className="absolute -right-1 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rotate-45" />
            </span>
          )}
        </button>

        {/* Number chooser - opens upward/left since the button sits in the bottom corner */}
        {isExpanded && PHONE_NUMBERS.length > 1 && (
          <div className="absolute bottom-full right-0 mb-3 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 min-w-[250px] z-50 whatsapp-bubble-in">
            <div className="px-3 py-2 border-b border-gray-100">
              <p className="text-sm font-bold text-gray-900">Contact Sir Ganguly</p>
              <p className="text-xs text-gray-500">Choose a number to chat on WhatsApp</p>
            </div>
            {PHONE_NUMBERS.map((phone) => (
              <a
                key={phone.number}
                href={getWhatsAppURL(phone.number)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-3 py-2 text-left hover:bg-green-50 transition-colors duration-200 flex items-center gap-3"
                onClick={() => setIsExpanded(false)}
              >
                <span className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                  <WhatsAppIcon className="w-4 h-4 text-white" />
                </span>
                <span>
                  <span className="block text-sm font-medium text-gray-900">{phone.label}</span>
                  <span className="block text-xs text-gray-600">{phone.countryCode} {phone.displayNumber}</span>
                </span>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Close the chooser when clicking outside it */}
      {isExpanded && (
        <div className="fixed inset-0 z-40" onClick={() => setIsExpanded(false)} />
      )}
    </div>
  )
}
