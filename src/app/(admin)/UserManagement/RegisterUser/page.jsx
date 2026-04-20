'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Table, Button, Container, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label } from 'reactstrap'
import { Icon } from '@iconify/react'
import { AllUser, AllUserManagement, DeleteUserInfo } from '@/redux/slice/UserManegement/UserManagementSlice'
import UserForm from './component/UserForm'
import { Spinner } from 'react-bootstrap'
import Select from 'react-select'
import { decodeJwt } from '@/utils/decodeJwt'
import { allRoles, AssignMultipleRole, GetAllRoles } from '@/redux/slice/Role/RoleSlice'
import Notify from '@/components/Notify'

const customSelectStyles = {
  control: (base) => ({
    ...base,
    backgroundColor: '#000',
    borderColor: '#444',
    color: '#fff',
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: '#000',
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? '#333' : '#000',
    color: '#fff',
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: '#333',
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: '#fff',
  }),
  singleValue: (base) => ({
    ...base,
    color: '#fff',
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
  const [assignData, setAssignData] = useState({
    userId: '',
    roleIds: [],
  })

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
    setAssignData({ userId: index })
    setSelectedIndex(index)
    setAssignModal(true)
  }
const AssignRole = async () => {
  const id = assignData.roleIds
  if (!Array.isArray(id) || id.length === 0) {
    Notify('error', 'Select At least one role')
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


  return (
    <Container className="mt-5">
      {view === 'list' && (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold custom-text">Users</h2>
            <Button color="primary" onClick={openCreate}>
              Create User
            </Button>
          </div>
          <Table bordered hover responsive className="shadow-sm rounded">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    <Spinner size="sm" className="me-2" />
                    Loading Users...
                  </td>
                </tr>
              ) : users?.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">
                    No Data Found
                  </td>
                </tr>
              ) : (
                filteredUsers?.map((user) => (
                  <tr key={user.id}>
                    <td>{user.userName || '-'}</td>
                    <td>{user.email || '-'}</td>
                    <td>{user.phoneNumber || '-'}</td>
                    <td>{user.role[0] || '-'}</td>
                    <td>
                      <div className="d-flex flex-column flex-sm-row justify-content-center gap-2">
                        <Button size="sm" color="info" className="me-1 w-sm-auto" onClick={() => openAssignModal(user.id)} title="Assign Role">
                          <Icon icon="mdi:account-key" />
                        </Button>
                        <Button size="sm" color="warning" className="me-1 w-sm-auto" onClick={() => openEdit(user)}>
                          <Icon icon="mdi:pencil" />
                        </Button>
                        <Button size="sm" color="danger" className="me-1 w-sm-auto" onClick={() => openDelete(user.id)}>
                          <Icon icon="mdi:delete" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </>
      )}
      {view === 'form' && <UserForm mode={mode} initialData={selectedUser} onBack={backToList} />}
      <Modal isOpen={deleteModal} toggle={() => setDeleteModal(false)} centered>
        <ModalHeader>Delete User</ModalHeader>
        <ModalBody>Are you sure?</ModalBody>
        <ModalFooter>
          <Button onClick={() => setDeleteModal(false)}>Cancel</Button>
          <Button color="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={AssignModal} centered toggle={() => setAssignModal(false)}>
        <ModalHeader toggle={() => setAssignModal(false)}>
          <Icon icon="mdi:playlist-edit" className="me-2" />
          Assign Roles
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label>Available Roles</Label>
            <Select
              isMulti
              options={RoleOption}
              value={RoleOption?.filter((option) => (assignData?.roleIds || []).includes(option.value))}
              onChange={(selectedOptions) =>
                setAssignData({
                  ...assignData,
                  roleIds: selectedOptions.map((option) => option.value),
                })
              }
              styles={customSelectStyles}
              placeholder="Select categories..."
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" outline onClick={() => setAssignModal(false)}>
            Cancel
          </Button>
          <Button color="primary" onClick={AssignRole} disabled={loading}>
            {loading && <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />}
            <Icon icon="mdi:check-circle-outline" className="me-1" />
            Assign
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  )
}

export default Page
