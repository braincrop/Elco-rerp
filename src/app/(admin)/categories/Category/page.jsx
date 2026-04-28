'use client'
import React, { useEffect, useState } from 'react'
import { Table, Button, Container, Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label, Spinner } from 'reactstrap'
import { Icon } from '@iconify/react'
import { useDispatch, useSelector } from 'react-redux'
import { CreateCatLanguage } from '@/components/createCatLanguage/createCatLanguage'
import { allCategories, DeleteCategoryData, GetAllCategory, PostCategory, UpdatedCategory } from '@/redux/slice/categories/CategorySlice'

const Page = () => {
  const dispatch = useDispatch()
  const { category, loading } = useSelector(allCategories)
  const [modalType, setModalType] = useState('')
  const [show, setShow] = useState(false)
  const [deleteid, setDeleteid] = useState('')
  const [selectedData,setSelectedData] = useState('')
  const [deleteModal, setDeleteModal] = useState(false)

  useEffect(() => {
    dispatch(GetAllCategory())
  }, [])

  const openModal = (type, cat,) => {
    console.log('cat', cat) 
    setModalType(type)
    if (type === 'edit') {
      setSelectedData(cat)
    }
    setShow(true)
  }

  const opendeleteModal = (index) => {
    setDeleteid(index)
    setDeleteModal(true)
  }
  const deleteCategory = () => {
    dispatch(DeleteCategoryData(deleteid)).unwrap()
    setDeleteModal(false)
  }

  return (
    <Container className="mt-5">
      {!show && (
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-black">Categories</h2>
          <Button color="primary" onClick={() => openModal('create')}>
            <Icon icon="mdi:plus" width="16" height="16" className="me-2" />
            Create New
          </Button>
        </div>
      )}
      {show? (
        <CreateCatLanguage modalType={modalType} selectedData={selectedData} setShow={setShow} />
      ) : (
        <Table bordered hover responsive className="shadow-sm rounded">
          <thead>
            <tr>
              <th>#</th>
              <th>Category Name</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="3" className="text-center py-4">
                  <Spinner size="sm" /> Loading...
                </td>
              </tr>
            ) : category?.length > 0 ? (
              category.map((cat) => (
                <tr key={cat.dcid}>
                  <td>{cat.dcid}</td>
                  <td>{cat.name}</td>
                  <td className="text-center">
                    <div className="d-flex flex-column flex-sm-row justify-content-center gap-2">
                      <Button color="warning" size="sm" className="me-1 w-sm-auto" onClick={() => openModal('edit', cat)}>
                        <Icon icon="mdi:pencil" width="16" />
                      </Button>
                      <Button color="danger" size="sm" onClick={() => opendeleteModal(cat.dcid)} className="me-1 w-sm-auto">
                        <Icon icon="mdi:delete" width="16" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center text-muted py-4">
                  No categories found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      {/* <Modal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)} centered >
        <ModalHeader toggle={() => setModalOpen(!modalOpen)}>{modalType === 'create' ? 'Create New Category' : 'Edit Category'}</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label>Category Name</Label>
            <Input type="text" value={categoryInput} onChange={(e) => setCategoryInput(e.target.value)} style={{backgroundColor:'transparent'}}/>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
          <Button color="primary" onClick={saveCategory} disabled={loading}>
            {loading && <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />}
            {modalType === 'create' ? 'Create' : 'Save'}
          </Button>
        </ModalFooter>
      </Modal> */}

      <Modal isOpen={deleteModal} toggle={() => setDeleteModal(!deleteModal)} centered>
        <ModalHeader toggle={() => setDeleteModal(!deleteModal)}>Delete Category</ModalHeader>
        <ModalBody>
          <p>Are you sure you want to delete this category?</p>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setDeleteModal(false)}>
            Cancel
          </Button>
          <Button color="danger" onClick={deleteCategory}>
            Delete
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  )
}

export default Page
