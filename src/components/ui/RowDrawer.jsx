'use client'
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import SvgIcon from './SvgIcon'
import styles from './RowDrawer.module.css'

export const RowDrawer = ({ open, onClose, title, subtitle, children, footer }) => {
  const overlayRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const handler = (e) => e.key === 'Escape' && onClose?.()
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (typeof document === 'undefined') return null

  return createPortal(
    <div
      className={[styles.overlay, open && styles.visible].filter(Boolean).join(' ')}
      ref={overlayRef}
      onClick={(e) => e.target === overlayRef.current && onClose?.()}
      aria-hidden={!open}
    >
      <div className={[styles.drawer, open && styles.open].filter(Boolean).join(' ')} role="dialog" aria-modal="true">
        <div className={styles.head}>
          <div className={styles.headText}>
            <span className={styles.title}>{title}</span>
            {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
          </div>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
            <SvgIcon id="i-x" />
          </button>
        </div>
        <div className={styles.body}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>,
    document.body
  )
}

export default RowDrawer
