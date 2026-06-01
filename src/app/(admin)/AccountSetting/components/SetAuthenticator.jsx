import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Card, CardBody, CardHeader, Badge, Alert, Button, Row, Col, Form, FormGroup, Label, Input } from 'reactstrap'
import { Icon } from '@iconify/react'
import { useDispatch, useSelector } from 'react-redux'
import { allUser, Enable2fA, Post2FAType } from '@/redux/slice/Authentication/AuthenticationSlice'

const handleDownloadCodes = (backupCode) => {
    const backupCodes = ['8392-1847', '2938-4756', '1029-3847', '5647-8392', '9182-3746', '4756-2938']

  const content = `Rerp-System - BACKUP CODES
=====================
Generated: ${new Date().toLocaleDateString()}

Keep these codes safe. Each code can only be used once.

${backupCode?.map((code, i) => `${i + 1}. ${code}`).join('\n')}

=====================
Do not share these codes with anyone.`

  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'backup-codes.txt'
  a.click()
  URL.revokeObjectURL(url)
}

const SetAuthenticator = () => {
  const [selectedMethod, setSelectedMethod] = useState('')
  const [step, setStep] = useState(1)
  const [code, setCode] = useState('')
  const { TFAtype, backupCode } = useSelector(allUser)
  const dispatch = useDispatch()
  const [enabled, setEnabled] = useState(false)
  const [emailCode, setEmailCode] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const otpAuthUrl = TFAtype?.qrUri || 'qrcode-placeholder'

  // console.log('TFAtype from Redux:', TFAtype.qrUri)
  console.log('Backup codes from Redux:', backupCode)
  const handleSelectMethod = async (method) => {
    setSelectedMethod(method)
    setStep(1)
    setCode('')
    setEmailCode('')
    setEmailSent(false)

    try {
      setLoading(true)
      dispatch(Post2FAType({ provider: method }))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // ─── API: Send Email OTP ──────────────────────────────────────────
  const handleSendEmailCode = async () => {
    try {
      setLoading(true)
      dispatch(Post2FAType({ provider: selectedMethod }))
      console.log('API call: send email OTP')
      setEmailSent(true)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // ─── API: Verify Email OTP ────────────────────────────────────────
  const handleVerifyEmail = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const daata = {
        provider: selectedMethod,
        code: emailCode,
      }
      console.log('Data to send for enabling 2FA:', daata)
      dispatch(Enable2fA(daata))
      // const res = await api.post('/2fa/verify-email-otp', { code: emailCode })
      console.log('API call: verify email OTP →', emailCode)
      setEnabled(true)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // ─── API: Verify Authenticator ────────────────────────────────────
  const handleVerifyAuthenticator = async (e) => {
    e.preventDefault()
    if (code.length !== 6) return
    try {
      setLoading(true)
      const daata = {
        provider: selectedMethod,
        code: code,
      }
      console.log('Data to send for enabling 2FA:', daata)
      dispatch(Enable2fA(daata))
      console.log('API call: verify authenticator →', code)
      setEnabled(true)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // ─── Disable 2FA ──────────────────────────────────────────────────
  const handleDisable = () => {
    setEnabled(false)
    setSelectedMethod(null)
    setStep(1)
    setCode('')
    setEmailCode('')
    setEmailSent(false)
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
                  {selectedMethod === 'Email' ? ' via Email' : ' via Authenticator App'}
                </div>
              </div>
              <Badge color="success" className="ms-auto" pill>
                Active
              </Badge>
            </div>
            <Alert color="success" className="rounded-3 d-flex align-items-center gap-2" style={{ fontSize: 13 }}>
              <Icon icon="mdi:check-circle" width={18} />
              {selectedMethod === 'Email' ? 'Email OTP linked successfully!' : 'Authenticator app linked successfully!'}
            </Alert>
            {selectedMethod === 'Authenticator' && (
              <div className="bg-light rounded-3 p-3 mb-4">
                <p className="fw-medium mb-2" style={{ fontSize: 13 }}>
                  Backup Codes
                </p>
                <p className="text-muted mb-3" style={{ fontSize: 12 }}>
                  Save these codes somewhere safe. Each can be used once if you lose access to your Authenticator.
                </p>
                <Row className="g-2">
                  {backupCode?.map((c, i) => (
                    <Col xs={6} key={i}>
                      <div className="bg-white border rounded-2 text-center py-2 fw-semibold" style={{ fontSize: 13, fontFamily: 'monospace' }}>
                        {c}
                      </div>
                    </Col>
                  ))}
                </Row>
                <Button color="outline-secondary" size="sm" className="rounded-2 mt-3" onClick={() => handleDownloadCodes(backupCode)}>
                  <Icon icon="mdi:download" width={14} className="me-1" />
                  Download Codes
                </Button>
              </div>
            )}
            <Button color="outline-danger" className="rounded-2" size="sm" onClick={handleDisable}>
              <Icon icon="mdi:shield-off" width={15} className="me-1" />
              Disable 2FA
            </Button>
          </CardBody>
        </Card>
      </div>
    )
  }

  // ════════════════════════════════════════════════════════════════
  // METHOD SELECTION CARDS
  // ════════════════════════════════════════════════════════════════
  if (!selectedMethod) {
    return (
      <div>
        <div className="d-flex align-items-center gap-2 mb-4">
          <div className="bg-success bg-opacity-10 text-success rounded-3 p-2">
            <Icon icon="mdi:shield-check" width={22} />
          </div>
          <div>
            <h5 className="mb-0 fw-semibold custom-text">Set Two-Factor Authentication</h5>
            <small className="custom-text">Choose your preferred 2FA method</small>
          </div>
        </div>

        <Row className="g-3">
          <Col xs={12} md={6}>
            <Card
              className="border rounded-3 h-100 cursor-pointer"
              style={{ cursor: 'pointer', transition: 'box-shadow 0.2s' }}
              onClick={() => handleSelectMethod('Email')}>
              <CardBody className="p-4">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="bg-primary bg-opacity-10 text-primary rounded-3 p-3">
                    <Icon icon="mdi:email-lock" width={28} />
                  </div>
                  <div>
                    <div className="fw-semibold custom-text">Email OTP</div>
                    <div className="text-muted" style={{ fontSize: 12 }}>
                      Verify via email code
                    </div>
                  </div>
                </div>
                <p className="text-muted mb-4" style={{ fontSize: 14 }}>
                  We'll send a 6-digit verification code to your registered email address.
                </p>
              </CardBody>
            </Card>
          </Col>

          {/* Authenticator Card */}
          <Col xs={12} md={6}>
            <Card
              className="border rounded-3 h-100 cursor-pointer"
              style={{ cursor: 'pointer', transition: 'box-shadow 0.2s' }}
              onClick={() => handleSelectMethod('Authenticator')}>
              <CardBody className="p-4">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="bg-success bg-opacity-10 text-success rounded-3 p-3">
                    <Icon icon="mdi:shield-key" width={28} />
                  </div>
                  <div>
                    <div className="fw-semibold custom-text">Authenticator App</div>
                    <div className="text-muted" style={{ fontSize: 12 }}>
                      Verify via QR code app
                    </div>
                  </div>
                </div>
                <p className="text-muted mb-0" style={{ fontSize: 13 }}>
                  Use Google Authenticator, Microsoft Authenticator, or Authy to scan a QR code and generate codes.
                </p>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }

  // ════════════════════════════════════════════════════════════════
  // EMAIL 2FA FLOW
  // ════════════════════════════════════════════════════════════════
  if (selectedMethod === 'Email') {
    return (
      <div>
        <div className="d-flex align-items-center gap-2 mb-4">
          <Button color="link" className="p-0 me-1" onClick={() => setSelectedMethod(null)}>
            <Icon icon="mdi:arrow-left" width={20} />
          </Button>
          <div className="bg-primary bg-opacity-10 text-primary rounded-3 p-2">
            <Icon icon="mdi:email-lock" width={22} />
          </div>
          <div>
            <h5 className="mb-0 fw-semibold custom-text">Email OTP</h5>
            <small className="custom-text">Verify your identity via email</small>
          </div>
        </div>

        <Card className="border-0 rounded-3 shadow-lg">
          <CardBody className="p-4">
            <Form onSubmit={handleVerifyEmail}>
              {TFAtype?.statusCode === '200' && (
                <Alert color="info" className="rounded-3 d-flex align-items-center gap-2 mb-4" style={{ fontSize: 13 }}>
                  <Icon icon="mdi:information" width={18} />
                  Code sent! Check your email inbox.
                </Alert>
              )}

              <FormGroup className="mb-4">
                <Label className="text-muted fw-medium" style={{ fontSize: 12 }}>
                  VERIFICATION CODE
                </Label>
                <Input
                  type="text"
                  maxLength={6}
                  value={emailCode}
                  onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, ''))}
                  className="rounded-2 text-center fw-semibold fs-4"
                  style={{ letterSpacing: '0.4em', maxWidth: 200 }}
                  placeholder="000000"
                />
                <small className="text-muted">
                  Didn't receive?{' '}
                  <span role="button" className="text-primary" onClick={handleSendEmailCode}>
                    Resend
                  </span>
                </small>
              </FormGroup>
              <div className="d-flex gap-2">
                <Button type="submit" color="success" className="rounded-2 px-4" disabled={emailCode.length !== 6 || loading}>
                  <Icon icon="mdi:shield-check" width={16} className="me-1" />
                  {loading ? 'Verifying...' : 'Verify & Enable'}
                </Button>
                {/* <Button color="outline-secondary" className="rounded-2" onClick={() => setEmailSent(false)}>
                  Back
                </Button> */}
              </div>
            </Form>
          </CardBody>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <div className="d-flex align-items-center gap-2 mb-4">
        <Button color="link" className="p-0 me-1" onClick={() => setSelectedMethod(null)}>
          <Icon icon="mdi:arrow-left" width={20} />
        </Button>
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
          <div key={s} className="d-flex align-items-center flex-grow-1">
            <div
              className={`rounded-circle d-flex align-items-center justify-content-center fw-bold text-white ${step >= s ? 'bg-primary' : 'bg-secondary bg-opacity-25'}`}
              style={{ width: 28, height: 28, fontSize: 12, flexShrink: 0 }}>
              {step > s ? <Icon icon="mdi:check" width={14} /> : s}
            </div>
            {s < 3 && <div className={`flex-grow-1 border-top border-2 ${step > s ? 'border-primary' : 'border-light'}`} />}
          </div>
        ))}
      </div>

      <Card className="border-0 rounded-3 shadow-lg">
        <CardHeader className="bg-white border-bottom py-3">
          <span className="fw-semibold custom-text" style={{ fontSize: 14 }}>
            {step === 1 ? 'Install Authenticator App' : step === 2 ? 'Scan QR Code' : 'Verify Setup'}
          </span>
        </CardHeader>
        <CardBody className="p-4">
          {/* Step 1 */}
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

          {/* Step 2 — Real QR Code */}
          {step === 2 && (
            <div>
              <p className="text-muted mb-4" style={{ fontSize: 14 }}>
                Scan this QR code with your authenticator app, or enter the secret key manually.
              </p>
              <div className="text-center mb-4">
                <div className="border rounded-3 d-inline-block p-3 bg-white mb-3">
                  <QRCodeSVG value={otpAuthUrl} size={160} />
                </div>
                {/* <div className="text-muted mb-2" style={{ fontSize: 12 }}>
                  Or enter this key manually:
                </div> */}
                {/* <div
                  className="bg-light border rounded-2 px-4 py-2 d-inline-block fw-semibold"
                  style={{ fontFamily: 'monospace', letterSpacing: '0.1em', fontSize: 15 }}>
                  {secretKey}
                </div> */}
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

          {/* Step 3 */}
          {step === 3 && (
            <Form onSubmit={handleVerifyAuthenticator}>
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
                <Button type="submit" color="success" className="rounded-2 px-4" disabled={code.length !== 6 || loading}>
                  <Icon icon="mdi:shield-check" width={16} className="me-1" />
                  {loading ? 'Verifying...' : 'Enable 2FA'}
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
