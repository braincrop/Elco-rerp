'use client'
import { useMemo, useState } from 'react'
import SlotCard from './SlotCard'
import styles from '../VirtualMachine.module.css'

export default function SlotGrid({
  slots,
  selectedSlot,
  onSelectSlot,
  dispensingCode,
  settings,
}) {
  const { slotsPerRow = 5, lowStockThreshold = 2, rows: allowedRows } = settings

  // Derive unique categories from slots
  const categories = useMemo(() => {
    const seen = new Set()
    const cats = []
    for (const s of slots) {
      if (s.category && !seen.has(s.category)) {
        seen.add(s.category)
        cats.push(s.category)
      }
    }
    return cats
  }, [slots])

  const [activeCat, setActiveCat] = useState(null) // null = All

  // Filter by category, then group by row
  const rowMap = useMemo(() => {
    const filtered = activeCat ? slots.filter((s) => s.category === activeCat) : slots
    const map = {}
    for (const slot of filtered) {
      if (allowedRows && !allowedRows.includes(slot.row)) continue
      map[slot.row] = map[slot.row] || []
      map[slot.row].push(slot)
    }
    return map
  }, [slots, activeCat, allowedRows])

  const rowKeys = Object.keys(rowMap).sort()

  if (slots.length === 0) {
    return (
      <div className={styles.noDevice}>
        <span className={styles.noDeviceIcon}>📦</span>
        <p className={styles.noDeviceText}>No slots loaded</p>
        <p className={styles.noDeviceSub}>Select a device above to load its product layout</p>
      </div>
    )
  }

  return (
    <div>
      {/* Category filter */}
      <div className={styles.cats}>
        <button
          type="button"
          className={[styles.cat, !activeCat && styles.catOn].filter(Boolean).join(' ')}
          onClick={() => setActiveCat(null)}
        >
          All · {slots.length}
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={[styles.cat, activeCat === cat && styles.catOn].filter(Boolean).join(' ')}
            onClick={() => setActiveCat(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Row groups */}
      {rowKeys.length === 0 && (
        <div className={styles.noDevice}>
          <p className={styles.noDeviceText}>No slots in this category</p>
        </div>
      )}

      {rowKeys.map((row) => {
        const rowSlots = rowMap[row]
        const firstCode = rowSlots[0]?.code
        const lastCode  = rowSlots[rowSlots.length - 1]?.code
        return (
          <div key={row} className={styles.rowGroup}>
            <div className={styles.rowHead}>
              <span className={styles.rowLabel}>Row {row}</span>
              {firstCode && lastCode && (
                <span className={styles.rowMeta}>{firstCode} — {lastCode}</span>
              )}
              <div className={styles.rowLine} />
            </div>
            <div
              className={styles.slots}
              style={{ '--cols': Math.min(slotsPerRow, rowSlots.length) }}
            >
              {rowSlots.map((slot) => (
                <SlotCard
                  key={slot.code}
                  slot={slot}
                  selected={selectedSlot?.code === slot.code}
                  dispensing={dispensingCode === slot.code}
                  onClick={onSelectSlot}
                  lowThreshold={lowStockThreshold}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
