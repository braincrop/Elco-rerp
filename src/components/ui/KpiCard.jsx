import Sparkline from './Sparkline'
import styles from './KpiCard.module.css'

export const KpiCard = ({ label, value, delta, deltaLabel, sparkline, sparklineColor }) => {
  const deltaPositive = delta > 0
  const deltaZero = delta === 0 || delta === undefined

  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <span className={styles.label}>{label}</span>
        {sparkline?.length > 1 && (
          <Sparkline
            data={sparkline}
            width={64}
            height={28}
            color={sparklineColor ?? (deltaPositive ? 'var(--good)' : 'var(--bad)')}
            filled
          />
        )}
      </div>
      <div className={styles.value}>{value}</div>
      {!deltaZero && (
        <div className={[styles.delta, deltaPositive ? styles.up : styles.down].join(' ')}>
          <span>{deltaPositive ? '↑' : '↓'}</span>
          <span>{Math.abs(delta)}%</span>
          {deltaLabel && <span className={styles.deltaLabel}>{deltaLabel}</span>}
        </div>
      )}
    </div>
  )
}

export default KpiCard
