'use client'
import { createContext, useContext, useEffect, useState } from 'react'

const clientId = process.env.NEXT_PUBLIC_CLIENT_ID
const url = `https://sprucesol.com/${clientId}/branding.json`
const CACHE_KEY = 'vendral_branding'

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
    // Apply cached branding synchronously so there's no flash on any page load
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      if (cached) {
        const cachedData = JSON.parse(cached)
        applyBranding(cachedData)
        setTheme(cachedData)
      }
    } catch {}

    // Fetch fresh branding and update cache
    const fetchTheme = async () => {
      try {
        const res = await fetch(url)
        if (!res.ok) throw new Error('Failed to fetch branding')
        const data = await res.json()
        setTheme(data)
        applyBranding(data)
        try { localStorage.setItem(CACHE_KEY, JSON.stringify(data)) } catch {}
      } catch (err) {
        console.error('Branding fetch error:', err)
      }
    }
    fetchTheme()
  }, [])

  return <ThemeContext.Provider value={{ theme }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)
