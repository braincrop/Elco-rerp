'use client'
import React, { useState } from 'react'
import Button from '@/components/ui/Button'
import Field from '@/components/ui/Field'

const Page = () => {
  const [form, setForm] = useState({
    sentType: '',
    sendTo: '',
    message: '',
  })

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('SMS Form Data:', form)
  }

  return (
    <div className="page-content">
      <div className="page-head">
        <div>
          <h1 className="page-title">SMS Service</h1>
          <p className="page-sub">Send SMS messages to users</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: '520px' }}>
        <div className="card-pad">
          <form onSubmit={handleSubmit}>
            <Field label="Sent Type">
              <select
                className="field-input"
                value={form.sentType}
                onChange={(e) => handleChange('sentType', e.target.value)}
              >
                <option value="">Select Sent Type</option>
                <option value="transactional">Transactional</option>
                <option value="promotional">Promotional</option>
                <option value="otp">OTP</option>
              </select>
            </Field>

            <Field label="Send To">
              <select
                className="field-input"
                value={form.sendTo}
                onChange={(e) => handleChange('sendTo', e.target.value)}
              >
                <option value="">Select Recipient</option>
                <option value="all">All Users</option>
                <option value="customers">Customers</option>
                <option value="admins">Admins</option>
                <option value="custom">Custom Number</option>
              </select>
            </Field>

            <Field label="Message">
              <textarea
                className="field-input"
                rows={4}
                value={form.message}
                onChange={(e) => handleChange('message', e.target.value)}
                placeholder="Enter your SMS message here..."
                style={{ resize: 'vertical' }}
              />
            </Field>

            <div style={{ marginTop: '16px' }}>
              <Button variant="primary" type="submit" style={{ width: '100%' }}>
                Send SMS
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Page
