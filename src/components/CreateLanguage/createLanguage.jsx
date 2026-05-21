'use client'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  allTranslation,
  GetSingleTranslationData,
  PostTranslation,
  TranslationBase,
  UpdateTranslationData,
} from '@/redux/slice/Translation/TranslationSlice'
import Button from '@/components/ui/Button'
import Notify from '@/components/Notify'
import styles from './createLanguage.module.css'

const CreateLanguage = ({ mode, initialData, onBack }) => {
  const dispatch = useDispatch()
  const { allTranslationBase, loading, Singletranslation } = useSelector(allTranslation)
  const [formData, setFormData] = useState({
    lang: '', name: '',
    isAll: { branchName: 'string', selected: true },
    sections: [],
  })

  useEffect(() => { dispatch(TranslationBase()) }, [])
  useEffect(() => { if (mode === 'edit') dispatch(GetSingleTranslationData(initialData.lang)) }, [])

  useEffect(() => {
    if (mode === 'edit' && Singletranslation) {
      setFormData({
        id: Singletranslation.id,
        lang: Singletranslation.lang || '',
        name: Singletranslation.name || '',
        isAll: Singletranslation.isAll || { branchName: 'string', selected: true },
        sections: Singletranslation.sections
          ? Singletranslation.sections.map((s) => ({ ...s, keys: s.keys.map((k) => ({ ...k })) }))
          : [],
      })
    }
  }, [mode, Singletranslation])

  useEffect(() => {
    if (mode !== 'edit' && allTranslationBase?.sections) {
      setFormData((prev) => ({ ...prev, sections: JSON.parse(JSON.stringify(allTranslationBase.sections)) }))
    }
  }, [allTranslationBase, mode])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleTranslationChange = (sIdx, kIdx, value) => {
    const newSections = [...formData.sections]
    newSections[sIdx].keys[kIdx].translatedValue = value
    setFormData({ ...formData, sections: newSections })
  }

  const handleKeyFieldChange = (sIdx, kIdx, field, value) => {
    setFormData((prev) => {
      const newSections = [...prev.sections]
      const newKeys = [...newSections[sIdx].keys]
      newKeys[kIdx] = { ...newKeys[kIdx], [field]: value }
      newSections[sIdx] = { ...newSections[sIdx], keys: newKeys }
      return { ...prev, sections: newSections }
    })
  }

  const handleAddKey = (sIdx) => {
    setFormData((prev) => {
      const newSections = [...prev.sections]
      newSections[sIdx] = {
        ...newSections[sIdx],
        keys: [...newSections[sIdx].keys, { key: `new_key_${Date.now()}`, defaultValue: '', translatedValue: '', __isNew: true }],
      }
      return { ...prev, sections: newSections }
    })
  }

  const handleDeleteKey = (sIdx, kIdx) => {
    setFormData((prev) => {
      const newSections = [...prev.sections]
      newSections[sIdx] = { ...newSections[sIdx], keys: newSections[sIdx].keys.filter((_, i) => i !== kIdx) }
      return { ...prev, sections: newSections }
    })
  }

  const handleAddSection = () => {
    setFormData((prev) => ({
      ...prev,
      sections: [{ name: '', __isNew: true, keys: [{ key: '', defaultValue: '', translatedValue: '', __isNew: true }] }, ...prev.sections],
    }))
  }

  const handleSectionFieldChange = (sIdx, value) => {
    setFormData((prev) => {
      const newSections = [...prev.sections]
      newSections[sIdx] = { ...newSections[sIdx], name: value }
      return { ...prev, sections: newSections }
    })
  }

  const handleDeleteSection = (sIdx) => {
    setFormData((prev) => ({ ...prev, sections: prev.sections.filter((_, i) => i !== sIdx) }))
  }

  const handleSubmit = async () => {
    if (!formData.lang) return Notify('error', 'Language Code is required')
    if (!formData.name) return Notify('error', 'Language Name is required')
    if (mode === 'create') {
      await dispatch(PostTranslation(formData)).unwrap()
    } else {
      await dispatch(UpdateTranslationData({ id: formData.lang, updatedData: formData })).unwrap()
    }
    onBack()
  }

  return (
    <div>
      <div className={styles.topBar}>
        <h4 className={styles.title}>{mode === 'create' ? 'Create Language' : 'Edit Language'}</h4>
        <Button variant="ghost" onClick={onBack}>View List</Button>
      </div>

      <div className={styles.fieldsRow}>
        <div>
          <label className={styles.label}>Language Code <span className={styles.req}>*</span></label>
          <input name="lang" value={formData.lang} onChange={handleChange} placeholder="e.g. fr, ar" className={styles.input} />
        </div>
        <div>
          <label className={styles.label}>Language Name <span className={styles.req}>*</span></label>
          <input name="name" value={formData.name} onChange={handleChange} placeholder="e.g. French, Arabic" className={styles.input} />
        </div>
      </div>

      <div className={styles.sectionHeader}>
        <Button size="sm" onClick={handleAddSection}>+ Add Section</Button>
      </div>

      {formData.sections && formData.sections.length > 0 ? (
        formData.sections.map((section, sIdx) => (
          <div key={sIdx} className={styles.section}>
            <div className={styles.sectionTop}>
              {section.__isNew ? (
                <input
                  value={section.name}
                  onChange={(e) => handleSectionFieldChange(sIdx, e.target.value)}
                  placeholder="Section name"
                  className={styles.input}
                  style={{ maxWidth: 280 }}
                />
              ) : (
                <h5 className={styles.sectionName}>{section.name}</h5>
              )}
              <div style={{ display: 'flex', gap: 8 }}>
                <Button size="sm" variant="ghost" onClick={() => handleAddKey(sIdx)}>+ Key</Button>
                {section.__isNew && <Button size="sm" variant="danger-outline" onClick={() => handleDeleteSection(sIdx)}>Delete</Button>}
              </div>
            </div>

            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>KEY</th>
                    <th>ENGLISH (BASE)</th>
                    <th>TRANSLATION</th>
                  </tr>
                </thead>
                <tbody>
                  {section.keys?.map((item, kIdx) => (
                    <tr key={`${sIdx}-${kIdx}`}>
                      <td>
                        {item.__isNew ? (
                          <input value={item.key} onChange={(e) => handleKeyFieldChange(sIdx, kIdx, 'key', e.target.value)}
                            placeholder="key" className={styles.cellInput} />
                        ) : (
                          <span className={styles.keyText}>{item.key}</span>
                        )}
                      </td>
                      <td>
                        {item.__isNew ? (
                          <input value={item.defaultValue} onChange={(e) => handleKeyFieldChange(sIdx, kIdx, 'defaultValue', e.target.value)}
                            placeholder="default value" className={styles.cellInput} />
                        ) : item.defaultValue}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <input value={item.translatedValue || ''} onChange={(e) => handleTranslationChange(sIdx, kIdx, e.target.value)}
                            placeholder="translation" className={styles.cellInput} />
                          {item.__isNew && (
                            <Button size="sm" variant="danger-outline" onClick={() => handleDeleteKey(sIdx, kIdx)}>✕</Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      ) : (
        <div className={styles.empty}>
          <span className={styles.spinner} />
          Loading translations…
        </div>
      )}

      <div className={styles.actions}>
        <Button variant="ghost" onClick={onBack}>Cancel</Button>
        <Button onClick={handleSubmit} busy={loading}>
          {mode === 'create' ? 'Create' : 'Update'}
        </Button>
      </div>
    </div>
  )
}

export default CreateLanguage
