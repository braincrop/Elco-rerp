'use client'

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { usePathname } from 'next/navigation'

const ThemeContext = createContext(undefined)

export const useLayoutContext = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useLayoutContext must be used within LayoutProvider')
  return context
}

const getStoredTheme = () => {
  if (typeof window === 'undefined') return 'light'
  return localStorage.getItem('theme') || 'light'
}

const resolveTheme = (preference) => {
  if (preference === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return preference
}

const LayoutProvider = ({ children }) => {
  const pathname = usePathname()
  const [themePreference, setThemePreference] = useState('light')
  const [showBackdrop, setShowBackdrop] = useState(false)

  // Apply data-theme on mount and whenever preference changes
  useEffect(() => {
    const stored = getStoredTheme()
    setThemePreference(stored)
    document.documentElement.setAttribute('data-theme', resolveTheme(stored))
  }, [])

  useEffect(() => {
    if (themePreference === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      const handler = (e) => {
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light')
      }
      mq.addEventListener('change', handler)
      return () => mq.removeEventListener('change', handler)
    }
  }, [themePreference])

  const changeTheme = useCallback((preference) => {
    const resolved = resolveTheme(preference)
    document.documentElement.setAttribute('data-theme', resolved)
    localStorage.setItem('theme', preference)
    setThemePreference(preference)
  }, [])

  // Close sidebar on route change
  useEffect(() => {
    setShowBackdrop(false)
    document.documentElement.classList.remove('sidebar-enable')
  }, [pathname])

  const toggleBackdrop = useCallback(() => {
    setShowBackdrop((prev) => {
      if (prev) document.documentElement.classList.remove('sidebar-enable')
      else document.documentElement.classList.add('sidebar-enable')
      return !prev
    })
  }, [])

  const contextValue = useMemo(
    () => ({
      themePreference,
      themeMode: resolveTheme(themePreference),
      changeTheme,
      toggleBackdrop,
      showBackdrop,
    }),
    [themePreference, showBackdrop, changeTheme, toggleBackdrop]
  )

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
      {showBackdrop && <div className="sidebar-backdrop" onClick={toggleBackdrop} />}
    </ThemeContext.Provider>
  )
}

export { LayoutProvider }
