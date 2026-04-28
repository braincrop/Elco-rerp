'use client'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Form, FormGroup, Label, Input, Button, Table } from 'reactstrap'
import { allTranslation, Translation } from '@/redux/slice/Translation/TranslationSlice'
import { allCategories, PostCategory, UpdatedCategory } from '@/redux/slice/categories/CategorySlice'
import { Icon } from '@iconify/react'

export const CreateCatLanguage = ({ modalType, selectedData, setShow }) => {
  const dispatch = useDispatch()
  const { translation } = useSelector(allTranslation)
  const { loading } = useSelector(allCategories)
  const [category, setCategory] = useState({
    name: '',
    translations: {},
  })

  useEffect(() => {
    dispatch(Translation())
  }, [])

  useEffect(() => {
    if (modalType === 'edit' && selectedData) {
      setCategory({
        name: selectedData.name || '',
        translations: {
          ...(selectedData.translations || {}),
          en: {
            ...(selectedData.translations?.en || {}),
            name: selectedData.name || '',
          },
        },
      })
    }
  }, [selectedData, modalType])
  const handleTranslationChange = (lang, field, value) => {
    setCategory((prev) => ({
      ...prev,
      translations: {
        ...prev.translations,
        [lang]: {
          ...prev.translations[lang],
          [field]: value,
        },
      },
    }))
  }
  const saveCategory = async () => {
    if (!category?.name.trim()) return
    try {
      if (modalType === 'create') {
        await dispatch(PostCategory(category)).unwrap()
      }
      if (modalType === 'edit') {
        const updatedData = {
          name: category.name,
          translations: category.translations,
        }
        const data = {
          dcid: selectedData.dcid,
          updatedData: updatedData,
        }
        await dispatch(UpdatedCategory(data)).unwrap()
      }
      setShow(false)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Form>
      <div className="d-flex justify-content-end">
        <Button color="primary" onClick={() => setShow(false)}>
          <Icon icon="mdi:arrow-left" width="18" />
          Back
        </Button>
      </div>
      <Row className="align-items-center">
        <Col md={3}>
          <FormGroup>
            <Label className="custom-text">Category Name</Label>
            <Input
              name="sku"
              value={category.name}
              style={{ backgroundColor: 'transparent' }}
              className="custom-text"
              onChange={(e) => setCategory({ ...category, name: e.target.value })}
            />
          </FormGroup>
        </Col>
      </Row>
      <Row className="mt-2">
        <h2 className="custom-text">Translations</h2>
        <Table hover responsive className="shadow-sm rounded">
          <thead>
            <tr>
              <th>Language</th>
              <th>Name</th>
              <th>Category Name</th>
            </tr>
          </thead>
          <tbody>
            {translation?.map((item) => (
              <tr key={item.translationId}>
                <td className="custom-text">{item.lang}</td>
                <td className="custom-text">{item.name}</td>
                <td>
                  <FormGroup>
                    <Input
                      className="custom-text"
                      style={{ backgroundColor: 'transparent' }}
                      value={category.translations?.[item.lang]?.name || ''}
                      onChange={(e) => handleTranslationChange(item.lang, 'name', e.target.value)}
                    />
                  </FormGroup>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Col md={12} className="text-end mb-2">
          <Button color="primary" onClick={saveCategory}>
            {loading && <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />}
            {modalType === 'create' ? 'Create Category' : 'Update Category'}
          </Button>
        </Col>
      </Row>
    </Form>
  )
}
