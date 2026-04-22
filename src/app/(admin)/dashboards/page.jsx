'use client'
import Footer from '@/components/layout/Footer'
import dynamic from 'next/dynamic'
import React, { useEffect } from 'react'
// import Chart from './components/Chart';
const Chart = dynamic(() => import('./components/Chart'), { ssr: false })
import User from './components/User'
import Link from 'next/link'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { Col, Row } from 'react-bootstrap'
import Cards from './components/Cards'
import { useRouter } from 'next/navigation';

// export const metadata = {
//   title: 'Analytics',
// }

const Page = () => {
  const router = useRouter()

  useEffect(() => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    if (!token) router.replace('/auth/sign-in')
  }
}, [])

  return (
    <>
      <Row>
        <Col xs={12}>
          <div className="page-title-box">
            <h4 className="mb-0 custom-text">Dashboard</h4>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link href="/">Taplox</Link>
              </li>
              <div
                className="mx-1"
                style={{
                  height: 24,
                  paddingRight: '8px',
                }}>
                <IconifyIcon icon="bx:chevron-right" height={16} width={16} />
              </div>
              <li className="breadcrumb-item active">Dashboard</li>
            </ol>
          </div>
        </Col>
      </Row>
      <Cards />
      <Chart />
      <User />
      <Footer />
    </>
  )
}
export default Page
