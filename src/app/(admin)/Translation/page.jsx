'use client'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Select from 'react-select'
import CreateLanguage from '../../../components/CreateLanguage/createLanguage'
import { allTranslation, AssignTranslationToBranch, Translation, TranslationDelete } from '@/redux/slice/Translation/TranslationSlice'
import { allBranch, GetAllBranch } from '@/redux/slice/Branch/branchSlice'
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
  const { translation, loading } = useSelector(allTranslation)
  const { branch } = useSelector(allBranch)
  const [view, setView] = useState('list')
  const [mode, setMode] = useState('create')
  const [selectedUser, setSelectedUser] = useState(null)
  const [deleteModal, setDeleteModal] = useState(false)
  const [AssignModal, setAssignModal] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [assignBranches, setassignBranches] = useState([])
  const [assignVal, setAssignVal] = useState()

  useEffect(() => {
    dispatch(Translation())
    dispatch(GetAllBranch())
  }, [])

  const Branches = branch?.map((cat) => ({
    value: cat.branchId,
    label: cat.name,
  }))

  const openCreate = () => {
    setMode('create')
    setSelectedUser(null)
    setView('form')
  }
  const backToList = () => {
    setView('list')
    setSelectedUser(null)
    dispatch(Translation())
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
  const openAssignModal = (index) => {
    setAssignModal(true)
    setAssignVal(index)
    setassignBranches([])
  }
  const confirmDelete = async () => {
    await dispatch(TranslationDelete(deleteId)).unwrap()
    setDeleteModal(false)
  }
  const handleAssignTranslation = () => {
    const data = {
      translationId: assignVal,
      branchIds: assignBranches,
    }
    dispatch(AssignTranslationToBranch(data)).unwrap()
    setAssignModal(false)
  }

  const columns = [
    { key: 'name', label: 'Language Name', render: (val) => val || '-' },
    { key: 'lang', label: 'Language Code', render: (val) => val || '-' },
    {
      key: 'actions',
      label: 'Action',
      align: 'center',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <Button variant="ghost" size="sm" icon={<SvgIcon id="i-key" />} onClick={() => openAssignModal(row.translationId)} title="Assign Branches" />
          <Button variant="ghost" size="sm" icon={<SvgIcon id="i-edit" />} onClick={() => openEdit(row)} />
          <Button variant="danger-outline" size="sm" icon={<SvgIcon id="i-trash" />} onClick={() => openDelete(row.lang)} />
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
              <h1 className="page-title">Translation</h1>
              <p className="page-sub">Manage language translations</p>
            </div>
            <Button variant="primary" icon={<SvgIcon id="i-plus" />} onClick={openCreate}>
              Add New
            </Button>
          </div>

          <div className="card">
            <div className="card-pad">
              <DataTable
                columns={columns}
                data={translation || []}
                rowKey="translationId"
                loading={loading}
                emptyText="No Translation Found"
              />
            </div>
          </div>
        </>
      )}

      {view === 'form' && <CreateLanguage mode={mode} initialData={selectedUser} onBack={backToList} />}

      <Modal
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Delete Translation"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteModal(false)}>Cancel</Button>
            <Button variant="danger-outline" onClick={confirmDelete}>Delete</Button>
          </>
        }
      >
        <p style={{ color: 'var(--ink-2)' }}>Are you sure you want to delete this translation?</p>
      </Modal>

      <Modal
        open={AssignModal}
        onClose={() => setAssignModal(false)}
        title="Assign Branches"
        footer={
          <>
            <Button variant="ghost" onClick={() => setAssignModal(false)}>Cancel</Button>
            <Button variant="primary" busy={loading} icon={<SvgIcon id="i-check" />} onClick={handleAssignTranslation}>
              Assign
            </Button>
          </>
        }
      >
        <Field label="Available Branches">
          <Select
            isMulti
            options={Branches}
            value={Branches?.filter((option) => (assignBranches || []).some((v) => String(v) === String(option.value)))}
            onChange={(selectedOptions) => setassignBranches(selectedOptions ? selectedOptions.map((o) => o.value) : [])}
            styles={customSelectStyles}
            placeholder="Select Branches..."
          />
        </Field>
      </Modal>
    </div>
  )
}

export default Page
