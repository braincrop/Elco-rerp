'use client'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Select from 'react-select'
import Notify from '@/components/Notify'
import {
  allEmailReceipt,
  DeleteEmailReceiptData,
  GetAllEmailReceipts,
  PostEmailReceipts,
  UpdatedEmailReceipt,
} from '@/redux/slice/EmailReceipt/EmailReceiptSlice'
import { AllEmailType, GetAllEmails } from '@/redux/slice/EmailType/EmailTypeSlice'
import DataTable from '@/components/ui/DataTable'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import RowDrawer from '@/components/ui/RowDrawer'
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
  const { EmailReceipt, loading } = useSelector(allEmailReceipt)
  const { EmailType } = useSelector(AllEmailType)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerMode, setDrawerMode] = useState('create')
  const [deleteid, setDeleteid] = useState('')
  const [deleteModal, setDeleteModal] = useState(false)
  const [EmailReceipts, setEmailReceipts] = useState({
    email: '',
    memo: '',
    emailTypeIds: [],
  })

  useEffect(() => {
    dispatch(GetAllEmailReceipts())
    dispatch(GetAllEmails())
  }, [])

  const openDrawer = (type, id) => {
    setDrawerMode(type)
    if (type === 'edit') {
      setEmailReceipts({
        id: id.emailRecipientId || '',
        email: id.email || '',
        memo: id.memo || '',
        emailTypeIds: Array.isArray(id.emailTypeIds)
          ? id.emailTypeIds.map(Number)
          : typeof id.emailTypeIds === 'string'
            ? id.emailTypeIds.split(',').map(Number)
            : [],
      })
    } else {
      setEmailReceipts({ email: '', memo: '', emailTypeIds: [] })
    }
    setDrawerOpen(true)
  }

  const EmailTypeOptions = EmailType?.map((cat) => ({
    value: cat.emailTypeId,
    label: cat.name,
  }))

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEmailReceipts((prev) => ({ ...prev, [name]: value }))
  }

  const saveEmails = () => {
    if (!EmailReceipts.email) { Notify('error', 'Email is required'); return }
    if (!EmailReceipts.memo) { Notify('error', 'Memo is required'); return }
    const id = EmailReceipts.emailTypeIds
    if (!Array.isArray(id) || id.length === 0) { Notify('error', 'Email IDs are required'); return }
    if (drawerMode === 'create') {
      dispatch(PostEmailReceipts(EmailReceipts)).unwrap()
    }
    if (drawerMode === 'edit') {
      const id = EmailReceipts.id
      dispatch(UpdatedEmailReceipt({ id, updatedData: EmailReceipts })).unwrap()
    }
    setDrawerOpen(false)
  }

  const openDeleteModal = (id) => {
    setDeleteid(id)
    setDeleteModal(true)
  }

  const deleteCategory = () => {
    dispatch(DeleteEmailReceiptData(deleteid)).unwrap()
    setDeleteModal(false)
  }

  const columns = [
    { key: 'index', label: '#', render: (_, __, idx) => idx + 1, width: '50px' },
    { key: 'email', label: 'Email' },
    { key: 'memo', label: 'Memo' },
    {
      key: 'actions',
      label: 'Actions',
      align: 'center',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <Button variant="ghost" size="sm" icon={<SvgIcon id="i-edit" />} onClick={() => openDrawer('edit', row)} />
          <Button variant="danger-outline" size="sm" icon={<SvgIcon id="i-trash" />} onClick={() => openDeleteModal(row.emailRecipientId)} />
        </div>
      ),
    },
  ]

  return (
    <div className="page-content">
      <div className="page-head">
        <div>
          <h1 className="page-title">Email Receipts</h1>
          <p className="page-sub">Manage email receipt recipients</p>
        </div>
        <Button variant="primary" icon={<SvgIcon id="i-plus" />} onClick={() => openDrawer('create')}>
          Create New
        </Button>
      </div>

      <div className="card">
        <div className="card-pad">
          <DataTable
            columns={columns}
            data={EmailReceipt || []}
            rowKey="emailRecipientId"
            loading={loading}
            emptyText="No Email Receipt Found"
          />
        </div>
      </div>

      <RowDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={drawerMode === 'create' ? 'Add Email Receipt' : 'Edit Email Receipt'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button variant="primary" busy={loading} onClick={saveEmails}>
              {drawerMode === 'create' ? 'Create' : 'Save'}
            </Button>
          </>
        }
      >
        <Field label="Email" required>
          <input
            className="field-input"
            type="text"
            name="email"
            value={EmailReceipts.email || ''}
            onChange={handleInputChange}
          />
        </Field>
        <Field label="Memo" required>
          <input
            className="field-input"
            type="text"
            name="memo"
            value={EmailReceipts.memo || ''}
            onChange={handleInputChange}
          />
        </Field>
        <Field label="Email Type IDs" required>
          <Select
            isMulti
            options={EmailTypeOptions}
            value={EmailTypeOptions?.filter((option) => (EmailReceipts?.emailTypeIds || []).includes(option.value))}
            onChange={(selectedOptions) =>
              setEmailReceipts({ ...EmailReceipts, emailTypeIds: selectedOptions.map((option) => option.value) })
            }
            styles={customSelectStyles}
            placeholder="Select Id..."
          />
        </Field>
      </RowDrawer>

      <Modal
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Delete Receipt"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteModal(false)}>Cancel</Button>
            <Button variant="danger-outline" onClick={deleteCategory}>Delete</Button>
          </>
        }
      >
        <p style={{ color: 'var(--ink-2)' }}>Are you sure you want to delete this Receipt?</p>
      </Modal>
    </div>
  )
}

export default Page
