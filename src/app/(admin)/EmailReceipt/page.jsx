'use client'
import React, { useEffect, useState } from 'react'
import { Table, Button, Container, Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label, Spinner } from 'reactstrap'
import { Icon } from '@iconify/react'
import { useDispatch, useSelector } from 'react-redux'
import Select from 'react-select'
import Notify from '@/components/Notify'
import {
  allEmailReceipt,
  DeleteEmailReceiptData,
  GetAllEmailReceipts,
  PostEmailReceipts,
  UpdatedEmailReceipt,
} from '@/redux/slice/EmailReceipt/EmailReceiptSlice'
import { AllEmailType, GetAllEmails } from '@/redux/slice/EmailType/EmailTypeSlice'

const customSelectStyles = {
  control: (base) => ({
    ...base,
    backgroundColor: '#22282e',
    borderColor: '#3a4551',
    color: '#fff',
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: '#22282e',
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? '#333' : '#22282e',
    color: '#fff',
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: '#333',
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: '#fff',
  }),
  singleValue: (base) => ({
    ...base,
    color: '#fff',
  }),
}

const Page = () => {
  const dispatch = useDispatch()
  const { EmailReceipt, loading } = useSelector(allEmailReceipt)
  const { EmailType } = useSelector(AllEmailType)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState('')
  const [deleteid, setDeleteid] = useState('')
  const [deleteModal, setDeleteModal] = useState(false)
  const [EmailReceipts, setEmailReceipts] = useState({
    email: '',
    memo: '',
    emailTypeIds: [],
  })

  useEffect(() => {
    dispatch(GetAllEmailReceipts())
    dispatch(GetAllEmails())
  }, [])

//   console.log('EmailReceipt', EmailReceipts)
//   console.log('Emailtype--', EmailType)
  const openModal = (type, id) => {
    console.log('id', id)
    setModalType(type)
    if (type === 'edit') {
      setEmailReceipts({
        id: id.emailRecipientId || '',
        email: id.email || '',
        memo: id.memo || '',
        emailTypeIds: Array.isArray(id.emailTypeIds)
          ? id.emailTypeIds.map(Number)
          : typeof id.emailTypeIds === 'string'
            ? id.emailTypeIds.split(',').map(Number)
            : [],
      })
    } else {
      setEmailReceipts({
        email: '',
        memo: '',
        emailTypeIds: [],
      })
    }
    setModalOpen(true)
  }

  const EmailTypeOptions = EmailType?.map((cat) => ({
    value: cat.emailTypeId,
    label: cat.name,
  }))

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEmailReceipts((prev) => ({
      ...prev,
      [name]: value,
    }))
  }
  const saveEmails = () => {
    if (!EmailReceipts.email) {
      Notify('error', 'Email is required')
      return
    }
    if (!EmailReceipts.memo) {
      Notify('error', 'Memo is required')
      return
    }
     const id = EmailReceipts.emailTypeIds
    if (!Array.isArray(id) || id.length === 0) {
      Notify('error', 'Email IDs are required')
      return
    }
    if (modalType === 'create') {
      dispatch(PostEmailReceipts(EmailReceipts)).unwrap()
    }
    if (modalType === 'edit') {
      const id = EmailReceipts.id
      dispatch(UpdatedEmailReceipt({ id: id, updatedData: EmailReceipts })).unwrap()
    }
    setModalOpen(false)
  }

  const opendeleteModal = (index) => {
    setDeleteid(index)
    setDeleteModal(true)
  }
  const deleteCategory = () => {
    dispatch(DeleteEmailReceiptData(deleteid)).unwrap()
    setDeleteModal(false)
  }

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold custom-text">Emails Receipt</h2>
        <Button color="primary" onClick={() => openModal('create')}>
          <Icon icon="mdi:plus" width="16" height="16" className="me-2" />
          Create New
        </Button>
      </div>
      <Table bordered hover responsive className="shadow-sm rounded">
        <thead className="table-light">
          <tr>
            <th>#</th>
            <th>Email</th>
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
          ) : EmailReceipt?.length > 0 ? (
            EmailReceipt.map((cat, index) => (
              <tr key={cat.emailRecipientId}>
                <td>{index + 1}</td>
                <td>{cat.email}</td>
                <td>{cat.memo}</td>
                <td className="text-center">
                  <div className="d-flex flex-column flex-sm-row justify-content-center gap-2">
                    <Button color="warning" size="sm" className="me-1 w-sm-auto" onClick={() => openModal('edit', cat)}>
                      <Icon icon="mdi:pencil" width="16" />
                    </Button>
                    <Button color="danger" size="sm" onClick={() => opendeleteModal(cat.emailRecipientId)} className="me-1 w-sm-auto">
                      <Icon icon="mdi:delete" width="16" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center text-muted py-4">
                No Email Receipt found
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)} centered>
        <ModalHeader toggle={() => setModalOpen(!modalOpen)}>{modalType === 'create' ? 'Add Email Receipt' : 'Edit Email Receipt'}</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label>
              Email<span style={{ color: '#e57373' }}>*</span>
            </Label>
            <Input type="text" value={EmailReceipts.email || ''} name="email" onChange={handleInputChange} />
          </FormGroup>
          <FormGroup>
            <Label>
              Memo <span style={{ color: '#e57373' }}>*</span>
            </Label>
            <Input type="text" value={EmailReceipts.memo || ''} name="memo" onChange={handleInputChange} />
          </FormGroup>
          <FormGroup>
            <Label>
              Email Type IDs <span style={{ color: '#e57373' }}>*</span>
            </Label>
            <Select
              isMulti
              options={EmailTypeOptions}
              value={EmailTypeOptions?.filter((option) => (EmailReceipts?.emailTypeIds || []).includes(option.value))}
              onChange={(selectedOptions) =>
                setEmailReceipts({
                  ...EmailReceipts,
                  emailTypeIds: selectedOptions.map((option) => option.value),
                })
              }
              styles={customSelectStyles}
              placeholder="Select Id..."
            />
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
        <ModalHeader toggle={() => setDeleteModal(!deleteModal)}>Delete Receipt</ModalHeader>
        <ModalBody>
          <p>Are you sure you want to delete this Receipt?</p>
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
