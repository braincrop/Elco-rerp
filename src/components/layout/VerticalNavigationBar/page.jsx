'use client'
import React, { useEffect, useState } from 'react'
import AppMenu from './components/AppMenu'
import { getMenuItems } from '@/helpers/Manu'
import SimplebarReactClient from '@/components/wrapper/SimplebarReactClient'
import LogoBox from '@/components/wrapper/LogoBox'
import { useTheme } from '@/context/BrandingContext'
const Page = () => {
  const [menuItems, setMenuItems] = useState([])
  const { theme } = useTheme()
  useEffect(() => {
    const items = getMenuItems()
    setMenuItems(items)
  }, [])

  return (
    <div className="app-sidebar" style={{ backgroundColor: theme.primaryColor }}>
      <LogoBox />
      <SimplebarReactClient className="scrollbar" data-simplebar>
        <AppMenu menuItems={menuItems} />
      </SimplebarReactClient>
    </div>
  )
}
export default Page
