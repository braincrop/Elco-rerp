'use client'
import DarkLogo from '@/assets/images/Logo-primidigitals 1 (1).png'
import LightLogo from '@/assets/images/Logo-primidigitals 1 (1).png'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { FormGroup, Label, Input } from 'reactstrap'
import { useDispatch, useSelector } from 'react-redux'
import { allUser, Login, Send2fA } from '@/redux/slice/Authentication/AuthenticationSlice'
import Notify from '@/components/Notify'
import { Spinner } from 'reactstrap'
import { useTheme } from '@/context/BrandingContext'

// ─── Full Screen Loader ───────────────────────────────────────────────────────
export function FullScreenLoader() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.75)',
        zIndex: 999999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(2px)',
      }}>
      <Spinner style={{ width: '3rem', height: '3rem' }} />
      <p className="mt-3 text-light">Please wait...</p>
    </div>
  )
}

// ─── Step Indicator ───────────────────────────────────────────────────────────
function StepIndicator({ currentStep, totalSteps }) {
  return (
    <div className="d-flex align-items-center justify-content-center gap-2 mb-4">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: i < currentStep ? '#4ade80' : i === currentStep ? '#fff' : 'rgba(255,255,255,0.2)',
              border: i === currentStep ? '2px solid #fff' : '2px solid transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 700,
              color: i < currentStep ? '#000' : i === currentStep ? '#000' : 'rgba(255,255,255,0.5)',
              transition: 'all 0.3s ease',
            }}>
            {i < currentStep ? '✓' : i + 1}
          </div>
          {i < totalSteps - 1 && (
            <div
              style={{
                width: 32,
                height: 2,
                background: i < currentStep - 1 ? '#4ade80' : 'rgba(255,255,255,0.2)',
                transition: 'all 0.3s ease',
              }}
            />
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Method Card ─────────────────────────────────────────────────────────────
function MethodCard({ icon, title, description, selected, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        border: selected ? '2px solid #fff' : '2px solid rgba(255,255,255,0.25)',
        borderRadius: 12,
        padding: '14px 16px',
        cursor: 'pointer',
        marginBottom: 12,
        background: selected ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        transition: 'all 0.2s ease',
      }}>
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: selected ? '#fff' : 'rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 20,
          flexShrink: 0,
          transition: 'all 0.2s ease',
        }}>
        {icon}
      </div>
      <div>
        <div style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>{title}</div>
        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 2 }}>{description}</div>
      </div>
      <div style={{ marginLeft: 'auto', flexShrink: 0 }}>
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: '50%',
            border: '2px solid',
            borderColor: selected ? '#fff' : 'rgba(255,255,255,0.3)',
            background: selected ? '#fff' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {selected && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#000' }} />}
        </div>
      </div>
    </div>
  )
}

