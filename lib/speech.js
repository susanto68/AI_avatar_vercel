/**
 * speech.js — Bulletproof Web Speech API wrapper for Chrome/Edge/Firefox
 *
 * Key design decisions:
 * - NO setTimeout before speak() — async delays break Chrome's user gesture chain
 * - cancel() then immediately speak() — Chrome handles this fine
 * - Use actual voice.lang not 'en-IN' — 'en-IN' silently fails if voice not installed
 * - callId counter — stale onComplete callbacks are ignored
 * - Chrome 15s keepalive — periodic pause/resume prevents Chrome freeze
 */

// ── Module state ─────────────────────────────────────────────────────────────
let _isSpeaking  = false
let _isPaused    = false
let _callId      = 0          // incremented on every new speak / stop
let _keepAlive   = null       // setInterval handle for Chrome keepalive
let _currentText = ''

// ── Voice settings ────────────────────────────────────────────────────────────
const EN_SETTINGS = { rate: 0.9,  pitch: 0.85, volume: 1.0 }
const HI_SETTINGS = { rate: 0.85, pitch: 0.85, volume: 1.0 }

const _isHindi = (opts = {}) =>
  opts.avatarType === 'hindi-teacher' ||
  opts.lang === 'hi' || opts.lang === 'hi-IN'

