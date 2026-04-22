'use client'

import React, { useEffect, useState } from 'react'
import { Button, Input, FormGroup, Label, Card, CardBody } from 'reactstrap'
import { useDispatch, useSelector } from 'react-redux'
import Notify from '@/components/Notify'
import { PostUser, UpdatedUserInfo, AllUserManagement } from '@/redux/slice/UserManegement/UserManagementSlice'
import { Icon } from '@iconify/react/dist/iconify.js'

const UserForm = ({ mode, initialData, onBack }) => {
  console.log('initialData', initialData)
  const dispatch = useDispatch()
  const { loading } = useSelector(AllUserManagement)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    UserName: '',
    email: '',
    phoneNumber: '',
    role: '',
    password: '',
    ConfirmPassword: '',
  })

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData({
        id: initialData.id,
        UserName: initialData.userName,
        email: initialData.email,
        phoneNumber: initialData.phoneNumber,
        role: initialData.role?.[0],
        password: '',
        ConfirmPassword: '',
      })
    }
  }, [mode, initialData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validate = () => {
    if (!formData.UserName) return Notify('error', 'Name is required')
    if (!formData.email) return Notify('error', 'Email is required')
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) return Notify('error', 'Invalid email format')
    if (mode === 'create') {
      if (!formData.password) return Notify('error', 'Password is required')
      if (formData.password.length < 6) return Notify('error', 'Password must be at least 6 characters long')
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])/
      if (!passwordRegex.test(formData.password)) {
        return Notify('error', 'Password must have at least 1 uppercase letter, 1 number, and 1 special character')
      }
      if (!formData.ConfirmPassword) return Notify('error', 'Confirm Password is required')
      if (formData.password !== formData.ConfirmPassword) return Notify('error', 'Passwords do not match')
      if (!formData.role) return Notify('error', 'Role is required')
    }
    return true
  }

  const handleSubmit = async () => {
    if (!validate()) return
    if (mode === 'create') {
      await dispatch(PostUser(formData)).unwrap()
    } else {
      await dispatch(
        UpdatedUserInfo({
          id: formData.id,
          updatedData: formData,
        }),
      ).unwrap()
    }
    onBack()
  }

  return (
    <div className="mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="custom-text">{mode === 'create' ? 'Create User' : 'Edit User'}</h4>
        <Button color="secondary" onClick={onBack}>
          View List
        </Button>
      </div>
      <div className="row mb-3">
        <div className="col-md-4">
          <FormGroup>
            <Label className="custom-text">
              Name <span style={{ color: '#e57373' }}>*</span>
            </Label>
            <Input name="UserName" value={formData.UserName} onChange={handleChange} style={{backgroundColor:'transparent'}} className="custom-text"/>
          </FormGroup>
        </div>
        <div className="col-md-4">
          <FormGroup>
            <Label className="custom-text">
              Email <span style={{ color: '#e57373' }}>*</span>
            </Label>
            <Input name="email" value={formData.email} onChange={handleChange} disabled={mode === 'edit'} style={{backgroundColor:'transparent'}} className="custom-text"/>
            {mode === 'edit' && <span className="text-muted m-1">Email cannot be changed</span>}
          </FormGroup>
        </div>
        <div className="col-md-4">
          <FormGroup>
            <Label className="custom-text">
              Phone <span style={{ color: '#e57373' }}>*</span>
            </Label>
            <Input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              style={{backgroundColor:'transparent'}} className="custom-text"
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '')
                setFormData({
                  ...formData,
                  phoneNumber: value,
                })
              }}
              placeholder="Enter phone number"
              maxLength={15}
            />
          </FormGroup>
        </div>
      </div>
      {mode === 'create' ? (
        <div className="row mb-3">
          <div className="col-md-4">
            <FormGroup className="position-relative">
              <Label className="custom-text">
                Password <span style={{ color: '#e57373' }}>*</span>
              </Label>
              <Input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} style={{backgroundColor:'transparent'}} className="custom-text"/>
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  top: '38px',
                  right: '10px',
                  cursor: 'pointer',
                  color: '#6c757d',
                }}>
                <Icon icon={showPassword ? 'mdi:eye-off' : 'mdi:eye'} />
              </span>
            </FormGroup>
          </div>
          <div className="col-md-4">
            <FormGroup className="position-relative">
              <Label className="custom-text">
                Confirm Password <span style={{ color: '#e57373' }}>*</span>
              </Label>
              <Input
              className="custom-text"
                type={showConfirmPassword ? 'text' : 'password'}
                name="ConfirmPassword"
                value={formData.ConfirmPassword}
                style={{backgroundColor:'transparent'}} 
                onChange={handleChange}
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute',
                  top: '38px',
                  right: '10px',
                  cursor: 'pointer',
                  color: '#6c757d',
                }}>
                <Icon icon={showConfirmPassword ? 'mdi:eye-off' : 'mdi:eye'} />
              </span>
            </FormGroup>
          </div>
          <div className="col-md-4">
            <FormGroup>
              <Label className="custom-text">
                Role <span style={{ color: '#e57373' }}>*</span>
              </Label>
              <Input type="select" name="role" value={formData.role} onChange={handleChange} style={{backgroundColor:'transparent'}} className="custom-text">
                <option value="">Select</option>
                <option value="Admin">Admin</option>
                <option value="PowerUser">PowerUser</option>
              </Input>
            </FormGroup>
          </div>
        </div>
      ) : (
        <div className="row mb-3">
          <div className="col-md-4">
            <FormGroup>
              <Label className="custom-text">
                Role <span style={{ color: '#e57373' }}>*</span>
              </Label>
              <Input type="select" name="role" value={formData.role} onChange={handleChange} style={{backgroundColor:'transparent'}} className="custom-text">
                <option value="">Select</option>
                <option value="Admin">Admin</option>
                <option value="PowerUser">PowerUser</option>
              </Input>
            </FormGroup>
          </div>
        </div>
      )}

      <div className="d-flex gap-2">
        <Button color="secondary" onClick={onBack}>
          Cancel
        </Button>
        <Button color="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Saving...' : mode === 'create' ? 'Create' : 'Update'}
        </Button>
      </div>
    </div>
  )
}

export default UserForm
