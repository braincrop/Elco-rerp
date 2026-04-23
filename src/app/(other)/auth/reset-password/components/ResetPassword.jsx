'use client'

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import DarkLogo from '@/assets/images/Logo-primidigitals 1 (1).png'
import LightLogo from '@/assets/images/Logo-primidigitals 1 (1).png'
import Image from 'next/image'
import { Form, FormGroup, Label, Input, Button } from 'reactstrap'
import { Card, CardBody, Col, Row } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import Notify from '@/components/Notify'
import { ForgotPassword } from '@/redux/slice/Authentication/AuthenticationSlice'
import { useRouter } from 'next/navigation'
import { Icon } from '@iconify/react/dist/iconify.js'
import { useTheme } from '@/context/BrandingContext'
const ResetPassword = () => {
  const { theme } = useTheme()
  const dispatch = useDispatch()
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const [data, setData] = useState({
    newPassword: '',
    email: '',
  })

  useEffect(() => {
    document.body.classList.add('authentication-bg')
    return () => {
      document.body.classList.remove('authentication-bg')
    }
  }, [])
  const handleChange = (e) => {
    const { name, value } = e.target
    setData({ ...data, [name]: value })
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!data.email?.trim() || !data.newPassword?.trim()) {
      Notify('error', 'Please fill all the fields')
      return
    }
    try {
      await dispatch(ForgotPassword(data)).unwrap()
      router.replace('/auth/sign-in')
    } catch (error) {
      console.log('failed to update password:', error)
    }
  }

  return (
    <div className="account-pages">
      <div className="container">
        <Row className=" justify-content-center">
          <Col md={6} lg={5}>
            <Card className="border-0 shadow-lg" style={{ backgroundColor: theme.primaryColor }}>
              <CardBody className="p-5">
                <div className="text-center">
                  <div className="mx-auto mb-4 text-center auth-logo">
                    <a className="logo-light">
                      <img src={theme?.logoUrl || LightLogo} height={62} alt="logolight" />
                    </a>
                  </div>
                  <h4 className="fw-bold text-dark mb-2">Reset Password</h4>
                </div>
                <form onSubmit={handleSubmit} className="mt-4">
                  <div className="mb-3">
                    <FormGroup>
                      <Label>
                        Email <span style={{ color: '#e57373' }}>*</span>
                      </Label>
                      <Input
                        name="email"
                        label="Email"
                        style={{ backgroundColor: 'transparent' }}
                        value={data.email}
                        onChange={(e) => handleChange(e)}
                        type="text"
                        placeholder="Enter your Email"
                      />
                    </FormGroup>
                  </div>
                  <div className="mb-3">
                    <FormGroup className="position-relative">
                      <Label>
                        Password <span style={{ color: '#e57373' }}>*</span>
                      </Label>
                      <Input
                        name="newPassword"
                        style={{ backgroundColor: 'transparent' }}
                        type={showPassword ? 'text' : 'password'}
                        value={data.newPassword}
                        onChange={handleChange}
                        placeholder="Enter your Password"
                      />
                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '38px',
                          cursor: 'pointer',
                          color: '#6c757d',
                        }}>
                        <Icon icon={showPassword ? 'mdi:eye-off' : 'mdi:eye'} size={25} />
                      </span>
                    </FormGroup>
                  </div>
                  <div className="d-grid">
                    <button className="btn btn-dark btn-lg fw-medium" type="submit">
                      Reset Password
                    </button>
                  </div>
                </form>
              </CardBody>
            </Card>
            <p className="text-center mt-4 text-white text-opacity-50">
              Back to&nbsp;
              <Link href="/auth/sign-in" className="text-decoration-none text-white fw-bold">
                Sign In
              </Link>
            </p>
          </Col>
        </Row>
      </div>
    </div>
  )
}
export default ResetPassword
