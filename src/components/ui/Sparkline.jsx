const normalize = (data, w, h, pad = 2) => {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const step = (w - pad * 2) / (data.length - 1)
  return data.map((v, i) => [
    pad + i * step,
    h - pad - ((v - min) / range) * (h - pad * 2),
  ])
}

export const Sparkline = ({
  data = [],
  width = 64,
  height = 24,
  color = 'var(--accent)',
  filled = false,
}) => {
  if (!data.length) return null
  const pts = normalize(data, width, height)
  const d = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x},${y}`).join(' ')
  const fill = filled
    ? `${d} L${pts[pts.length - 1][0]},${height} L${pts[0][0]},${height} Z`
    : null

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
      style={{ display: 'block', overflow: 'visible' }}
    >
      {filled && (
        <path d={fill} fill={color} fillOpacity="0.12" stroke="none" />
      )}
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default Sparkline
