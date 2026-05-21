'use client'
import { useState } from 'react'
import SvgIcon from './SvgIcon'
import styles from './Toolbar.module.css'

export const Toolbar = ({
  onSearch,
  searchPlaceholder = 'Search…',
  children,
  actions,
}) => {
  const [query, setQuery] = useState('')

  const handleSearch = (e) => {
    setQuery(e.target.value)
    onSearch?.(e.target.value)
  }

  return (
    <div className={styles.toolbar}>
      <div className={styles.search}>
        <SvgIcon id="i-search" className="ic-sm" />
        <input
          type="search"
          placeholder={searchPlaceholder}
          value={query}
          onChange={handleSearch}
          className={styles.input}
        />
      </div>
      {children && <div className={styles.chips}>{children}</div>}
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  )
}

export default Toolbar
