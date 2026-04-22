'use client'
import React from 'react'
import IconifyIcon from '@/components/wrapper/IconifyIcon'

const ThemeModeToggle = () => {
  return (
    <div className="topbar-item">
      <button type="button" className="topbar-button" disabled style={{backgroundColor:'transparent'}}>
        <IconifyIcon icon="ri:moon-line" className="fs-22 dark-mode" />
      </button>
    </div>
  )
}

export default ThemeModeToggle