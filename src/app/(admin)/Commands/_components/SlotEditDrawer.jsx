'use client'
import { useEffect, useState } from 'react'
import { RowDrawer } from '@/components/ui/RowDrawer'
import Field from '@/components/ui/Field'
import Button from '@/components/ui/Button'
import Toggle from '@/components/ui/Toggle'
import styles from '../VirtualMachine.module.css'

export default function SlotEditDrawer({ slot, onSave, onClose }) {
  const [form, setForm] = useState(slot)

  useEffect(() => { setForm(slot) }, [slot])

  if (!slot) return null

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }))

  const handleSave = () => {
    onSave(form)
    onClose()
  }

  return (
    <RowDrawer
      open={!!slot}
      onClose={onClose}
      title={`Edit Slot ${slot.code}`}
      subtitle={`Motor ${slot.motorNo} · Row ${slot.row}`}
      footer={
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Slot</Button>
        </div>
      }
    >
      {form && (
        <div className={styles.editGrid}>
          <div>
            <Field label="Product Name">
              <input
                value={form.productName || ''}
                onChange={(e) => set('productName', e.target.value)}
                placeholder="e.g. Potato Chips"
              />
            </Field>
          </div>
          <div>
            <Field label="Category">
              <input
                value={form.category || ''}
                onChange={(e) => set('category', e.target.value)}
                placeholder="e.g. Snacks"
              />
            </Field>
          </div>

          <div>
            <Field label="Price (PKR)">
              <input
                type="number"
                value={form.price ?? ''}
                onChange={(e) => set('price', Number(e.target.value))}
                placeholder="150"
              />
            </Field>
          </div>
          <div>
            <Field label="Motor No.">
              <input
                type="number"
                value={form.motorNo ?? ''}
                onChange={(e) => set('motorNo', Number(e.target.value))}
                placeholder="1"
              />
            </Field>
          </div>

          <div>
            <Field label="Stock">
              <div className={styles.stockControls}>
                <button
                  type="button"
                  className={styles.stockBtn}
                  onClick={() => set('stock', Math.max(0, (form.stock || 0) - 1))}
                >−</button>
                <div className={styles.stockVal}>{form.stock ?? 0}</div>
                <button
                  type="button"
                  className={styles.stockBtn}
                  onClick={() => set('stock', Math.min(form.capacity || 99, (form.stock || 0) + 1))}
                >+</button>
              </div>
            </Field>
          </div>
          <div>
            <Field label="Capacity">
              <input
                type="number"
                value={form.capacity ?? ''}
                onChange={(e) => set('capacity', Number(e.target.value))}
                placeholder="10"
              />
            </Field>
          </div>

          <div className={styles.editFullRow}>
            <Field label="Image URL">
              <input
                value={form.image || ''}
                onChange={(e) => set('image', e.target.value)}
                placeholder="https://…"
              />
            </Field>
          </div>

          <div className={styles.editFullRow} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-2)', margin: 0 }}>Slot Active</p>
              <p style={{ fontSize: 11, color: 'var(--ink-4)', margin: '2px 0 0' }}>Inactive slots are greyed out and unclickable</p>
            </div>
            <Toggle checked={form.active ?? true} onChange={(v) => set('active', v)} />
          </div>
        </div>
      )}
    </RowDrawer>
  )
}
