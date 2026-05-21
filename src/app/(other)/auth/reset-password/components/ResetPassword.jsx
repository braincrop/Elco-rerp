'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { ForgotPassword } from '@/redux/slice/Authentication/AuthenticationSlice'
import Notify from '@/components/Notify'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/context/BrandingContext'
import LightLogo from '@/assets/images/Logo-primidigitals 1 (1).png'
import styles from './resetpassword.module.css'

const ResetPassword = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { theme } = useTheme()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [data, setData] = useState({ email: '', newPassword: '' })

  const handleChange = (e) => setData((p) => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!data.email?.trim() || !data.newPassword?.trim()) return Notify('error', 'Please fill all the fields')
    try {
      setLoading(true)
      await dispatch(ForgotPassword(data)).unwrap()
      router.replace('/auth/sign-in')
    } catch {
      setLoading(false)
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
        <h1 className={styles.title}>Reset password</h1>
        <p className={styles.sub}>Enter your email and new password</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.fieldWrap}>
            <label className={styles.label} htmlFor="email">Email</label>
            <input id="email" name="email" type="email" className={styles.input}
              value={data.email} onChange={handleChange} placeholder="you@example.com" autoComplete="email" />
          </div>
          <div className={styles.fieldWrap}>
            <label className={styles.label} htmlFor="newPassword">New password</label>
            <div className={styles.pwWrap}>
              <input id="newPassword" name="newPassword" type={showPassword ? 'text' : 'password'}
                className={styles.input} value={data.newPassword} onChange={handleChange}
                placeholder="••••••••" autoComplete="new-password" />
              <button type="button" className={styles.eyeBtn} onClick={() => setShowPassword((v) => !v)} aria-label="Toggle password">
                {showPassword ? '🙈' : '👁'}
              </button>
            </div>
          </div>
          <button type="submit" className={styles.submit} disabled={loading}>
            {loading ? <span className={styles.btnSpinner} /> : 'Reset password'}
          </button>
        </form>

        <p className={styles.footer}>
          Back to{' '}
          <Link href="/auth/sign-in" className={styles.link}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default ResetPassword
