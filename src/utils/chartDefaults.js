const getCssVar = (name) =>
  typeof document !== 'undefined'
    ? getComputedStyle(document.documentElement).getPropertyValue(name).trim()
    : ''

export const getChartDefaults = () => {
  const ink2    = getCssVar('--ink-2')   || '#888'
  const line    = getCssVar('--line')    || '#e2e2e2'
  const accent  = getCssVar('--accent')  || '#5b5ef4'
  const surface = getCssVar('--surface') || '#fff'

  return {
    chart: {
      background: 'transparent',
      toolbar: { show: false },
      zoom: { enabled: false },
      fontFamily: 'var(--font-geist-sans, "Helvetica Neue", sans-serif)',
    },
    theme: { mode: 'light' },
    colors: [accent],
    grid: {
      borderColor: line,
      strokeDashArray: 3,
      xaxis: { lines: { show: false } },
    },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: ink2, fontSize: '11px' } },
    },
    yaxis: {
      labels: { style: { colors: ink2, fontSize: '11px' } },
    },
    tooltip: {
      theme: 'light',
      style: { fontSize: '12px' },
    },
    legend: {
      labels: { colors: ink2 },
    },
    stroke: { curve: 'smooth', width: 2 },
    dataLabels: { enabled: false },
  }
}

export const mergeChartOptions = (custom = {}) => {
  const defaults = getChartDefaults()
  return {
    ...defaults,
    ...custom,
    chart: { ...defaults.chart, ...(custom.chart ?? {}) },
    grid:  { ...defaults.grid,  ...(custom.grid  ?? {}) },
    xaxis: { ...defaults.xaxis, ...(custom.xaxis ?? {}) },
    yaxis: { ...defaults.yaxis, ...(custom.yaxis ?? {}) },
  }
}
