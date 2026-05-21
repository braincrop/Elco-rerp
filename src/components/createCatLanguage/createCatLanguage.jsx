'use client'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { allTranslation, Translation } from '@/redux/slice/Translation/TranslationSlice'
import { allCategories, PostCategory, UpdatedCategory } from '@/redux/slice/categories/CategorySlice'
import Field from '@/components/ui/Field'
import Button from '@/components/ui/Button'
import SvgIcon from '@/components/ui/SvgIcon'
import styles from './createCatLanguage.module.css'

export const CreateCatLanguage = ({ modalType, selectedData, setShow }) => {
  const dispatch = useDispatch()
  const { translation } = useSelector(allTranslation)
  const { loading } = useSelector(allCategories)

  const [category, setCategory] = useState({ name: '', translations: {} })

  useEffect(() => {
    dispatch(Translation())
  }, [])

  useEffect(() => {
    if (modalType === 'edit' && selectedData) {
      setCategory({
        name: selectedData.name || '',
        translations: {
          ...(selectedData.translations || {}),
          en: { ...(selectedData.translations?.en || {}), name: selectedData.name || '' },
        },
      })
    }
  }, [selectedData, modalType])

  const setTranslation = (lang, field, value) => {
    setCategory((prev) => ({
      ...prev,
      translations: { ...prev.translations, [lang]: { ...prev.translations[lang], [field]: value } },
    }))
  }

  const saveCategory = async () => {
    if (!category?.name.trim()) return
    try {
      if (modalType === 'create') {
        await dispatch(PostCategory(category)).unwrap()
      } else {
        await dispatch(UpdatedCategory({ dcid: selectedData.dcid, updatedData: { name: category.name, translations: category.translations } })).unwrap()
      }
      setShow(false)
    } catch (err) { console.error(err) }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <Button variant="ghost" size="sm" icon={<SvgIcon id="i-arrow" />} onClick={() => setShow(false)}>Back</Button>
      </div>

      <Field label="Category Name" required>
        <input value={category.name} onChange={(e) => setCategory((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. Beverages" />
      </Field>

      {translation?.length > 0 && (
        <div className={styles.transWrap}>
          <h3 className={styles.transTitle}>Translations</h3>
          <div className={styles.transTable}>
            <div className={styles.transHead}>
              <span>Language</span><span>Name</span><span>Category Name</span>
            </div>
            {translation.map((item) => (
              <div key={item.translationId} className={styles.transRow}>
                <span className={styles.transLang}>{item.lang} — {item.name}</span>
                <span />
                <input
                  value={category.translations?.[item.lang]?.name || ''}
                  onChange={(e) => setTranslation(item.lang, 'name', e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.footer}>
        <Button variant="ghost" onClick={() => setShow(false)}>Cancel</Button>
        <Button onClick={saveCategory} busy={loading}>{modalType === 'create' ? 'Create Category' : 'Update Category'}</Button>
      </div>
    </div>
  )
}
