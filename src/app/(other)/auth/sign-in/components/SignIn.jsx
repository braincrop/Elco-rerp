'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { allUser, Login } from '@/redux/slice/Authentication/AuthenticationSlice'
import Notify from '@/components/Notify'
import { useTheme } from '@/context/BrandingContext'
import LightLogo from '@/assets/images/Logo-primidigitals 1 (1).png'
import styles from './signin.module.css'

export function FullScreenLoader() {
  return (
    <div className={styles.loaderOverlay}>
      <span className={styles.loaderSpinner} />
      <p className={styles.loaderText}>Please wait…</p>
    </div>
  )
}

const SignIn = () => {
  const dispatch = useDispatch()
  const { loading } = useSelector(allUser)
  const { theme } = useTheme()
  const router = useRouter()
  const [routeLoading, setRouteLoading] = useState(false)
  const [data, setData] = useState({ email: '', password: '' })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark')
    return () => { document.documentElement.setAttribute('data-theme', 'light') }
  }, [])

  const handleChange = (e) => setData((p) => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!data.email?.trim() || !data.password?.trim()) return Notify('error', 'Please fill all fields')
    try {
      await dispatch(Login(data)).unwrap()
      setRouteLoading(true)
      Notify('success', 'Logged in successfully')
      router.replace('/dashboards')
    } catch {
      setRouteLoading(false)
    }
  }

  const showLoader = loading || routeLoading

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
      </div>
    </div>
  )
}

export default SignIn
