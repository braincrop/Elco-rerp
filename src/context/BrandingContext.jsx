'use client'
import { createContext, useContext, useEffect, useState } from 'react'

const clientId = process.env.NEXT_PUBLIC_CLIENT_ID
const url = `https://sprucesol.com/${clientId}/branding.json`

const ThemeContext = createContext()

const applyBranding = (data) => {
  const root = document.documentElement
  const set = (k, v) => v && root.style.setProperty(k, v)

  // Layer 1 only — 5 brand tokens max
  set('--brand-primary',      data.primaryColor)
  set('--brand-accent',       data.accentColor)
  set('--brand-accent-light', data.accentLightColor)
  set('--brand-bg',           data.backgroundColor)
  set('--brand-surface',      data.surfaceColor)
}

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(null)

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const res = await fetch(url)
        if (!res.ok) throw new Error('Failed to fetch branding')
        const data = await res.json()
        setTheme(data)
        applyBranding(data)
      } catch (err) {
        console.error('Branding fetch error:', err)
      }
    }
    fetchTheme()
  }, [])

  return <ThemeContext.Provider value={{ theme }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)
