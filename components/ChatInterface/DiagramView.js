// Renders a validated diagram spec ({ type, title, items }) as real SVG.
// The AI never draws SVG itself — see lib/diagramSpec.js for why. All
// coordinates here are computed from item count, never supplied by the model.

const PALETTE = [
  { fill: '#EFF6FF', stroke: '#2563EB', text: '#1E3A8A' }, // blue
  { fill: '#FAF5FF', stroke: '#9333EA', text: '#581C87' }, // purple
  { fill: '#EEF2FF', stroke: '#4F46E5', text: '#312E81' }, // indigo
]
const CONNECTOR_COLOR = '#4F46E5'

// SVG <text> doesn't auto-wrap, so labels are wrapped manually. Devanagari
// gets a smaller character budget — the fallback font that actually renders
// it (Nirmala UI, Noto Sans Devanagari, etc.) runs measurably wider per
// character than the page's Latin font stack.
function wrapLabel(text, maxCharsPerLine, maxLines) {
  const str = String(text || '').trim()
  if (!str) return []
  const isDevanagari = /[ऀ-ॿ]/.test(str)
  const budget = isDevanagari ? Math.round(maxCharsPerLine * 0.75) : maxCharsPerLine
  const words = str.split(/\s+/)
  const lines = []
  let cur = ''
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > budget) {
      if (cur) lines.push(cur)
      cur = w
    } else {
      cur = (cur + ' ' + w).trim()
    }
    if (lines.length === maxLines) break
  }
  if (cur && lines.length < maxLines) lines.push(cur)
  if (lines.length === maxLines) {
    const consumed = lines.join(' ').split(/\s+/).length
    if (consumed < words.length) {
      lines[maxLines - 1] = lines[maxLines - 1].replace(/…$/, '') + '…'
    }
  }
  return lines.length ? lines : [str.slice(0, maxCharsPerLine)]
}

function MultilineText({ x, y, lines, lineHeight = 14, fontSize = 12, fontWeight = 600, fill = '#1f2937' }) {
  if (!lines.length) return null
  const startDy = -((lines.length - 1) * lineHeight) / 2
  return (
    <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize={fontSize} fontWeight={fontWeight} fill={fill}>
      {lines.map((line, i) => (
        <tspan key={i} x={x} dy={i === 0 ? startDy : lineHeight}>{line}</tspan>
      ))}
    </text>
  )
}

// Triangle arrowhead with its tip at `tip`, pointing along `directionDeg`.
function arrowheadPoints(tip, directionDeg, size = 8) {
  const toRad = (d) => (d * Math.PI) / 180
  const back1 = toRad(directionDeg + 150)
  const back2 = toRad(directionDeg - 150)
  const p2 = { x: tip.x + size * Math.cos(back1), y: tip.y + size * Math.sin(back1) }
  const p3 = { x: tip.x + size * Math.cos(back2), y: tip.y + size * Math.sin(back2) }
  return `${tip.x},${tip.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`
}

// ── flowchart: vertical stack of numbered boxes + arrows ──────────────────
function FlowchartDiagram({ items, title }) {
  const N = items.length
  const boxW = 260, boxH = 56, boxX = 30, gap = 32
  const H = 32 + N * boxH + (N - 1) * gap

  return (
    <svg viewBox={`0 0 320 ${H}`} width="100%" role="img">
      <title>{title || 'Flowchart diagram'}</title>
      {items.map((item, i) => {
        const y = 16 + i * (boxH + gap)
        const color = PALETTE[i % PALETTE.length]
        const lines = wrapLabel(item, 26, 2)
        const cx = boxX + boxW / 2
        const cy = y + boxH / 2
        return (
          <g key={i}>
            {i < N - 1 && (
              <g>
                <line x1={cx} y1={y + boxH} x2={cx} y2={y + boxH + gap} stroke={CONNECTOR_COLOR} strokeWidth="2.5" />
                <polygon
                  points={`${cx - 5},${y + boxH + gap - 8} ${cx + 5},${y + boxH + gap - 8} ${cx},${y + boxH + gap}`}
                  fill={CONNECTOR_COLOR}
                />
              </g>
            )}
            <rect x={boxX} y={y} width={boxW} height={boxH} rx="12" fill={color.fill} stroke={color.stroke} strokeWidth="2" />
            <circle cx={boxX} cy={y + 28} r="14" fill={color.stroke} />
            <text x={boxX} y={y + 28} textAnchor="middle" dominantBaseline="central" fontSize="13" fontWeight="700" fill="#ffffff">
              {i + 1}
            </text>
            <MultilineText x={cx} y={cy} lines={lines} fill={color.text} />
          </g>
        )
      })}
    </svg>
  )
}

