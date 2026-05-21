import React, { useState } from 'react'
import { Card, CardBody, CardHeader, Form, FormGroup, Label, Input, Button, Alert, Progress } from 'reactstrap'
import { Icon } from '@iconify/react'

function getStrength(password) {
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  return score
}

const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong']
const strengthColor = ['', 'danger', 'warning', 'info', 'success']

const ResetPassword = () => {
  const [form, setForm] = useState({ current: '', newPass: '', confirm: '' })
  const [show, setShow] = useState({ current: false, newPass: false, confirm: false })
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const strength = getStrength(form.newPass)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.current) return setError('Please enter your current password.')
    if (form.newPass.length < 8) return setError('New password must be at least 8 characters.')
    if (form.newPass !== form.confirm) return setError('Passwords do not match.')
    setSuccess(true)
    setForm({ current: '', newPass: '', confirm: '' })
  }

  const ToggleBtn = ({ field }) => (
    <button
      type="button"
      className="btn btn-link text-muted p-0 position-absolute end-0 top-50 translate-middle-y me-3"
      onClick={() => setShow({ ...show, [field]: !show[field] })}
      style={{ zIndex: 5 }}>
      <Icon icon={show[field] ? 'mdi:eye-off' : 'mdi:eye'} width={18} />
    </button>
  )

  return (
    <div>
      <div className="d-flex align-items-center gap-2 mb-4">
        <div className="bg-warning bg-opacity-10 text-warning rounded-3 p-2">
          <Icon icon="mdi:lock-reset" width={22} />
        </div>
        <div>
          <h5 className="mb-0 fw-semibold custom-text">Reset Password</h5>
          <small className="custom-text">Update your account password</small>
        </div>
      </div>

      {success && (
        <Alert color="success" className="rounded-3 d-flex align-items-center gap-2">
          <Icon icon="mdi:check-circle" width={20} />
          Password updated successfully!
        </Alert>
      )}
      {error && (
        <Alert color="danger" className="rounded-3 d-flex align-items-center gap-2">
          <Icon icon="mdi:alert-circle" width={20} />
          {error}
        </Alert>
      )}

      <Card className="border-0 rounded-3 mb-4 shadow-lg">
        <CardHeader className="bg-white border-bottom py-3">
          <span className="fw-semibold custom-text" style={{ fontSize: 14 }}>
            Change Password
          </span>
        </CardHeader>
        <CardBody className="p-4">
          <Form onSubmit={handleSubmit}>
            <FormGroup className="mb-3">
              <Label className="custom-text fw-medium" style={{ fontSize: 12 }}>
                CURRENT PASSWORD
              </Label>
              <div className="position-relative">
                <Input
                  type={show.current ? 'text' : 'password'}
                  name="current"
                  value={form.current}
                  onChange={handleChange}
                  style={{ backgroundColor: 'transparent' }}
                  className="rounded-2 pe-5"
                  placeholder="Enter current password"
                />
                <ToggleBtn field="current" />
              </div>
            </FormGroup>

            <FormGroup className="mb-1">
              <Label className="custom-text fw-medium" style={{ fontSize: 12 }}>
                NEW PASSWORD
              </Label>
              <div className="position-relative">
                <Input
                  type={show.newPass ? 'text' : 'password'}
                  name="newPass"
                  value={form.newPass}
                  onChange={handleChange}
                  style={{ backgroundColor: 'transparent' }}
                  className="rounded-2 pe-5"
                  placeholder="Enter new password"
                />
                <ToggleBtn field="newPass" />
              </div>
            </FormGroup>

            {form.newPass && (
              <div className="mb-3">
                <Progress value={(strength / 4) * 100} color={strengthColor[strength]} className="rounded-pill mb-1" style={{ height: 4 }} />
                <small className={`text-${strengthColor[strength]}`}>Password strength: {strengthLabel[strength]}</small>
              </div>
            )}

            <FormGroup className="mb-4">
              <Label className="custom-text fw-medium" style={{ fontSize: 12 }}>
                CONFIRM NEW PASSWORD
              </Label>
              <div className="position-relative">
                <Input
                  type={show.confirm ? 'text' : 'password'}
                  style={{ backgroundColor: 'transparent' }}
                  name="confirm"
                  value={form.confirm}
                  onChange={handleChange}
                  className={`rounded-2 pe-5 ${form.confirm && form.newPass !== form.confirm ? 'is-invalid' : form.confirm ? 'is-valid' : ''}`}
                  placeholder="Confirm new password"
                />
                <ToggleBtn field="confirm" />
              </div>
              {form.confirm && form.newPass !== form.confirm && <small className="text-danger">Passwords do not match</small>}
            </FormGroup>

            <div className="rounded-3 p-3 mb-4">
              <p className="custom-text mb-2 fw-medium" style={{ fontSize: 13 }}>
                Password requirements:
              </p>
              {[
                ['mdi:check', 'At least 8 characters', form.newPass.length >= 8],
                ['mdi:check', 'One uppercase letter', /[A-Z]/.test(form.newPass)],
                ['mdi:check', 'One number', /[0-9]/.test(form.newPass)],
                ['mdi:check', 'One special character', /[^A-Za-z0-9]/.test(form.newPass)],
              ].map(([icon, label, met], i) => (
                <div key={i} className={`d-flex align-items-center gap-2 mb-1 ${met ? 'text-success' : 'text-muted'}`} style={{ fontSize: 13 }}>
                  <Icon icon={met ? 'mdi:check-circle' : 'mdi:circle-outline'} width={15} />
                  {label}
                </div>
              ))}
            </div>

            <Button type="submit" color="primary" className="rounded-2 px-4">
              <Icon icon="mdi:lock-check" width={16} className="me-1" />
              Update Password
            </Button>
          </Form>
        </CardBody>
      </Card>
    </div>
  )
}

export default ResetPassword
