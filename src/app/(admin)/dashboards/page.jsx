'use client'
import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import KpiCard from '@/components/ui/KpiCard'
import styles from './dashboard.module.css'

const Chart = dynamic(() => import('./components/Chart'), { ssr: false })
const User  = dynamic(() => import('./components/User'),  { ssr: false })

const KPI_DATA = [
  { label: 'Clicks',  value: '15,352', delta: 3.02,  deltaLabel: 'vs last month', sparkline: [8,12,9,15,11,14,16,13,15] },
  { label: 'Sales',   value: '8,764',  delta: -1.15, deltaLabel: 'vs last month', sparkline: [10,9,11,8,7,9,8,7,8] },
  { label: 'Events',  value: '5,123',  delta: 4.78,  deltaLabel: 'vs last month', sparkline: [4,6,5,7,6,8,7,9,8] },
  { label: 'Users',   value: '12,945', delta: 2.35,  deltaLabel: 'vs last month', sparkline: [10,11,10,12,11,13,12,13,13] },
]

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('token')) {
      router.replace('/auth/sign-in')
    }
  }, [])

  return (
    <div className="page-content">
      <div className="page-head">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-sub">Welcome back &mdash; here&apos;s what&apos;s happening today.</p>
        </div>
      </div>

      <div className="kpis">
        {KPI_DATA.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </div>

      <div className={styles.grid}>
        <Chart />
        <User />
      </div>
    </div>
  )
}
