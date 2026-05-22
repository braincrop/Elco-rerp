'use client'
import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import SvgIcon from '@/components/ui/SvgIcon'
import { useLayoutContext } from '@/context/useLayoutContext'
import styles from './TopNavigationBar.module.css'
import avatar from '@/assets/images/users/avatar-1.jpg'

const ProfileMenu = () => {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (!ref.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const logOut = () => {
    localStorage.removeItem('token')
    document.cookie = 'token=; Max-Age=0; path=/;'
    window.location.replace('/auth/sign-in')
  }

  return (
    <div className={styles.profileWrap} ref={ref}>
      <button type="button" className={styles.avatarBtn} onClick={() => setOpen((v) => !v)} aria-label="Profile menu">
        <Image src={avatar} alt="avatar" width={28} height={28} className={styles.avatar} />
      </button>
      {open && (
        <div className={styles.dropdown}>
          <div className={styles.dropHead}>
            <p className={styles.dropGreet}>Signed in</p>
          </div>
          <Link href="/settings/profile" className={styles.dropItem} onClick={() => setOpen(false)}>
            <SvgIcon id="i-user" className="ic-sm" /> My Account
          </Link>
          <Link href="/settings" className={styles.dropItem} onClick={() => setOpen(false)}>
            <SvgIcon id="i-cog" className="ic-sm" /> Settings
          </Link>
          <div className={styles.dropDivider} />
          <button type="button" className={[styles.dropItem, styles.dropDanger].join(' ')} onClick={logOut}>
            <SvgIcon id="i-arrow" className="ic-sm" /> Sign out
          </button>
        </div>
      )}
    </div>
  )
}

const ThemeToggle = () => {
  const { themeMode, changeTheme } = useLayoutContext()
  return (
    <button
      type="button"
      className={styles.iconBtn}
      onClick={() => changeTheme(themeMode === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle theme"
      title={themeMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <SvgIcon id="i-sun-moon" />
    </button>
  )
}

const TopNavigationBar = () => {
  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        {/* Breadcrumb placeholder — pages can add their own */}
      </div>
      <div className={styles.right}>
        <ThemeToggle />
        <ProfileMenu />
      </div>
    </header>
  )
}

export default TopNavigationBar
