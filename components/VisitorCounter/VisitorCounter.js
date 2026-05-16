import { useEffect, useState } from 'react'

const DEFAULT_GLOBAL_COUNT = 503
const DEFAULT_INDIA_COUNT = 2129
const HEARTBEAT_INTERVAL_MS = 30000

const safeNumber = (value, fallback) => {
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback
}

export default function VisitorCounter() {
  const [counts, setCounts] = useState({
    global: DEFAULT_GLOBAL_COUNT + DEFAULT_INDIA_COUNT,
    india: DEFAULT_INDIA_COUNT,
    active: 1
  })

  const totalVisitors = Math.max(counts.global, counts.india, counts.active)

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const readStoredCounts = () => {
      setCounts((current) => ({
        ...current,
        global: safeNumber(localStorage.getItem('totalCount'), safeNumber(localStorage.getItem('globalCount'), DEFAULT_GLOBAL_COUNT) + safeNumber(localStorage.getItem('indiaCount'), DEFAULT_INDIA_COUNT)),
        india: safeNumber(localStorage.getItem('indiaCount'), DEFAULT_INDIA_COUNT)
      }))
    }

    readStoredCounts()

    const sessionKey = 'visitorSessionId'
    let visitorSessionId = sessionStorage.getItem(sessionKey)
    if (!visitorSessionId) {
      visitorSessionId = `visitor-${Date.now()}-${Math.random().toString(36).slice(2)}`
      sessionStorage.setItem(sessionKey, visitorSessionId)
    }

    const sendHeartbeat = async () => {
      readStoredCounts()

      try {
        const response = await fetch('/api/visitor-counter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mode: 'heartbeat',
            visitorSessionId
          })
        })

        const data = await response.json()
        if (data?.success) {
          const nextTotal = safeNumber(data.totalCount, DEFAULT_GLOBAL_COUNT + DEFAULT_INDIA_COUNT)
          const nextIndia = safeNumber(data.indiaCount, DEFAULT_INDIA_COUNT)
          localStorage.setItem('totalCount', String(nextTotal))
          localStorage.setItem('indiaCount', String(nextIndia))

          setCounts((current) => ({
            ...current,
            global: safeNumber(data.totalCount, safeNumber(data.globalCount, current.global) + safeNumber(data.indiaCount, current.india)),
            india: nextIndia,
            active: safeNumber(data.activeCount, current.active)
          }))
        }
      } catch (error) {
        console.warn('Visitor heartbeat failed:', error)
      }
    }

    sendHeartbeat()
    const intervalId = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL_MS)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <div id="visitor-counters" aria-label="Visitor statistics">
      <div className="visitor total">
        <b>Visitors:</b> <span id="total-count" data-count={totalVisitors}>{totalVisitors}</span>
      </div>
      <div className="visitor active-now">
        <b>Active now:</b> <span id="active-count">{counts.active}</span>
      </div>
      <div className="visitor india">
        <b>India:</b> <span id="india-count" data-count={counts.india}>{counts.india}</span>
      </div>
    </div>
  )
}