// ─── OTP Input ────────────────────────────────────────────────────────────────
function OTPInput({ value, onChange }) {
  const digits = 6
  const arr = value.split('').concat(Array(digits).fill('')).slice(0, digits)

  const handleKey = (e, idx) => {
    if (e.key === 'Backspace') {
      const newVal = value.slice(0, -1)
      onChange(newVal)
      if (idx > 0) document.getElementById(`otp-${idx - 1}`)?.focus()
      return
    }
    if (!/^\d$/.test(e.key)) return
    const newVal = (value + e.key).slice(0, digits)
    onChange(newVal)
    if (idx < digits - 1) document.getElementById(`otp-${idx + 1}`)?.focus()
  }

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, digits)
    onChange(pasted)
    document.getElementById(`otp-${Math.min(pasted.length, digits - 1)}`)?.focus()
  }

  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center', margin: '8px 0' }}>
      {arr.map((digit, idx) => (
        <input
          key={idx}
          id={`otp-${idx}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onPaste={handlePaste}
          onKeyDown={(e) => handleKey(e, idx)}
          onChange={() => {}}
          style={{
            width: 44,
            height: 52,
            textAlign: 'center',
            fontSize: 22,
            fontWeight: 700,
            background: 'rgba(255,255,255,0.1)',
            border: digit ? '2px solid #fff' : '2px solid rgba(255,255,255,0.25)',
            borderRadius: 10,
            color: '#fff',
            outline: 'none',
            transition: 'border 0.2s ease',
          }}
        />
      ))}
    </div>
  )
}

// ─── STEP ENUMS ───────────────────────────────────────────────────────────────
const STEP = {
  CHOOSE_METHOD: 'CHOOSE_METHOD', // Step 0: Normal login ya 2FA?
  CHOOSE_2FA: 'CHOOSE_2FA', // Step 1: Email ya Authenticator?
  NORMAL_LOGIN: 'NORMAL_LOGIN', // Normal login form
  EMAIL_2FA_FORM: 'EMAIL_2FA_FORM', // Email 2FA: email enter karo, OTP bhejo
  EMAIL_2FA_VERIFY: 'EMAIL_2FA_VERIFY', // Email 2FA: OTP verify karo
  AUTH_VERIFY: 'AUTH_VERIFY', // Authenticator: sirf email + app code
}

// ─── Main Component ───────────────────────────────────────────────────────────
const SignIn = () => {
  const dispatch = useDispatch()
  const { loading } = useSelector(allUser)
  const { theme } = useTheme()
  const router = useRouter()

  const [routeLoading, setRouteLoading] = useState(false)
  const [step, setStep] = useState(STEP.CHOOSE_METHOD)
  const [twoFAMethod, setTwoFAMethod] = useState('') // 'email' | 'authenticator'

  // Normal login
  const [loginData, setLoginData] = useState({ email: '', password: '' })

  // 2FA login
  const [twoFAData, setTwoFAData] = useState({ email: '', otp: '' })

  // Resend cooldown
  const [resendTimer, setResendTimer] = useState(0)

  useEffect(() => {
    document.body.classList.add('authentication-bg')
    return () => document.body.classList.remove('authentication-bg')
  }, [])

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer <= 0) return
    const t = setTimeout(() => setResendTimer((r) => r - 1), 1000)
    return () => clearTimeout(t)
  }, [resendTimer])

  // ── Normal Login Submit ──────────────────────────────────────────────────
  const handleNormalLogin = async (e) => {
    e.preventDefault()
    const { email, password } = loginData
    if (!email?.trim() || !password?.trim()) {
      Notify('error', 'Please fill all the fields')
      return
    }
    try {
      await dispatch(Login(loginData)).unwrap()
      setRouteLoading(true)
      Notify('success', 'User Login successfully')
      router.replace('/dashboards')
    } catch (error) {
      console.log('Login failed:', error)
      setRouteLoading(false)
    }
  }

  // ── Email 2FA: Send OTP to email ─────────────────────────────────────────
  const handleSendEmailOTP = async (e) => {
    e.preventDefault()
    const { email } = twoFAData
    if (!email?.trim()) {
      Notify('error', 'Please enter your email')
      return
    }
    try {
      await dispatch(Send2fA(email)).unwrap()
      Notify('success', 'OTP sent to your email')
      setStep(STEP.EMAIL_2FA_VERIFY)
      setResendTimer(60)
    } catch (error) {
      console.log('Send OTP failed:', error)
    }
  }

  // ── Email 2FA: Verify OTP ─────────────────────────────────────────────────
  const handleVerifyEmailOTP = async (e) => {
    e.preventDefault()
    const { email, otp } = twoFAData
    if (!email?.trim() || otp.length < 6) {
      Notify('error', 'Please complete the 6-digit OTP code')
      return
    }
    try {
      // await dispatch(Verify2FACode({ email, otp, method: 'email' })).unwrap()
      setRouteLoading(true)
      Notify('success', 'Login successful')
      router.replace('/dashboards')
    } catch (error) {
      console.log('Email OTP verify failed:', error)
      setRouteLoading(false)
    }
  }

  // ── Authenticator: Verify app code directly (no send-OTP API call) ────────
  // Authenticator app khud code generate karta hai — sirf email + code verify hoga
  const handleVerifyAuthCode = async (e) => {
    e.preventDefault()
    const { email, otp } = twoFAData
    if (!email?.trim()) {
      Notify('error', 'Please enter your email')
      return
    }
    if (otp.length < 6) {
      Notify('error', 'Please enter the 6-digit code from your authenticator app')
      return
    }
    try {
      // await dispatch(Verify2FACode({ email, otp, method: 'authenticator' })).unwrap()
      setRouteLoading(true)
      Notify('success', 'Login successful')
      router.replace('/dashboards')
    } catch (error) {
      console.log('Authenticator verify failed:', error)
      setRouteLoading(false)
    }
  }

  // ── Resend OTP (only for email 2FA) ──────────────────────────────────────
  const handleResend = async () => {
    if (resendTimer > 0) return
    try {
      await dispatch(Send2fA(email)).unwrap()
      Notify('success', 'OTP resent successfully')
      setResendTimer(60)
    } catch (error) {
      console.log('Resend failed:', error)
    }
  }

  const showLoader = loading || routeLoading

  // ── Step indicator mapping ────────────────────────────────────────────────
  const stepMap = {
    [STEP.CHOOSE_METHOD]: 0,
    [STEP.NORMAL_LOGIN]: 1,
    [STEP.CHOOSE_2FA]: 1,
    [STEP.EMAIL_2FA_FORM]: 2,
    [STEP.EMAIL_2FA_VERIFY]: 3,
    [STEP.AUTH_VERIFY]: 2,
  }
  // Email 2FA: 4 steps | Authenticator 2FA: 3 steps | Normal: 2 steps
  const totalSteps = step === STEP.NORMAL_LOGIN ? 2 : twoFAMethod === 'authenticator' ? 3 : 4

  // ────────────────────────────────────────────────────────────────────────────
  return (
    <div className="account-pages">
      <div className="container">
        <Row className="justify-content-center">
          {showLoader && <FullScreenLoader />}
          <Col md={6} lg={5}>
            <div style={{ backgroundColor: theme.primaryColor, borderRadius: 16, overflow: 'hidden' }}>
              <div className="p-5">
                {/* Logo + Title */}
                <div className="text-center mb-4">
                  <div className="mx-auto mb-4 text-center auth-logo">
                    <a className="logo-light">
                      <img src={theme?.logoUrl || LightLogo} height={92} width={200} alt="logo" />
                    </a>
                  </div>
                  <h4 className="fw-bold mb-1 text-white">Welcome Back!</h4>
                  <p className="text-white mb-0" style={{ opacity: 0.7, fontSize: 14 }}>
                    Sign in to your account to continue
                  </p>
                </div>

                {/* Step Indicator (only for 2FA path) */}
                {step !== STEP.NORMAL_LOGIN && <StepIndicator currentStep={stepMap[step]} totalSteps={totalSteps} />}

                {/* ── STEP: Choose Login Method ─────────────────────────────── */}
                {step === STEP.CHOOSE_METHOD && (
                  <div>
                    <p className="text-white text-center mb-3" style={{ fontSize: 13, opacity: 0.8 }}>
                      How would you like to sign in?
                    </p>
                    <MethodCard
                      icon="🔑"
                      title="Standard Login"
                      description="Sign in with your email & password"
                      selected={false}
                      onClick={() => setStep(STEP.NORMAL_LOGIN)}
                    />
                    <MethodCard
                      icon="🛡️"
                      title="Login with 2FA"
                      description="Enhanced security with two-factor authentication"
                      selected={false}
                      onClick={() => setStep(STEP.CHOOSE_2FA)}
                    />
                  </div>
                )}

                {/* ── STEP: Choose 2FA Method ───────────────────────────────── */}
                {step === STEP.CHOOSE_2FA && (
                  <div>
                    <p className="text-white text-center mb-3" style={{ fontSize: 13, opacity: 0.8 }}>
                      Choose your 2FA verification method
                    </p>
                    <MethodCard
                      icon="📧"
                      title="Email OTP"
                      description="Receive a one-time code on your email"
                      selected={twoFAMethod === 'email'}
                      onClick={() => setTwoFAMethod('email')}
                    />
                    <MethodCard
                      icon="📱"
                      title="Authenticator App"
                      description="Use Google Authenticator or similar app"
                      selected={twoFAMethod === 'authenticator'}
                      onClick={() => setTwoFAMethod('authenticator')}
                    />

                    <div className="d-flex gap-2 mt-4">
                      <button className="btn btn-outline-light w-50" onClick={() => setStep(STEP.CHOOSE_METHOD)}>
                        ← Back
                      </button>
                      <button
                        className="btn btn-dark w-50 fw-medium"
                        disabled={!twoFAMethod}
                        onClick={() => (twoFAMethod === 'email' ? setStep(STEP.EMAIL_2FA_FORM) : setStep(STEP.AUTH_VERIFY))}
                        style={{ opacity: twoFAMethod ? 1 : 0.5 }}>
                        Continue →
                      </button>
                    </div>
                  </div>
                )}

                {/* ── STEP: Normal Login Form ───────────────────────────────── */}
                {step === STEP.NORMAL_LOGIN && (
                  <form onSubmit={handleNormalLogin}>
                    <div className="mb-3">
                      <FormGroup>
                        <Label className="text-white">
                          Email <span style={{ color: '#e57373' }}>*</span>
                        </Label>
                        <Input
                          style={{ backgroundColor: 'transparent', color: '#fff' }}
                          name="email"
                          value={loginData.email}
                          onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                          type="text"
                          placeholder="Enter your Email"
                        />
                      </FormGroup>
                    </div>
                    <div className="mb-3">
                      <Link href="/auth/reset-password" className="float-end text-muted ms-1" style={{ fontSize: 13 }}>
                        Forgot password?
                      </Link>
                      <FormGroup>
                        <Label className="text-white">
                          Password <span style={{ color: '#e57373' }}>*</span>
                        </Label>
                        <Input
                          style={{ backgroundColor: 'transparent', color: '#fff' }}
                          name="password"
                          type="password"
                          value={loginData.password}
                          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                          placeholder="Enter your Password"
                        />
                      </FormGroup>
                    </div>
                    <div className="d-flex gap-2">
                      <button type="button" className="btn btn-outline-light w-50" onClick={() => setStep(STEP.CHOOSE_METHOD)}>
                        ← Back
                      </button>
                      <button type="submit" className="btn btn-dark btn-lg fw-medium w-50">
                        Sign In
                      </button>
                    </div>
                  </form>
                )}

                {/* ── STEP: Email 2FA — Enter email & request OTP ──────────── */}
                {step === STEP.EMAIL_2FA_FORM && (
                  <form onSubmit={handleSendEmailOTP}>
                    <div className="text-center mb-3">
                      <span
                        style={{
                          background: 'rgba(255,255,255,0.15)',
                          borderRadius: 20,
                          padding: '4px 14px',
                          color: '#fff',
                          fontSize: 13,
                        }}>
                        📧 Email OTP
                      </span>
                    </div>
                    <FormGroup className="mb-3">
                      <Label className="text-white">
                        Email <span style={{ color: '#e57373' }}>*</span>
                      </Label>
                      <Input
                        style={{ backgroundColor: 'transparent', color: '#fff' }}
                        type="email"
                        value={twoFAData.email}
                        onChange={(e) => setTwoFAData({ ...twoFAData, email: e.target.value })}
                        placeholder="Enter your registered email"
                      />
                    </FormGroup>
                    <p className="text-white text-center mb-3" style={{ fontSize: 12, opacity: 0.7 }}>
                      A 6-digit OTP will be sent to your email address.
                    </p>
                    <div className="d-flex gap-2">
                      <button type="button" className="btn btn-outline-light w-50" onClick={() => setStep(STEP.CHOOSE_2FA)}>
                        ← Back
                      </button>
                      <button type="submit" className="btn btn-dark fw-medium w-50">
                        Send OTP →
                      </button>
                    </div>
                  </form>
                )}

                {/* ── STEP: Email 2FA — Enter OTP received on email ────────── */}
                {step === STEP.EMAIL_2FA_VERIFY && (
                  <form onSubmit={handleVerifyEmailOTP}>
                    <div className="text-center mb-3">
                      <span
                        style={{
                          background: 'rgba(255,255,255,0.15)',
                          borderRadius: 20,
                          padding: '4px 14px',
                          color: '#fff',
                          fontSize: 13,
                        }}>
                        📧 Email OTP
                      </span>
                    </div>
                    <p className="text-white text-center mb-3" style={{ fontSize: 13, opacity: 0.8 }}>
                      OTP sent to <strong>{twoFAData.email}</strong>
                    </p>
                    <FormGroup className="mb-3">
                      <Label className="text-white text-center d-block" style={{ fontSize: 13 }}>
                        Enter 6-digit OTP
                      </Label>
                      <OTPInput value={twoFAData.otp} onChange={(otp) => setTwoFAData({ ...twoFAData, otp })} />
                    </FormGroup>
                    <div className="text-center mb-3">
                      <button
                        type="button"
                        onClick={handleResend}
                        disabled={resendTimer > 0}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: resendTimer > 0 ? 'rgba(255,255,255,0.4)' : '#fff',
                          fontSize: 13,
                          cursor: resendTimer > 0 ? 'not-allowed' : 'pointer',
                          textDecoration: resendTimer > 0 ? 'none' : 'underline',
                        }}>
                        {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
                      </button>
                    </div>
                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-outline-light w-50"
                        onClick={() => {
                          setStep(STEP.EMAIL_2FA_FORM)
                          setTwoFAData((d) => ({ ...d, otp: '' }))
                        }}>
                        ← Back
                      </button>
                      <button
                        type="submit"
                        className="btn btn-dark fw-medium w-50"
                        disabled={twoFAData.otp.length < 6}
                        style={{ opacity: twoFAData.otp.length < 6 ? 0.5 : 1 }}>
                        Verify & Login ✓
                      </button>
                    </div>
                  </form>
                )}

                {/* ── STEP: Authenticator — Enter email + app code directly ── */}
                {/* No send-OTP API call — app itself generates the code       */}
                {step === STEP.AUTH_VERIFY && (
                  <form onSubmit={handleVerifyAuthCode}>
                    <div className="text-center mb-3">
                      <span
                        style={{
                          background: 'rgba(255,255,255,0.15)',
                          borderRadius: 20,
                          padding: '4px 14px',
                          color: '#fff',
                          fontSize: 13,
                        }}>
                        📱 Authenticator App
                      </span>
                    </div>
                    <p className="text-white text-center mb-3" style={{ fontSize: 13, opacity: 0.8 }}>
                      Open your authenticator app and enter the current 6-digit code.
                    </p>
                    <FormGroup className="mb-3">
                      <Label className="text-white">
                        Email <span style={{ color: '#e57373' }}>*</span>
                      </Label>
                      <Input
                        style={{ backgroundColor: 'transparent', color: '#fff' }}
                        type="email"
                        value={twoFAData.email}
                        onChange={(e) => setTwoFAData({ ...twoFAData, email: e.target.value })}
                        placeholder="Enter your registered email"
                      />
                    </FormGroup>
                    <FormGroup className="mb-3">
                      <Label className="text-white text-center d-block" style={{ fontSize: 13 }}>
                        Enter 6-digit code from app
                      </Label>
                      <OTPInput value={twoFAData.otp} onChange={(otp) => setTwoFAData({ ...twoFAData, otp })} />
                    </FormGroup>
                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-outline-light w-50"
                        onClick={() => {
                          setStep(STEP.CHOOSE_2FA)
                          setTwoFAData({ email: '', otp: '' })
                        }}>
                        ← Back
                      </button>
                      <button
                        type="submit"
                        className="btn btn-dark fw-medium w-50"
                        disabled={!twoFAData.email || twoFAData.otp.length < 6}
                        style={{ opacity: !twoFAData.email || twoFAData.otp.length < 6 ? 0.5 : 1 }}>
                        Verify & Login ✓
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default SignIn
