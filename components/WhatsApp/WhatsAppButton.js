import { useState, useEffect } from 'react'

export default function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Phone numbers
  const phoneNumbers = [
    { number: '7004043422', label: 'Primary', countryCode: '+91' },
    { number: '9835379900', label: 'Secondary', countryCode: '+91' }
  ]

  // Check if mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Show button after page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 2000) // Show after 2 seconds

    return () => clearTimeout(timer)
  }, [])

  // Generate WhatsApp URL
  const getWhatsAppURL = (phoneNumber) => {
    const message = encodeURIComponent(
      `Hi! I'm interested in your AI Avatar Assistant. Can you help me with more information?`
    )
    // Add country code if not present
    const fullNumber = phoneNumber.startsWith('91') ? phoneNumber : `91${phoneNumber}`
    return `https://wa.me/${fullNumber}?text=${message}`
  }

  // Handle WhatsApp click
  const handleWhatsAppClick = (phoneNumber) => {
    const url = getWhatsAppURL(phoneNumber)
    window.open(url, '_blank', 'noopener,noreferrer')
    setIsExpanded(false)
  }

  // Handle main button click
  const handleMainClick = () => {
    if (phoneNumbers.length === 1) {
      // If only one number, directly open WhatsApp
      handleWhatsAppClick(phoneNumbers[0].number)
    } else {
      // If multiple numbers, toggle expansion
      setIsExpanded(!isExpanded)
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed top-4 right-4 z-50">
      {/* Main WhatsApp Button */}
      <div className="relative">
        <button
          onClick={handleMainClick}
          className={`
            group relative flex items-center justify-center
            w-12 h-12 sm:w-14 sm:h-14
            bg-gradient-to-r from-green-500 to-green-600
            hover:from-green-600 hover:to-green-700
            rounded-full shadow-lg hover:shadow-xl
            transition-all duration-300 ease-in-out
            transform hover:scale-110 active:scale-95
            ${isExpanded ? 'rotate-45' : 'rotate-0'}
          `}
          aria-label="Contact via WhatsApp"
        >
          {/* WhatsApp Icon */}
          <svg
            className="w-6 h-6 sm:w-7 sm:h-7 text-white transition-transform duration-300"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
          </svg>

          {/* Pulse Animation */}
          <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20"></div>
          
          {/* Notification Badge */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-bounce">
            !
          </div>
        </button>

        {/* Expanded Menu for Multiple Numbers */}
        {isExpanded && phoneNumbers.length > 1 && (
          <div className="absolute right-16 top-0 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[200px] animate-in slide-in-from-right duration-300">
            <div className="px-3 py-2 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-800">Choose Number</p>
            </div>
            {phoneNumbers.map((phone, index) => (
              <button
                key={index}
                onClick={() => handleWhatsAppClick(phone.number)}
                className="w-full px-3 py-2 text-left hover:bg-green-50 transition-colors duration-200 flex items-center gap-3"
              >
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{phone.label}</p>
                  <p className="text-xs text-gray-600">{phone.countryCode} {phone.number}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Tooltip */}
        <div className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
          Chat with us on WhatsApp
          <div className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
        </div>
      </div>

      {/* Close overlay when clicking outside */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsExpanded(false)}
        ></div>
      )}
    </div>
  )
}
