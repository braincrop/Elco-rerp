'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AllUser, AllUserManagement, DeleteUserInfo } from '@/redux/slice/UserManegement/UserManagementSlice'
import UserForm from './component/UserForm'
import { decodeJwt } from '@/utils/decodeJwt'
import { allRoles, AssignMultipleRole, GetAllRoles } from '@/redux/slice/Role/RoleSlice'
import Notify from '@/components/Notify'
import Select from 'react-select'
import DataTable from '@/components/ui/DataTable'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Field from '@/components/ui/Field'
import SvgIcon from '@/components/ui/SvgIcon'

const customSelectStyles = {
  control: (base) => ({
    ...base,
    backgroundColor: 'var(--surface)',
    borderColor: 'var(--line)',
    color: 'var(--ink)',
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: 'var(--surface)',
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? 'var(--line)' : 'var(--surface)',
    color: 'var(--ink)',
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: 'var(--line)',
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: 'var(--ink)',
  }),
  singleValue: (base) => ({
    ...base,
    color: 'var(--ink)',
  }),
}

const Page = () => {
  const dispatch = useDispatch()
  const { users, loading } = useSelector(AllUserManagement)
  const { Role } = useSelector(allRoles)
  const [view, setView] = useState('list')
  const [mode, setMode] = useState('create')
  const [selectedUser, setSelectedUser] = useState(null)
  const [deleteModal, setDeleteModal] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [tokenEmail, setTokenEmail] = useState(null)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [AssignModal, setAssignModal] = useState(false)
  const [assignData, setAssignData] = useState({ userId: '', roleIds: [] })

  useEffect(() => {
    dispatch(AllUser())
    dispatch(GetAllRoles())
  }, [])

  const RoleOption = Role?.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }))

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      if (token) {
        const decoded = decodeJwt(token)
        setTokenEmail(decoded?.email || decoded?.Email || null)
      }
    }
  }, [])

  const filteredUsers = useMemo(() => {
    if (!tokenEmail) return users || []
    return (users || []).filter((user) => user.email?.toLowerCase() !== tokenEmail.toLowerCase())
  }, [users, tokenEmail])

  const openCreate = () => {
    setMode('create')
    setSelectedUser(null)
    setView('form')
  }
  const backToList = () => {
    setView('list')
    setSelectedUser(null)
  }
  const openEdit = (user) => {
    setMode('edit')
    setSelectedUser(user)
    setView('form')
  }
  const openDelete = (id) => {
    setDeleteId(id)
    setDeleteModal(true)
  }
  const confirmDelete = async () => {
    await dispatch(DeleteUserInfo(deleteId)).unwrap()
    setDeleteModal(false)
  }
  const openAssignModal = (index) => {
    setAssignData({ userId: index, roleIds: [] })
    setSelectedIndex(index)
    setAssignModal(true)
  }
  const AssignRole = async () => {
    const id = assignData.roleIds
    if (!Array.isArray(id) || id.length === 0) {
      Notify('error', 'Select at least one role')
      return
    }
    try {
      await dispatch(AssignMultipleRole(assignData)).unwrap()
      setAssignModal(false)
      await dispatch(AllUser()).unwrap()
    } catch (error) {
      console.error('Assign role error:', error)
    }
  }

  const columns = [
    { key: 'userName', label: 'Name', render: (val) => val || '-' },
    { key: 'email', label: 'Email', render: (val) => val || '-' },
    { key: 'phoneNumber', label: 'Phone', render: (val) => val || '-' },
    { key: 'role', label: 'Role', render: (val) => (Array.isArray(val) ? val[0] : val) || '-' },
    {
      key: 'actions',
      label: 'Action',
      align: 'center',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <Button variant="ghost" size="sm" icon={<SvgIcon id="i-key" />} onClick={() => openAssignModal(row.id)} title="Assign Role" />
          <Button variant="ghost" size="sm" icon={<SvgIcon id="i-edit" />} onClick={() => openEdit(row)} />
          <Button variant="danger-outline" size="sm" icon={<SvgIcon id="i-trash" />} onClick={() => openDelete(row.id)} />
        </div>
      ),
    },
  ]

  return (
    <div className="page-content">
      {view === 'list' && (
        <>
          <div className="page-head">
            <div>
              <h1 className="page-title">Users</h1>
              <p className="page-sub">Manage registered users</p>
            </div>
            <Button variant="primary" icon={<SvgIcon id="i-plus" />} onClick={openCreate}>
              Create User
            </Button>
          </div>

          <div className="card">
            <div className="card-pad">
              <DataTable
                columns={columns}
                data={filteredUsers}
                rowKey="id"
                loading={loading}
                emptyText="No Users Found"
              />
            </div>
          </div>
        </>
      )}

      {view === 'form' && <UserForm mode={mode} initialData={selectedUser} onBack={backToList} />}

      <Modal
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Delete User"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteModal(false)}>Cancel</Button>
            <Button variant="danger-outline" onClick={confirmDelete}>Delete</Button>
          </>
        }
      >
        <p style={{ color: 'var(--ink-2)' }}>Are you sure you want to delete this user?</p>
      </Modal>

      <Modal
        open={AssignModal}
        onClose={() => setAssignModal(false)}
        title="Assign Roles"
        footer={
          <>
            <Button variant="ghost" onClick={() => setAssignModal(false)}>Cancel</Button>
            <Button variant="primary" busy={loading} onClick={AssignRole} icon={<SvgIcon id="i-check" />}>
              Assign
            </Button>
          </>
        }
      >
        <Field label="Available Roles">
          <Select
            isMulti
            options={RoleOption}
            value={RoleOption?.filter((option) => (assignData?.roleIds || []).includes(option.value))}
            onChange={(selectedOptions) =>
              setAssignData({ ...assignData, roleIds: selectedOptions.map((option) => option.value) })
            }
            styles={customSelectStyles}
            placeholder="Select roles..."
          />
        </Field>
      </Modal>
    </div>
  )
}

export default Page
