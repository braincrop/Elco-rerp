'use client'
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import SvgIcon from './SvgIcon'
import styles from './Modal.module.css'

export const Modal = ({ open, onClose, title, size, children, footer }) => {
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

  if (!open || typeof document === 'undefined') return null

  return createPortal(
    <div
      className={styles.overlay}
      ref={overlayRef}
      onClick={(e) => e.target === overlayRef.current && onClose?.()}
    >
      <div
        className={[styles.dialog, size === 'lg' && styles.lg, size === 'sm' && styles.sm]
          .filter(Boolean)
          .join(' ')}
        role="dialog"
        aria-modal="true"
      >
        {title !== undefined && (
          <div className={styles.head}>
            <span className={styles.title}>{title}</span>
            <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
              <SvgIcon id="i-x" />
            </button>
          </div>
        )}
        <div className={styles.body}>{children}</div>
        {footer && <div className={styles.foot}>{footer}</div>}
      </div>
    </div>,
    document.body
  )
}

export default Modal
