import { createContext, useContext, useState } from 'react'

const NotificationContext = createContext(undefined)

export function useNotificationContext() {
  const context = useContext(NotificationContext)
  if (!context) throw new Error('useNotificationContext must be used within a NotificationProvider')
  return context
}

export function NotificationProvider({ children }) {
  const [config, setConfig] = useState({ show: false, message: '', title: '' })

  const showNotification = ({ title, message, delay = 2000 }) => {
    setConfig({ show: true, title, message })
    setTimeout(() => setConfig({ show: false, message: '', title: '' }), delay)
  }

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {config.show && (
        <div style={{
          position: 'fixed', top: 16, right: 16, zIndex: 9999, minWidth: 260,
          background: 'var(--surface)', border: '1px solid var(--line)',
          borderRadius: 8, padding: '12px 16px', boxShadow: 'var(--shadow-2)',
          fontSize: 14, color: 'var(--ink)',
        }}>
          {config.title && <strong style={{ display: 'block', marginBottom: 4 }}>{config.title}</strong>}
          {config.message}
        </div>
      )}
      {children}
    </NotificationContext.Provider>
  )
}
