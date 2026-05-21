'use client'
import { useState, useMemo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Select from 'react-select'
import { allProducts, DeleteProductData, GetAllProduct, PostProductBulkUpsert } from '@/redux/slice/Products/productSlice'
import { allBranch, GetAllBranch } from '@/redux/slice/Branch/branchSlice'
import CreateProduct from '@/components/CreateProduct/createproduct'
import DataTable from '@/components/ui/DataTable'
import Toolbar from '@/components/ui/Toolbar'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import SvgIcon from '@/components/ui/SvgIcon'
import Field from '@/components/ui/Field'
import { getSelectStyles } from '@/utils/selectStyles'

const COLUMNS = [
  {
    key: 'name',
    label: 'Product',
    sortable: true,
    render: (_, row) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {row.imagePath && (
          <img src={row.imagePath} alt={row.name} style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} />
        )}
        <div>
          <div style={{ fontWeight: 500 }}>{row.name}</div>
          {row.productDescription && <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 1 }}>{row.productDescription.slice(0, 60)}{row.productDescription.length > 60 ? '…' : ''}</div>}
        </div>
      </div>
    ),
  },
  { key: 'sku', label: 'SKU', render: (v) => v ? <span style={{ fontFamily: 'var(--font-geist-mono, monospace)', fontSize: 12 }}>{v}</span> : '-' },
  { key: 'basePrice', label: 'Buy', align: 'right', render: (v) => `$${v ?? '-'}` },
  { key: 'sellPrice', label: 'Sell', align: 'right', render: (v) => `$${v ?? '-'}` },
  { key: 'shelfLife', label: 'Shelf Life' },
]

