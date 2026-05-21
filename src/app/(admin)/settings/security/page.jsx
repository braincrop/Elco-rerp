'use client'
import { useState } from 'react'
import Field from '@/components/ui/Field'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Notify from '@/components/Notify'

export default function SecurityPage() {
  const [form, setForm] = useState({ current: '', next: '', confirm: '' })
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }))

  const handleSave = (e) => {
    e.preventDefault()
    if (form.next !== form.confirm) return Notify('error', 'New passwords do not match')
    if (form.next.length < 8) return Notify('error', 'Password must be at least 8 characters')
    Notify('success', 'Password updated')
    setForm({ current: '', next: '', confirm: '' })
  }

  return (
    <Card>
      <Card.Head>
        <span className="panel-title">Security</span>
        <span className="panel-sub">Change your password.</span>
      </Card.Head>
      <Card.Body>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 400 }}>
          <Field label="Current Password">
            <input type="password" value={form.current} onChange={set('current')} autoComplete="current-password" />
          </Field>
          <Field label="New Password">
            <input type="password" value={form.next} onChange={set('next')} autoComplete="new-password" />
          </Field>
          <Field label="Confirm New Password">
            <input type="password" value={form.confirm} onChange={set('confirm')} autoComplete="new-password" />
          </Field>
          <div>
            <Button type="submit">Update Password</Button>
          </div>
        </form>
      </Card.Body>
    </Card>
  )
}
