'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getMenuItems } from '@/helpers/Manu'
import { useTheme } from '@/context/BrandingContext'
import SvgIcon from '@/components/ui/SvgIcon'
import { GROUP_LABELS } from '@/assets/data/menu-items'
import styles from './VerticalNavigationBar.module.css'

const NavItem = ({ item, depth = 0 }) => {
  const pathname = usePathname()
  const isActive = pathname === item.url || (item.children && item.children.some((c) => pathname === c.url))
  const hasChildren = !!item.children?.length
  const [open, setOpen] = useState(isActive)

  const cls = [
    styles.item,
    depth > 0 && styles.child,
    isActive && styles.active,
  ].filter(Boolean).join(' ')

  if (hasChildren) {
    return (
      <div className={styles.group}>
        <button
          type="button"
          className={[styles.item, styles.parent, isActive && styles.active].filter(Boolean).join(' ')}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          {item.icon && <SvgIcon id={item.icon} className="ic" />}
          <span className={styles.label}>{item.label}</span>
          <SvgIcon id="i-down" className={[styles.chevron, open && styles.chevronOpen].join(' ')} />
        </button>
        {open && (
          <div className={styles.children}>
            {item.children.map((child) => (
              <NavItem key={child.key} item={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Link href={item.url ?? '#'} className={cls}>
      {item.icon && <SvgIcon id={item.icon} className="ic" />}
      <span className={styles.label}>{item.label}</span>
    </Link>
  )
}

const VerticalNavigationBar = () => {
  const [menuItems, setMenuItems] = useState([])
  const { theme } = useTheme()

  useEffect(() => {
    setMenuItems(getMenuItems())
  }, [])

  // Group items preserving order of first appearance
  const groups = []
  const seen = new Set()
  for (const item of menuItems) {
    if (item.isTitle) continue
    const g = item.group ?? 'workspace'
    if (!seen.has(g)) {
      seen.add(g)
      groups.push({ key: g, label: GROUP_LABELS[g] ?? g, items: [] })
    }
    groups[groups.findIndex((x) => x.key === g)].items.push(item)
  }

  return (
    <aside className={styles.sidebar}>
      {/* Brand mark */}
      <div className={styles.brand}>
        <Link href="/dashboards" className={styles.brandLink}>
          {theme?.logoUrl ? (
            <img src={theme.logoUrl} alt="logo" className={styles.brandLogo} />
          ) : (
            <span className={styles.brandText}>V</span>
          )}
          <span className={styles.brandName}>{theme?.name || 'Vendral'}</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className={styles.nav}>
        {groups.map((group) => (
          <div key={group.key} className={styles.section}>
            <span className={styles.sectionLabel}>{group.label}</span>
            {group.items.map((item) => (
              <NavItem key={item.key} item={item} />
            ))}
          </div>
        ))}
      </nav>

      {/* Bottom: settings link */}
      <div className={styles.bottom}>
        <Link href="/settings" className={styles.item}>
          <SvgIcon id="i-cog" className="ic" />
          <span className={styles.label}>Settings</span>
        </Link>
      </div>
    </aside>
  )
}

export default VerticalNavigationBar
