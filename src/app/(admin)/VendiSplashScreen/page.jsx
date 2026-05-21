'use client'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Select from 'react-select'
import {
  allVendiSplashMachine, DeleteVendiMachine, GetAllVendiMachine,
  PostVendiMachine, UpdatedVendiMachine, AssignVendiMachineToDevice,
} from '@/redux/slice/VendingSplashMachine/VendingSplashMachine'
import { allDevices, GetAllDevices } from '@/redux/slice/devicesSlice/DevicesSlice'
import { postVideo } from '@/api/VideoApi/videoHelperApi'
import Notify from '@/components/Notify'
import { getSelectStyles } from '@/utils/selectStyles'
import DataTable from '@/components/ui/DataTable'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import RowDrawer from '@/components/ui/RowDrawer'
import Field from '@/components/ui/Field'
import Toolbar from '@/components/ui/Toolbar'
import SvgIcon from '@/components/ui/SvgIcon'

const COLUMNS = [
  { key: 'name',     label: 'Name',    sortable: true },
  { key: 'memo',     label: 'Memo' },
  { key: 'path',     label: 'Video',   render: (v) => v ? <a href={v} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>View</a> : '-' },
  { key: 'startTime', label: 'Start',  render: (v) => v ? new Date(v).toLocaleString() : '-' },
  { key: 'endTime',   label: 'End',    render: (v) => v ? new Date(v).toLocaleString() : '-' },
  {
    key: 'vendronDeviceInfoIds',
    label: 'Devices',
    render: (v) => v?.length
      ? <Badge variant="good">{v.length} device{v.length !== 1 ? 's' : ''}</Badge>
      : <Badge variant="neutral">Not assigned</Badge>,
  },
]

const EMPTY_FORM = { name: '', memo: '', path: '', starttime: '', endtime: '', vendronDeviceInfoIds: [], id: null }

