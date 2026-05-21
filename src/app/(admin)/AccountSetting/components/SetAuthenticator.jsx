import React, { useState } from 'react'
import { Card, CardBody, CardHeader, Form, FormGroup, Label, Input, Button, Alert, Badge, Row, Col } from 'reactstrap'
import { Icon } from '@iconify/react'

const SetAuthenticator = () => {
  const [step, setStep] = useState(1)
  const [code, setCode] = useState('')
  const [enabled, setEnabled] = useState(false)
  const secretKey = 'JBSW Y3DP EHPK 3PXP'

  const handleVerify = (e) => {
    e.preventDefault()
    if (code.length === 6) setEnabled(true)
  }

  if (enabled) {
    return (
      <div>
        <div className="d-flex align-items-center gap-2 mb-4">
          <div className="bg-success bg-opacity-10 text-success rounded-3 p-2">
            <Icon icon="mdi:shield-check" width={22} />
          </div>
          <div>
            <h5 className="mb-0 fw-semibold custom-text">Authenticator App</h5>
            <small className="custom-text">Two-factor authentication</small>
          </div>
        </div>
        <Card className="border-0 rounded-3 mb-4 shadow-lg">
          <CardBody className="p-4">
            <div className="d-flex align-items-center gap-3 mb-4">
              <div className="bg-success bg-opacity-10 text-success rounded-3 p-3">
                <Icon icon="mdi:shield-lock" width={32} />
              </div>
              <div>
                <div className="fw-semibold custom-text">Two-Factor Authentication Enabled</div>
                <div className="custom-text" style={{ fontSize: 13 }}>
                  Your account is now protected with 2FA
                </div>
              </div>
              <Badge color="success" className="ms-auto" pill>
                Active
              </Badge>
            </div>
            <Alert color="success" className="rounded-3 d-flex align-items-center gap-2" style={{ fontSize: 13 }}>
              <Icon icon="mdi:check-circle" width={18} />
              Authenticator app linked successfully!
            </Alert>
            <div className="bg-light rounded-3 p-3 mb-4">
              <p className="fw-medium mb-2" style={{ fontSize: 13 }}>
                Backup Codes
              </p>
              <p className="text-muted mb-3" style={{ fontSize: 12 }}>
                Save these codes somewhere safe. Each can be used once if you lose access to your authenticator.
              </p>
              <Row className="g-2">
                {['8392-1847', '2938-4756', '1029-3847', '5647-8392', '9182-3746', '4756-2938'].map((c, i) => (
                  <Col xs={6} key={i}>
                    <div className="bg-white border rounded-2 text-center py-2 fw-mono fw-semibold" style={{ fontSize: 13, fontFamily: 'monospace' }}>
                      {c}
                    </div>
                  </Col>
                ))}
              </Row>
              <Button color="outline-secondary" size="sm" className="rounded-2 mt-3">
                <Icon icon="mdi:download" width={14} className="me-1" />
                Download Codes
              </Button>
            </div>
            <Button
              color="outline-danger"
              className="rounded-2"
              size="sm"
              onClick={() => {
                setEnabled(false)
                setStep(1)
                setCode('')
              }}>
              <Icon icon="mdi:shield-off" width={15} className="me-1" />
              Disable 2FA
            </Button>
          </CardBody>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <div className="d-flex align-items-center gap-2 mb-4">
        <div className="bg-success bg-opacity-10 text-success rounded-3 p-2">
          <Icon icon="mdi:shield-check" width={22} />
        </div>
        <div>
          <h5 className="mb-0 fw-semibold custom-text">Set Authenticator</h5>
          <small className="custom-text">Enable two-factor authentication via QR code</small>
        </div>
      </div>

      {/* Steps indicator */}
      <div className="d-flex align-items-center gap-2 mb-4">
        {[1, 2, 3].map((s) => (
          <React.Fragment key={s}>
            <div
              className={`rounded-circle d-flex align-items-center justify-content-center fw-bold text-white ${step >= s ? 'bg-primary' : 'bg-secondary bg-opacity-25'}`}
              style={{ width: 28, height: 28, fontSize: 12 }}>
              {step > s ? <Icon icon="mdi:check" width={14} /> : s}
            </div>
            {s < 3 && <div className={`flex-grow-1 border-top border-2 ${step > s ? 'border-primary' : 'border-light'}`} />}
          </React.Fragment>
        ))}
      </div>

      <Card className="border-0 rounded-3 shadow-lg">
        <CardHeader className="bg-white border-bottom py-3">
          <span className="fw-semibold custom-text" style={{ fontSize: 14 }}>
            {step === 1 ? 'Install Authenticator App' : step === 2 ? 'Scan QR Code' : 'Verify Setup'}
          </span>
        </CardHeader>
        <CardBody className="p-4">
          {step === 1 && (
            <div>
              <p className="custom-text mb-4" style={{ fontSize: 14 }}>
                Download and install one of these authenticator apps on your mobile device:
              </p>
              <Row className="g-3 mb-4">
                {[
                  { icon: 'mdi:google', name: 'Google Authenticator', platforms: 'iOS & Android' },
                  { icon: 'mdi:microsoft', name: 'Microsoft Authenticator', platforms: 'iOS & Android' },
                  { icon: 'mdi:shield-key', name: 'Authy', platforms: 'iOS, Android & Desktop' },
                ].map((app, i) => (
                  <Col xs={12} key={i}>
                    <div className="d-flex align-items-center gap-3 border rounded-3 p-3">
                      <div
                        className="bg-primary bg-opacity-10 text-primary rounded-2 d-flex align-items-center justify-content-center"
                        style={{ width: 40, height: 40 }}>
                        <Icon icon={app.icon} width={22} />
                      </div>
                      <div>
                        <div className="fw-medium custom-text" style={{ fontSize: 14 }}>
                          {app.name}
                        </div>
                        <div className="text-muted custom-text" style={{ fontSize: 12 }}>
                          {app.platforms}
                        </div>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
              <Button color="primary" className="rounded-2 px-4" onClick={() => setStep(2)}>
                I have the app installed
                <Icon icon="mdi:arrow-right" width={16} className="ms-1" />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div>
              <p className="text-muted mb-4" style={{ fontSize: 14 }}>
                Scan this QR code with your authenticator app, or enter the secret key manually.
              </p>
              <div className="text-center mb-4">
                {/* QR Code placeholder */}
                <div className="border rounded-3 d-inline-block p-3 bg-white mb-3">
                  <div
                    style={{
                      width: 160,
                      height: 160,
                      background: 'repeating-conic-gradient(#000 0% 25%, #fff 0% 50%) 0 / 10px 10px',
                      borderRadius: 4,
                    }}
                  />
                </div>
                <div className="text-muted mb-2" style={{ fontSize: 12 }}>
                  Or enter this key manually:
                </div>
                <div
                  className="bg-light border rounded-2 px-4 py-2 d-inline-block fw-semibold"
                  style={{ fontFamily: 'monospace', letterSpacing: '0.1em', fontSize: 15 }}>
                  {secretKey}
                </div>
              </div>
              <div className="d-flex gap-2">
                <Button color="primary" className="rounded-2 px-4" onClick={() => setStep(3)}>
                  QR Code Scanned
                  <Icon icon="mdi:arrow-right" width={16} className="ms-1" />
                </Button>
                <Button color="outline-secondary" className="rounded-2" onClick={() => setStep(1)}>
                  Back
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <Form onSubmit={handleVerify}>
              <p className="text-muted mb-4" style={{ fontSize: 14 }}>
                Enter the 6-digit code shown in your authenticator app to verify the setup.
              </p>
              <FormGroup className="mb-4">
                <Label className="text-muted fw-medium" style={{ fontSize: 12 }}>
                  VERIFICATION CODE
                </Label>
                <Input
                  type="text"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  className="rounded-2 text-center fw-semibold fs-4"
                  style={{ letterSpacing: '0.4em', maxWidth: 200 }}
                  placeholder="000000"
                />
                <small className="text-muted">Code refreshes every 30 seconds</small>
              </FormGroup>
              <div className="d-flex gap-2">
                <Button type="submit" color="success" className="rounded-2 px-4" disabled={code.length !== 6}>
                  <Icon icon="mdi:shield-check" width={16} className="me-1" />
                  Enable 2FA
                </Button>
                <Button color="outline-secondary" className="rounded-2" onClick={() => setStep(2)}>
                  Back
                </Button>
              </div>
            </Form>
          )}
        </CardBody>
      </Card>
    </div>
  )
}

export default SetAuthenticator
