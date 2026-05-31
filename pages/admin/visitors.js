import { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'

const REFRESH_INTERVAL_MS = 30000

const formatCount = (value) => {
  const count = Number.parseInt(value, 10)
  return Number.isFinite(count) && count >= 0 ? count.toLocaleString() : '0'
}

const StatCard = ({ label, value, accent }) => (
  <div className="rounded-lg border border-white/15 bg-white/10 p-5 backdrop-blur">
    <p className="text-sm font-medium uppercase tracking-wide text-white/65">{label}</p>
    <p className={`mt-3 text-4xl font-bold ${accent}`}>{formatCount(value)}</p>
  </div>
)

export default function VisitorAnalytics() {
  const [visitorData, setVisitorData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  useEffect(() => {
    let isMounted = true

    const loadVisitorData = async () => {
      try {
        const response = await fetch('/api/visitor-counter')
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data?.error || 'Unable to load visitor totals')
        }

        if (isMounted) {
          setVisitorData(data)
          setLastUpdated(new Date())
          setError(null)
        }
      } catch (error) {
        if (isMounted) {
          setError(error.message)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadVisitorData()
    const intervalId = setInterval(loadVisitorData, REFRESH_INTERVAL_MS)

    return () => {
      isMounted = false
      clearInterval(intervalId)
    }
  }, [])

  const totalCount = visitorData?.totalCount ?? 0
  const indiaCount = visitorData?.indiaCount ?? 0
  const internationalCount = Math.max((visitorData?.globalCount ?? 0), 0)
  const activeCount = visitorData?.activeCount ?? 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-slate-950 to-indigo-950">
      <Head>
        <title>Visitor Analytics - Avatar AI Assistant</title>
        <meta name="description" content="Admin dashboard for visitor analytics" />
      </Head>

      <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-8 md:py-12">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-200/80">
            Admin
          </p>
          <h1 className="mt-2 text-3xl font-bold text-white md:text-5xl">
            Visitor Analytics
          </h1>
          <p className="mt-3 max-w-2xl text-base text-white/70 md:text-lg">
            Live totals from the current visitor counter backend.
          </p>
        </div>

        {loading ? (
          <div className="rounded-lg border border-white/15 bg-white/10 p-6 text-white/80">
            Loading visitor totals...
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-400/30 bg-red-500/15 p-6 text-red-100">
            {error}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="Total visitors" value={totalCount} accent="text-blue-200" />
              <StatCard label="Active now" value={activeCount} accent="text-emerald-200" />
              <StatCard label="India" value={indiaCount} accent="text-green-200" />
              <StatCard label="International" value={internationalCount} accent="text-cyan-200" />
            </div>

            <section className="mt-6 rounded-lg border border-white/15 bg-white/10 p-5 text-white/75 backdrop-blur">
              <h2 className="text-lg font-semibold text-white">Counter Source</h2>
              <p className="mt-2 text-sm leading-6">
                These numbers come from <span className="font-mono text-white">/api/visitor-counter</span>.
                The dashboard reads totals without sending a heartbeat, so it does not increase visitor counts or active sessions.
              </p>
              {lastUpdated && (
                <p className="mt-4 text-sm text-white/55">
                  Last updated {lastUpdated.toLocaleTimeString()}
                </p>
              )}
            </section>
          </>
        )}

        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center rounded-lg bg-white/15 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/25"
          >
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  )
}
