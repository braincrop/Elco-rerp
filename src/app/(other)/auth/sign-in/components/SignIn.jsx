'use client'
import DarkLogo from '@/assets/images/Logo-primidigitals 1 (1).png'
import LightLogo from '@/assets/images/Logo-primidigitals 1 (1).png'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardBody, Col, Row } from 'react-bootstrap'
import { Form, FormGroup, Label, Input, Button } from 'reactstrap'
import { useDispatch, useSelector } from 'react-redux'
import { allUser, Login } from '@/redux/slice/Authentication/AuthenticationSlice'
import Notify from '@/components/Notify'
import { Spinner } from 'reactstrap'
import { useTheme } from '@/context/BrandingContext'

export function FullScreenLoader() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0, 0, 0, 0.75)',
        zIndex: 999999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(2px)',
      }}
    >
      <Spinner style={{ width: '3rem', height: '3rem' }} />
      <p className="mt-3 text-light">Please wait...</p>
    </div>
  )
}

const SignIn = () => {
  const dispatch = useDispatch()
  const { loading } = useSelector(allUser)
  const { theme } = useTheme();
  const router = useRouter()
  const [routeLoading, setRouteLoading] = useState(false)
  const [data, setData] = useState({
    email: '',
    password: '',
  })
  const handleChange = (e) => {
    const { name, value } = e.target
    setData({ ...data, [name]: value })
  }
  useEffect(() => {
    document.body.classList.add('authentication-bg')
    return () => {
      document.body.classList.remove('authentication-bg')
    }
  }, [])
  
  console.log("theme--",theme);

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { email, password } = data
    if (!email?.trim() || !password?.trim()) {
      Notify('error', 'Please fill all the fields')
      return
    }
    try {
      await dispatch(Login(data)).unwrap()
      setRouteLoading(true)
      Notify('success', 'User Login successfully')
      router.replace('/dashboards')
    } catch (error) {
      console.log('Login failed:', error)
      setRouteLoading(false)
    }
  }
  const showLoader = loading || routeLoading
  return (
    <div className="account-pages">
      <div className="container">
        <Row className="justify-content-center">
            {showLoader && <FullScreenLoader />}
          <Col md={6} lg={5}>
            <div className="border-0" style={{backgroundColor:theme.primaryColor}}>
              <div className="p-5">
                <div className="text-center">
                  <div className="mx-auto mb-4 text-center auth-logo">
                    <a className="logo-light">
                      <img src={theme?.logoUrl || LightLogo} height={92} alt="logo light" width={200} />
                    </a>
                  </div>
                  <h4 className="fw-bold text-dark mb-2">Welcome Back!</h4>
                  <p className="text-muted">Sign in to your account to continue</p>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <FormGroup>
                      <Label>
                        Email <span style={{ color: '#e57373' }}>*</span>
                      </Label>
                      <Input
                        name="email"
                        label="Email"
                        value={data.email}
                        onChange={(e) => handleChange(e)}
                        type="text"
                        placeholder="Enter your Email"
                      />
                    </FormGroup>
                  </div>
                  <div className="mb-3">
                    <Link href="/auth/reset-password" className="float-end text-muted  ms-1">
                      Forgot password?{' '}
                    </Link>
                    <FormGroup>
                      <Label>
                        Password <span style={{ color: '#e57373' }}>*</span>
                      </Label>
                      <Input
                        name="password"
                        type="password"
                        value={data.password}
                        onChange={(e) => handleChange(e)}
                        placeholder="Enter your Password"
                      />
                    </FormGroup>
                  </div>
                  {/* <div className="form-check mb-3">
                  <input type="checkbox" className="form-check-input" id="remember-me" />
                  <label className="form-check-label" htmlFor="remember-me">
                    Remember me
                  </label>
                </div> */}
                  <div className="d-grid">
                    <button className="btn btn-dark btn-lg fw-medium" type="submit">
                       Sign in
                    </button>
                  </div>
                </form>
              </div>
            </div>
            {/* <p className="text-center mt-4 text-white text-opacity-50">
              Don&apos;t have an account?
              <Link href="/auth/sign-up" className="text-decoration-none text-white fw-bold">
                Sign Up
              </Link>
            </p> */}
          </Col>
        </Row>
      </div>
    </div>
  )
}
export default SignIn
