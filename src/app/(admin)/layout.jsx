import dynamic from 'next/dynamic'

const TopNavigationBar = dynamic(() => import('@/components/layout/TopNavigationBar/page'))
const VerticalNavigationBar = dynamic(() => import('@/components/layout/VerticalNavigationBar/page'))

const AdminLayout = ({ children }) => {
  return (
    <div className="app">
      <VerticalNavigationBar />
      <div className="app-main">
        <TopNavigationBar />
        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
