'use client'
import dynamic from 'next/dynamic'
import { mergeChartOptions } from '@/utils/chartDefaults'
import Card from '@/components/ui/Card'

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

const salesSeries = [
  { name: 'Page Views',       type: 'bar',  data: [34,65,46,68,49,61,42,44,78,52,63,67] },
  { name: 'Clicks',           type: 'area', data: [8,12,7,17,21,11,5,9,7,29,12,35] },
  { name: 'Conversion Ratio', type: 'area', data: [12,16,11,22,28,25,15,29,35,45,42,48] },
]

const Chart = () => {
  const options = mergeChartOptions({
    chart: { height: 300, type: 'line' },
    stroke: { dashArray: [0,0,2], width: [0,2,2], curve: 'smooth' },
    fill: {
      opacity: [1,1,1],
      type: ['solid','gradient','gradient'],
      gradient: { type: 'vertical', inverseColors: false, opacityFrom: 0.5, opacityTo: 0, stops: [0,90] },
    },
    markers: { size: [0,0], strokeWidth: 2, hover: { size: 4 } },
    xaxis: { categories: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'] },
    legend: { show: true, position: 'top', horizontalAlign: 'right' },
  })

  return (
    <Card>
      <Card.Head>
        <span className="panel-title">Sales Overview</span>
        <span className="panel-sub">Page views, clicks, conversion</span>
      </Card.Head>
      <Card.Body>
        <ReactApexChart type="line" height={300} series={salesSeries} options={options} />
      </Card.Body>
    </Card>
  )
}

export default Chart
