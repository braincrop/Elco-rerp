'use client'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Select from 'react-select'
import { allProducts, GetSingleProduct, PostProduct, UpdatedProduct } from '@/redux/slice/Products/productSlice'
import { allCategories, GetAllCategory } from '@/redux/slice/categories/CategorySlice'
import { allTranslation, Translation } from '@/redux/slice/Translation/TranslationSlice'
import { postImage } from '@/api/ImagesApi/imageHelperApi'
import Notify from '@/components/Notify'
import Field from '@/components/ui/Field'
import Button from '@/components/ui/Button'
import { getSelectStyles } from '@/utils/selectStyles'
import styles from './createproduct.module.css'

const CreateProduct = ({ setShow, selectedProduct, modalType }) => {
  const dispatch = useDispatch()
  const { translation } = useSelector(allTranslation)
  const { singleProduct, loading } = useSelector(allProducts)
  const { category } = useSelector(allCategories)
  const selectStyles = getSelectStyles()

  const [form, setForm] = useState({
    name: '', memo: '', imagePath: '', imagePathNf: '',
    productDescription: '', ingredients: '', productContains: '',
    shelfLife: '', basePrice: '', sellPrice: '', sku: '',
    taxApplied: '', categoryIds: [], translations: {},
  })

  useEffect(() => {
    dispatch(GetAllCategory())
    dispatch(Translation())
    if (modalType === 'edit') dispatch(GetSingleProduct(selectedProduct?.dpid))
  }, [])

  useEffect(() => {
    if (modalType === 'create' && translation?.length) {
      const formatted = {}
      translation.forEach((item) => { formatted[item.lang] = { name: '', productDescription: '' } })
      setForm((prev) => ({ ...prev, translations: formatted }))
    }
  }, [translation, modalType])

  useEffect(() => {
    if (form.name && form.translations?.en) {
      setForm((prev) => ({ ...prev, translations: { ...prev.translations, en: { ...prev.translations.en, name: form.name } } }))
    }
  }, [form.name])

  useEffect(() => {
    if (modalType === 'edit' && singleProduct) {
      const formatted = {}
      if (singleProduct.translations) {
        Object.entries(singleProduct.translations).forEach(([lang, value]) => {
          formatted[lang] = { name: value?.name ?? '', productDescription: value?.productDescription ?? '' }
        })
      }
      setForm({
        name: singleProduct.name ?? '', memo: singleProduct.memo ?? '',
        imagePath: singleProduct.imagePath ?? '', imagePathNf: singleProduct.imagePathNf ?? '',
        productDescription: singleProduct.productDescription ?? '',
        ingredients: singleProduct.ingredients ?? '', productContains: singleProduct.productContains ?? '',
        shelfLife: singleProduct.shelfLife ?? '', basePrice: singleProduct.basePrice ?? '',
        sellPrice: singleProduct.sellPrice ?? '', sku: singleProduct.sku ?? '',
        taxApplied: singleProduct.taxApplied ?? '',
        categoryIds: Array.isArray(singleProduct.categoryIds) ? singleProduct.categoryIds.map(Number)
          : typeof singleProduct.categoryIds === 'string' ? singleProduct.categoryIds.split(',').map(Number) : [],
        translations: formatted,
      })
    }
  }, [singleProduct, modalType])

  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }))

  const uploadImage = async (file, fieldName) => {
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await postImage(fd)
      setForm((prev) => ({ ...prev, [fieldName]: res?.data.url }))
    } catch (err) { console.error(err) }
  }

  const handleImageChange = (e) => {
    if (e.target.files?.length) uploadImage(e.target.files[0], e.target.name)
  }

  const categoryOptions = category?.map((c) => ({ value: c.dcid, label: c.name })) ?? []

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name?.trim()) return Notify('error', 'Product name is required')
    if (!form.categoryIds?.length) return Notify('error', 'Category IDs are required')

    const payload = {
      ...form,
      basePrice: Number(form.basePrice),
      sellPrice: Number(form.sellPrice),
      taxApplied: Number(form.taxApplied),
    }

    let resultAction
    if (modalType === 'create') {
      resultAction = await dispatch(PostProduct(payload))
      if (PostProduct.fulfilled.match(resultAction)) { setShow(false); return }
    } else {
      resultAction = await dispatch(UpdatedProduct({
        dpid: selectedProduct.dpid,
        updatedData: { ...payload, categoryIds: payload.categoryIds.map(Number) },
      }))
      if (UpdatedProduct.fulfilled.match(resultAction)) { setShow(false); return }
    }
    Notify('error', resultAction.payload || 'Operation failed')
  }

  const setTranslation = (lang, field, value) => {
    setForm((prev) => ({ ...prev, translations: { ...prev.translations, [lang]: { ...prev.translations[lang], [field]: value } } }))
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.grid}>
        <Field label="Product Name" required>
          <input name="name" value={form.name} onChange={set('name')} />
        </Field>
        <Field label="Memo">
          <input name="memo" value={form.memo} onChange={set('memo')} />
        </Field>
        <Field label="SKU">
          <input name="sku" value={form.sku} onChange={set('sku')} />
        </Field>
        <Field label="Base Price">
          <input type="number" name="basePrice" value={form.basePrice} onChange={set('basePrice')} />
        </Field>
        <Field label="Sell Price">
          <input type="number" name="sellPrice" value={form.sellPrice} onChange={set('sellPrice')} />
        </Field>
        <Field label="Tax Applied (%)">
          <input type="number" name="taxApplied" value={form.taxApplied} onChange={set('taxApplied')} />
        </Field>
        <Field label="Shelf Life">
          <input name="shelfLife" value={form.shelfLife} onChange={set('shelfLife')} placeholder="e.g. 12 months" />
        </Field>
        <Field label="Categories" required>
          <Select isMulti options={categoryOptions}
            value={categoryOptions.filter((o) => form.categoryIds.includes(o.value))}
            onChange={(opts) => setForm((p) => ({ ...p, categoryIds: opts.map((o) => o.value) }))}
            styles={selectStyles} placeholder="Select categories…" />
        </Field>
        <Field label="Ingredients">
          <input name="ingredients" value={form.ingredients} onChange={set('ingredients')} />
        </Field>
        <Field label="Product Contains">
          <input name="productContains" value={form.productContains} onChange={set('productContains')} />
        </Field>
        <Field label="Product Image">
          <input type="file" name="imagePath" onChange={handleImageChange} />
          {form.imagePath && <img src={form.imagePath} alt="product" style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 6, marginTop: 6 }} />}
        </Field>
        <Field label="No-fill Image">
          <input type="file" name="imagePathNf" onChange={handleImageChange} />
          {form.imagePathNf && <img src={form.imagePathNf} alt="product-nf" style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 6, marginTop: 6 }} />}
        </Field>
        <Field label="Description" className={styles.wide}>
          <textarea name="productDescription" value={form.productDescription} onChange={set('productDescription')} rows={3} />
        </Field>
      </div>

      {translation?.length > 0 && (
        <div className={styles.translationsWrap}>
          <h3 className={styles.transTitle}>Translations</h3>
          <div className={styles.transTable}>
            <div className={styles.transHead}>
              <span>Language</span><span>Name</span><span>Description</span>
            </div>
            {translation.map((item) => (
              <div key={item.translationId} className={styles.transRow}>
                <span className={styles.transLang}>{item.lang} — {item.name}</span>
                <input
                  value={form.translations?.[item.lang]?.name || ''}
                  onChange={(e) => setTranslation(item.lang, 'name', e.target.value)}
                />
                <textarea
                  value={form.translations?.[item.lang]?.productDescription || ''}
                  onChange={(e) => setTranslation(item.lang, 'productDescription', e.target.value)}
                  rows={2}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.footer}>
        <Button type="button" variant="ghost" onClick={() => setShow(false)}>Cancel</Button>
        <Button type="submit" busy={loading}>{modalType === 'create' ? 'Create Product' : 'Update Product'}</Button>
      </div>
    </form>
  )
}

export default CreateProduct
