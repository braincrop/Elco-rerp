'use client'
import { useTheme } from '@/context/BrandingContext'
import React, { useState } from 'react'
import { Button, Input, Label, FormGroup } from 'reactstrap'

const Page = () => {
  const { theme } = useTheme()
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
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="border rounded p-4 shadow-sm" style={{ width: '100%', maxWidth: 500, backgroundColor: theme.primaryColor }}>
        <h3 className="text-center mb-4 text-white">SMS Service</h3>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="sentType" className="text-white">
              Sent Type
            </Label>
            <Input
              type="select"
              id="sentType"
              value={form.sentType}
              onChange={(e) => handleChange('sentType', e.target.value)}
              style={{ background: 'transparent' }}>
              <option value="">Select Sent Type</option>
              <option value="transactional" className="custom-text">
                Transactional
              </option>
              <option value="promotional" className="custom-text">
                Promotional
              </option>
              <option value="otp" className="custom-text">
                OTP
              </option>
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="sendTo" className="text-white">
              Send To
            </Label>
            <Input
              type="select"
              id="sendTo"
              value={form.sendTo}
              onChange={(e) => handleChange('sendTo', e.target.value)}
              style={{ background: 'transparent' }}>
              <option value="">Select Recipient</option>
              <option value="all" className="custom-text">
                All Users
              </option>
              <option value="customers" className="custom-text">
                Customers
              </option>
              <option value="admins" className="custom-text">
                Admins
              </option>
              <option value="custom" className="custom-text">
                Custom Number
              </option>
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="message" className="text-white">
              Message
            </Label>
            <Input
              type="textarea"
              id="message"
              rows="4"
              style={{ background: 'transparent' }}
              value={form.message}
              onChange={(e) => handleChange('message', e.target.value)}
              placeholder="Enter your SMS message here..."
            />
          </FormGroup>
          <div className="d-grid mt-3">
            <Button color="primary" type="submit">
              Send SMS
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Page
