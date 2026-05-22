'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter, useSearchParams } from 'next/navigation'
import { ForgotPassword, ResetPassword as ResetPasswordAction, allUser } from '@/redux/slice/Authentication/AuthenticationSlice'
import Notify from '@/components/Notify'
import { useTheme } from '@/context/BrandingContext'
import LightLogo from '@/assets/images/Logo-primidigitals 1 (1).png'
import styles from './resetpassword.module.css'

const ResetPassword = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { theme } = useTheme()
  const { loading } = useSelector(allUser)

  const token = searchParams.get('token')
  const emailFromUrl = searchParams.get('email')
  const isResetStep = !!token

  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleForgot = async (e) => {
    e.preventDefault()
    if (!email.trim()) return Notify('error', 'Enter your email address')
    try {
      await dispatch(ForgotPassword({ email })).unwrap()
      setSent(true)
    } catch {
      // error notification handled in slice
    }
  }

  const handleReset = async (e) => {
    e.preventDefault()
    if (!newPassword.trim() || !confirm.trim()) return Notify('error', 'Please fill all fields')
    if (newPassword !== confirm) return Notify('error', 'Passwords do not match')
    if (newPassword.length < 8) return Notify('error', 'Password must be at least 8 characters')
    try {
      await dispatch(ResetPasswordAction({ email: emailFromUrl, token, newPassword })).unwrap()
      router.replace('/auth/sign-in')
    } catch {
      // error notification handled in slice
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logoWrap}>
          {theme?.logoUrl
            ? <img src={theme.logoUrl} alt="logo" className={styles.logo} />
            : <Image src={LightLogo} alt="logo" width={140} height={56} className={styles.logo} />
          }
        </div>

        {isResetStep ? (
          <>
            <h1 className={styles.title}>Set new password</h1>
            <p className={styles.sub}>Choose a strong password for your account.</p>
            <form onSubmit={handleReset} className={styles.form}>
              <div className={styles.fieldWrap}>
                <label className={styles.label} htmlFor="newPassword">New password</label>
                <div className={styles.pwWrap}>
                  <input
                    id="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    className={styles.input}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
                  <button type="button" className={styles.eyeBtn} onClick={() => setShowPassword((v) => !v)} aria-label="Toggle password">
                    {showPassword ? '🙈' : '👁'}
                  </button>
                </div>
              </div>
              <div className={styles.fieldWrap}>
                <label className={styles.label} htmlFor="confirm">Confirm password</label>
                <input
                  id="confirm"
                  type={showPassword ? 'text' : 'password'}
                  className={styles.input}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
              </div>
              <button type="submit" className={styles.submit} disabled={loading}>
                {loading ? <span className={styles.btnSpinner} /> : 'Set new password'}
              </button>
            </form>
          </>
        ) : sent ? (
          <>
            <h1 className={styles.title}>Check your inbox</h1>
            <p className={styles.sub}>
              We sent a password reset link to <strong>{email}</strong>. Follow the link in the email to set a new password.
            </p>
            <p className={styles.footer}>
              Didn&apos;t receive it?{' '}
              <button
                type="button"
                className={styles.link}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit' }}
                onClick={() => setSent(false)}
              >
                Try again
              </button>
            </p>
          </>
        ) : (
          <>
            <h1 className={styles.title}>Forgot password?</h1>
            <p className={styles.sub}>Enter your email and we&apos;ll send you a reset link.</p>
            <form onSubmit={handleForgot} className={styles.form}>
              <div className={styles.fieldWrap}>
                <label className={styles.label} htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
              <button type="submit" className={styles.submit} disabled={loading}>
                {loading ? <span className={styles.btnSpinner} /> : 'Send reset link'}
              </button>
            </form>
          </>
        )}

        <p className={styles.footer}>
          Back to{' '}
          <Link href="/auth/sign-in" className={styles.link}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default ResetPassword
