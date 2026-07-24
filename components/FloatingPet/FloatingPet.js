import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

const petMoods = [
  { emotion: 'happy', message: 'Namaste, ready to learn?' },
  { emotion: 'thinking', message: 'Ask your AI teacher.' },
  { emotion: 'focused', message: 'I am listening.' },
  { emotion: 'excited', message: 'Great question!' }
]

export default function FloatingPet() {
  const [isOpen, setIsOpen] = useState(false)
  const [messageIndex, setMessageIndex] = useState(0)
  const [position, setPosition] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [direction, setDirection] = useState('idle')
  const [emotion, setEmotion] = useState(petMoods[0].emotion)
  const dragRef = useRef({
    pointerId: null,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
    moved: false,
    lastDirection: 'idle'
  })
  const emotionTimeoutRef = useRef(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setMessageIndex((index) => {
        const nextIndex = (index + 1) % petMoods.length
        setEmotion(petMoods[nextIndex].emotion)
        return nextIndex
      })
    }, 7000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    return () => {
      if (emotionTimeoutRef.current) {
        window.clearTimeout(emotionTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const placeBelowVisitorCounter = () => {
      setPosition((current) => {
        const width = window.innerWidth <= 768 ? 148 : 176
        const height = window.innerWidth <= 768 ? 176 : 196
        const padding = window.innerWidth <= 768 ? 8 : 14
        const defaultX = window.innerWidth <= 768 ? 10 : 14
        const defaultY = window.innerWidth <= 768 ? 84 : 104

        if (current) {
          return {
            x: Math.min(Math.max(padding, current.x), window.innerWidth - width - padding),
            y: Math.min(Math.max(padding, current.y), window.innerHeight - height - padding)
          }
        }

        return {
          x: defaultX,
          y: defaultY
        }
      })
    }

    placeBelowVisitorCounter()
    window.addEventListener('resize', placeBelowVisitorCounter)
    return () => window.removeEventListener('resize', placeBelowVisitorCounter)
  }, [])

  const message = useMemo(() => petMoods[messageIndex].message, [messageIndex])
  const petClassName = [
    'floating-pet',
    isOpen ? 'floating-pet-open' : '',
    isDragging ? 'floating-pet-dragging' : '',
    `floating-pet-emotion-${emotion}`,
    `floating-pet-direction-${direction}`
  ].filter(Boolean).join(' ')

  const setTemporaryEmotion = useCallback((nextEmotion, duration = 900) => {
    if (emotionTimeoutRef.current) {
      window.clearTimeout(emotionTimeoutRef.current)
    }

    setEmotion(nextEmotion)
    emotionTimeoutRef.current = window.setTimeout(() => {
      setEmotion(petMoods[messageIndex].emotion)
    }, duration)
  }, [messageIndex])

  const clampPosition = useCallback((x, y) => {
    const width = window.innerWidth <= 768 ? 148 : 176
    const height = window.innerWidth <= 768 ? 176 : 196
    const padding = window.innerWidth <= 768 ? 6 : 10

    return {
      x: Math.min(Math.max(padding, x), window.innerWidth - width - padding),
      y: Math.min(Math.max(padding, y), window.innerHeight - height - padding)
    }
  }, [])

  const handlePointerDown = (event) => {
    if (!position) return

    event.currentTarget.setPointerCapture?.(event.pointerId)
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: position.x,
      originY: position.y,
      moved: false,
      lastDirection: 'idle'
    }
    setIsDragging(true)
    setDirection('idle')
    setEmotion('focused')
  }

  const handlePointerMove = useCallback((event) => {
    if (dragRef.current.pointerId !== event.pointerId) return
    event.preventDefault?.()

    const deltaX = event.clientX - dragRef.current.startX
    const deltaY = event.clientY - dragRef.current.startY
    const distance = Math.hypot(deltaX, deltaY)

    if (distance > 3) {
      dragRef.current.moved = true
    }

    if (distance > 18) {
      const nextDirection = Math.abs(deltaX) > Math.abs(deltaY)
        ? (deltaX > 0 ? 'right' : 'left')
        : (deltaY > 0 ? 'down' : 'up')

      if (dragRef.current.lastDirection !== nextDirection) {
        dragRef.current.lastDirection = nextDirection
        setDirection(nextDirection)
      }
    }

    setPosition(clampPosition(
      dragRef.current.originX + deltaX,
      dragRef.current.originY + deltaY
    ))
  }, [clampPosition])

  const handlePointerUp = useCallback((event) => {
    if (dragRef.current.pointerId !== event.pointerId) return

    event.currentTarget.releasePointerCapture?.(event.pointerId)
    const wasDragged = dragRef.current.moved
    dragRef.current.pointerId = null
    setIsDragging(false)

    if (!wasDragged) {
      setIsOpen((open) => !open)
      setTemporaryEmotion('surprised', 850)
    } else {
      setTemporaryEmotion('happy', 700)
    }

    window.setTimeout(() => setDirection('idle'), 500)
  }, [setTemporaryEmotion])

  useEffect(() => {
    if (!isDragging) return undefined

    window.addEventListener('pointermove', handlePointerMove, { passive: false })
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointercancel', handlePointerUp)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointercancel', handlePointerUp)
    }
  }, [handlePointerMove, handlePointerUp, isDragging])

  return (
    <div
      className={petClassName}
      style={position
        ? { position: 'fixed', left: position.x, top: position.y, right: 'auto', bottom: 'auto' }
        : { position: 'fixed', left: 14, top: 104 }
      }
    >
      <div className="floating-pet-bubble" role="status" aria-live="polite">
        {message}
      </div>

      <button
        type="button"
        className="floating-pet-button"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerEnter={() => setTemporaryEmotion('happy', 1100)}
        onFocus={() => setTemporaryEmotion('happy', 1100)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            setIsOpen((open) => !open)
            setTemporaryEmotion('surprised', 850)
          }
        }}
        aria-label="Toggle Sir Ganguly cartoon companion"
      >
        <span className="teacher-pet-glow" aria-hidden="true" />
        <span className="teacher-pet-shadow" aria-hidden="true" />
        <span className="teacher-pet-action-ring" aria-hidden="true" />
        <span className="teacher-pet" aria-hidden="true">
          <span className="teacher-pet-neck" />
          <span className="teacher-pet-shirt">
            <span className="teacher-pet-collar teacher-pet-collar-left" />
            <span className="teacher-pet-collar teacher-pet-collar-right" />
            <span className="teacher-pet-placket" />
          </span>
          <span className="teacher-pet-head">
            <span className="teacher-pet-ear teacher-pet-ear-left" />
            <span className="teacher-pet-ear teacher-pet-ear-right" />
            <span className="teacher-pet-hair" />
            <span className="teacher-pet-hair-sweep" />
            <span className="teacher-pet-brow teacher-pet-brow-left" />
            <span className="teacher-pet-brow teacher-pet-brow-right" />
            <span className="teacher-pet-glasses">
              <span className="teacher-pet-lens teacher-pet-lens-left" />
              <span className="teacher-pet-bridge" />
              <span className="teacher-pet-lens teacher-pet-lens-right" />
            </span>
            <span className="teacher-pet-eye teacher-pet-eye-left">
              <span className="teacher-pet-pupil" />
            </span>
            <span className="teacher-pet-eye teacher-pet-eye-right">
              <span className="teacher-pet-pupil" />
            </span>
            <span className="teacher-pet-nose" />
            <span className="teacher-pet-cheek teacher-pet-cheek-left" />
            <span className="teacher-pet-cheek teacher-pet-cheek-right" />
            <span className="teacher-pet-moustache" />
            <span className="teacher-pet-smile" />
            <span className="teacher-pet-mouth-open" />
          </span>
          <span className="teacher-pet-arm teacher-pet-arm-left">
            <span className="teacher-pet-hand" />
          </span>
          <span className="teacher-pet-arm teacher-pet-arm-right">
            <span className="teacher-pet-hand" />
          </span>
          <span className="teacher-pet-leg teacher-pet-leg-left">
            <span className="teacher-pet-shoe" />
          </span>
          <span className="teacher-pet-leg teacher-pet-leg-right">
            <span className="teacher-pet-shoe" />
          </span>
          <span className="teacher-pet-spark teacher-pet-spark-one" />
          <span className="teacher-pet-spark teacher-pet-spark-two" />
        </span>
      </button>
    </div>
  )
}
