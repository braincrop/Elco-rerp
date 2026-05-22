'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import DarkLogo from '@/assets/images/Logo-primidigitals 1 (1).png'
import LightLogo from '@/assets/images/Logo-primidigitals 1 (1).png'
import { Form, FormGroup, Label, Input, Button } from 'reactstrap'
import { Card, CardBody, Col, Row } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import Notify from '@/components/Notify'
import { ForgotPassword, ResetUserPassword, SendPasswordLi } from '@/redux/slice/Authentication/AuthenticationSlice'
import { useRouter } from 'next/navigation'
import { Icon } from '@iconify/react/dist/iconify.js'
import { useTheme } from '@/context/BrandingContext'
import { useSearchParams } from 'next/navigation';


const VerifyPassword = () => {
  const { theme } = useTheme()
  const dispatch = useDispatch()
  const searchParams = useSearchParams()
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const email = searchParams.get('email')
  const token = searchParams.get('token')
  const encodedToken = encodeURIComponent(token)
  const [data, setData] = useState({
    password: '',
    confirmPassword: '',
  })

  console.log('email:', email)
  console.log('token:', token)
  console.log('encodedToken:', encodedToken)

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

  const handleConfirmPassword = async () => {
    const passwordRegex = /^(?=.*[!@#$%^&*])(?=.*\d).{6,}$/;
    if (!email || !token) {
      Notify("error", "Email or token is missing.");
      return;
    } else if (!data.password || !data.confirmPassword) {
      Notify("error", "Please fill in both password fields.");
      return;
    } else if (data.password !== data.confirmPassword) {
      Notify("error", "Passwords do not match.");
      return;
    } else if (!passwordRegex.test(data.password)) {
      Notify(
        "error",
        "Password must be at least 6 characters long, contain at least one special character, and one number."
      );
      return;
    }
    const sendData = {
      email,
      encodedToken,
      body: {
        password: data.password,
        confirmPassword: data.confirmPassword,
      },
    }
    dispatch(
      ResetUserPassword(sendData)
    ).then((res) => {
      if (res?.payload?.success) {
        // Notify("success", res?.payload?.message || "Password reset successful.");
        router.replace('/auth/sign-in');
      } else {
        // Notify("error", res?.payload?.message || "Password reset failed.");
        console.error("Password reset failed:", res);
      }
    });
  };

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
                  <h4 className="fw-bold text-dark mb-2">Verify Password</h4>
                </div>
              
                  <div className="mb-3">
                    <FormGroup>
                      <Label>
                       Password <span style={{ color: '#e57373' }}>*</span>
                      </Label>
                      <Input
                        name="password"
                        label="Password"
                        style={{ backgroundColor: 'transparent' }}
                        value={data.password}
                        onChange={(e) => handleChange(e)}
                        type="text"
                        placeholder="Enter your Password"
                      />
                    </FormGroup>
                  </div>
                  <div className="mb-3">
                    <FormGroup className="position-relative">
                      <Label>
                        Confirm Password <span style={{ color: '#e57373' }}>*</span>
                      </Label>
                      <Input
                        name="confirmPassword"
                        style={{ backgroundColor: 'transparent' }}
                        type={showPassword ? 'text' : 'password'}
                        value={data.confirmPassword}
                        onChange={handleChange}
                        placeholder="Enter your Confirm Password"
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
                    <button className="btn btn-dark btn-lg fw-medium" onClick={handleConfirmPassword} type="button">
                      Verify
                    </button>
                  </div>
            
              </CardBody>
            </Card>
            {/* <p className="text-center mt-4 text-white text-opacity-50">
              Back to&nbsp;
              <Link href="/auth/sign-in" className="text-decoration-none text-white fw-bold">
                Sign In
              </Link>
            </p> */}
          </Col>
        </Row>
      </div>
    </div>
  )
}
export default VerifyPassword
