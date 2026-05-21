'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Registration } from '@/redux/slice/Authentication/AuthenticationSlice'
import Notify from '@/components/Notify'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/context/BrandingContext'
import LightLogo from '@/assets/images/Logo-primidigitals 1 (1).png'
import styles from './signup.module.css'

const SignUp = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { theme } = useTheme()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({ userName: '', email: '', password: '' })

  const handleChange = (e) => setData((p) => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { userName, email, password } = data
    if (!userName?.trim() || !email?.trim() || !password?.trim()) return Notify('error', 'Please fill all the fields')
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return Notify('error', 'Please enter a valid email address')
    try {
      setLoading(true)
      await dispatch(Registration(data)).unwrap()
      router.push('/auth/sign-in')
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
        <h1 className={styles.title}>Create account</h1>
        <p className={styles.sub}>Sign up for a new account</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.fieldWrap}>
            <label className={styles.label} htmlFor="userName">Name</label>
            <input id="userName" name="userName" type="text" className={styles.input}
              value={data.userName} onChange={handleChange} placeholder="Your name" autoComplete="name" />
          </div>
          <div className={styles.fieldWrap}>
            <label className={styles.label} htmlFor="email">Email</label>
            <input id="email" name="email" type="email" className={styles.input}
              value={data.email} onChange={handleChange} placeholder="you@example.com" autoComplete="email" />
          </div>
          <div className={styles.fieldWrap}>
            <label className={styles.label} htmlFor="password">Password</label>
            <input id="password" name="password" type="password" className={styles.input}
              value={data.password} onChange={handleChange} placeholder="••••••••" autoComplete="new-password" />
          </div>
          <button type="submit" className={styles.submit} disabled={loading}>
            {loading ? <span className={styles.btnSpinner} /> : 'Sign up'}
          </button>
        </form>

        <p className={styles.footer}>
          Already have an account?{' '}
          <Link href="/auth/sign-in" className={styles.link}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default SignUp
