'use client'
import { useState, useEffect } from 'react'
import { useTheme } from '@/context/BrandingContext'
import Card from '@/components/ui/Card'
import Field from '@/components/ui/Field'
import Button from '@/components/ui/Button'
import Notify from '@/components/Notify'

export default function BrandingPage() {
  const { theme } = useTheme()
  const [form, setForm] = useState({
    primaryColor: '',
    accentColor: '',
    accentLightColor: '',
    backgroundColor: '',
    surfaceColor: '',
    logoUrl: '',
    name: '',
  })

  useEffect(() => {
    if (theme) {
      setForm({
        primaryColor:     theme.primaryColor     || '',
        accentColor:      theme.accentColor      || '',
        accentLightColor: theme.accentLightColor || '',
        backgroundColor:  theme.backgroundColor  || '',
        surfaceColor:     theme.surfaceColor     || '',
        logoUrl:          theme.logoUrl          || '',
        name:             theme.name             || '',
      })
    }
  }, [theme])

  const set = (k) => (e) => {
    const v = e.target.value
    setForm((p) => ({ ...p, [k]: v }))
    // Live preview: update CSS var directly
    const varMap = {
      primaryColor:     '--brand-primary',
      accentColor:      '--brand-accent',
      accentLightColor: '--brand-accent-light',
      backgroundColor:  '--brand-bg',
      surfaceColor:     '--brand-surface',
    }
    if (varMap[k]) document.documentElement.style.setProperty(varMap[k], v)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    const clientId = process.env.NEXT_PUBLIC_CLIENT_ID
    try {
      const res = await fetch(`https://sprucesol.com/${clientId}/branding.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Save failed')
      Notify('success', 'Branding updated')
    } catch (err) {
      Notify('error', err.message || 'Failed to save branding')
    }
  }

  return (
    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Card>
        <Card.Head>
          <span className="panel-title">Brand Identity</span>
          <span className="panel-sub">Changes apply instantly as a preview. Save to persist.</span>
        </Card.Head>
        <Card.Body>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="Organization Name">
              <input value={form.name} onChange={set('name')} placeholder="Vendral" />
            </Field>
            <Field label="Logo URL">
              <input value={form.logoUrl} onChange={set('logoUrl')} placeholder="https://…" />
            </Field>
          </div>
        </Card.Body>
      </Card>

      <Card>
        <Card.Head>
          <span className="panel-title">Color Tokens</span>
          <span className="panel-sub">Only 5 values needed — everything else is derived automatically.</span>
        </Card.Head>
        <Card.Body>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {[
              ['primaryColor',     '--brand-primary',       'Primary (buttons, text)', '#1a1814'],
              ['accentColor',      '--brand-accent',        'Accent (links, focus)', 'oklch(0.45 0.10 265)'],
              ['accentLightColor', '--brand-accent-light',  'Accent Light (dark mode)', 'oklch(0.75 0.10 265)'],
              ['backgroundColor',  '--brand-bg',            'Background', '#f5f3ee'],
              ['surfaceColor',     '--brand-surface',       'Surface', '#faf8f3'],
            ].map(([key, cssVar, label, placeholder]) => (
              <Field key={key} label={label} helper={cssVar}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input
                    type="color"
                    value={form[key]?.startsWith('#') ? form[key] : '#888888'}
                    onChange={set(key)}
                    style={{ width: 34, height: 34, padding: 2, borderRadius: 6, border: '1px solid var(--line-2)', cursor: 'pointer', background: 'transparent' }}
                  />
                  <input
                    value={form[key]}
                    onChange={set(key)}
                    placeholder={placeholder}
                    style={{ flex: 1 }}
                  />
                </div>
              </Field>
            ))}
          </div>
        </Card.Body>
      </Card>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <Button variant="ghost" type="button" onClick={() => window.location.reload()}>Reset</Button>
        <Button type="submit">Save Branding</Button>
      </div>
    </form>
  )
}
