'use client'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  allRestuarantItem,
  DeleteRestuarantItemData,
  GetRestuarantItem,
  PostRestuarantItemData,
  UpdateRestuarantItem,
} from '@/redux/slice/RestuarantItem/RestuarantItemSlice'
import { allProducts, GetAllProduct } from '@/redux/slice/Products/productSlice'
import DataTable from '@/components/ui/DataTable'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { postImage } from '@/api/ImagesApi/imageHelperApi'
import Notify from '../Notify'
import styles from './ItemCategoryView.module.css'

const ItemCategoryView = ({ data, onBack }) => {
  const dispatch = useDispatch()
  const { product } = useSelector(allProducts)
  const { restuarantItem, loading } = useSelector(allRestuarantItem)
  const [deleteModal, setDeleteModal] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [modalType, setModalType] = useState('create')
  const [modalOpen, setModalOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [itemInput, setItemInput] = useState({
    barcode: '', name: '', buyPrice: 0, sellPrice: 0,
    distinctProductId: '', imagePath: '', itemSubCategoryIds: [data?.itemSubCategoryID],
  })

  useEffect(() => {
    if (data.itemSubCategoryID) dispatch(GetRestuarantItem({ ItemSubCategoryId: data.itemSubCategoryID }))
    dispatch(GetAllProduct())
  }, [])

  const isProductSelected = !!itemInput.distinctProductId

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name === 'distinctProductId') {
      const selected = product.find((p) => p.dpid === Number(value))
      if (selected) {
        setItemInput((prev) => ({
          ...prev,
          distinctProductId: value,
          barcode: selected.barcode || '',
          name: selected.name || '',
          buyPrice: selected.basePrice || '',
          sellPrice: selected.sellPrice || '',
          imagePath: selected.imagePath || '',
        }))
      }
    } else {
      setItemInput((prev) => ({ ...prev, [name]: value }))
    }
  }

  const openModal = (type, item = null) => {
    setModalType(type)
    if (type === 'edit' && item) {
      setItemInput({
        restaurantItemID: item.restaurantItemID || 0,
        barcode: item.barcode || '',
        name: item.name || '',
        buyPrice: item.buyPrice || 0,
        sellPrice: item.sellPrice || 0,
        distinctProductId: item.distinctProductId || 0,
        imagePath: item.imagePath || '',
        itemSubCategoryIds: item.itemSubCategoryID || data?.itemSubCategoryID,
      })
    } else {
      setItemInput({
        barcode: '', name: '', buyPrice: 0, sellPrice: 0,
        distinctProductId: 0, imagePath: '', itemSubCategoryIds: data?.itemSubCategoryID,
      })
    }
    setModalOpen(true)
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await postImage(formData)
      setItemInput((prev) => ({ ...prev, imagePath: res?.data.url }))
    } catch {
      Notify('error', 'Image upload failed')
    } finally {
      setUploading(false)
    }
  }

  const saveItem = async () => {
    if (!itemInput.name.trim()) return Notify('error', 'Item name is required')
    try {
      const payload = {
        ...itemInput,
        itemSubCategoryIds: Array.isArray(itemInput.itemSubCategoryIds)
          ? itemInput.itemSubCategoryIds.map(Number)
          : [Number(itemInput.itemSubCategoryIds)],
      }
      if (modalType === 'edit') {
        await dispatch(UpdateRestuarantItem({ restaurantItemID: itemInput.restaurantItemID, updatedData: payload })).unwrap()
      } else {
        await dispatch(PostRestuarantItemData(payload)).unwrap()
      }
      setModalOpen(false)
    } catch {
      Notify('error', 'Failed to save item')
    }
  }

  const confirmDelete = () => {
    dispatch(DeleteRestuarantItemData(selectedIndex)).unwrap()
    setDeleteModal(false)
  }

  const columns = [
    { key: 'index', header: '#', render: (_, __, i) => i + 1, width: 50 },
    { key: 'name', header: 'Name' },
    { key: 'barcode', header: 'Barcode' },
    { key: 'buyPrice', header: 'Buy Price' },
    { key: 'sellPrice', header: 'Sell Price' },
    { key: 'isPerishable', header: 'Perishable', render: (v) => v ? 'Yes' : 'No' },
    { key: 'isInCatalog', header: 'In Catalog', render: (v) => v ? 'Yes' : 'No' },
    { key: 'taxCategoryId', header: 'Tax Cat.', render: (v) => v ?? '-' },
    { key: 'imagePath', header: 'Image', render: (v, row) => v ? <img src={v} alt={row.name} width={40} height={40} style={{ borderRadius: 4, objectFit: 'cover' }} /> : '-' },
    {
      key: 'actions', header: 'Actions',
      render: (_, item) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button size="sm" variant="ghost" onClick={() => openModal('edit', item)}>Edit</Button>
          <Button size="sm" variant="danger-outline" onClick={() => { setSelectedIndex(item.restaurantItemID); setDeleteModal(true) }}>Delete</Button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <div className={styles.header}>
        <h2 className={styles.title}>Restaurant Items</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button onClick={() => openModal('create')}>+ Create New</Button>
          <Button variant="ghost" onClick={onBack}>← Back to Category</Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={restuarantItem || []}
        rowKey="restaurantItemID"
        loading={loading}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={modalType === 'create' ? 'Create Item' : 'Edit Item'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label className={styles.label}>Distinct Product</label>
            <select name="distinctProductId" value={itemInput.distinctProductId || ''} onChange={handleInputChange} className={styles.input}>
              <option value="" disabled hidden>Select Product</option>
              {product?.map((p) => (
                <option key={p.dpid} value={p.dpid}>{p.name}</option>
              ))}
            </select>
          </div>

          {isProductSelected && (
            <>
              <div>
                <label className={styles.label}>Barcode</label>
                <input name="barcode" value={itemInput.barcode} onChange={handleInputChange} className={styles.input} />
              </div>
              <div>
                <label className={styles.label}>Name</label>
                <input name="name" value={itemInput.name} onChange={handleInputChange} className={styles.input} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className={styles.label}>Buy Price</label>
                  <input name="buyPrice" type="number" value={itemInput.buyPrice} onChange={handleInputChange} className={styles.input} />
                </div>
                <div>
                  <label className={styles.label}>Sell Price</label>
                  <input name="sellPrice" type="number" value={itemInput.sellPrice} onChange={handleInputChange} className={styles.input} />
                </div>
              </div>
              <div>
                <label className={styles.label}>Image</label>
                <input type="file" onChange={handleImageUpload} className={styles.input} accept="image/*" />
                {uploading && <span style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 4 }}>Uploading…</span>}
                {itemInput.imagePath && <img src={itemInput.imagePath} alt="preview" width={60} style={{ marginTop: 8, borderRadius: 4 }} />}
              </div>
            </>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--line)' }}>
          <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button onClick={saveItem} busy={loading}>{modalType === 'create' ? 'Create' : 'Save'}</Button>
        </div>
      </Modal>

      <Modal open={deleteModal} onClose={() => setDeleteModal(false)} title="Delete Item">
        <p style={{ color: 'var(--ink-2)', margin: 0 }}>Are you sure you want to delete this restaurant item?</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--line)' }}>
          <Button variant="ghost" onClick={() => setDeleteModal(false)}>Cancel</Button>
          <Button variant="danger-outline" onClick={confirmDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  )
}

export default ItemCategoryView
