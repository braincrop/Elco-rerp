'use client'
import React, { useEffect, useState } from 'react'
import { Button, Input, FormGroup, Label, Card, CardBody, Table } from 'reactstrap'
import { Spinner } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Icon } from '@iconify/react'
import Notify from '@/components/Notify'
import { allTranslation, GetAllTranslation, GetSingleTranslationData, PostTranslation, TranslationBase, UpdateTranslationData } from '@/redux/slice/Translation/TranslationSlice'

const CreateLanguage = ({ mode, initialData, onBack }) => {
  const dispatch = useDispatch()
  const { allTranslationBase, loading,Singletranslation } = useSelector(allTranslation)
  const [formData, setFormData] = useState({
    lang: '',
    name: '',
    isAll: {
      branchName: 'string',
      selected: true,
    },
    sections: [],
  })

  useEffect(() => {
    dispatch(TranslationBase())
  }, [])

  useEffect(()=>{
    if(mode ==='edit'){
      dispatch(GetSingleTranslationData(initialData.lang))
    }
  },[])

  useEffect(() => {
    if (mode === 'edit' && Singletranslation) {
      setFormData({
        id: Singletranslation.id,
        lang: Singletranslation.lang || '',
        name: Singletranslation.name || '',
        isAll: Singletranslation.isAll || { branchName: 'string', selected: true },
        sections: Singletranslation.sections
          ? Singletranslation.sections.map((section) => ({
              ...section,
              keys: section.keys.map((k) => ({ ...k })),
            }))
          : [],
      })
    }
  }, [mode, Singletranslation])

  useEffect(() => {
    if (mode !== 'edit' && allTranslationBase && allTranslationBase.sections) {
      setFormData((prev) => ({
        ...prev,
        sections: JSON.parse(JSON.stringify(allTranslationBase.sections)),
      }))
    }
  }, [allTranslationBase, mode])

  const handleTranslationChange = (sIdx, kIdx, value) => {
    const newSections = [...formData.sections]
    newSections[sIdx].keys[kIdx].translatedValue = value
    setFormData({ ...formData, sections: newSections })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    if (!formData.lang) return Notify('error', 'Language Code is required')
    if (!formData.name) return Notify('error', 'Language Name is required')
    if (mode === 'create') {
      await dispatch(PostTranslation(formData)).unwrap()
    } else {
      const data = {
        id: formData.lang,
        updatedData: formData,
      }
      await dispatch(UpdateTranslationData(data)).unwrap()
    }
    onBack()
  }
  const handleAddKey = (sIdx) => {
    setFormData((prev) => {
      const newSections = [...prev.sections]

      const newKeyObj = {
        key: `new_key_${Date.now()}`,
        defaultValue: '',
        translatedValue: '',
        __isNew: true,
      }

      newSections[sIdx] = {
        ...newSections[sIdx],
        keys: [...newSections[sIdx].keys, newKeyObj],
      }

      return { ...prev, sections: newSections }
    })
  }
  const handleKeyFieldChange = (sIdx, kIdx, field, value) => {
    setFormData((prev) => {
      const newSections = [...prev.sections]
      const newKeys = [...newSections[sIdx].keys]

      newKeys[kIdx] = {
        ...newKeys[kIdx],
        [field]: value,
      }

      newSections[sIdx] = {
        ...newSections[sIdx],
        keys: newKeys,
      }

      return { ...prev, sections: newSections }
    })
  }
  const handleDeleteKey = (sIdx, kIdx) => {
    setFormData((prev) => {
      const newSections = [...prev.sections]
      const newKeys = newSections[sIdx].keys.filter((_, index) => index !== kIdx)

      newSections[sIdx] = {
        ...newSections[sIdx],
        keys: newKeys,
      }

      return { ...prev, sections: newSections }
    })
  }
 const handleAddSection = () => {
  setFormData(prev => ({
    ...prev,
    sections: [
      {
        name: '',
        __isNew: true,
        keys: [
          {
            key: '',
            defaultValue: '',
            translatedValue: '',
            __isNew: true,
          },
        ],
      },
      ...prev.sections,
    ],
  }));
};

  const handleSectionFieldChange = (sIdx, value) => {
    setFormData((prev) => {
      const newSections = [...prev.sections]
      newSections[sIdx] = {
        ...newSections[sIdx],
        name: value,
      }

      return { ...prev, sections: newSections }
    })
  }
  const handleDeleteSection = (sIdx) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, index) => index !== sIdx),
    }))
  }
  return (
    <div className="mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="custom-text">{mode === 'create' ? 'Create Language' : 'Edit Language'}</h4>
        <Button color="secondary" onClick={onBack}>
          View List
        </Button>
      </div>
      <div className="row mb-3">
        <div className="col-md-4">
          <FormGroup>
            <Label className="custom-text">
              Language Code <span style={{ color: '#e57373' }}>*</span>
            </Label>
            <Input name="lang" placeholder="e.g  fr,ar,is" value={formData.lang} onChange={handleChange} style={{backgroundColor:'transparent'}} className="custom-text"/>
          </FormGroup>
        </div>
        <div className="col-md-4">
          <FormGroup>
            <Label className="custom-text">
              Language Name <span style={{ color: '#e57373' }}>*</span>
            </Label>
            <Input name="name" value={formData.name} placeholder="e.g france, Arabic, Iceland" onChange={handleChange} style={{backgroundColor:'transparent'}} className="custom-text" />
          </FormGroup>
        </div>
      </div>
      <div className="row mb-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Button size="sm" onClick={handleAddSection}>
            <Icon icon="mdi:folder-plus" width="20" height="20"/>
            Add Section
          </Button>
        </div>
        {formData.sections && formData.sections.length > 0 ? (
          formData.sections.map((section, sIdx) => (
            <div key={sIdx} className="mb-4 border rounded p-2">
              <div className="d-flex justify-content-between align-items-center mb-2">
                {section.__isNew ? (
                  <Input
                    type="text"
                    className="custom-text"
                    value={section.name}
                    onChange={(e) => handleSectionFieldChange(sIdx, e.target.value)}
                    placeholder="Enter section name"
                    style={{ maxWidth: 250 ,backgroundColor:'transaprent'}}
                  />
                ) : (
                  <h5 className="custom-text mb-0" style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                    {section.name}
                  </h5>
                )}
                <div className="d-flex gap-2">
                  <Button size="sm" onClick={() => handleAddKey(sIdx)} title="Add new key">
                    <Icon icon="mdi:plus" width="20" height="20" />
                  </Button>
                  {section.__isNew && (
                    <Button color="danger" size="sm" onClick={() => handleDeleteSection(sIdx)} title="Delete section">
                      <Icon icon="mdi:delete" />
                    </Button>
                  )}
                </div>
              </div>
              <Table bordered hover responsive size="sm">
                <thead className="">
                  <tr>
                    <th style={{ width: '30%' }}>KEY</th>
                    <th style={{ width: '35%' }}>ENGLISH (BASE)</th>
                    <th style={{ width: '35%' }}>TRANSLATION ()</th>
                  </tr>
                </thead>
                <tbody>
                  {section.keys &&
                    section.keys.map((item, kIdx) => (
                      <tr key={`${sIdx}-${kIdx}`}>
                        {/* KEY */}
                        <td>
                          {item.__isNew ? (
                            <Input
                              type="text"
                             style={{backgroundColor:'transparent'}}
                            className="custom-text"
                              value={item.key}
                              onChange={(e) => handleKeyFieldChange(sIdx, kIdx, 'key', e.target.value)}
                              placeholder="Enter key"
                            />
                          ) : (
                            <span className="text-secondary">{item.key}</span>
                          )}
                        </td>
                        <td>
                          {item.__isNew ? (
                            <Input
                              type="text"
                              value={item.defaultValue}
                              style={{backgroundColor:'transparent'}}
                            className="custom-text"
                              onChange={(e) => handleKeyFieldChange(sIdx, kIdx, 'defaultValue', e.target.value)}
                              placeholder="Enter default value"
                            />
                          ) : (
                            item.defaultValue
                          )}
                        </td>
                        <td className="d-flex align-items-center gap-2">
                          <Input
                            type="text"
                            value={item.translatedValue || ''}
                            style={{backgroundColor:'transparent'}}
                            className="custom-text"
                            onChange={(e) => handleTranslationChange(sIdx, kIdx, e.target.value)}
                            placeholder="Enter translation"
                          />

                          {item.__isNew && (
                            <Button color="danger" size="sm" onClick={() => handleDeleteKey(sIdx, kIdx)} title="Delete key">
                              <Icon icon="mdi:delete" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </div>
          ))
        ) : (
          <div className="d-flex justify-content-center">
            <Spinner size="sm" className="me-2" />
            <h5>Loading translations...</h5>
          </div>
        )}
      </div>

      <div className="sticky-action-bar d-flex justify-content-end gap-2">
        <Button color="secondary" onClick={onBack}>
          Cancel
        </Button>
        <Button color="primary" onClick={handleSubmit} disabled={loading}>
          {loading && <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />}
          {mode === 'create' ? 'Create' : 'Update'}
        </Button>
      </div>
    </div>
  )
}

export default CreateLanguage