// ── Text cleaning ─────────────────────────────────────────────────────────────
function _clean(text) {
  if (!text || typeof text !== 'string') return ''
  return text
    .replace(/```[\s\S]*?```/g, ' code block. ')  // strip code fences
    .replace(/`[^`]+`/g, ' ')                      // inline code
    .replace(/\*\*(.*?)\*\*/g, '$1')               // bold
    .replace(/\*(.*?)\*/g, '$1')                   // italic
    .replace(/#{1,6}\s?/g, '')                     // headings
    .replace(/[_~\[\]{}|\\]/g, ' ')
    .replace(/</g, ' ').replace(/>/g, ' ')
    .replace(/&/g, ' and ')
    .replace(/@/g, ' at ')
    .replace(/\$/g, ' ')
    .replace(/\+/g, ' plus ')
    .replace(/=/g, ' equals ')
    .replace(/["'""\u2018\u2019\u201C\u201D]/g, '')
    .replace(/•/g, '. ')
    .replace(/\n{2,}/g, '. ')
    .replace(/\n/g, ', ')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

// ── Voice selection ───────────────────────────────────────────────────────────
function _pickVoice(hindi) {
  const all = window.speechSynthesis.getVoices()
  if (!all.length) return null

  const scored = all.map(v => {
    const n = v.name.toLowerCase()
    const l = v.lang.toLowerCase()
    let s = 0
    if (hindi) {
      if (l === 'hi-in')            s += 120
      else if (l.startsWith('hi')) s += 90
      if (n.includes('hindi'))     s += 80
      if (n.includes('india'))     s += 40
    } else {
      if (l === 'en-in')           s += 120
      if (n.includes('india') || n.includes('indian')) s += 80
      if (l === 'en-gb')           s += 50
      if (l === 'en-us')           s += 40
      if (l.startsWith('en'))      s += 20
    }
    if (n.includes('male'))          s += 50
    if (/ravi|prabhat|aarav|rishi|dfm/.test(n)) s += 60
    if (n.includes('google'))        s += 25
    if (n.includes('microsoft'))     s += 20
    if (/natural|neural|online|enhanced/.test(n)) s += 25
    if (v.default)                   s += 5
    return { v, s }
  })

  scored.sort((a, b) => b.s - a.s)

  // For English, ensure we pick an English-language voice (not random)
  if (!hindi) {
    const enVoice = scored.find(x => x.v.lang.startsWith('en'))
    if (enVoice) return enVoice.v
  }

  return scored[0]?.v || all[0]
}

// ── Chrome 15-second keepalive ────────────────────────────────────────────────
function _startKeepalive() {
  _stopKeepalive()
  
  // Only apply Keepalive pause/resume trick to Google Chrome to avoid side-effects in Edge/Safari
  const isChrome = typeof window !== 'undefined' && 
    /chrome|chromium/i.test(navigator.userAgent) && 
    !/edge|edg/i.test(navigator.userAgent)
    
  if (!isChrome) return

  _keepAlive = setInterval(() => {
    try {
      if (window.speechSynthesis?.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause()
        window.speechSynthesis.resume()
      }
    } catch (_) {}
  }, 10000)
}

function _stopKeepalive() {
  if (_keepAlive) { clearInterval(_keepAlive); _keepAlive = null }
}

function _speakWithDefaultVoice(cleaned, cfg, myId, onComplete) {
  try {
    const fallback = new SpeechSynthesisUtterance(cleaned)
    fallback.lang = 'en-US'
    fallback.voice = null
    fallback.rate = cfg.rate
    fallback.pitch = cfg.pitch
    fallback.volume = cfg.volume
    fallback.onstart = () => {
      if (myId !== _callId) return
      _isSpeaking = true
      _isPaused = false
      _startKeepalive()
      console.log('Speech retry started with browser default voice')
    }
    fallback.onend = () => {
      if (myId !== _callId) return
      _isSpeaking = false
      _isPaused = false
      _currentText = ''
      _stopKeepalive()
      if (onComplete) onComplete()
    }
    fallback.onerror = (e) => {
      if (myId !== _callId) return
      console.error('Speech retry failed:', e.error)
      _isSpeaking = false
      _isPaused = false
      _currentText = ''
      _stopKeepalive()
      if (onComplete) onComplete()
    }
    window.speechSynthesis.speak(fallback)
    return true
  } catch (e) {
    console.error('Speech retry threw:', e)
    return false
  }
}

// ── Public: initSynth ─────────────────────────────────────────────────────────
export function initSynth() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return false
  try {
    // Trigger async voice load in Chrome (voices load on first getVoices call)
    const v = window.speechSynthesis.getVoices()
    if (!v.length) {
      window.speechSynthesis.addEventListener('voiceschanged', () => {
        console.log('🎤 Voices ready:', window.speechSynthesis.getVoices().length)
      })
    } else {
      console.log('🎤 Voices ready:', v.length)
    }
    return true
  } catch (e) { return false }
}

// ── Public: speakText ─────────────────────────────────────────────────────────
/**
 * Speak text. Works both from click handlers and async contexts.
 * Call unlockAudio() once on first user click before using this.
 */
export function speakText(text, onComplete, options = {}) {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    if (onComplete) onComplete()
    return false
  }

  const cleaned = _clean(text)
  if (!cleaned) {
    if (onComplete) onComplete()
    return false
  }

  const myId = ++_callId
  const hindi = _isHindi(options)
  const cfg   = hindi ? HI_SETTINGS : EN_SETTINGS

  // ── Defer if voices are not loaded yet ──────────────────────────────────
  const voices = window.speechSynthesis.getVoices()
  if (voices.length === 0) {
    console.log('⏳ SpeechSynthesis voices empty. Registering voiceschanged listener.')
    const retry = () => {
      if (myId !== _callId) return
      window.speechSynthesis.removeEventListener('voiceschanged', retry)
      speakText(text, onComplete, options)
    }
    window.speechSynthesis.addEventListener('voiceschanged', retry)
    return true
  }

  // ── Cancel any current speech ───────────────────────────────────────────
  _stopKeepalive()
  _isSpeaking = false
  _isPaused   = false
  _currentText = cleaned
  try {
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      window.speechSynthesis.cancel()
    }
  } catch (_) {}

  // ── Build utterance ─────────────────────────────────────────────────────
  const u = new SpeechSynthesisUtterance(cleaned)
  u.rate   = options.rate   || cfg.rate
  u.pitch  = options.pitch  || cfg.pitch
  u.volume = options.volume !== undefined ? options.volume : cfg.volume

  // ── Assign best voice ───────────────────────────────────────────────────
  const voice = _pickVoice(hindi)
  if (voice) {
    u.voice = voice
    u.lang  = voice.lang   // use the REAL voice lang
    console.log('🎤 Voice:', voice.name, '|', voice.lang)
  } else {
    u.lang = hindi ? 'hi-IN' : 'en-US'
  }

  // ── Event handlers ──────────────────────────────────────────────────────
  u.onstart = () => {
    if (myId !== _callId) return
    _isSpeaking = true
    _isPaused   = false
    _startKeepalive()
    console.log('🔊 Speech started:', cleaned.substring(0, 60))
  }

  u.onend = () => {
    if (myId !== _callId) return
    if (!normal && u.voice) {
      console.log('Retrying speech synthesis with browser default voice')
      _isSpeaking = false
      _isPaused = false
      _stopKeepalive()
      if (_speakWithDefaultVoice(cleaned, cfg, myId, onComplete)) return
    }
    _isSpeaking  = false
    _isPaused    = false
    _currentText = ''
    _stopKeepalive()
    console.log('✅ Speech ended')
    if (onComplete) onComplete()
  }

  u.onerror = (e) => {
    const normal = e.error === 'canceled' || e.error === 'interrupted'
    if (!normal) console.error('❌ Speech error:', e.error)
    else         console.log('ℹ️ Speech', e.error, '(normal)')
    if (myId !== _callId) return
    _isSpeaking  = false
    _isPaused    = false
    _currentText = ''
    _stopKeepalive()
    if (onComplete) onComplete()
  }

  u.onpause  = () => { _isPaused = true  }
  u.onresume = () => { _isPaused = false }

  // ── SPEAK ───────────────────────────────────────────────────────────────
  try {
    // Force resume in case speechSynthesis was stuck in paused state
    if (window.speechSynthesis.paused) {
      try { window.speechSynthesis.resume() } catch (_) {}
    }
    window.speechSynthesis.speak(u)
    console.log('🔈 speak() queued | voices:', voices.length, '| lang:', u.lang)
  } catch (e) {
    console.error('❌ speak() threw:', e)
    if (onComplete) onComplete()
    return false
  }

  return true
}

// ── Public: unlockAudio ───────────────────────────────────────────────────────
/**
 * Call this SYNCHRONOUSLY inside a click/touch handler to unlock Chrome's
 * audio autoplay policy. Must be called before the first speakText().
 */
export function unlockAudio() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  try {
    // Speak a near-silent single character "a" — space " " might be ignored
    const u = new SpeechSynthesisUtterance('a')
    u.volume = 0.001
    u.rate   = 10
    u.pitch  = 1
    // Don't cancel first — just queue it
    window.speechSynthesis.speak(u)
    console.log('🔓 Audio unlocked via tiny utterance')
  } catch (e) {
    console.warn('⚠️ unlockAudio failed:', e)
  }
}

// ── Public: stopSpeaking ──────────────────────────────────────────────────────
export function stopSpeaking() {
  _stopKeepalive()
  _isSpeaking  = false
  _isPaused    = false
  _currentText = ''
  _callId++   // invalidate any pending callbacks
  try {
    if (typeof window !== 'undefined' && window.speechSynthesis)
      window.speechSynthesis.cancel()
  } catch (_) {}
}

// ── Public: pauseSpeaking / resumeSpeaking ────────────────────────────────────
export function pauseSpeaking() {
  try { window.speechSynthesis?.pause(); _isPaused = true  } catch (_) {}
}
export function resumeSpeaking() {
  try { window.speechSynthesis?.resume(); _isPaused = false } catch (_) {}
}

// ── Public: state accessors ───────────────────────────────────────────────────
export function getSpeakingState() {
  return {
    isSpeaking:  _isSpeaking,
    isPaused:    _isPaused,
    canPause:    _isSpeaking && !_isPaused,
    canResume:   _isPaused,
    canStop:     _isSpeaking || _isPaused,
    currentText: _currentText
  }
}

export function getSpeechStatus() {
  if (typeof window === 'undefined') return { supported: false }
  const s = window.speechSynthesis
  if (!s) return { supported: false }
  const voices = s.getVoices()
  return {
    supported:  true,
    voiceCount: voices.length,
    voices:     voices.slice(0, 8).map(v => ({ name: v.name, lang: v.lang })),
    speaking:   s.speaking,
    pending:    s.pending,
    paused:     s.paused
  }
}

export function reinitSynth() { stopSpeaking(); return initSynth() }
