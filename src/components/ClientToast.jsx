'use client'

import { useEffect, useState } from 'react'

export default function ClientToast() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    const handler = (e) => {
      const toast = e.detail
      setToasts((prev) => [...prev, toast])
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id))
      }, 3000)
    }

    window.addEventListener('app-toast', handler)
    return () => window.removeEventListener('app-toast', handler)
  }, [])

  return (
    <div style={{ position: 'fixed', top: 25, right: 20, zIndex: 9999, minWidth: 280 }}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          style={{
            marginBottom: 8,
            padding: '10px 16px',
            borderRadius: 8,
            background: toast.status === 'success' ? '#08bb67' : '#d31313',
            color: '#fff',
            boxShadow: '0 4px 12px rgba(0,0,0,.15)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 14,
          }}
        >
          <strong>{toast.status === 'success' ? '✅' : '⚠️'}</strong>
          {toast.message}
        </div>
      ))}
    </div>
  )
}