export default function SplashScreenPage() {
  const dispatch = useDispatch()
  const { VendiMachine, loading } = useSelector(allVendiSplashMachine)
  const { devices } = useSelector(allDevices)
  const selectStyles = getSelectStyles()

  const [search, setSearch] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerMode, setDrawerMode] = useState('create')
  const [form, setForm] = useState(EMPTY_FORM)
  const [uploadingField, setUploadingField] = useState(null)
  const [deleteModal, setDeleteModal] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [assignModal, setAssignModal] = useState(false)
  const [assignId, setAssignId] = useState(null)
  const [assignDevices, setAssignDevices] = useState([])

  useEffect(() => {
    dispatch(GetAllVendiMachine())
    dispatch(GetAllDevices())
  }, [])

  const deviceOptions = devices?.map((d) => ({ value: d.id, label: d.name })) ?? []

  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }))

  const uploadVideo = async (file, fieldName) => {
    try {
      setUploadingField(fieldName)
      const fd = new FormData()
      fd.append('file', file)
      const res = await postVideo(fd)
      setForm((prev) => ({ ...prev, [fieldName]: res?.data?.url }))
    } catch (err) {
      Notify('error', err?.message || 'Upload failed')
    } finally {
      setUploadingField(null)
    }
  }

  const openCreate = () => {
    setForm(EMPTY_FORM)
    setDrawerMode('create')
    setDrawerOpen(true)
  }

  const openEdit = (row) => {
    setForm({ name: row.name || '', memo: row.memo || '', path: row.path || '', starttime: row.startTime || '', endtime: row.endTime || '', vendronDeviceInfoIds: row.vendronDeviceInfoIds || [], id: row.vmSplashId })
    setDrawerMode('edit')
    setDrawerOpen(true)
  }

  const save = async () => {
    if (!form.name?.trim()) return Notify('error', 'Name is required')
    if (!form.starttime) return Notify('error', 'Start time is required')
    if (!form.endtime) return Notify('error', 'End time is required')
    if (!form.vendronDeviceInfoIds?.length) return Notify('error', 'Select at least one device')

    const action = drawerMode === 'create'
      ? PostVendiMachine({ name: form.name, memo: form.memo, path: form.path, starttime: form.starttime, endtime: form.endtime, vendronDeviceInfoIds: form.vendronDeviceInfoIds })
      : UpdatedVendiMachine({ id: form.id, updatedData: { name: form.name, memo: form.memo, path: form.path, startTime: form.starttime, endTime: form.endtime, vendronDeviceInfoIds: form.vendronDeviceInfoIds } })

    try {
      await dispatch(action).unwrap()
      setDrawerOpen(false)
    } catch (err) { Notify('error', 'Operation failed') }
  }

  const filtered = (VendiMachine ?? []).filter((m) => !search || m.name?.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="page-content">
      <div className="page-head">
        <div>
          <h1 className="page-title">Splash Screens</h1>
          <p className="page-sub">Manage splash screen media assigned to vending machines.</p>
        </div>
        <Button onClick={openCreate} icon={<SvgIcon id="i-plus" />}>Add Splash Screen</Button>
      </div>

      <Toolbar onSearch={setSearch} searchPlaceholder="Search splash screens…" />

      <DataTable
        columns={[
          ...COLUMNS,
          {
            key: '_actions',
            label: 'Actions',
            align: 'right',
            render: (_, row) => (
              <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                <Button size="sm" variant="ghost" title="Assign device" onClick={(e) => { e.stopPropagation(); setAssignId(row.vmSplashId); setAssignDevices([]); setAssignModal(true) }}>
                  <SvgIcon id="i-device" />
                </Button>
                <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); openEdit(row) }} title="Edit">
                  <SvgIcon id="i-edit" />
                </Button>
                <Button size="sm" variant="danger-outline" onClick={(e) => { e.stopPropagation(); setDeleteId(row.vmSplashId); setDeleteModal(true) }} title="Delete">
                  <SvgIcon id="i-trash" />
                </Button>
              </div>
            ),
          },
        ]}
        data={filtered}
        rowKey="vmSplashId"
        loading={loading}
        onRowClick={openEdit}
        emptyText="No splash screens found"
      />

      <RowDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={drawerMode === 'create' ? 'Add Splash Screen' : 'Edit Splash Screen'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button onClick={save} busy={loading || !!uploadingField}>{uploadingField ? 'Uploading…' : drawerMode === 'create' ? 'Create' : 'Save'}</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Field label="Name" required><input value={form.name} onChange={set('name')} /></Field>
          <Field label="Memo"><input value={form.memo} onChange={set('memo')} /></Field>
          <Field label="Video File">
            <input type="file" name="path" onChange={(e) => e.target.files?.[0] && uploadVideo(e.target.files[0], 'path')} disabled={!!uploadingField} />
            {uploadingField && <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>Uploading…</span>}
          </Field>
          <Field label="Start Time" required><input type="datetime-local" value={form.starttime} onChange={set('starttime')} /></Field>
          <Field label="End Time" required><input type="datetime-local" value={form.endtime} onChange={set('endtime')} /></Field>
          <Field label="Assigned Devices" required>
            <Select isMulti options={deviceOptions}
              value={deviceOptions.filter((o) => form.vendronDeviceInfoIds?.includes(o.value))}
              onChange={(opts) => setForm((p) => ({ ...p, vendronDeviceInfoIds: opts.map((o) => o.value) }))}
              styles={selectStyles} placeholder="Select devices…" />
          </Field>
        </div>
      </RowDrawer>

      <Modal
        open={assignModal}
        onClose={() => setAssignModal(false)}
        title="Assign Device"
        footer={
          <>
            <Button variant="ghost" onClick={() => setAssignModal(false)}>Cancel</Button>
            <Button onClick={async () => { await dispatch(AssignVendiMachineToDevice({ vmSplashId: assignId, vendronDeviceInfoIds: assignDevices.map((d) => d.value) })).unwrap(); setAssignModal(false) }}>Assign</Button>
          </>
        }
      >
        <Field label="Devices">
          <Select isMulti options={deviceOptions} value={assignDevices} onChange={setAssignDevices} styles={selectStyles} placeholder="Select devices…" />
        </Field>
      </Modal>

      <Modal
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Delete Splash Screen"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteModal(false)}>Cancel</Button>
            <Button variant="danger-outline" onClick={async () => { try { await dispatch(DeleteVendiMachine(deleteId)).unwrap() } catch (e) {} setDeleteModal(false) }}>Delete</Button>
          </>
        }
      >
        <p style={{ margin: 0, color: 'var(--ink-2)' }}>Are you sure you want to delete this splash screen?</p>
      </Modal>
    </div>
  )
}
