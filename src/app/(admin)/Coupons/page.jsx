'use client'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { allCoupons, DeleteCouponsData, GetAllCoupons, PostCoupon, UpdatedCoupons } from '@/redux/slice/Coupons/couponsSlice'
import Notify from '@/components/Notify'
import DataTable from '@/components/ui/DataTable'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import RowDrawer from '@/components/ui/RowDrawer'
import Field from '@/components/ui/Field'
import SvgIcon from '@/components/ui/SvgIcon'
import Toolbar from '@/components/ui/Toolbar'

const Page = () => {
  const { coupons, loading } = useSelector(allCoupons)
  const dispatch = useDispatch()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerMode, setDrawerMode] = useState('create')
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [CouponsInput, setCouponsInput] = useState({
    code: '',
    amount: '',
    maxdiscount: '',
    mindiscount: '',
    expiryDate: '',
  })
  const [deleteModal, setDeleteModal] = useState(false)

  useEffect(() => {
    dispatch(GetAllCoupons())
  }, [])

  const generateCouponCode = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const numbers = '0123456789'
    let alphaPart = ''
    let numberPart = ''
    for (let i = 0; i < 3; i++) alphaPart += letters.charAt(Math.floor(Math.random() * letters.length))
    for (let i = 0; i < 3; i++) numberPart += numbers.charAt(Math.floor(Math.random() * numbers.length))
    return `${alphaPart}${numberPart}`
  }

  const handleGenerateCode = () => {
    setCouponsInput((prev) => ({ ...prev, code: generateCouponCode() }))
  }

  const openDrawer = (type, index = null) => {
    setDrawerMode(type)
    if (type === 'edit' && index !== null) {
      setCouponsInput({
        couponsId: index.couponId,
        code: index.code || '',
        amount: index.amount || '',
        maxdiscount: index.maxDiscount || '',
        mindiscount: index.minDiscount || '',
        expiryDate: index.expiryDate ? new Date(index.expiryDate).toISOString().slice(0, 16) : '',
      })
    } else {
      setCouponsInput({ code: '', amount: '', maxdiscount: '', mindiscount: '', expiryDate: '' })
    }
    setDrawerOpen(true)
  }

  const saveCoupons = () => {
    if (!CouponsInput.code.trim()) { Notify('error', 'Code is required'); return }
    if (!CouponsInput.amount) { Notify('error', 'Amount is required'); return }
    if (!CouponsInput.maxdiscount) { Notify('error', 'Max Discount is required'); return }
    if (!CouponsInput.mindiscount) { Notify('error', 'Min Discount is required'); return }
    if (!CouponsInput.expiryDate) { Notify('error', 'Expire Date is required'); return }
    if (drawerMode === 'create') {
      dispatch(PostCoupon(CouponsInput)).unwrap()
    }
    if (drawerMode === 'edit') {
      const id = CouponsInput.couponsId
      dispatch(UpdatedCoupons({ id, updatedData: CouponsInput })).unwrap()
    }
    setDrawerOpen(false)
  }

  const openDeleteModal = (id) => {
    setSelectedIndex(id)
    setDeleteModal(true)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCouponsInput((prev) => ({ ...prev, [name]: value }))
  }

  const confirmDelete = () => {
    dispatch(DeleteCouponsData(selectedIndex)).unwrap()
    setDeleteModal(false)
  }

  const columns = [
    { key: 'index', label: '#', render: (_, __, idx) => idx + 1, width: '50px' },
    { key: 'code', label: 'Code', render: (val) => val || '-' },
    { key: 'amount', label: 'Amount', render: (val) => val || '-' },
    { key: 'maxDiscount', label: 'Max Discount', render: (val) => val || '-' },
    { key: 'minDiscount', label: 'Min Discount', render: (val) => val || '-' },
    {
      key: 'expiryDate',
      label: 'Expire Date',
      render: (val) =>
        val
          ? new Date(val).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
          : '-',
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'center',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <Button variant="ghost" size="sm" icon={<SvgIcon id="i-edit" />} onClick={() => openDrawer('edit', row)} />
          <Button variant="danger-outline" size="sm" icon={<SvgIcon id="i-trash" />} onClick={() => openDeleteModal(row.couponId)} />
        </div>
      ),
    },
  ]

  return (
    <div className="page-content">
      <div className="page-head">
        <div>
          <h1 className="page-title">Coupons</h1>
          <p className="page-sub">Manage discount coupons</p>
        </div>
        <Button variant="primary" icon={<SvgIcon id="i-plus" />} onClick={() => openDrawer('create')}>
          Create New
        </Button>
      </div>

      <div className="card">
        <div className="card-pad">
          <DataTable
            columns={columns}
            data={coupons || []}
            rowKey="couponId"
            loading={loading}
            emptyText="No Coupons Found"
          />
        </div>
      </div>

      <RowDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={drawerMode === 'create' ? 'Create Coupon' : 'Edit Coupon'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={saveCoupons}>
              {drawerMode === 'create' ? 'Create' : 'Save'}
            </Button>
          </>
        }
      >
        <Field label="Code" required>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              className="field-input"
              type="text"
              name="code"
              value={CouponsInput.code}
              onChange={(e) => handleInputChange({ target: { name: 'code', value: e.target.value.toUpperCase() } })}
              placeholder="Enter or generate code"
              style={{ flex: 1 }}
            />
            <Button variant="ghost" size="sm" icon={<SvgIcon id="i-refresh" />} onClick={handleGenerateCode} />
          </div>
        </Field>
        <Field label="Amount" required>
          <input className="field-input" type="number" name="amount" value={CouponsInput.amount} onChange={handleInputChange} />
        </Field>
        <Field label="Max Discount" required>
          <input className="field-input" type="number" name="maxdiscount" value={CouponsInput.maxdiscount} onChange={handleInputChange} />
        </Field>
        <Field label="Min Discount" required>
          <input className="field-input" type="number" name="mindiscount" value={CouponsInput.mindiscount} onChange={handleInputChange} />
        </Field>
        <Field label="Expire Date" required>
          <input
            className="field-input"
            type="datetime-local"
            name="expiryDate"
            min={new Date().toISOString().slice(0, 16)}
            value={CouponsInput.expiryDate}
            onChange={handleInputChange}
          />
        </Field>
      </RowDrawer>

      <Modal
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Delete Coupon"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteModal(false)}>Cancel</Button>
            <Button variant="danger-outline" onClick={confirmDelete}>Delete</Button>
          </>
        }
      >
        <p style={{ color: 'var(--ink-2)' }}>Are you sure you want to delete this Coupon?</p>
      </Modal>
    </div>
  )
}

export default Page