// ── labeled: central shape + radial callouts to each part ─────────────────
function LabeledDiagram({ items, title }) {
  const N = items.length
  const cx = 180, cy = 180
  const centerR = 52
  const leaderInnerR = 52
  const leaderOuterR = 104
  const labelR = 120
  const labelW = 96, labelH = 32
  const centerColor = PALETTE[1]
  const titleLines = wrapLabel(title, 11, 2)

  return (
    <svg viewBox="0 0 360 360" width="100%" role="img">
      <title>{title || 'Labeled diagram'}</title>
      {items.map((item, i) => {
        const angle = ((-90 + (i * 360) / N) * Math.PI) / 180
        const cos = Math.cos(angle), sin = Math.sin(angle)
        const lx1 = cx + leaderInnerR * cos, ly1 = cy + leaderInnerR * sin
        const lx2 = cx + leaderOuterR * cos, ly2 = cy + leaderOuterR * sin
        const bx = cx + labelR * cos, by = cy + labelR * sin
        const color = PALETTE[i % PALETTE.length]
        const lines = wrapLabel(item, 13, 2)
        return (
          <g key={i}>
            <line x1={lx1} y1={ly1} x2={lx2} y2={ly2} stroke={CONNECTOR_COLOR} strokeWidth="1.5" />
            <rect x={bx - labelW / 2} y={by - labelH / 2} width={labelW} height={labelH} rx="8" fill={color.fill} stroke={color.stroke} strokeWidth="2" />
            <MultilineText x={bx} y={by} lines={lines} fill={color.text} lineHeight={13} fontSize={11} />
          </g>
        )
      })}
      <circle cx={cx} cy={cy} r={centerR} fill={centerColor.fill} stroke={centerColor.stroke} strokeWidth="2.5" />
      <MultilineText x={cx} y={cy} lines={titleLines} fill={centerColor.text} lineHeight={13} fontSize={11} fontWeight={700} />
    </svg>
  )
}

// ── cycle: nodes around a circle connected by arcs that loop back ─────────
function CycleDiagram({ items, title }) {
  const N = items.length
  const cx = 180, cy = 180
  const nodeR = 130
  const nodeW = 100, nodeH = 44
  const toRad = (deg) => (deg * Math.PI) / 180
  const angleFor = (i) => -90 + (i * 360) / N
  const pointAt = (deg, r = nodeR) => ({ x: cx + r * Math.cos(toRad(deg)), y: cy + r * Math.sin(toRad(deg)) })
  const delta = Math.max(14, 90 / N)

  const arcs = items.map((_, i) => {
    const startDeg = angleFor(i) + delta
    let endDeg = angleFor(i + 1 === N ? 0 : i + 1) - delta
    if (endDeg < startDeg) endDeg += 360
    const start = pointAt(startDeg)
    const end = pointAt(endDeg)
    const arrow = arrowheadPoints(end, endDeg + 90, 7)
    return { start, end, arrow }
  })

  return (
    <svg viewBox="0 0 360 360" width="100%" role="img">
      <title>{title || 'Cycle diagram'}</title>
      {arcs.map((arc, i) => (
        <g key={`arc-${i}`}>
          <path
            d={`M ${arc.start.x} ${arc.start.y} A ${nodeR} ${nodeR} 0 0 1 ${arc.end.x} ${arc.end.y}`}
            fill="none" stroke={CONNECTOR_COLOR} strokeWidth="2.5"
          />
          <polygon points={arc.arrow} fill={CONNECTOR_COLOR} />
        </g>
      ))}
      {items.map((item, i) => {
        const { x, y } = pointAt(angleFor(i))
        const color = PALETTE[i % PALETTE.length]
        const lines = wrapLabel(item, 15, 2)
        return (
          <g key={`node-${i}`}>
            <rect x={x - nodeW / 2} y={y - nodeH / 2} width={nodeW} height={nodeH} rx="10" fill={color.fill} stroke={color.stroke} strokeWidth="2" />
            <MultilineText x={x} y={y} lines={lines} fill={color.text} lineHeight={13} fontSize={11} />
          </g>
        )
      })}
    </svg>
  )
}

const RENDERERS = {
  flowchart: FlowchartDiagram,
  labeled: LabeledDiagram,
  cycle: CycleDiagram,
}

export default function DiagramView({ spec }) {
  // Defensive re-check even though the API already validates this shape —
  // cheap insurance, not a re-implementation of lib/diagramSpec.js.
  if (!spec?.type || !Array.isArray(spec?.items) || spec.items.length < 2) return null

  const Renderer = RENDERERS[spec.type]
  if (!Renderer) return null

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-xl p-3 sm:p-4 border-2 border-white/40 shadow-lg">
      {spec.title && (
        <h3 className="text-sm sm:text-base font-bold text-purple-900 text-center mb-2 break-words">
          {spec.title}
        </h3>
      )}
      <div className="max-w-sm sm:max-w-md mx-auto">
        <Renderer items={spec.items} title={spec.title} />
      </div>
    </div>
  )
}
