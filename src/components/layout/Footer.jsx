'use client'
import { useTheme } from '@/context/BrandingContext'
import { currentYear } from '@/context/constants'
import React from 'react'
import { Col, Row } from 'react-bootstrap'
const Footer = () => {
  const { theme } = useTheme()
  return (
    <footer className="footer mb-0 rounded-0 justify-content-center align-items-center" style={{ backgroundColor: theme.backgroundColor }}>
      <div className="container-fluid">
        <Row>
          <Col xs={12} className="text-center">
            <p className="mb-0 text-black">
              {currentYear} © {theme.name || 'Primidigital'}.
            </p>
          </Col>
        </Row>
      </div>
    </footer>
  )
}
export default Footer
