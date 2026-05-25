'use client'
import styles from '../VirtualMachine.module.css'

export default function SlotCard({ slot, selected, dispensing, onClick, lowThreshold = 2 }) {
  const isEmpty = slot.stock === 0
  const isLow   = !isEmpty && slot.stock <= lowThreshold

  const classNames = [
    styles.slot,
    selected   && styles.slotSel,
    isEmpty    && styles.slotOut,
    !slot.active && styles.slotInactive,
  ].filter(Boolean).join(' ')

  const stkClass = isEmpty ? styles.slotStkOut : isLow ? styles.slotStkLow : styles.slotStk

  return (
    <button type="button" className={classNames} onClick={() => onClick(slot)}>
      {/* Product image or diagonal placeholder */}
      {slot.image ? (
        <div className={styles.slotImgWrap}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={slot.image} alt={slot.productName || slot.code} className={styles.slotImg} />
        </div>
      ) : (
        <div className={styles.slotPh} />
      )}

      {/* Stock status badge */}
      {isEmpty && <span className={styles.outBadge}>OUT</span>}
      {isLow   && !isEmpty && <span className={styles.lowBadge}>LOW</span>}

      {/* Dispensing overlay */}
      {dispensing && <div className={styles.dispensingOverlay}>Dispensing…</div>}

      {/* Slot meta */}
      <div className={styles.slotMeta}>
        <div className={styles.slotCode}>{slot.code}</div>
        {slot.productName && (
          <div className={styles.slotName} title={slot.productName}>{slot.productName}</div>
        )}
        <div className={stkClass}>
          {isEmpty ? 'OUT OF STOCK' : isLow ? `${slot.stock} left · LOW` : `${slot.stock} left`}
        </div>
      </div>
    </button>
  )
}
