'use client'
import { useState } from 'react'
import Card from '@/components/ui/Card'
import ToggleRow from '@/components/ui/ToggleRow'
import Button from '@/components/ui/Button'

const DEFAULTS = {
  emailSales:    true,
  emailDevice:   true,
  emailSecurity: true,
  pushOrders:    false,
  pushAlerts:    true,
}

export default function NotificationsPage() {
  const [prefs, setPrefs] = useState(DEFAULTS)
  const toggle = (k) => setPrefs((p) => ({ ...p, [k]: !p[k] }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Card>
        <Card.Head>
          <span className="panel-title">Email Notifications</span>
        </Card.Head>
        <Card.Body>
          <ToggleRow label="Sales summary" description="Daily digest of sales activity across all branches" checked={prefs.emailSales} onChange={() => toggle('emailSales')} />
          <ToggleRow label="Device alerts" description="Get notified when a device goes offline or has an error" checked={prefs.emailDevice} onChange={() => toggle('emailDevice')} />
          <ToggleRow label="Security events" description="Login attempts, password changes, and access alerts" checked={prefs.emailSecurity} onChange={() => toggle('emailSecurity')} />
        </Card.Body>
      </Card>

      <Card>
        <Card.Head>
          <span className="panel-title">Push Notifications</span>
        </Card.Head>
        <Card.Body>
          <ToggleRow label="New orders" description="Real-time push when a vend transaction completes" checked={prefs.pushOrders} onChange={() => toggle('pushOrders')} />
          <ToggleRow label="Low stock alerts" description="Notify when a slot drops below minimum threshold" checked={prefs.pushAlerts} onChange={() => toggle('pushAlerts')} />
        </Card.Body>
      </Card>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={() => {}}>Save Preferences</Button>
      </div>
    </div>
  )
}
