'use client'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AllEmailType, DeleteEmailTypeData, GetAllEmails, PostEmails, UpdatedEmailType } from '@/redux/slice/EmailType/EmailTypeSlice'
import Notify from '@/components/Notify'
import DataTable from '@/components/ui/DataTable'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import RowDrawer from '@/components/ui/RowDrawer'
import Field from '@/components/ui/Field'
import SvgIcon from '@/components/ui/SvgIcon'

const Page = () => {
  const dispatch = useDispatch()
  const { EmailType, loading } = useSelector(AllEmailType)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerMode, setDrawerMode] = useState('create')
  const [deleteid, setDeleteid] = useState('')
  const [deleteModal, setDeleteModal] = useState(false)
  const [Emailtype, setEmailtype] = useState({ name: '', memo: '' })

  useEffect(() => {
    dispatch(GetAllEmails())
  }, [])

  const openDrawer = (type, id = null) => {
    setDrawerMode(type)
    if (type === 'edit' && id !== null) {
      setEmailtype({ id: id.emailTypeId || '', name: id.name || '', memo: id.memo || '' })
    } else {
      setEmailtype({ name: '', memo: '' })
    }
    setDrawerOpen(true)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEmailtype((prev) => ({ ...prev, [name]: value }))
  }

  const saveEmails = () => {
    if (!Emailtype.name) { Notify('error', 'Name is required'); return }
    if (!Emailtype.memo) { Notify('error', 'Memo is required'); return }
    if (drawerMode === 'create') {
      dispatch(PostEmails(Emailtype)).unwrap()
    }
    if (drawerMode === 'edit') {
      const id = Emailtype.id
      dispatch(UpdatedEmailType({ id, updatedData: Emailtype })).unwrap()
    }
    setDrawerOpen(false)
  }

  const openDeleteModal = (id) => {
    setDeleteid(id)
    setDeleteModal(true)
  }

  const deleteCategory = () => {
    dispatch(DeleteEmailTypeData(deleteid)).unwrap()
    setDeleteModal(false)
  }

  const columns = [
    { key: 'index', label: '#', render: (_, __, idx) => idx + 1, width: '50px' },
    { key: 'name', label: 'Name' },
    { key: 'memo', label: 'Memo' },
    {
      key: 'actions',
      label: 'Actions',
      align: 'center',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <Button variant="ghost" size="sm" icon={<SvgIcon id="i-edit" />} onClick={() => openDrawer('edit', row)} />
          <Button variant="danger-outline" size="sm" icon={<SvgIcon id="i-trash" />} onClick={() => openDeleteModal(row.emailTypeId)} />
        </div>
      ),
    },
  ]

  return (
    <div className="page-content">
      <div className="page-head">
        <div>
          <h1 className="page-title">Email Types</h1>
          <p className="page-sub">Manage email categories</p>
        </div>
        <Button variant="primary" icon={<SvgIcon id="i-plus" />} onClick={() => openDrawer('create')}>
          Create New
        </Button>
      </div>

      <div className="card">
        <div className="card-pad">
          <DataTable
            columns={columns}
            data={EmailType || []}
            rowKey="emailTypeId"
            loading={loading}
            emptyText="No Email Type Found"
          />
        </div>
      </div>

      <RowDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={drawerMode === 'create' ? 'Add Email Category' : 'Edit Email Category'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button variant="primary" busy={loading} onClick={saveEmails}>
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
            value={Emailtype.name || ''}
            onChange={handleInputChange}
          />
        </Field>
        <Field label="Memo" required>
          <input
            className="field-input"
            type="text"
            name="memo"
            value={Emailtype.memo || ''}
            onChange={handleInputChange}
          />
        </Field>
      </RowDrawer>

      <Modal
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Delete Email Type"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteModal(false)}>Cancel</Button>
            <Button variant="danger-outline" onClick={deleteCategory}>Delete</Button>
          </>
        }
      >
        <p style={{ color: 'var(--ink-2)' }}>Are you sure you want to delete this Email Type?</p>
      </Modal>
    </div>
  )
}

export default Page
