'use client'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Notify from '@/components/Notify'
import Button from '@/components/ui/Button'
import { PostUser, UpdatedUserInfo, AllUserManagement } from '@/redux/slice/UserManegement/UserManagementSlice'
import styles from './userForm.module.css'

const UserForm = ({ mode, initialData, onBack }) => {
  const dispatch = useDispatch()
  const { loading } = useSelector(AllUserManagement)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    UserName: '', email: '', phoneNumber: '', role: '', password: '', ConfirmPassword: '',
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
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return Notify('error', 'Invalid email format')
    if (mode === 'create') {
      if (!formData.password) return Notify('error', 'Password is required')
      if (formData.password.length < 6) return Notify('error', 'Password must be at least 6 characters')
      if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])/.test(formData.password))
        return Notify('error', 'Password must have 1 uppercase, 1 number, and 1 special character')
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
      await dispatch(UpdatedUserInfo({ id: formData.id, updatedData: formData })).unwrap()
    }
    onBack()
  }

  return (
    <div>
      <div className={styles.topBar}>
        <h4 className={styles.title}>{mode === 'create' ? 'Create User' : 'Edit User'}</h4>
        <Button variant="ghost" onClick={onBack}>View List</Button>
      </div>

      <div className={styles.grid3}>
        <div>
          <label className={styles.label}>Name <span className={styles.req}>*</span></label>
          <input name="UserName" value={formData.UserName} onChange={handleChange} className={styles.input} />
        </div>
        <div>
          <label className={styles.label}>Email <span className={styles.req}>*</span></label>
          <input name="email" type="email" value={formData.email} onChange={handleChange}
            disabled={mode === 'edit'} className={styles.input} />
          {mode === 'edit' && <span className={styles.hint}>Email cannot be changed</span>}
        </div>
        <div>
          <label className={styles.label}>Phone <span className={styles.req}>*</span></label>
          <input type="tel" name="phoneNumber" value={formData.phoneNumber}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value.replace(/[^0-9]/g, '') })}
            placeholder="Phone number" maxLength={15} className={styles.input} />
        </div>
      </div>

      {mode === 'create' ? (
        <div className={styles.grid3}>
          <div>
            <label className={styles.label}>Password <span className={styles.req}>*</span></label>
            <div className={styles.pwWrap}>
              <input type={showPassword ? 'text' : 'password'} name="password"
                value={formData.password} onChange={handleChange} className={styles.input} />
              <button type="button" className={styles.eyeBtn} onClick={() => setShowPassword((v) => !v)}>
                {showPassword ? '🙈' : '👁'}
              </button>
            </div>
          </div>
          <div>
            <label className={styles.label}>Confirm Password <span className={styles.req}>*</span></label>
            <div className={styles.pwWrap}>
              <input type={showConfirmPassword ? 'text' : 'password'} name="ConfirmPassword"
                value={formData.ConfirmPassword} onChange={handleChange} className={styles.input} />
              <button type="button" className={styles.eyeBtn} onClick={() => setShowConfirmPassword((v) => !v)}>
                {showConfirmPassword ? '🙈' : '👁'}
              </button>
            </div>
          </div>
          <div>
            <label className={styles.label}>Role <span className={styles.req}>*</span></label>
            <select name="role" value={formData.role} onChange={handleChange} className={styles.input}>
              <option value="">Select role</option>
              <option value="Admin">Admin</option>
              <option value="PowerUser">PowerUser</option>
            </select>
          </div>
        </div>
      ) : (
        <div className={styles.grid3}>
          <div>
            <label className={styles.label}>Role</label>
            <select name="role" value={formData.role} onChange={handleChange} className={styles.input}>
              <option value="">Select role</option>
              <option value="Admin">Admin</option>
              <option value="PowerUser">PowerUser</option>
            </select>
          </div>
        </div>
      )}

      <div className={styles.actions}>
        <Button variant="ghost" onClick={onBack}>Cancel</Button>
        <Button onClick={handleSubmit} busy={loading}>
          {mode === 'create' ? 'Create' : 'Update'}
        </Button>
      </div>
    </div>
  )
}

export default UserForm
