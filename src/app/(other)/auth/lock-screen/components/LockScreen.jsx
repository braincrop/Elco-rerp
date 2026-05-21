'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useTheme } from '@/context/BrandingContext'
import LightLogo from '@/assets/images/Logo-primidigitals 1 (1).png'
import styles from './lockscreen.module.css'

const LockScreen = () => {
  const { theme } = useTheme()
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
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
        <h1 className={styles.title}>Locked</h1>
        <p className={styles.sub}>Enter your password to continue</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.fieldWrap}>
            <label className={styles.label} htmlFor="password">Password</label>
            <input id="password" name="password" type="password" className={styles.input}
              value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" autoComplete="current-password" />
          </div>
          <button type="submit" className={styles.submit}>
            Unlock
          </button>
        </form>

        <p className={styles.footer}>
          Not you?{' '}
          <Link href="/auth/sign-in" className={styles.link}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default LockScreen
