'use client'
import { useState } from 'react'
import styles from '../VirtualMachine.module.css'

const DOT = {
  success: styles.logDotOk,
  error:   styles.logDotErr,
  warn:    styles.logDotWarn,
}

function fmt(date) {
  return date instanceof Date
    ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : ''
}

export default function CommandLog({ entries = [] }) {
  const [open, setOpen] = useState(false)

  // Auto-open when first entry arrives
  const handleToggle = () => setOpen((v) => !v)

  return (
    <div className={styles.logWrap}>
      <div className={styles.logToggle} onClick={handleToggle} role="button" tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleToggle()}>
        <span className={styles.logToggleLabel}>
          {open ? '▾' : '▸'} Command Log
        </span>
        {entries.length > 0 && (
          <span className={styles.logToggleCount}>{entries.length}</span>
        )}
      </div>

      {open && (
        <div className={styles.logBody}>
          {entries.length === 0 ? (
            <p className={styles.logEmpty}>No commands yet</p>
          ) : (
            entries.map((e) => (
              <div key={e.id} className={styles.logEntry}>
                <div className={[styles.logDot, DOT[e.status] ?? styles.logDotWarn].join(' ')} />
                <span className={styles.logTime}>{fmt(e.time)}</span>
                <span className={styles.logAction}>{e.action}</span>
                {e.slotCode && <span className={styles.logSlot}>{e.slotCode}</span>}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
