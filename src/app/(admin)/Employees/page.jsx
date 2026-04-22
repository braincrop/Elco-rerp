'use client'
import React, { useState, useMemo, useEffect } from 'react'
import { Table, Button, Container, Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label, Row, Col, Spinner } from 'reactstrap'
import { Icon } from '@iconify/react'
import { useDispatch, useSelector } from 'react-redux'
import { AllEmployees, DeleteEmployeeData, GetAllEmployee, PostEmployeesData, UpdatedEmployee } from '@/redux/slice/Employees/EmployeeSlice'
import Notify from '@/components/Notify'

const Page = () => {
  const dispatch = useDispatch()
  const { Employee, loading } = useSelector(AllEmployees)
  const [search, setSearch] = useState('')
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [deleteModal, setDeleteModal] = useState(false)
  const [productInput, setProductInput] = useState({
    eeid: '',
    name: '',
    email: '',
    workPhone: '',
    isEmployed: '',
  })

  useEffect(() => {
    dispatch(GetAllEmployee())
  }, [])

  const openModal = (type, prod = null) => {
    setModalType(type)
    if (type === 'edit') {
      setProductInput({
        id: prod.employeeId || '',
        eeid: prod.eeid || '',
        name: prod.name || '',
        email: prod.email || '',
        workPhone: prod.workPhone || '',
        isEmployed: prod.isEmployed || '',
      })
    } else {
      setProductInput({
        eeid: '',
        name: '',
        email: '',
        workPhone: '',
        isEmployed: '',
      })
    }
    setModalOpen(true)
  }

  const validateProduct = () => {
    if (!productInput.eeid) {
      Notify('error', 'EEID is required')
      return false
    }
    if (!productInput.name?.trim()) {
      Notify('error', 'Name is required')
      return false
    }
    if (!productInput.email) {
      Notify('error', 'Email is required')
      return false
    }
    if (!productInput.workPhone) {
      Notify('error', 'WorkPhone is required')
      return false
    }
    if (productInput.isEmployed === '' || productInput.isEmployed === null || productInput.isEmployed === undefined) {
      Notify('error', 'Employed Status is required')
      return false
    }

    return true
  }

  const saveProduct = () => {
    if (!validateProduct()) return
    if (modalType === 'create') {
      dispatch(PostEmployeesData(productInput)).unwrap()
    }

    if (modalType === 'edit') {
      const id = productInput.id
      dispatch(UpdatedEmployee({ id, updatedData: productInput })).unwrap()
    }

    setModalOpen(false)
  }

  const openDeleteModal = (index) => {
    setSelectedIndex(index)
    setDeleteModal(true)
  }

  const confirmDelete = () => {
    dispatch(DeleteEmployeeData(selectedIndex)).unwrap()
    setDeleteModal(false)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProductInput((prev) => ({ ...prev, [name]: value }))
  }
  // const filteredProducts = useMemo(() => {
  //   return products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
  // }, [search, products])
  // const paginated = filteredProducts.slice(0, itemsPerPage)

  return (
    <Container className="mt-5">
      <Row className="mb-4">
        <Col md="2">
          <Input type="text" placeholder="Search branch..." value={search} onChange={(e) => setSearch(e.target.value)}  style={{backgroundColor:'transparent'}} className="custom-text"/>
        </Col>
        <Col md="2">
          <Input type="select" value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} style={{backgroundColor:'transparent'}} className="custom-text">
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </Input>
        </Col>
        <Col md="8" className="text-end">
          <Button color="primary" onClick={() => openModal('create')}>
            <Icon icon="mdi:plus" width={18} className="me-2" />
            Create New
          </Button>
        </Col>
      </Row>
      <Table bordered hover responsive className="shadow-sm rounded">
        <thead>
          <tr>
            <th>#</th>
            {/* <th>Branch</th> */}
            <th>EEID</th>
            <th>Name</th>
            <th>Email</th>
            <th>WorkPhone</th>
            <th>Employed</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="7" className="text-center py-4">
                <Spinner size="sm" className="me-2" />
                Loading employees...
              </td>
            </tr>
          ) : Employee?.length > 0 ? (
            Employee.map((prod, index) => (
              <tr key={prod.employeeId}>
                <td>{index + 1}</td>
                <td>{prod.eeid}</td>
                <td>{prod.name}</td>
                <td>{prod.email}</td>
                <td>{prod.workPhone}</td>
                <td>{prod.isEmployed ? 'Yes' : 'No'}</td>
                <td className="text-center">
                  <Button color="warning" size="sm" className="me-2 text-white" onClick={() => openModal('edit', prod)}>
                    <Icon icon="mdi:pencil" width={16} />
                  </Button>
                  <Button color="danger" size="sm" onClick={() => openDeleteModal(prod.employeeId)}>
                    <Icon icon="mdi:delete" width={16} />
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center text-muted py-4">
                No Employees Found
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      <Modal isOpen={modalOpen} centered>
        <ModalHeader toggle={() => setModalOpen(!modalOpen)}>{modalType === 'create' ? 'Create Employee' : 'Edit Employee'}</ModalHeader>
        <ModalBody>
          {/* <FormGroup>
            <Label>Branch</Label>
            <Input name="branch" value={productInput.branch} onChange={handleInputChange} />
          </FormGroup> */}
          <FormGroup>
            <Label>
              EE ID <span style={{ color: '#e57373' }}>*</span>
            </Label>
            <Input name="eeid" value={productInput.eeid} onChange={handleInputChange} style={{backgroundColor:'transparent'}}/>
          </FormGroup>
          <FormGroup>
            <Label>
              Name <span style={{ color: '#e57373' }}>*</span>
            </Label>
            <Input name="name" value={productInput.name} onChange={handleInputChange} style={{backgroundColor:'transparent'}}/>
          </FormGroup>
          <FormGroup>
            <Label>
              Email <span style={{ color: '#e57373' }}>*</span>
            </Label>
            <Input name="email" value={productInput.email} onChange={handleInputChange} style={{backgroundColor:'transparent'}}/>
          </FormGroup>
          <FormGroup>
            <Label>
              Work Phone <span style={{ color: '#e57373' }}>*</span>
            </Label>
            <Input
              name="workPhone"
              value={productInput.workPhone}
              style={{backgroundColor:'transparent'}}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '')
                setProductInput({
                  ...productInput,
                  workPhone: value,
                })
              }}
              maxLength={15}
            />
          </FormGroup>
          <FormGroup>
            <Label>
              Employed <span style={{ color: '#e57373' }}>*</span>
            </Label>
            <Input
              type="select"
              name="isEmployed"
              style={{backgroundColor:'transparent'}}
              value={productInput.isEmployed ?? ''}
              onChange={(e) =>
                handleInputChange({
                  target: {
                    name: 'isEmployed',
                    value: e.target.value === 'true',
                  },
                })
              }>
              <option value="">Select Status</option>
              <option value="true">Yes (Employed)</option>
              <option value="false">No (Unemployed)</option>
            </Input>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
          <Button color="primary" onClick={saveProduct}>
            {modalType === 'create' ? 'Create' : 'Save'}
          </Button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={deleteModal} centered>
        <ModalHeader>Delete Employee</ModalHeader>
        <ModalBody>Are you sure you want to delete this Employee?</ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setDeleteModal(false)}>
            Cancel
          </Button>
          <Button color="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  )
}

export default Page
