'use client'
import { useEffect, useState } from 'react'
import Select from 'react-select'
import { useDispatch, useSelector } from 'react-redux'
import { allBranch, GetAllBranch } from '@/redux/slice/Branch/branchSlice'
import { allItemCategory, GetItemCategory } from '@/redux/slice/ItemCategory/ItemCategorySlice'
import { allProducts, GetAllProduct, PostProduct } from '@/redux/slice/Products/productSlice'
import { PostRestuarantItemData } from '@/redux/slice/RestuarantItem/RestuarantItemSlice'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import { getSelectStyles } from '@/utils/selectStyles'
import Notify from '../Notify'
import styles from './CreateRestuarantItem.module.css'

const CreateRestuarantItem = ({ onBack }) => {
  const dispatch = useDispatch()
  const { branch } = useSelector(allBranch)
  const { itemCat } = useSelector(allItemCategory)
  const { product, loading } = useSelector(allProducts)
  const [formData, setFormData] = useState({
    branchId: '', categoryIds: [], productId: '',
    editProduct: { name: '', barcode: '', buyPrice: '', sellPrice: '' },
  })
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newProduct, setNewProduct] = useState({ name: '', buyPrice: '', sellPrice: '', categoryIds: [] })

  useEffect(() => {
    dispatch(GetAllBranch())
    dispatch(GetAllProduct())
  }, [])

  const branchOptions = branch?.map((b) => ({ value: b.branchId, label: b.name }))
  const categoryOptions = itemCat?.map((c) => ({ value: c.itemSubCategoryID, label: c.categoryName }))
  const productOptions = product?.map((p) => ({ value: p.dpid, label: p.name }))

  const handleChange = (type, value) => {
    if (type === 'branch') {
      setFormData({ branchId: value, categoryIds: [], productId: '', editProduct: { name: '', barcode: '', buyPrice: '', sellPrice: '' } })
      dispatch(GetItemCategory({ BranchId: value }))
    }
    if (type === 'category') {
      const ids = value.map((c) => c.value)
      setFormData((prev) => ({ ...prev, categoryIds: ids, productId: '', editProduct: { name: '', barcode: '', buyPrice: '', sellPrice: '' } }))
      setNewProduct((prev) => ({ ...prev, categoryIds: ids }))
    }
    if (type === 'product') {
      if (!value) {
        setFormData((prev) => ({ ...prev, productId: '', editProduct: { name: '', barcode: '', buyPrice: '', sellPrice: '' } }))
        return
      }
      const full = product.find((p) => p.dpid === value.value)
      setFormData((prev) => ({
        ...prev,
        productId: value.value,
        editProduct: { name: full?.name || '', barcode: full?.barcode || '', buyPrice: full?.basePrice || '', sellPrice: full?.sellPrice || '' },
      }))
    }
  }

  const handleUpdateProduct = () => {
    const { name, barcode, buyPrice, sellPrice } = formData.editProduct
    if (!name || !barcode || !buyPrice || !sellPrice) return Notify('error', 'All fields are required')
    dispatch(PostRestuarantItemData({
      branchId: formData.branchId,
      itemSubCategoryIds: formData.categoryIds,
      productId: formData.productId,
      name, barcode, buyPrice, sellPrice,
    })).unwrap()
    setFormData({ branchId: '', categoryIds: [], productId: '', editProduct: { name: '', barcode: '', buyPrice: '', sellPrice: '' } })
  }

  const handleCreateProduct = () => {
    dispatch(PostProduct(newProduct)).unwrap()
    setShowCreateModal(false)
    setNewProduct({ name: '', buyPrice: '', sellPrice: '' })
  }

  const selectStyles = getSelectStyles()

  const ep = formData.editProduct
  const setEp = (key, val) => setFormData((p) => ({ ...p, editProduct: { ...p.editProduct, [key]: val } }))

  return (
    <>
      <Card>
        <Card.Head actions={<Button variant="ghost" onClick={onBack}>← Back</Button>}>
          <span className="panel-title">Create Restaurant Item</span>
        </Card.Head>
        <Card.Body>
          <div className={styles.row3}>
            <div>
              <label className={styles.label}>Branch</label>
              <select value={formData.branchId} onChange={(e) => handleChange('branch', e.target.value)} className={styles.input}>
                <option value="">Select Branch</option>
                {branchOptions?.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
              </select>
            </div>
            <div>
              <label className={styles.label}>Categories</label>
              <Select
                isMulti isDisabled={!formData.branchId}
                options={categoryOptions}
                value={categoryOptions?.filter((c) => formData.categoryIds.includes(c.value))}
                styles={selectStyles}
                onChange={(val) => handleChange('category', val)}
                placeholder="Select categories"
              />
            </div>
            <div>
              <label className={styles.label}>Product</label>
              <Select
                options={productOptions} isSearchable isClearable
                styles={selectStyles} isLoading={loading}
                value={productOptions?.find((p) => p.value === formData.productId) || null}
                onChange={(val) => handleChange('product', val)}
                placeholder="Search product…"
                noOptionsMessage={() => (
                  <button className={styles.createBtn} onMouseDown={(e) => { e.preventDefault(); setShowCreateModal(true) }}>
                    + Create New Product
                  </button>
                )}
              />
            </div>
          </div>

          {formData.productId && formData.branchId && formData.categoryIds.length > 0 && (
            <div className={styles.editCard}>
              <div className={styles.editCardHead}>Edit Product Details</div>
              <div className={styles.row2}>
                <div>
                  <label className={styles.label}>Name <span className={styles.req}>*</span></label>
                  <input value={ep.name} onChange={(e) => setEp('name', e.target.value)} className={styles.input} />
                </div>
                <div>
                  <label className={styles.label}>Barcode <span className={styles.req}>*</span></label>
                  <input value={ep.barcode} onChange={(e) => setEp('barcode', e.target.value)} className={styles.input} />
                </div>
                <div>
                  <label className={styles.label}>Buy Price <span className={styles.req}>*</span></label>
                  <input type="number" value={ep.buyPrice} onChange={(e) => setEp('buyPrice', e.target.value)} className={styles.input} />
                </div>
                <div>
                  <label className={styles.label}>Sell Price <span className={styles.req}>*</span></label>
                  <input type="number" value={ep.sellPrice} onChange={(e) => setEp('sellPrice', e.target.value)} className={styles.input} />
                </div>
              </div>
              <div style={{ textAlign: 'right', marginTop: 16 }}>
                <Button onClick={handleUpdateProduct}>Create Item</Button>
              </div>
            </div>
          )}
        </Card.Body>
      </Card>

      <Modal open={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create New Product">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label className={styles.label}>Product Name</label>
            <input value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} className={styles.input} />
          </div>
          <div>
            <label className={styles.label}>Categories</label>
            <Select
              isMulti options={categoryOptions}
              value={categoryOptions?.filter((c) => formData.categoryIds.includes(c.value))}
              styles={selectStyles}
              onChange={(val) => handleChange('category', val)}
              placeholder="Select categories"
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className={styles.label}>Buy Price</label>
              <input type="number" value={newProduct.buyPrice} onChange={(e) => setNewProduct({ ...newProduct, buyPrice: e.target.value })} className={styles.input} />
            </div>
            <div>
              <label className={styles.label}>Sell Price</label>
              <input type="number" value={newProduct.sellPrice} onChange={(e) => setNewProduct({ ...newProduct, sellPrice: e.target.value })} className={styles.input} />
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--line)' }}>
          <Button variant="ghost" onClick={() => setShowCreateModal(false)}>Cancel</Button>
          <Button onClick={handleCreateProduct} busy={loading}>Create Product</Button>
        </div>
      </Modal>
    </>
  )
}

export default CreateRestuarantItem
