'use client'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DeleteRoleData, GetAllRoles, PostRoles, UpdatedRoles, allRoles } from '@/redux/slice/Role/RoleSlice'
import Notify from '@/components/Notify'
import DataTable from '@/components/ui/DataTable'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import RowDrawer from '@/components/ui/RowDrawer'
import Field from '@/components/ui/Field'
import SvgIcon from '@/components/ui/SvgIcon'

const Page = () => {
  const dispatch = useDispatch()
  const { Role, loading } = useSelector(allRoles)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerMode, setDrawerMode] = useState('create')
  const [deleteid, setDeleteid] = useState('')
  const [deleteModal, setDeleteModal] = useState(false)
  const [Roles, setRoles] = useState({ name: '' })

  useEffect(() => {
    dispatch(GetAllRoles())
  }, [])

  const openDrawer = (type, id = null) => {
    setDrawerMode(type)
    if (type === 'edit') {
      setRoles({ id: id.id || '', name: id.name || '' })
    } else {
      setRoles({ name: '' })
    }
    setDrawerOpen(true)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setRoles((prev) => ({ ...prev, [name]: value }))
  }

  const saveRoles = () => {
    if (!Roles.name) { Notify('error', 'Name is required'); return }
    if (drawerMode === 'create') {
      dispatch(PostRoles(Roles)).unwrap()
    }
    if (drawerMode === 'edit') {
      const id = Roles.id
      dispatch(UpdatedRoles({ id, updatedData: Roles })).unwrap()
    }
    setDrawerOpen(false)
  }

  const openDeleteModal = (id) => {
    setDeleteid(id)
    setDeleteModal(true)
  }

  const deleteRole = () => {
    dispatch(DeleteRoleData(deleteid)).unwrap()
    setDeleteModal(false)
  }

  const columns = [
    { key: 'index', label: '#', render: (_, __, idx) => idx + 1, width: '50px' },
    { key: 'name', label: 'Name' },
    {
      key: 'actions',
      label: 'Actions',
      align: 'center',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <Button variant="ghost" size="sm" icon={<SvgIcon id="i-edit" />} onClick={() => openDrawer('edit', row)} />
          <Button variant="danger-outline" size="sm" icon={<SvgIcon id="i-trash" />} onClick={() => openDeleteModal(row.id)} />
        </div>
      ),
    },
  ]

  return (
    <div className="page-content">
      <div className="page-head">
        <div>
          <h1 className="page-title">Roles</h1>
          <p className="page-sub">Manage user roles</p>
        </div>
        <Button variant="primary" icon={<SvgIcon id="i-plus" />} onClick={() => openDrawer('create')}>
          Create New
        </Button>
      </div>

      <div className="card">
        <div className="card-pad">
          <DataTable
            columns={columns}
            data={Role || []}
            rowKey="id"
            loading={loading}
            emptyText="No Role Found"
          />
        </div>
      </div>

      <RowDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={drawerMode === 'create' ? 'Add Role' : 'Edit Role'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button variant="primary" busy={loading} onClick={saveRoles}>
              {drawerMode === 'create' ? 'Create' : 'Save'}
            </Button>
          </>
        }
      >
        <Field label="Name" required>
          <input
            className="field-input"
            type="text"
            name="name"
            value={Roles.name || ''}
            onChange={handleInputChange}
          />
        </Field>
      </RowDrawer>

      <Modal
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Delete Role"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteModal(false)}>Cancel</Button>
            <Button variant="danger-outline" onClick={deleteRole}>Delete</Button>
          </>
        }
      >
        <p style={{ color: 'var(--ink-2)' }}>Are you sure you want to delete this Role?</p>
      </Modal>
    </div>
  )
}

export default Page
