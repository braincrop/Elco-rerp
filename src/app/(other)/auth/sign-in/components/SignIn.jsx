'use client'
import LightLogo from '@/assets/images/Logo-primidigitals 1 (1).png'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { FormGroup, Label, Input } from 'reactstrap'
import { useDispatch, useSelector } from 'react-redux'
import { allUser, Login, LoginWithTwoFactor, Send2fA, Verify2FA } from '@/redux/slice/Authentication/AuthenticationSlice'
import Notify from '@/components/Notify'
import { Spinner } from 'reactstrap'
import { useTheme } from '@/context/BrandingContext'


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

const STEP = {
  LOGIN_FORM: 'LOGIN_FORM',
  EMAIL_OTP: 'EMAIL_OTP',
  AUTH_CODE: 'AUTH_CODE',
}
const SignIn = () => {
  const dispatch = useDispatch()
  const { loading } = useSelector(allUser)
  const { theme } = useTheme()
  const router = useRouter()
  const [routeLoading, setRouteLoading] = useState(false)
  const [step, setStep] = useState(STEP.LOGIN_FORM)
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [tempToken, setTempToken] = useState('')
  const [otp, setOtp] = useState('')
  const [resendTimer, setResendTimer] = useState(0)



  useEffect(() => {
    document.body.classList.add('authentication-bg')
    return () => document.body.classList.remove('authentication-bg')
  }, [])
  
  useEffect(() => {
    if (resendTimer <= 0) return
    const t = setTimeout(() => setResendTimer((r) => r - 1), 1000)
    return () => clearTimeout(t)
  }, [resendTimer])

  const handleLogin = async (e) => {
    e.preventDefault()
    const { email, password } = loginData
    if (!email?.trim() || !password?.trim()) {
      Notify('error', 'Please fill all the fields')
      return
    }
    try {
      const result = await dispatch(Login(loginData)).unwrap()
      if (result?.requiresTwoFactor) {
        setTempToken(result.tempToken)
        if (result.provider === 'Email') {
          Notify('success', 'OTP sent to your email')
          setResendTimer(60)
          setStep(STEP.EMAIL_OTP)
        } else {
          setStep(STEP.AUTH_CODE)
        }
      } else {
        setRouteLoading(true)
        Notify('success', 'Login successful')
        router.replace('/dashboards')
      }
    } catch (error) {
      console.log('Login failed:', error)
    }
  }


  const handleVerifyEmailOTP = async (e) => {
    e.preventDefault()
    if (otp.length < 6) {
      Notify('error', 'Please enter the complete 6-digit OTP')
      return
    }
    try {
       const data = {
        tempToken: tempToken,
        code: otp,
      }
      await dispatch(LoginWithTwoFactor(data)).unwrap()
      setRouteLoading(true)
      // Notify('success', 'Login successful')
      router.replace('/dashboards')
    } catch (error) {
      console.log('Email OTP verify failed:', error)
      setRouteLoading(false)
    }
  }

  const handleVerifyAuthCode = async (e) => {
    e.preventDefault()
    if (otp.length < 6) {
      Notify('error', 'Please enter the 6-digit code from your authenticator app')
      return
    }
    try {
      const data = {
        tempToken: tempToken,
        code: otp,
      }
      await dispatch(LoginWithTwoFactor(data)).unwrap()
      setRouteLoading(true)
      Notify('success', 'Login successful')
      router.replace('/dashboards')
    } catch (error) {
      console.log('Authenticator verify failed:', error)
      setRouteLoading(false)
    }
  }

  const handleResend = async () => {
    if (resendTimer > 0) return
    try {
      // await dispatch(Send2fA({ email: loginData.email, tempToken })).unwrap()
      Notify('success', 'OTP resent successfully')
      setResendTimer(60)
    } catch (error) {
      console.log('Resend failed:', error)
    }
  }

  const showLoader = loading || routeLoading
  const inputStyle = { backgroundColor: 'transparent', color: '#fff' }

  const Badge = ({ children }) => (
    <div className="text-center mb-3">
      <span
        style={{
          background: 'rgba(255,255,255,0.15)',
          borderRadius: 20,
          padding: '4px 14px',
          color: '#fff',
          fontSize: 13,
        }}>
        {children}
      </span>
    </div>
  )

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

                {/* ── STEP 1: Normal Login Form ──────────────────────────────── */}
                {step === STEP.LOGIN_FORM && (
                  <form onSubmit={handleLogin}>
                    <FormGroup className="mb-3">
                      <Label className="text-white">
                        Email <span style={{ color: '#e57373' }}>*</span>
                      </Label>
                      <Input
                        style={inputStyle}
                        name="email"
                        type="text"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        placeholder="Enter your Email"
                      />
                    </FormGroup>

                    <FormGroup className="mb-4">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <Label className="text-white mb-0">
                          Password <span style={{ color: '#e57373' }}>*</span>
                        </Label>
                        <Link href="/auth/reset-password" className="text-muted" style={{ fontSize: 13 }}>
                          Forgot password?
                        </Link>
                      </div>
                      <Input
                        style={inputStyle}
                        name="password"
                        type="password"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        placeholder="Enter your Password"
                      />
                    </FormGroup>

                    <button type="submit" className="btn btn-dark btn-lg fw-medium w-100">
                      Sign In
                    </button>
                  </form>
                )}

                {/* ── STEP 2a: Email OTP Verify ──────────────────────────────── */}
                {step === STEP.EMAIL_OTP && (
                  <form onSubmit={handleVerifyEmailOTP}>
                    <Badge>📧 Email OTP Verification</Badge>
                    <p className="text-white text-center mb-3" style={{ fontSize: 13, opacity: 0.8 }}>
                      OTP sent to <strong>{loginData.email}</strong>
                    </p>
                    <FormGroup className="mb-3">
                      <Label className="text-white text-center d-block" style={{ fontSize: 13 }}>
                        Enter 6-digit OTP
                      </Label>
                      <OTPInput value={otp} onChange={setOtp} />
                    </FormGroup>
                    <div className="text-center mb-4">
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
                          setStep(STEP.LOGIN_FORM)
                          setOtp('')
                        }}>
                        ← Back
                      </button>
                      <button
                        type="submit"
                        className="btn btn-dark fw-medium w-50"
                        disabled={otp.length < 6}
                        style={{ opacity: otp.length < 6 ? 0.5 : 1 }}>
                        Verify & Login ✓
                      </button>
                    </div>
                  </form>
                )}

                {/* ── STEP 2b: Authenticator Code ────────────────────────────── */}
                {step === STEP.AUTH_CODE && (
                  <form onSubmit={handleVerifyAuthCode}>
                    <Badge>📱 Authenticator Verification</Badge>
                    <p className="text-white text-center mb-3" style={{ fontSize: 13, opacity: 0.8 }}>
                      Open your authenticator app and enter the current 6-digit code.
                    </p>
                    <FormGroup className="mb-4">
                      <Label className="text-white text-center d-block" style={{ fontSize: 13 }}>
                        Enter 6-digit code from app
                      </Label>
                      <OTPInput value={otp} onChange={setOtp} />
                    </FormGroup>
                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-outline-light w-50"
                        onClick={() => {
                          setStep(STEP.LOGIN_FORM)
                          setOtp('')
                        }}>
                        ← Back
                      </button>
                      <button
                        type="submit"
                        className="btn btn-dark fw-medium w-50"
                        disabled={otp.length < 6}
                        style={{ opacity: otp.length < 6 ? 0.5 : 1 }}>
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
