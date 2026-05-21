'use client'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AllEmployees, DeleteEmployeeData, GetAllEmployee, PostEmployeesData, UpdatedEmployee } from '@/redux/slice/Employees/EmployeeSlice'
import Notify from '@/components/Notify'
import DataTable from '@/components/ui/DataTable'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import RowDrawer from '@/components/ui/RowDrawer'
import Field from '@/components/ui/Field'
import SvgIcon from '@/components/ui/SvgIcon'
import Toolbar from '@/components/ui/Toolbar'

const Page = () => {
  const dispatch = useDispatch()
  const { Employee, loading } = useSelector(AllEmployees)
  const [search, setSearch] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerMode, setDrawerMode] = useState('create')
  const [deleteModal, setDeleteModal] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [productInput, setProductInput] = useState({
    eeid: '',
    name: '',
    email: '',
    workPhone: '',
    isEmployed: '',
  })

  useEffect(() => {
    dispatch(GetAllEmployee())
  }, [])

  const openDrawer = (type, prod = null) => {
    setDrawerMode(type)
    if (type === 'edit') {
      setProductInput({
        id: prod.employeeId || '',
        eeid: prod.eeid || '',
        name: prod.name || '',
        email: prod.email || '',
        workPhone: prod.workPhone || '',
        isEmployed: prod.isEmployed || '',
      })
    } else {
      setProductInput({ eeid: '', name: '', email: '', workPhone: '', isEmployed: '' })
    }
    setDrawerOpen(true)
  }

  const validateProduct = () => {
    if (!productInput.eeid) { Notify('error', 'EEID is required'); return false }
    if (!productInput.name?.trim()) { Notify('error', 'Name is required'); return false }
    if (!productInput.email) { Notify('error', 'Email is required'); return false }
    if (!productInput.workPhone) { Notify('error', 'WorkPhone is required'); return false }
    if (productInput.isEmployed === '' || productInput.isEmployed === null || productInput.isEmployed === undefined) {
      Notify('error', 'Employed Status is required'); return false
    }
    return true
  }

  const saveProduct = () => {
    if (!validateProduct()) return
    if (drawerMode === 'create') {
      dispatch(PostEmployeesData(productInput)).unwrap()
    }
    if (drawerMode === 'edit') {
      const id = productInput.id
      dispatch(UpdatedEmployee({ id, updatedData: productInput })).unwrap()
    }
    setDrawerOpen(false)
  }

  const openDeleteModal = (id) => {
    setSelectedIndex(id)
    setDeleteModal(true)
  }

  const confirmDelete = () => {
    dispatch(DeleteEmployeeData(selectedIndex)).unwrap()
    setDeleteModal(false)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProductInput((prev) => ({ ...prev, [name]: value }))
  }

  const filteredEmployees = (Employee || []).filter((e) =>
    e.name?.toLowerCase().includes(search.toLowerCase()) ||
    e.email?.toLowerCase().includes(search.toLowerCase()) ||
    e.eeid?.toLowerCase().includes(search.toLowerCase())
  )

  const columns = [
    { key: 'index', label: '#', render: (_, __, idx) => idx + 1, width: '50px' },
    { key: 'eeid', label: 'EEID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'workPhone', label: 'Work Phone' },
    {
      key: 'isEmployed',
      label: 'Employed',
      render: (val) => (
        <span style={{ color: val ? 'var(--good)' : 'var(--bad)' }}>
          {val ? 'Yes' : 'No'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'center',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <Button variant="ghost" size="sm" icon={<SvgIcon id="i-edit" />} onClick={() => openDrawer('edit', row)} />
          <Button variant="danger-outline" size="sm" icon={<SvgIcon id="i-trash" />} onClick={() => openDeleteModal(row.employeeId)} />
        </div>
      ),
    },
  ]

  return (
    <div className="page-content">
      <div className="page-head">
        <div>
          <h1 className="page-title">Employees</h1>
          <p className="page-sub">Manage all employees</p>
        </div>
        <Button variant="primary" icon={<SvgIcon id="i-plus" />} onClick={() => openDrawer('create')}>
          Create New
        </Button>
      </div>

      <div className="card">
        <div className="card-pad">
          <Toolbar onSearch={setSearch} searchPlaceholder="Search by name, email or EEID..." />
          <DataTable
            columns={columns}
            data={filteredEmployees}
            rowKey="employeeId"
            loading={loading}
            emptyText="No Employees Found"
          />
        </div>
      </div>

      <RowDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={drawerMode === 'create' ? 'Create Employee' : 'Edit Employee'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={saveProduct}>
              {drawerMode === 'create' ? 'Create' : 'Save'}
            </Button>
          </>
        }
      >
        <Field label="EE ID" required>
          <input
            className="field-input"
            name="eeid"
            value={productInput.eeid}
            onChange={handleInputChange}
          />
        </Field>
        <Field label="Name" required>
          <input
            className="field-input"
            name="name"
            value={productInput.name}
            onChange={handleInputChange}
          />
        </Field>
        <Field label="Email" required>
          <input
            className="field-input"
            name="email"
            value={productInput.email}
            onChange={handleInputChange}
          />
        </Field>
        <Field label="Work Phone" required>
          <input
            className="field-input"
            name="workPhone"
            value={productInput.workPhone}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, '')
              setProductInput((prev) => ({ ...prev, workPhone: value }))
            }}
            maxLength={15}
          />
        </Field>
        <Field label="Employed" required>
          <select
            className="field-input"
            name="isEmployed"
            value={productInput.isEmployed ?? ''}
            onChange={(e) =>
              handleInputChange({ target: { name: 'isEmployed', value: e.target.value === 'true' } })
            }
          >
            <option value="">Select Status</option>
            <option value="true">Yes (Employed)</option>
            <option value="false">No (Unemployed)</option>
          </select>
        </Field>
      </RowDrawer>

      <Modal
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Delete Employee"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteModal(false)}>Cancel</Button>
            <Button variant="danger-outline" onClick={confirmDelete}>Delete</Button>
          </>
        }
      >
        <p style={{ color: 'var(--ink-2)' }}>Are you sure you want to delete this Employee?</p>
      </Modal>
    </div>
  )
}

export default Page
