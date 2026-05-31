import { useEffect, useState } from 'react'

const DEFAULT_GLOBAL_COUNT = 503
const DEFAULT_INDIA_COUNT = 2129
const HEARTBEAT_INTERVAL_MS = 30000
const SESSION_KEY = 'visitorSessionId'
const SESSION_COUNTED_KEY = 'visitorSessionCounted'

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

    let visitorSessionId = sessionStorage.getItem(SESSION_KEY)
    if (!visitorSessionId) {
      visitorSessionId = `visitor-${Date.now()}-${Math.random().toString(36).slice(2)}`
      sessionStorage.setItem(SESSION_KEY, visitorSessionId)
      sessionStorage.removeItem(SESSION_COUNTED_KEY)
    }

    const updateCountsFromResponse = (data) => {
      const nextTotal = safeNumber(data.totalCount, DEFAULT_GLOBAL_COUNT + DEFAULT_INDIA_COUNT)
      const nextGlobal = safeNumber(data.globalCount, Math.max(DEFAULT_GLOBAL_COUNT, nextTotal - DEFAULT_INDIA_COUNT))
      const nextIndia = safeNumber(data.indiaCount, DEFAULT_INDIA_COUNT)

      localStorage.setItem('totalCount', String(nextTotal))
      localStorage.setItem('globalCount', String(nextGlobal))
      localStorage.setItem('indiaCount', String(nextIndia))

      setCounts((current) => ({
        ...current,
        global: nextTotal,
        india: nextIndia,
        active: safeNumber(data.activeCount, current.active)
      }))
    }

    const postCounterUpdate = async (payload) => {
      readStoredCounts()

      const response = await fetch('/api/visitor-counter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorSessionId,
          ...payload
        })
      })

      const data = await response.json()
      if (data?.success) {
        updateCountsFromResponse(data)
      }

      return data
    }

    const sendFirstVisit = async () => {
      if (sessionStorage.getItem(SESSION_COUNTED_KEY) === 'true') {
        await sendHeartbeat()
        return
      }

      let locationData = null
      try {
        const locationResponse = await fetch('https://ipapi.co/json/')
        locationData = await locationResponse.json()
      } catch (error) {
        console.warn('Visitor location lookup failed:', error)
      }

      try {
        const data = await postCounterUpdate({
          mode: 'visit',
          countryCode: locationData?.country_code,
          ipAddress: locationData?.ip,
          userAgent: navigator.userAgent
        })

        if (data?.success) {
          sessionStorage.setItem(SESSION_COUNTED_KEY, 'true')
        }
      } catch (error) {
        console.warn('Visitor count failed:', error)
      }
    }

    const sendHeartbeat = async () => {
      try {
        await postCounterUpdate({ mode: 'heartbeat' })
      } catch (error) {
        console.warn('Visitor heartbeat failed:', error)
      }
    }

    sendFirstVisit()
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
