'use client'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import DarkLogo from '@/assets/images/logo-dark.png'
import LightLogo from '@/assets/images/logo-light.png'
import TextFormInput from '@/components/from/TextFormInput'
import { Card, CardBody, Col, Row } from 'react-bootstrap'
import { Form, FormGroup, Label, Input, Button } from 'reactstrap'
import { useDispatch } from 'react-redux'
import Notify from '@/components/Notify'
import { useRouter } from 'next/navigation'
import { Registration } from '@/redux/slice/Authentication/AuthenticationSlice'
const SignUp = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const [data, setData] = useState({
    userName: '',
    email: '',
    password: '',
  })
  const handleChange = (e) => {
    const { name, value } = e.target
    setData({ ...data, [name]: value })
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    const { userName, email, password } = data
    if (!userName?.trim() || !email?.trim() || !password?.trim()) {
      Notify('error', 'Please fill all the fields')
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      Notify('error', 'Please enter a valid email address')
      return
    }
    try {
      await dispatch(Registration(data)).unwrap()
      router.push('/auth/sign-in')
    } catch (error) {
      console.log('Registration failed:', error)
    }
  }
  return (
    <>
      <div className="account-pages" style={{ paddingTop: '150px' }}>
        <div className="container">
          <Row className=" justify-content-center">
            <Col md={6} lg={5}>
              <Card className=" border-0 shadow-lg">
                <CardBody className=" p-5">
                  <div className="text-center">
                    <div className="mx-auto mb-4 text-center auth-logo">
                      <Link href="/dashboards" className="logo-dark">
                        <Image src={DarkLogo} height={32} alt="logo dark" />
                      </Link>
                      <Link href="/" className="logo-light">
                        <Image src={LightLogo} height={28} alt="logo light" />
                      </Link>
                    </div>
                    <h4 className="fw-bold text-dark mb-2">Sign Up</h4>
                    <p className="text-muted">New to our platform? Sign up now! It only takes a minute.</p>
                  </div>

                  <div className="mb-3">
                    <FormGroup>
                      <Label>
                        Name <span style={{ color: '#e57373' }}>*</span>
                      </Label>
                      <Input name="userName" value={data.userName} onChange={(e) => handleChange(e)} type="text" placeholder="Enter your Name" />
                    </FormGroup>
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
                  {/* <div className="mb-3">
                    <div className="form-check">
                      <input type="checkbox" className="form-check-input" id="checkbox-signin" />
                      <label className="form-check-label" htmlFor="checkbox-signin">
                        I accept Terms and Condition
                      </label>
                    </div>
                  </div> */}
                  <div className="mb-1 text-center d-grid">
                    <button className="btn btn-dark btn-lg fw-medium" type='submit'>
                      Sign Up
                    </button>
                  </div>
                  </form>
                </CardBody>
              </Card>
              <p className="text-center mt-4 text-white text-opacity-50">
                I already have an account&nbsp;
                <Link href="/auth/sign-in" className="text-decoration-none text-white fw-bold">
                  Sign In
                </Link>
              </p>
            </Col>
          </Row>
        </div>
      </div>
    </>
  )
}
export default SignUp
