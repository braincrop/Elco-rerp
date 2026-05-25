'use client'
import { useState, useEffect } from 'react'
import SvgIcon from '@/components/ui/SvgIcon'
import CommandLog from './CommandLog'
import styles from '../VirtualMachine.module.css'

const KEYS = ['A', 'B', 'C', 'D', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'CLR', 'OK']

export default function CommandPanel({
  selectedSlot,
  onSelectByCode,
  dispense,
  testMotor,
  emergencyStop,
  commandLog,
  dispensingCode,
  isLive,
}) {
  const [entered, setEntered] = useState('')

  // When OK is pressed (or code is complete like "A3"), try to select the slot
  const handleKey = (k) => {
    if (k === 'CLR') { setEntered(''); return }
    if (k === 'OK') {
      if (entered.length >= 2) onSelectByCode(entered)
      setEntered('')
      return
    }
    const next = (entered + k).slice(0, 3)
    setEntered(next)
    // Auto-select when a letter + digit is entered (e.g. A3)
    if (next.length >= 2 && /^[A-F]\d/.test(next)) {
      onSelectByCode(next)
    }
  }

  // Clear entered code when slot changes externally
  useEffect(() => { setEntered('') }, [selectedSlot?.code])

  const canDispense = selectedSlot && selectedSlot.active && selectedSlot.stock > 0 && !dispensingCode

  return (
    <div className={styles.panel}>
      {/* ── Selected slot preview ── */}
      <div className={styles.panelSection}>
        <div className={styles.panelLabel}>Selected slot</div>
        <div className={styles.selectedCard}>
          {selectedSlot?.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={selectedSlot.image} alt="" className={styles.selectedImg} />
          ) : (
            <div className={styles.selectedPh} />
          )}
          <div className={styles.selectedInfo}>
            {selectedSlot ? (
              <>
                <div className={styles.selectedCode}>{selectedSlot.code} · Motor {selectedSlot.motorNo}</div>
                <div className={styles.selectedName}>{selectedSlot.productName || '—'}</div>
                <div className={styles.selectedMeta}>
                  {selectedSlot.price != null ? `PKR ${selectedSlot.price}` : ''}{' '}
                  · {selectedSlot.stock} left
                </div>
              </>
            ) : (
              <div className={styles.selectedName} style={{ color: 'var(--ink-4)' }}>No slot selected</div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.panelDivider} />

      {/* ── LCD + Keypad ── */}
      <div className={styles.panelSection}>
        <div className={styles.lcdShell}>
          <div className={styles.lcdRow}>
            <span className={styles.lcdTag}>Selected slot</span>
            <span className={styles.lcdMode}>{isLive ? 'LIVE' : 'EMU'}</span>
          </div>
          <div className={styles.lcdScreen}>
            {selectedSlot ? (
              <>
                <p className={styles.lcdCode}>{selectedSlot.code} / Motor {selectedSlot.motorNo}</p>
                <p className={styles.lcdName}>{selectedSlot.productName}</p>
                <p className={styles.lcdInfo}>
                  PKR {selectedSlot.price} &nbsp;|&nbsp; Stock {selectedSlot.stock}
                </p>
              </>
            ) : (
              <p className={styles.lcdEmpty}>Select a slot</p>
            )}
          </div>
        </div>

        {/* Entered code display */}
        <div className={styles.enteredDisplay}>{entered || '————'}</div>

        {/* 4×4 Keypad */}
        <div className={styles.keypadGrid}>
          {KEYS.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => handleKey(k)}
              className={[
                styles.key,
                k === 'OK'  && styles.keyAction,
                k === 'CLR' && styles.keyClear,
              ].filter(Boolean).join(' ')}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.panelDivider} />

      {/* ── Action buttons ── */}
      <div className={styles.panelSection}>
        <div className={styles.actionRow}>
          <button
            type="button"
            className={styles.dispenseBtn}
            disabled={!canDispense}
            onClick={() => dispense(selectedSlot)}
          >
            <SvgIcon id="i-arrow" className="ic-sm" /> Dispense
          </button>
          <button
            type="button"
            className={styles.testBtn}
            disabled={!selectedSlot || !!dispensingCode}
            onClick={() => testMotor(selectedSlot)}
          >
            <SvgIcon id="i-device" className="ic-sm" /> Test Motor
          </button>
        </div>
      </div>

      <div className={styles.panelDivider} />

      {/* ── Command Log ── */}
      <CommandLog entries={commandLog} />

      {/* ── Emergency Stop ── */}
      <button type="button" className={styles.stopBtn} onClick={emergencyStop}>
        <SvgIcon id="i-warn" className="ic-sm" /> Emergency Stop
      </button>
    </div>
  )
}
