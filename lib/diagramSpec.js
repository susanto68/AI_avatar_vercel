// Diagram spec extraction + validation
//
// The AI model (Groq llama-3.1-8b-instant) never draws SVG directly — it's a
// small, fast, text-only model, and freeform model-generated markup would be
// both unreliable (malformed/nonsensical layouts) and unsafe (raw markup in
// the DOM is an XSS vector). Instead the model emits one compact JSON "spec"
// (a `type` plus a handful of short labels) as a `DIAGRAM:{...}` line, and
// DiagramView deterministically lays out real SVG from the validated spec.

const DIAGRAM_TYPES = new Set(['flowchart', 'labeled', 'cycle'])
const MIN_ITEMS = 2
const MAX_ITEMS = 6
const MAX_ITEM_LEN = 40
const MAX_TITLE_LEN = 60

function truncateWithEllipsis(str, maxLen) {
  if (str.length <= maxLen) return str
  const slice = str.slice(0, maxLen)
  const lastSpace = slice.lastIndexOf(' ')
  const cut = lastSpace > maxLen * 0.5 ? slice.slice(0, lastSpace) : slice
  return cut.trim() + '…'
}

// Validates and clamps a parsed diagram object. Returns null if the shape
// can't be safely rendered (unknown type, too few usable items) — a missing
// diagram is always a safe fallback, a malformed one rendered anyway is not.
export function validateDiagramSpec(parsed) {
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null

  const type = String(parsed.type || '').trim().toLowerCase()
  if (!DIAGRAM_TYPES.has(type)) return null

  if (!Array.isArray(parsed.items)) return null
  const items = parsed.items
    .filter((item) => typeof item === 'string' && item.trim().length > 0)
    .map((item) => truncateWithEllipsis(item.trim(), MAX_ITEM_LEN))
    .slice(0, MAX_ITEMS)
  if (items.length < MIN_ITEMS) return null

  let title = typeof parsed.title === 'string' ? parsed.title.trim() : ''
  if (title) title = truncateWithEllipsis(title, MAX_TITLE_LEN)

  return { type, title, items }
}

// Finds a `DIAGRAM:{...}` span in raw model text, extracts + validates the
// JSON object, and returns the text with the whole span removed — so a
// malformed or unsupported diagram never leaks raw JSON into the answer
// that gets displayed or spoken aloud.
export function extractDiagramSpec(rawText) {
  if (!rawText || typeof rawText !== 'string') return { diagram: null, text: rawText || '' }

  const markerMatch = rawText.match(/DIAGRAM:\s*\{/i)
  if (!markerMatch) return { diagram: null, text: rawText }

  const braceStart = markerMatch.index + markerMatch[0].length - 1
  const lineStart = rawText.lastIndexOf('\n', markerMatch.index) + 1

  // Walk braces while tracking whether we're inside a quoted string, so a
  // label containing "{" or "}" doesn't desync the depth count. This is
  // deliberately decoupled from JSON *validity* — it only needs to find a
  // structurally-balanced slice; JSON.parse below is what rejects bad JSON.
  let depth = 0
  let inString = false
  let escaped = false
  let endIdx = -1

  for (let i = braceStart; i < rawText.length; i++) {
    const ch = rawText[i]
    if (inString) {
      if (escaped) escaped = false
      else if (ch === '\\') escaped = true
      else if (ch === '"') inString = false
      continue
    }
    if (ch === '"') { inString = true; continue }
    if (ch === '{') depth++
    else if (ch === '}') {
      depth--
      if (depth === 0) { endIdx = i; break }
    }
  }

  if (endIdx === -1) {
    // Truncated mid-object (e.g. the model hit its token ceiling) — nothing
    // after this point is salvageable, so drop from the marker to the end.
    const text = rawText.slice(0, lineStart).replace(/\n{3,}/g, '\n\n').trim()
    return { diagram: null, text }
  }

  const jsonSlice = rawText.slice(braceStart, endIdx + 1)
  const before = rawText.slice(0, lineStart)
  // Defensive mop-up in case the model ever emits a second DIAGRAM: fragment.
  const after = rawText.slice(endIdx + 1).replace(/DIAGRAM:\s*\{[\s\S]*$/i, '')
  const text = (before + after).replace(/\n{3,}/g, '\n\n').trim()

  let parsed
  try {
    parsed = JSON.parse(jsonSlice)
  } catch (e) {
    return { diagram: null, text }
  }

  return { diagram: validateDiagramSpec(parsed), text }
}
