'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import SvgIcon from '@/components/ui/SvgIcon'
import styles from './settings.module.css'

const NAV = [
  { href: '/settings/profile',       label: 'Profile',        icon: 'i-user' },
  { href: '/settings/security',      label: 'Security',       icon: 'i-lock' },
  { href: '/settings/notifications', label: 'Notifications',  icon: 'i-bell' },
  { href: '/settings/preferences',   label: 'Preferences',    icon: 'i-sliders' },
  { href: '/settings/branding',      label: 'Branding',       icon: 'i-palette' },
]

export default function SettingsLayout({ children }) {
  const pathname = usePathname()

  return (
    <div className="page-content">
      <div className="page-head">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-sub">Manage your account, preferences, and organization branding.</p>
        </div>
      </div>

      <div className={styles.shell}>
        <nav className={styles.nav}>
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={[styles.navItem, pathname === item.href && styles.active].filter(Boolean).join(' ')}
            >
              <SvgIcon id={item.icon} className="ic" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  )
}
