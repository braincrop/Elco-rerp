'use client'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Select from 'react-select'
import {
  allBranch, GetAllBranch, PostBranchData, UpdatedBranch,
  DeleteBranchData, PostAssignItemCategory, PostItemCategoryBulk,
} from '@/redux/slice/Branch/branchSlice'
import { allCategories, GetAllCategory } from '@/redux/slice/categories/CategorySlice'
import { allDevices, GetAllDevices } from '@/redux/slice/devicesSlice/DevicesSlice'
import { useRouter } from 'next/navigation'
import Notify from '@/components/Notify'
import { getSelectStyles } from '@/utils/selectStyles'
import DataTable from '@/components/ui/DataTable'
import Toolbar from '@/components/ui/Toolbar'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import RowDrawer from '@/components/ui/RowDrawer'
import Field from '@/components/ui/Field'
import SvgIcon from '@/components/ui/SvgIcon'

const COLUMNS = [
  { key: 'name',          label: 'Branch',   sortable: true },
  { key: 'outletAddress', label: 'Address',  sortable: true },
  { key: 'memo',          label: 'Memo' },
  { key: 'mobileOrdering', label: 'Mobile', render: (v) => v === null ? '-' : v ? 'Yes' : 'No' },
  { key: 'revenueCenterId', label: 'Revenue Center' },
]

