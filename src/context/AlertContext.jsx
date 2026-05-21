'use client'

import { createContext, useContext, useState } from 'react'

const AlertContext = createContext()

const typeToVar = (type) => {
  if (type === 'success') return { bg: 'var(--good-bg)', color: 'var(--good)' }
  if (type === 'error')   return { bg: 'var(--bad-bg)',  color: 'var(--bad)'  }
  if (type === 'warning') return { bg: 'var(--warn-bg)', color: 'var(--warn)' }
  return { bg: 'var(--info-bg)', color: 'var(--info)' }
}

export function AlertProvider({ children }) {
  const [alert, setAlert] = useState(null)

  const showAlert = (type, message) => {
    setAlert({ type, message })
    setTimeout(() => setAlert(null), 3000)
  }

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {alert && (
        <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 9999, minWidth: 280 }}>
          <div style={{
            padding: '10px 16px',
            borderRadius: 8,
            background: typeToVar(alert.type).bg,
            color: typeToVar(alert.type).color,
            border: `1px solid currentColor`,
            fontSize: 14,
          }}>
            {alert.message}
          </div>
        </div>
      )}
      {children}
    </AlertContext.Provider>
  )
}

export const useAlert = () => useContext(AlertContext)
