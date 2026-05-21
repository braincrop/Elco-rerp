'use client'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { allCategories, DeleteCategoryData, GetAllCategory } from '@/redux/slice/categories/CategorySlice'
import { CreateCatLanguage } from '@/components/createCatLanguage/createCatLanguage'
import DataTable from '@/components/ui/DataTable'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import SvgIcon from '@/components/ui/SvgIcon'

const COLUMNS = [
  { key: 'dcid',  label: 'ID',   width: 80 },
  { key: 'name',  label: 'Name', sortable: true },
]

export default function CategoriesPage() {
  const dispatch = useDispatch()
  const { category, loading } = useSelector(allCategories)

  const [showForm, setShowForm] = useState(false)
  const [modalType, setModalType] = useState('')
  const [selectedData, setSelectedData] = useState(null)
  const [deleteModal, setDeleteModal] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  useEffect(() => { dispatch(GetAllCategory()) }, [])

  const openCreate = () => { setModalType('create'); setSelectedData(null); setShowForm(true) }
  const openEdit   = (row) => { setModalType('edit'); setSelectedData(row); setShowForm(true) }

  if (showForm) {
    return (
      <div className="page-content">
        <div className="page-head">
          <h1 className="page-title">{modalType === 'create' ? 'New Category' : 'Edit Category'}</h1>
        </div>
        <div className="card card-pad">
          <CreateCatLanguage modalType={modalType} selectedData={selectedData} setShow={setShowForm} />
        </div>
      </div>
    )
  }

  return (
    <div className="page-content">
      <div className="page-head">
        <div>
          <h1 className="page-title">Categories</h1>
          <p className="page-sub">Organize your products into categories.</p>
        </div>
        <Button onClick={openCreate} icon={<SvgIcon id="i-plus" />}>Add Category</Button>
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
                <Button size="sm" variant="danger-outline" onClick={(e) => { e.stopPropagation(); setDeleteId(row.dcid); setDeleteModal(true) }} title="Delete">
                  <SvgIcon id="i-trash" />
                </Button>
              </div>
            ),
          },
        ]}
        data={category ?? []}
        rowKey="dcid"
        loading={loading}
        onRowClick={openEdit}
        emptyText="No categories found"
      />

      <Modal
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Delete Category"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteModal(false)}>Cancel</Button>
            <Button variant="danger-outline" onClick={() => { dispatch(DeleteCategoryData(deleteId)).unwrap(); setDeleteModal(false) }}>Delete</Button>
          </>
        }
      >
        <p style={{ margin: 0, color: 'var(--ink-2)' }}>Are you sure you want to delete this category?</p>
      </Modal>
    </div>
  )
}
