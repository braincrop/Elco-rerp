'use client'
import { useState } from 'react'
import Field from '@/components/ui/Field'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

export default function ProfilePage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [saved, setSaved] = useState(false)
  const set = (k) => (e) => { setForm((p) => ({ ...p, [k]: e.target.value })); setSaved(false) }

  const handleSave = (e) => {
    e.preventDefault()
    setSaved(true)
  }

  return (
    <Card>
      <Card.Head actions={saved && <span style={{ fontSize: 12, color: 'var(--good)' }}>Saved</span>}>
        <span className="panel-title">Profile</span>
        <span className="panel-sub">Your personal information.</span>
      </Card.Head>
      <Card.Body>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Field label="Display Name">
            <input value={form.name} onChange={set('name')} placeholder="Your name" />
          </Field>
          <Field label="Email">
            <input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" />
          </Field>
          <Field label="Phone">
            <input type="tel" value={form.phone} onChange={set('phone')} placeholder="+1 555 000 0000" />
          </Field>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Card.Body>
    </Card>
  )
}
