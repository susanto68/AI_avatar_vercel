import '../styles/globals.css'
import '../styles/modern-cursor.css'
import '../styles/space-background.css'
import { useEffect } from 'react'
import ModernCursor from '../components/ModernCursor/ModernCursor'
import FloatingPet from '../components/FloatingPet/FloatingPet'

export default function App({ Component, pageProps }) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return
    if (typeof window === 'undefined') return

    const clearLocalServiceWorker = async () => {
      try {
        if ('serviceWorker' in navigator) {
          const registrations = await navigator.serviceWorker.getRegistrations()
          await Promise.all(registrations.map((registration) => registration.unregister()))
        }

        if ('caches' in window) {
          const names = await caches.keys()
          await Promise.all(names.map((name) => caches.delete(name)))
        }
      } catch (error) {
        console.warn('Local service worker cleanup failed:', error)
      }
    }

    clearLocalServiceWorker()
  }, [])

  return (
    <>
      <ModernCursor />
      <Component {...pageProps} />
      <FloatingPet />
    </>
  )
}
