'use client'
import React, { useEffect, useState } from 'react'
import { Table, Button, Container, Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label, Spinner } from 'reactstrap'
import { Icon } from '@iconify/react'
import { useDispatch, useSelector } from 'react-redux'
import { AllEmailType, DeleteEmailTypeData, GetAllEmails, PostEmails, UpdatedEmailType } from '@/redux/slice/EmailType/EmailTypeSlice'
import Notify from '@/components/Notify'

const Page = () => {
  const dispatch = useDispatch()
  const { EmailType,loading } = useSelector(AllEmailType)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState('')
  const [deleteid, setDeleteid] = useState('')
  const [deleteModal, setDeleteModal] = useState(false)
  const [Emailtype, setEmailtype] = useState({
    name: '',
    memo: '',
  })
 

  useEffect(() => {
    dispatch(GetAllEmails())
  }, [])

  const openModal = (type, id = null) => {
    setModalType(type)
    if (type === 'edit' && id !== null) {
      setEmailtype({
        id: id.emailTypeId || '',
        name: id.name || '',
        memo: id.memo || '',
      })
    } else {
      setEmailtype('')
    }
    setModalOpen(true)
  }
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEmailtype((prev) => ({
      ...prev,
      [name]: value,
    }))
  }
  const saveEmails = () => {
    if (!Emailtype.name){
        Notify('error', 'Name is required')
        return
    }
    if(!Emailtype.memo){
        Notify('error', 'Memo is required')
        return
    }
    if (modalType === 'create') {
      dispatch(
        PostEmails(Emailtype)).unwrap()
    }
    if (modalType === 'edit') {
      const id = Emailtype.id
      dispatch(UpdatedEmailType({ id: id, updatedData: Emailtype })).unwrap()
    }
    setModalOpen(false)
  }

  const opendeleteModal = (index) => {
    setDeleteid(index)
    setDeleteModal(true)
  }
  const deleteCategory = () => {
    dispatch(DeleteEmailTypeData(deleteid)).unwrap()
    setDeleteModal(false)
  }
  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold custom-text">Emails</h2>
        <Button color="primary" onClick={() => openModal('create')}>
          <Icon icon="mdi:plus" width="16" height="16" className="me-2" />
          Create New
        </Button>
      </div>
      <Table bordered hover responsive className="shadow-sm rounded">
        <thead className="table-light align-middle">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Memo</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" className="text-center py-4">
                <Spinner size="sm" /> Loading...
              </td>
            </tr>
          ) : EmailType?.length > 0 ? (
            EmailType.map((cat,index) => (
              <tr key={cat.emailTypeId}>
                <td>{index +1}</td>
                <td>{cat.name}</td>
                <td>{cat.memo}</td>
                <td className="text-center">
                  <div className="d-flex flex-column flex-sm-row justify-content-center gap-2">
                    <Button color="warning" size="sm" className="me-1 w-sm-auto" onClick={() => openModal('edit', cat)}>
                      <Icon icon="mdi:pencil" width="16" />
                    </Button>
                    <Button color="danger" size="sm" onClick={() => opendeleteModal(cat.emailTypeId)} className="me-1 w-sm-auto">
                      <Icon icon="mdi:delete" width="16" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center text-muted ">
                No Email found
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)} centered>
        <ModalHeader toggle={() => setModalOpen(!modalOpen)}>{modalType === 'create' ? 'Add Email Category' : 'Edit Email Category'}</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label>Name <span style={{ color: '#e57373' }}>*</span></Label>
            <Input type="text" value={Emailtype.name || ''} name="name" onChange={handleInputChange} />
          </FormGroup>
          <FormGroup>
            <Label>Memo <span style={{ color: '#e57373' }}>*</span></Label>
            <Input type="text" value={Emailtype.memo || ''} name="memo" onChange={handleInputChange} />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
          <Button color="primary" onClick={saveEmails} disabled={loading}>
            {loading && <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />}
            {modalType === 'create' ? 'Create' : 'Save'}
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={deleteModal} toggle={() => setDeleteModal(!deleteModal)} centered>
        <ModalHeader toggle={() => setDeleteModal(!deleteModal)}>Delete Email</ModalHeader>
        <ModalBody>
          <p>Are you sure you want to delete this Email Type?</p>
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
