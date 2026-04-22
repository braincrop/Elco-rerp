'use client'
import React, { useState, useMemo, useEffect } from 'react'
import {
  Table,
  Button,
  Container,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  FormGroup,
  Label,
  Row,
  Col,
  Spinner,
  InputGroupText,
  InputGroup,
} from 'reactstrap'
import { Icon } from '@iconify/react'
import { useDispatch, useSelector } from 'react-redux'
import { allCoupons, DeleteCouponsData, GetAllCoupons, PostCoupon, UpdatedCoupons } from '@/redux/slice/Coupons/couponsSlice'
import Notify from '@/components/Notify'

const Page = () => {
  const { coupons, loading } = useSelector(allCoupons)
  const dispatch = useDispatch()
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [CouponsInput, setCouponsInput] = useState({
    code: '',
    amount: '',
    maxdiscount: '',
    mindiscount: '',
    expiryDate: '',
  })
  const [deleteModal, setDeleteModal] = useState(false)

  useEffect(() => {
    dispatch(GetAllCoupons())
  }, [])

  const generateCouponCode = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const numbers = '0123456789'

    let alphaPart = ''
    let numberPart = ''

    // 3 alphabets
    for (let i = 0; i < 3; i++) {
      alphaPart += letters.charAt(Math.floor(Math.random() * letters.length))
    }

    // 3 numbers
    for (let i = 0; i < 3; i++) {
      numberPart += numbers.charAt(Math.floor(Math.random() * numbers.length))
    }

    return `${alphaPart}${numberPart}` // e.g. ABC123
  }
  const handleGenerateCode = () => {
    const newCode = generateCouponCode()
    setCouponsInput((prev) => ({
      ...prev,
      code: newCode,
    }))
  }

  console.log('coupons', CouponsInput)

  const openModal = (type, index = null) => {
    console.log('index', index)
    setModalType(type)
    if (type === 'edit' && index !== null) {
      setCouponsInput({
        couponsId: index.couponId,
        code: index.code || '',
        amount: index.amount || '',
        maxdiscount: index.maxDiscount || '',
        mindiscount: index.minDiscount || '',
        expiryDate: index.expiryDate ? new Date(index.expiryDate).toISOString().slice(0, 16) : '',
      })
    } else {
      setCouponsInput({
        code: '',
        amount: '',
        maxdiscount: '',
        mindiscount: '',
        expiryDate: '',
      })
    }

    setModalOpen(true)
  }
  const saveCoupons = () => {
    if (!CouponsInput.code.trim()) {
      Notify('error', 'Code is required')
      return
    }
     if (!CouponsInput.amount) {
      Notify('error', 'Amount is required')
      return
    }
     if (!CouponsInput.maxdiscount) {
      Notify('error', 'Max Discount is required')
      return
    }
      if (!CouponsInput.mindiscount) {
      Notify('error', 'Min Discount is required')
      return
    }
      if (!CouponsInput.expiryDate) {
      Notify('error', 'Expire Date is required')
      return
    }
    if (modalType === 'create') {
      dispatch(PostCoupon(CouponsInput)).unwrap()
    }
    if (modalType === 'edit') {
      const id = CouponsInput.couponsId
      dispatch(UpdatedCoupons({ id: id, updatedData: CouponsInput })).unwrap()
    }
    setModalOpen(false)
  }
  const openDeleteModal = (index) => {
    setSelectedIndex(index)
    setDeleteModal(true)
  }
  const handleInputChange = (e) => {
    const { name, value } = e.target

    setCouponsInput((prev) => ({
      ...prev,
      [name]: value,
    }))
  }
  const confirmDelete = () => {
    dispatch(DeleteCouponsData(selectedIndex)).unwrap()
    setDeleteModal(false)
  }
  // const filteredCouponss = useMemo(() => {
  //   return Couponss?.filter((p) => p.amount.toLowerCase().includes(search.toLowerCase()))
  // }, [search, Couponss])

  // const paginated = filteredCouponss.slice(0, itemsPerPage)

  return (
    <Container className="mt-5">
      {/* <Row className="d-flex justify-content-between align-items-center mb-4">
        <Col md="2">
          <Input type="text" placeholder="Amount$..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </Col>
        <Col md="2">
          <Input type="select" value={deleted} onChange={(e) => setDeleted(e.target.value)}>
            <option value="" disabled>
              --IsDeleted--
            </option>
            <option value="true">true</option>
            <option value="false">false</option>
          </Input>
        </Col>
        <Col md="2">
          <Input type="select" value={used} onChange={(e) => setUsed(e.target.value)}>
            <option value="" disabled>
              --IsUsed--
            </option>
            <option value="true">true</option>
            <option value="false">false</option>
          </Input>
        </Col>
        <Col md="2">
          <Input type="select" value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </Input>
        </Col>
        <Col md="10" className="text-end">
          <Button color="primary" onClick={() => openModal('create')} className="me-1">
            <Icon icon="mdi:plus" width={18} className="me-1" />
            Add Coupon
          </Button>
          <Button color="primary" onClick={() => openModal('create')}>
            <Icon icon="mdi:plus" width={18} className="me-1" />
            Multiple Coupon
          </Button>
        </Col>
      </Row> */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold custom-text">Coupons</h2>
        <Button color="primary" onClick={() => openModal('create')}>
          <Icon icon="mdi:plus" width="16" height="16" className="me-2" />
          Create New
        </Button>
      </div>
      <Table bordered hover responsive className="shadow-sm rounded">
        <thead>
          <tr>
            <th>#</th>
            <th>Code</th>
            <th>Amount</th>
            <th>Max Discount</th>
            <th>Min Discount</th>
            <th>Expire Date</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={9} className="text-center">
                <Spinner size="sm" /> Loading...
              </td>
            </tr>
          ) : coupons?.length > 0 ? (
            coupons.map((prod, index) => (
              <tr key={prod.couponId}>
                <td>{index + 1}</td>
                <td>{prod.code || '-'}</td>
                <td>{prod.amount || '-'}</td>
                <td>{prod.maxDiscount || '-'}</td>
                <td>{prod.minDiscount || '-'}</td>
                <td>
                  {prod.expiryDate
                    ? new Date(prod.expiryDate).toLocaleString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '-'}
                </td>
                <td className="text-center">
                  <div className="d-flex flex-column flex-sm-row justify-content-center gap-2">
                    <Button color="warning" size="sm" className="me-1 w-sm-auto" onClick={() => openModal('edit', prod)}>
                      <Icon icon="mdi:pencil" width={16} />
                    </Button>
                    <Button color="danger" size="sm" className="me-1 w-sm-auto" onClick={() => openDeleteModal(prod.couponId)}>
                      <Icon icon="mdi:delete" width={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={9} className="text-center text-muted py-4">
                No coupons Found
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      <Modal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)} centered>
        <ModalHeader toggle={() => setModalOpen(!modalOpen)}>{modalType === 'create' ? 'Create Coupon' : 'Edit Coupon'}</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label>
              Code <span style={{ color: '#e57373' }}>*</span>
            </Label>
            <InputGroup>
              <Input
                type="text"
                name="code"
                value={CouponsInput.code}
                style={{backgroundColor:'transparent'}}
                onChange={(e) =>
                  handleInputChange({
                    target: { name: 'code', value: e.target.value.toUpperCase() },
                  })
                }
                placeholder="Enter or generate code"
              />
              <InputGroupText style={{ cursor: 'pointer' }} onClick={handleGenerateCode} title="Generate Code">
                <Icon icon="mdi:refresh" width={18} />
              </InputGroupText>
            </InputGroup>
          </FormGroup>

          <FormGroup>
            <Label>Amount <span style={{ color: '#e57373' }}>*</span></Label>
            <Input type="number" name="amount" value={CouponsInput.amount} onChange={handleInputChange} style={{backgroundColor:'transparent'}}/>
          </FormGroup>
          <FormGroup>
            <Label>Max Discount <span style={{ color: '#e57373' }}>*</span></Label>
            <Input type="number" name="maxdiscount" value={CouponsInput.maxdiscount} onChange={handleInputChange} style={{backgroundColor:'transparent'}}/>
          </FormGroup>
          <FormGroup>
            <Label>Min Discount <span style={{ color: '#e57373' }}>*</span></Label>
            <Input type="number" name="mindiscount" value={CouponsInput.mindiscount} onChange={handleInputChange} style={{backgroundColor:'transparent'}}/>
          </FormGroup>
          <FormGroup>
            <Label>Expire Date <span style={{ color: '#e57373' }}>*</span></Label>
            <Input
              type="datetime-local"
              style={{backgroundColor:'transparent'}}
              name="expiryDate"
              min={new Date().toISOString().slice(0, 16)}
              value={CouponsInput.expiryDate}
              onChange={handleInputChange}
            />
          </FormGroup>
        </ModalBody>

        <ModalFooter>
          <Button color="secondary" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
          <Button color="primary" onClick={saveCoupons}>
            {modalType === 'create' ? 'Create' : 'Save'}
          </Button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={deleteModal} toggle={() => setDeleteModal(!deleteModal)} centered>
        <ModalHeader>Delete Coupon</ModalHeader>
        <ModalBody>Are you sure you want to delete this Coupon?</ModalBody>
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
