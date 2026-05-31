import { mkdir, readFile, writeFile } from 'fs/promises'
import path from 'path'

const DEFAULT_GLOBAL_COUNT = 503
const DEFAULT_INDIA_COUNT = 2129
const ACTIVE_WINDOW_MS = 90000
const COUNTED_SESSION_WINDOW_MS = 12 * 60 * 60 * 1000
const counterFilePath = path.join(process.cwd(), '.data', 'visitor-counts.json')

const activeVisitors = globalThis.__aiAvatarActiveVisitors || new Map()
globalThis.__aiAvatarActiveVisitors = activeVisitors

const countedVisitorSessions = globalThis.__aiAvatarCountedVisitorSessions || new Map()
globalThis.__aiAvatarCountedVisitorSessions = countedVisitorSessions

let cachedCounts = globalThis.__aiAvatarVisitorCounts || null

const cleanCount = (value, fallback) => {
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback
}

const pruneActiveVisitors = () => {
  const cutoff = Date.now() - ACTIVE_WINDOW_MS

  for (const [visitorId, lastSeen] of activeVisitors.entries()) {
    if (lastSeen < cutoff) {
      activeVisitors.delete(visitorId)
    }
  }
}

const pruneCountedSessions = () => {
  const cutoff = Date.now() - COUNTED_SESSION_WINDOW_MS

  for (const [visitorId, countedAt] of countedVisitorSessions.entries()) {
    if (countedAt < cutoff) {
      countedVisitorSessions.delete(visitorId)
    }
  }
}

const getActiveCount = () => {
  pruneActiveVisitors()
  return activeVisitors.size
}

const trackActiveVisitor = (visitorSessionId, fallbackId) => {
  const visitorId = visitorSessionId || fallbackId || `visitor-${Date.now()}`
  activeVisitors.set(visitorId, Date.now())
  return getActiveCount()
}

const loadCounts = async () => {
  if (cachedCounts) return cachedCounts

  try {
    const file = await readFile(counterFilePath, 'utf8')
    const data = JSON.parse(file)
    cachedCounts = {
      globalCount: cleanCount(data.globalCount, DEFAULT_GLOBAL_COUNT),
      indiaCount: cleanCount(data.indiaCount, DEFAULT_INDIA_COUNT)
    }
  } catch {
    cachedCounts = {
      globalCount: cleanCount(process.env.GLOBAL_VISITOR_COUNT, DEFAULT_GLOBAL_COUNT),
      indiaCount: cleanCount(process.env.INDIA_VISITOR_COUNT, DEFAULT_INDIA_COUNT)
    }
  }

  globalThis.__aiAvatarVisitorCounts = cachedCounts
  return cachedCounts
}

const saveCounts = async (counts) => {
  cachedCounts = counts
  globalThis.__aiAvatarVisitorCounts = counts

  try {
    await mkdir(path.dirname(counterFilePath), { recursive: true })
    await writeFile(counterFilePath, JSON.stringify(counts, null, 2))
  } catch (error) {
    console.warn('Visitor counter file save failed:', error.message)
  }
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const counts = await loadCounts()

      return res.status(200).json({
        success: true,
        globalCount: counts.globalCount,
        indiaCount: counts.indiaCount,
        activeCount: getActiveCount(),
        totalCount: counts.globalCount + counts.indiaCount
      })
    } catch (error) {
      console.error('Visitor counter read error:', error)
      return res.status(500).json({
        error: 'Failed to read visitor counter',
        details: error.message
      })
    }
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { countryCode, ipAddress, userAgent, mode, visitorSessionId } = req.body
    const clientIP = ipAddress || req.headers['x-forwarded-for'] ||
      req.headers['x-real-ip'] ||
      req.connection.remoteAddress
    const activeCount = trackActiveVisitor(visitorSessionId, `${clientIP}-${userAgent || 'unknown'}`)
    const counts = await loadCounts()

    if (mode !== 'visit' || !visitorSessionId) {
      return res.status(200).json({
        success: true,
        globalCount: counts.globalCount,
        indiaCount: counts.indiaCount,
        activeCount,
        totalCount: counts.globalCount + counts.indiaCount,
        counted: false,
        message: 'Visitor active'
      })
    }

    pruneCountedSessions()
    if (countedVisitorSessions.has(visitorSessionId)) {
      return res.status(200).json({
        success: true,
        globalCount: counts.globalCount,
        indiaCount: counts.indiaCount,
        activeCount,
        totalCount: counts.globalCount + counts.indiaCount,
        counted: false,
        message: 'Visitor session already counted'
      })
    }

    countedVisitorSessions.set(visitorSessionId, Date.now())

    const isIndia = countryCode === 'IN'
    const nextCounts = {
      globalCount: counts.globalCount + (isIndia ? 0 : 1),
      indiaCount: counts.indiaCount + (isIndia ? 1 : 0)
    }

    await saveCounts(nextCounts)

    console.log('Visitor counted:', {
      country: countryCode || 'Unknown',
      isIndia,
      ip: clientIP,
      globalCount: nextCounts.globalCount,
      indiaCount: nextCounts.indiaCount,
      activeCount,
      timestamp: new Date().toISOString()
    })

    return res.status(200).json({
      success: true,
      globalCount: nextCounts.globalCount,
      indiaCount: nextCounts.indiaCount,
      activeCount,
      totalCount: nextCounts.globalCount + nextCounts.indiaCount,
      counted: true,
      message: `${isIndia ? 'Indian' : 'International'} visitor counted`,
      note: 'Counts stored locally for this app server'
    })
  } catch (error) {
    console.error('Visitor counter error:', error)
    return res.status(500).json({
      error: 'Failed to update visitor counter',
      details: error.message
    })
  }
}