export default function ProductsPage() {
  const dispatch = useDispatch()
  const { product, loading } = useSelector(allProducts)
  const { branch } = useSelector(allBranch)
  const selectStyles = getSelectStyles()

  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [modalType, setModalType] = useState('create')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [deleteModal, setDeleteModal] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [assignModal, setAssignModal] = useState(false)
  const [assignData, setAssignData] = useState({ sku: '', branches: [] })
  const [viewModal, setViewModal] = useState(false)
  const [viewProduct, setViewProduct] = useState(null)

  useEffect(() => {
    dispatch(GetAllProduct())
    dispatch(GetAllBranch())
  }, [])

  const branchOptions = Array.isArray(branch) ? branch.map((b) => ({ value: b.branchId, label: b.name })) : []

  const filtered = useMemo(
    () => (product ?? []).filter((p) => p.name?.toLowerCase().includes(search.toLowerCase())),
    [search, product]
  )

  const openCreate = () => { setModalType('create'); setSelectedProduct(null); setShowForm(true) }
  const openEdit   = (row) => { setModalType('edit'); setSelectedProduct(row); setShowForm(true) }

  const handleAssign = async () => {
    await dispatch(PostProductBulkUpsert([assignData])).unwrap()
    setAssignModal(false)
  }

  if (showForm) {
    return (
      <div className="page-content">
        <div className="page-head">
          <div>
            <h1 className="page-title">{modalType === 'create' ? 'Add Product' : 'Edit Product'}</h1>
          </div>
          <Button variant="ghost" onClick={() => setShowForm(false)} icon={<SvgIcon id="i-arrow" />}>Back to list</Button>
        </div>
        <div className="card card-pad">
          <CreateProduct setShow={setShowForm} selectedProduct={selectedProduct} modalType={modalType} />
        </div>
      </div>
    )
  }

  return (
    <div className="page-content">
      <div className="page-head">
        <div>
          <h1 className="page-title">Products</h1>
          <p className="page-sub">Manage your product catalog, pricing, and branch assignments.</p>
        </div>
        <Button onClick={openCreate} icon={<SvgIcon id="i-plus" />}>Add Product</Button>
      </div>

      <Toolbar onSearch={setSearch} searchPlaceholder="Search products…" />

      <DataTable
        columns={[
          ...COLUMNS,
          {
            key: '_actions',
            label: 'Actions',
            align: 'right',
            render: (_, row) => (
              <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                <Button size="sm" variant="ghost" title="View" onClick={(e) => { e.stopPropagation(); setViewProduct(row); setViewModal(true) }}>
                  <SvgIcon id="i-eye" />
                </Button>
                <Button size="sm" variant="ghost" title="Assign to branch" onClick={(e) => { e.stopPropagation(); setAssignData({ sku: row.sku, branches: [] }); setAssignModal(true) }}>
                  <SvgIcon id="i-branch" />
                </Button>
                <Button size="sm" variant="ghost" title="Edit" onClick={(e) => { e.stopPropagation(); openEdit(row) }}>
                  <SvgIcon id="i-edit" />
                </Button>
                <Button size="sm" variant="danger-outline" title="Delete" onClick={(e) => { e.stopPropagation(); setDeleteId(row.dpid); setDeleteModal(true) }}>
                  <SvgIcon id="i-trash" />
                </Button>
              </div>
            ),
          },
        ]}
        data={filtered}
        rowKey="dpid"
        loading={loading}
        onRowClick={openEdit}
        emptyText="No products found"
      />

      {/* Delete modal */}
      <Modal
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Delete Product"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteModal(false)}>Cancel</Button>
            <Button variant="danger-outline" onClick={() => { dispatch(DeleteProductData(deleteId)); setDeleteModal(false) }}>Delete</Button>
          </>
        }
      >
        <p style={{ margin: 0, color: 'var(--ink-2)' }}>Are you sure you want to delete this product?</p>
      </Modal>

      {/* Assign to branch modal */}
      <Modal
        open={assignModal}
        onClose={() => setAssignModal(false)}
        title="Assign Product to Branches"
        footer={
          <>
            <Button variant="ghost" onClick={() => setAssignModal(false)}>Cancel</Button>
            <Button onClick={handleAssign} busy={loading}>Assign</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Field label="SKU">
            <input value={assignData.sku} readOnly />
          </Field>
          <Field label="Branches">
            <Select isMulti options={branchOptions}
              value={branchOptions.filter((o) => assignData.branches.includes(o.value))}
              onChange={(opts) => setAssignData((p) => ({ ...p, branches: opts.map((o) => o.value) }))}
              styles={selectStyles} placeholder="Select branches…" />
          </Field>
        </div>
      </Modal>

      {/* View product modal */}
      <Modal
        open={viewModal}
        onClose={() => setViewModal(false)}
        title={viewProduct?.name}
        size="lg"
        footer={<Button variant="ghost" onClick={() => setViewModal(false)}>Close</Button>}
      >
        {viewProduct && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {viewProduct.imagePath && (
              <img src={viewProduct.imagePath} alt={viewProduct.name} style={{ width: 96, height: 96, objectFit: 'cover', borderRadius: 8 }} />
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px', fontSize: 13 }}>
              {[
                ['SKU', viewProduct.sku],
                ['Base Price', `$${viewProduct.basePrice}`],
                ['Sell Price', `$${viewProduct.sellPrice}`],
                ['Tax Applied', viewProduct.taxApplied ? `${viewProduct.taxApplied}%` : '-'],
                ['Shelf Life', viewProduct.shelfLife || '-'],
                ['Ingredients', viewProduct.ingredients || '-'],
                ['Contains', viewProduct.productContains || '-'],
                ['Memo', viewProduct.memo || '-'],
              ].map(([label, value]) => (
                <div key={label}>
                  <div style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{label}</div>
                  <div style={{ color: 'var(--ink)', fontWeight: 500 }}>{value}</div>
                </div>
              ))}
            </div>
            {viewProduct.productDescription && (
              <div>
                <div style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Description</div>
                <p style={{ margin: 0, color: 'var(--ink-2)', fontSize: 13 }}>{viewProduct.productDescription}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
