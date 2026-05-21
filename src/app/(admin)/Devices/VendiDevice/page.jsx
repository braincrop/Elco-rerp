'use client'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { allDevices, DeleteDeviceData, GetAllDevices, PostDevice, UpdatedDevice } from '@/redux/slice/devicesSlice/DevicesSlice'
import Notify from '@/components/Notify'
import DataTable from '@/components/ui/DataTable'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import RowDrawer from '@/components/ui/RowDrawer'
import Field from '@/components/ui/Field'
import SvgIcon from '@/components/ui/SvgIcon'
import Toggle from '@/components/ui/Toggle'

const COLUMNS = [
  { key: 'name',       label: 'Name',    sortable: true },
  { key: 'deviceName', label: 'Device',  sortable: true },
  { key: 'ip',         label: 'IP',      render: (v) => <span style={{ fontFamily: 'var(--font-geist-mono, monospace)', fontSize: 12 }}>{v || '-'}</span> },
  {
    key: 'isActive',
    label: 'Status',
    render: (v) => <Badge variant={v ? 'good' : 'neutral'}>{v ? 'Active' : 'Inactive'}</Badge>,
  },
  {
    key: 'isConnected',
    label: 'Connection',
    render: (v) => <Badge variant={v ? 'good' : 'bad'}>{v ? 'Connected' : 'Offline'}</Badge>,
  },
]

export default function VendiDevicePage() {
  const dispatch = useDispatch()
  const { devices, loading } = useSelector(allDevices)

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerMode, setDrawerMode] = useState('create')
  const [form, setForm] = useState({ name: '', deviceName: '', ip: '', isActive: true, id: null })
  const [deleteModal, setDeleteModal] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  useEffect(() => { dispatch(GetAllDevices()) }, [])

  const openCreate = () => {
    setForm({ name: '', deviceName: '', ip: '', isActive: true, id: null })
    setDrawerMode('create')
    setDrawerOpen(true)
  }

  const openEdit = (row) => {
    setForm({ name: row.name || '', deviceName: row.deviceName || '', ip: row.ip || '', isActive: row.isActive, id: row.id })
    setDrawerMode('edit')
    setDrawerOpen(true)
  }

  const saveDevice = async () => {
    if (!form.name?.trim()) return Notify('error', 'Device name is required')
    const action = drawerMode === 'create'
      ? PostDevice({ name: form.name, deviceName: form.deviceName, ip: form.ip, isActive: form.isActive })
      : UpdatedDevice({ id: form.id, updatedData: { name: form.name, deviceName: form.deviceName, ip: form.ip, isActive: form.isActive } })
    const result = await dispatch(action)
    if (result.meta.requestStatus === 'fulfilled') {
      await dispatch(GetAllDevices())
      setDrawerOpen(false)
    } else {
      Notify('error', result.payload || 'Operation failed')
    }
  }

  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }))

  return (
    <div className="page-content">
      <div className="page-head">
        <div>
          <h1 className="page-title">Devices</h1>
          <p className="page-sub">Manage Vendi vending machine devices and their network configuration.</p>
        </div>
        <Button onClick={openCreate} icon={<SvgIcon id="i-plus" />}>Add Device</Button>
      </div>

      <DataTable
        columns={[
          ...COLUMNS,
          {
            key: '_actions',
            label: 'Actions',
            align: 'right',
            render: (_, row) => (
              <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); openEdit(row) }} title="Edit">
                  <SvgIcon id="i-edit" />
                </Button>
                <Button size="sm" variant="danger-outline" onClick={(e) => { e.stopPropagation(); setDeleteId(row.id); setDeleteModal(true) }} title="Delete">
                  <SvgIcon id="i-trash" />
                </Button>
              </div>
            ),
          },
        ]}
        data={devices ?? []}
        rowKey="id"
        loading={loading}
        onRowClick={openEdit}
        emptyText="No devices found"
      />

      <RowDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={drawerMode === 'create' ? 'Add Device' : 'Edit Device'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button onClick={saveDevice} busy={loading}>{drawerMode === 'create' ? 'Create' : 'Save'}</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Field label="Name" required>
            <input value={form.name} onChange={set('name')} placeholder="e.g. Device A" />
          </Field>
          <Field label="Device Name">
            <input value={form.deviceName} onChange={set('deviceName')} placeholder="e.g. Vendi-001" />
          </Field>
          <Field label="IP Address">
            <input value={form.ip} onChange={set('ip')} placeholder="e.g. 192.168.1.100" />
          </Field>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>Active</span>
            <Toggle checked={!!form.isActive} onChange={(v) => setForm((p) => ({ ...p, isActive: v })) } />
          </div>
        </div>
      </RowDrawer>

      <Modal
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Delete Device"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteModal(false)}>Cancel</Button>
            <Button variant="danger-outline" onClick={() => { dispatch(DeleteDeviceData(deleteId)); setDeleteModal(false) }}>Delete</Button>
          </>
        }
      >
        <p style={{ margin: 0, color: 'var(--ink-2)' }}>Are you sure you want to delete this device?</p>
      </Modal>
    </div>
  )
}
