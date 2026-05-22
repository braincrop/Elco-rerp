'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { allUser, Login } from '@/redux/slice/Authentication/AuthenticationSlice'
import { CompleteTwoFactorLogin, selectTwoFactor } from '@/redux/slice/TwoFactor/TwoFactorSlice'
import Notify from '@/components/Notify'
import { useTheme } from '@/context/BrandingContext'
import LightLogo from '@/assets/images/Logo-primidigitals 1 (1).png'
import styles from './signin.module.css'

export function FullScreenLoader() {
  return (
    <div className={styles.loaderOverlay}>
      <span className={styles.loaderSpinner} />
      <p className={styles.loaderText}>Please wait&hellip;</p>
    </div>
  )
}

const SignIn = () => {
  const dispatch = useDispatch()
  const { loading, twoFactorProvider } = useSelector(allUser)
  const { loading: tfLoading } = useSelector(selectTwoFactor)
  const { theme } = useTheme()
  const router = useRouter()
  const [routeLoading, setRouteLoading] = useState(false)
  const [step, setStep] = useState('credentials')
  const [tempToken, setTempToken] = useState(null)
  const [data, setData] = useState({ email: '', password: '' })
  const [totpCode, setTotpCode] = useState('')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark')
    return () => { document.documentElement.setAttribute('data-theme', 'light') }
  }, [])

  const handleChange = (e) => setData((p) => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!data.email?.trim() || !data.password?.trim()) return Notify('error', 'Please fill all fields')
    try {
      const result = await dispatch(Login(data)).unwrap()
      if (result?.requiresTwoFactor) {
        setTempToken(result.tempToken)
        setStep('totp')
      } else {
        setRouteLoading(true)
        Notify('success', 'Logged in successfully')
        router.replace('/dashboards')
      }
    } catch {
      setRouteLoading(false)
    }
  }

  const handleTotpSubmit = async (e) => {
    e.preventDefault()
    if (totpCode.length !== 6) return Notify('error', 'Enter a 6-digit code')
    try {
      await dispatch(CompleteTwoFactorLogin({ tempToken, code: totpCode })).unwrap()
      setRouteLoading(true)
      Notify('success', 'Logged in successfully')
      router.replace('/dashboards')
    } catch {
      setRouteLoading(false)
    }
  }

  const showLoader = loading || tfLoading || routeLoading

  return (
    <div className={styles.page}>
      {showLoader && <FullScreenLoader />}
      <div className={styles.card}>
        <div className={styles.logoWrap}>
          {theme?.logoUrl
            ? <img src={theme.logoUrl} alt="logo" className={styles.logo} />
            : <Image src={LightLogo} alt="logo" width={140} height={56} className={styles.logo} />
          }
        </div>

        {step === 'credentials' ? (
          <>
            <h1 className={styles.title}>Welcome back</h1>
            <p className={styles.sub}>Sign in to your account</p>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.fieldWrap}>
                <label className={styles.label} htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={styles.input}
                  value={data.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
              <div className={styles.fieldWrap}>
                <div className={styles.labelRow}>
                  <label className={styles.label} htmlFor="password">Password</label>
                  <Link href="/auth/reset-password" className={styles.forgotLink}>Forgot password?</Link>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className={styles.input}
                  value={data.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>
              <button type="submit" className={styles.submit} disabled={loading || routeLoading}>
                {loading ? <span className={styles.btnSpinner} /> : 'Sign in'}
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className={styles.title}>Two-Factor Authentication</h1>
            <p className={styles.sub}>
              {twoFactorProvider === 'Email'
                ? 'Enter the 6-digit code sent to your email.'
                : 'Enter the code from your authenticator app.'}
            </p>
            <form onSubmit={handleTotpSubmit} className={styles.form}>
              <div className={styles.fieldWrap}>
                <label className={styles.label} htmlFor="totp">Authentication Code</label>
                <input
                  id="totp"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  className={styles.input}
                  style={{ letterSpacing: '0.3em', textAlign: 'center', fontSize: 20 }}
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  autoComplete="one-time-code"
                  autoFocus
                />
              </div>
              <button type="submit" className={styles.submit} disabled={tfLoading || totpCode.length !== 6}>
                {tfLoading ? <span className={styles.btnSpinner} /> : 'Verify'}
              </button>
              <button
                type="button"
                className={styles.submit}
                style={{ marginTop: 0, background: 'transparent', color: 'var(--ink-3)', border: '1px solid var(--line)', fontSize: 13 }}
                onClick={() => { setStep('credentials'); setTotpCode('') }}
              >
                &larr; Back to sign in
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default SignIn
