'use client'
import { createPortal } from 'react-dom'
import styles from './BulkActionBar.module.css'

export const BulkActionBar = ({ count, actions = [], onClear }) => {
  if (!count) return null
  if (typeof document === 'undefined') return null

  return createPortal(
    <div className={styles.bar} role="toolbar" aria-label="Bulk actions">
      <span className={styles.count}>
        <strong>{count}</strong> selected
      </span>
      <div className={styles.divider} />
      <div className={styles.actions}>
        {actions.map((action) => (
          <button
            key={action.label}
            type="button"
            className={[styles.action, action.danger && styles.danger].filter(Boolean).join(' ')}
            onClick={action.onClick}
          >
            {action.icon && <span className={styles.actionIcon}>{action.icon}</span>}
            {action.label}
          </button>
        ))}
      </div>
      <button type="button" className={styles.clear} onClick={onClear} aria-label="Clear selection">
        ✕
      </button>
    </div>,
    document.body
  )
}

export default BulkActionBar
