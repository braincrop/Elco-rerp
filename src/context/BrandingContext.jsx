'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { tenantConfig } from '../utils/tenantConfig'

const clientId = process.env.NEXT_PUBLIC_CLIENT_ID

const url = `https://sprucesol.com/${clientId}/branding.json`

const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('')
  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error('Failed to fetch theme')
        }
        const data = await response.json()
        setTheme(data)
      } catch (error) {
        console.error('Error fetching theme:', error)
      }
    }
    fetchTheme()
  }, [])

  useEffect(() => {
    if (theme?.secondaryColor) {
      document.documentElement.style.setProperty('--custom-text-color', theme.textColor)
      document.documentElement.style.setProperty('--custom-bg-color', theme.primaryColor)
      document.documentElement.style.setProperty('--custom-modal-bg', theme.primaryColor)
      document.body.style.backgroundColor = theme.backgroundColor
    }
  }, [theme])

  return <ThemeContext.Provider value={{ theme: theme }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)