export default function BranchPage() {
  const router = useRouter()
  const dispatch = useDispatch()
  const { branch, loading } = useSelector(allBranch)
  const { category } = useSelector(allCategories)
  const { devices } = useSelector(allDevices)

  const [search, setSearch] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerMode, setDrawerMode] = useState('create')
  const [form, setForm] = useState({ name: '', memo: '', outletAddress: '', vendronDeviceInfoId: '', branchId: null })
  const [deleteModal, setDeleteModal] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [assignModal, setAssignModal] = useState(false)
  const [assignId, setAssignId] = useState(null)
  const [bulkModal, setBulkModal] = useState(false)
  const [bulkBranchId, setBulkBranchId] = useState(null)
  const [bulkCategories, setBulkCategories] = useState([])

  useEffect(() => {
    dispatch(GetAllBranch())
    dispatch(GetAllCategory())
    dispatch(GetAllDevices())
  }, [])

  const selectStyles = getSelectStyles()
  const deviceOptions   = devices?.map((d) => ({ value: d.id, label: d.name })) ?? []
  const categoryOptions = category?.map((c) => ({ value: c.dcid, label: c.name })) ?? []

  const filtered = (branch ?? []).filter((b) =>
    b.name?.toLowerCase().includes(search.toLowerCase()) ||
    b.outletAddress?.toLowerCase().includes(search.toLowerCase())
  )

  const openCreate = () => {
    setForm({ name: '', memo: '', outletAddress: '', vendronDeviceInfoId: '', branchId: null })
    setDrawerMode('create')
    setDrawerOpen(true)
  }

  const openEdit = (row) => {
    setForm({
      name: row.name || '',
      memo: row.memo || '',
      outletAddress: row.outletAddress || '',
      vendronDeviceInfoId: row.vendronDeviceInfoId || '',
      branchId: row.branchId,
    })
    setDrawerMode('edit')
    setDrawerOpen(true)
  }

  const saveBranch = async () => {
    if (!form.name?.trim()) return Notify('error', 'Branch name is required')
    if (!form.vendronDeviceInfoId) return Notify('error', 'Vendi Device ID is required')

    const action = drawerMode === 'create'
      ? PostBranchData({ name: form.name, memo: form.memo, outletAddress: form.outletAddress, vendronDeviceInfoId: form.vendronDeviceInfoId })
      : UpdatedBranch({ branchId: form.branchId, updatedData: { name: form.name, memo: form.memo, outletAddress: form.outletAddress, vendronDeviceInfoId: form.vendronDeviceInfoId } })

    const result = await dispatch(action)
    if (result.meta.requestStatus === 'fulfilled') {
      setDrawerOpen(false)
    } else {
      Notify('error', result.payload || 'Operation failed')
    }
  }

  const confirmDelete = () => {
    dispatch(DeleteBranchData(deleteId))
    setDeleteModal(false)
  }

  const confirmAssign = () => {
    dispatch(PostAssignItemCategory(assignId)).unwrap()
    setAssignModal(false)
  }

  const submitBulk = async () => {
    if (!bulkCategories.length) return Notify('error', 'Please select at least one category')
    const result = await dispatch(PostItemCategoryBulk({ branchId: bulkBranchId, distinctCategoryIds: bulkCategories.map((c) => c.value) }))
    if (PostItemCategoryBulk.fulfilled.match(result)) setBulkModal(false)
    else Notify('error', 'Assignment failed')
  }

  return (
    <div className="page-content">
      <div className="page-head">
        <div>
          <h1 className="page-title">Branches</h1>
          <p className="page-sub">Manage your physical branch locations and device assignments.</p>
        </div>
        <Button onClick={openCreate} icon={<SvgIcon id="i-plus" />}>Add Branch</Button>
      </div>

      <Toolbar onSearch={setSearch} searchPlaceholder="Search branches…" />

      <DataTable
        columns={[
          ...COLUMNS,
          {
            key: '_actions',
            label: 'Actions',
            align: 'right',
            render: (_, row) => (
              <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); setBulkBranchId(row.branchId); setBulkCategories([]); setBulkModal(true) }} title="Assign categories">
                  <SvgIcon id="i-list" />
                </Button>
                <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); setAssignId(row.branchId); setAssignModal(true) }} title="Assign branch">
                  <SvgIcon id="i-branch" />
                </Button>
                <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); openEdit(row) }} title="Edit">
                  <SvgIcon id="i-edit" />
                </Button>
                <Button size="sm" variant="danger-outline" onClick={(e) => { e.stopPropagation(); setDeleteId(row.branchId); setDeleteModal(true) }} title="Delete">
                  <SvgIcon id="i-trash" />
                </Button>
              </div>
            ),
          },
        ]}
        data={filtered}
        rowKey="branchId"
        loading={loading}
        onRowClick={openEdit}
        emptyText="No branches found"
      />

      {/* Create / Edit drawer */}
      <RowDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={drawerMode === 'create' ? 'Add Branch' : 'Edit Branch'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button onClick={saveBranch} busy={loading}>{drawerMode === 'create' ? 'Create' : 'Save'}</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Field label="Branch Name" required>
            <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. Main Street" />
          </Field>
          <Field label="Vendi Device" required>
            {deviceOptions.length ? (
              <Select
                options={deviceOptions}
                value={deviceOptions.find((o) => o.value === form.vendronDeviceInfoId) || null}
                onChange={(opt) => setForm((p) => ({ ...p, vendronDeviceInfoId: opt?.value || '' }))}
                styles={selectStyles}
                placeholder="Select device…"
              />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--warn-bg)', borderRadius: 'var(--radius-sm)', fontSize: 13, color: 'var(--warn)' }}>
                <span>No device found.</span>
                <Button size="sm" variant="ghost" onClick={() => router.push('/Devices/VendiDevice')}>Create Device</Button>
              </div>
            )}
          </Field>
          <Field label="Address">
            <input value={form.outletAddress} onChange={(e) => setForm((p) => ({ ...p, outletAddress: e.target.value }))} placeholder="e.g. 123 Main St" />
          </Field>
          <Field label="Memo">
            <textarea value={form.memo} onChange={(e) => setForm((p) => ({ ...p, memo: e.target.value }))} rows={3} />
          </Field>
        </div>
      </RowDrawer>

      {/* Delete confirm */}
      <Modal
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Delete Branch"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteModal(false)}>Cancel</Button>
            <Button variant="danger-outline" onClick={confirmDelete}>Delete</Button>
          </>
        }
      >
        <p style={{ margin: 0, color: 'var(--ink-2)' }}>Are you sure you want to delete this branch? This action cannot be undone.</p>
      </Modal>

      {/* Assign branch */}
      <Modal
        open={assignModal}
        onClose={() => setAssignModal(false)}
        title="Assign Branch"
        footer={
          <>
            <Button variant="ghost" onClick={() => setAssignModal(false)}>Cancel</Button>
            <Button onClick={confirmAssign} busy={loading}>Assign</Button>
          </>
        }
      >
        <p style={{ margin: 0, color: 'var(--ink-2)' }}>Confirm assigning this branch to the selected item?</p>
      </Modal>

      {/* Bulk item categories */}
      <Modal
        open={bulkModal}
        onClose={() => setBulkModal(false)}
        title="Assign Item Categories"
        footer={
          <>
            <Button variant="ghost" onClick={() => setBulkModal(false)}>Cancel</Button>
            <Button onClick={submitBulk} busy={loading}>Assign</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Field label="Branch ID">
            <input value={bulkBranchId || ''} readOnly />
          </Field>
          <Field label="Item Categories" required>
            <Select isMulti options={categoryOptions} value={bulkCategories} onChange={setBulkCategories} styles={selectStyles} placeholder="Select categories…" />
          </Field>
        </div>
      </Modal>
    </div>
  )
}
