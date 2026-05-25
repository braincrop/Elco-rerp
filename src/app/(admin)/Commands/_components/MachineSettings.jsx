'use client'
import { RowDrawer } from '@/components/ui/RowDrawer'
import Toggle from '@/components/ui/Toggle'
import Button from '@/components/ui/Button'
import styles from '../VirtualMachine.module.css'

const COLS_OPTIONS = [3, 5, 8, 10]
const ROW_OPTIONS  = ['A', 'B', 'C', 'D', 'E', 'F']
const REFRESH_OPTIONS = [
  { label: 'Off',  value: 0 },
  { label: '30 s', value: 30 },
  { label: '1 min', value: 60 },
  { label: '5 min', value: 300 },
]

export default function MachineSettings({ open, onClose, settings, onChange, slots = [] }) {
  const set = (key, val) => onChange({ ...settings, [key]: val })

  const toggleRow = (row) => {
    const next = settings.rows.includes(row)
      ? settings.rows.filter((r) => r !== row)
      : [...settings.rows, row].sort()
    set('rows', next)
  }

  // Restock priority: slots with stock <= threshold, sorted by urgency
  const restockList = [...slots]
    .filter((s) => s.stock <= settings.lowStockThreshold)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 12)

  return (
    <RowDrawer
      open={open}
      onClose={onClose}
      title="Machine Settings"
      subtitle="Configure connection mode, grid layout, and thresholds"
      footer={
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </div>
      }
    >
      <div className={styles.settingsSection}>

        {/* Connection mode */}
        <div className={styles.settingGroup}>
          <p className={styles.settingGroupLabel}>Connection</p>
          <div className={styles.settingRow}>
            <div>
              <p className={styles.settingDesc}>Dispense mode</p>
              <p className={styles.settingDescSub}>
                {settings.dispenseMode === 'live'
                  ? 'Commands sent to device via socket'
                  : 'Local emulation — no network calls'}
              </p>
            </div>
            <Toggle
              checked={settings.dispenseMode === 'live'}
              onChange={(v) => set('dispenseMode', v ? 'live' : 'emulated')}
            />
          </div>
          <p style={{ fontSize: 11, color: 'var(--ink-4)', margin: '4px 0 0' }}>
            Swap point: toggle to live when the socket endpoint is ready.
            The emulator behaves identically without a device connected.
          </p>
        </div>

        {/* Grid config */}
        <div className={styles.settingGroup}>
          <p className={styles.settingGroupLabel}>Slot Grid</p>

          <div className={styles.settingRow} style={{ flexWrap: 'wrap', gap: 8 }}>
            <p className={styles.settingDesc} style={{ minWidth: 100 }}>Slots per row</p>
            <div style={{ display: 'flex', gap: 6 }}>
              {COLS_OPTIONS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => set('slotsPerRow', n)}
                  style={{
                    padding: '4px 12px', fontSize: 12, borderRadius: 'var(--radius-sm)',
                    border: '1px solid',
                    borderColor: settings.slotsPerRow === n ? 'var(--accent)' : 'var(--line-2)',
                    background: settings.slotsPerRow === n ? 'var(--accent-2)' : 'var(--surface)',
                    color: settings.slotsPerRow === n ? 'var(--accent)' : 'var(--ink-3)',
                    cursor: 'pointer', fontWeight: 600,
                  }}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className={styles.settingDesc} style={{ marginBottom: 8 }}>Active rows</p>
            <div className={styles.rowCheckboxes}>
              {ROW_OPTIONS.map((row) => (
                <label key={row} className={styles.rowCheckbox}>
                  <input
                    type="checkbox"
                    checked={settings.rows.includes(row)}
                    onChange={() => toggleRow(row)}
                  />
                  Row {row}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Thresholds */}
        <div className={styles.settingGroup}>
          <p className={styles.settingGroupLabel}>Thresholds</p>
          <div className={styles.settingRow}>
            <div>
              <p className={styles.settingDesc}>Low stock threshold</p>
              <p className={styles.settingDescSub}>Slots at or below this count show a LOW badge</p>
            </div>
            <input
              type="number"
              min={1} max={10}
              value={settings.lowStockThreshold}
              onChange={(e) => set('lowStockThreshold', Math.max(1, Number(e.target.value)))}
              style={{
                width: 60, padding: '6px 8px', fontSize: 13, fontFamily: 'monospace',
                textAlign: 'center', borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--line-2)', background: 'var(--surface)', color: 'var(--ink)',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Auto-refresh */}
        <div className={styles.settingGroup}>
          <p className={styles.settingGroupLabel}>Auto-Refresh</p>
          <div className={styles.settingRow} style={{ flexWrap: 'wrap', gap: 8 }}>
            <p className={styles.settingDesc} style={{ minWidth: 120 }}>Refresh products</p>
            <div style={{ display: 'flex', gap: 6 }}>
              {REFRESH_OPTIONS.map(({ label, value }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => set('autoRefresh', value)}
                  style={{
                    padding: '4px 10px', fontSize: 12, borderRadius: 'var(--radius-sm)',
                    border: '1px solid',
                    borderColor: settings.autoRefresh === value ? 'var(--accent)' : 'var(--line-2)',
                    background: settings.autoRefresh === value ? 'var(--accent-2)' : 'var(--surface)',
                    color: settings.autoRefresh === value ? 'var(--accent)' : 'var(--ink-3)',
                    cursor: 'pointer', fontWeight: 600,
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Restock priority list */}
        {restockList.length > 0 && (
          <div className={styles.settingGroup}>
            <p className={styles.settingGroupLabel}>Restock Needed</p>
            <div className={styles.restockList}>
              {restockList.map((slot) => (
                <div key={slot.code} className={styles.restockItem}>
                  <span className={styles.restockCode}>{slot.code}</span>
                  <span className={styles.restockName}>{slot.productName || '—'}</span>
                  {slot.stock === 0 ? (
                    <span className={[styles.restockBadge, styles.restockOut].join(' ')}>OUT</span>
                  ) : (
                    <span className={[styles.restockBadge, styles.restockLow].join(' ')}>{slot.stock} left</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </RowDrawer>
  )
}
