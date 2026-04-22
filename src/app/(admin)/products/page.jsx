'use client'
import React, { useState, useMemo, useEffect } from 'react'
import { Table, Button, Container, Modal, ModalHeader, ModalBody, ModalFooter, Spinner, Input, FormGroup, Label, Row, Col, Form } from 'reactstrap'
import { Icon } from '@iconify/react'
import { useDispatch, useSelector } from 'react-redux'
import Select from 'react-select'
import CreateProduct from '../../../components/CreateProduct/createproduct'
import { allProducts, DeleteProductData, GetAllProduct, PostProductBulkUpsert } from '@/redux/slice/Products/productSlice'
import { allBranch, GetAllBranch } from '@/redux/slice/Branch/branchSlice'

const customSelectStyles = {
  control: (base) => ({
    ...base,
    backgroundColor: '#22282e',
    borderColor: '#3a4551',
    color: '#fff',
  }),

  valueContainer: (base) => ({
    ...base,
    color: '#fff',
  }),

  input: (base) => ({
    ...base,
    color: '#fff', // 👈 typing text
  }),

  placeholder: (base) => ({
    ...base,
    color: '#ccc', // 👈 placeholder text
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

  multiValueRemove: (base) => ({
    ...base,
    color: '#fff',
    ':hover': {
      backgroundColor: '#555',
      color: '#fff',
    },
  }),

  singleValue: (base) => ({
    ...base,
    color: '#fff',
  }),
}

const Page = () => {
  const { product, loading } = useSelector(allProducts)
  const dispatch = useDispatch()
  const [search, setSearch] = useState('')
  const [show, setShow] = useState(false)
  const { branch } = useSelector(allBranch)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [deleteModal, setDeleteModal] = useState(false)
  const [assignModal, setAssignModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [viewModal, setViewModal] = useState(false)
  const [ViewselectedProduct, ViewsetSelectedProduct] = useState(null)
  const [assignData, setAssignData] = useState({
    sku: '',
    branches: [],
  })
  const [modalType, setModalType] = useState('create')

  useEffect(() => {
    dispatch(GetAllProduct())
    dispatch(GetAllBranch())
  }, [])
  const openDeleteModal = (index) => {
    setSelectedIndex(index)
    setDeleteModal(true)
  }
  const openViewModal = (product) => {
    console.log('product', product)
    ViewsetSelectedProduct(product)
    setViewModal(true)
  }

  const closeViewModal = () => {
    setViewModal(false)
    ViewsetSelectedProduct(null)
  }

  const branchOptions = Array.isArray(branch) ? branch.map((b) => ({ value: b.branchId, label: b.name })) : []

  const handleChange = (key, value) => {
    const ids = Array.isArray(value) ? value.map((v) => v.value) : []
    setAssignData((prev) => ({ ...prev, branches: ids }))
  }

  const confirmDelete = () => {
    setDeleteModal(false)
    dispatch(DeleteProductData(selectedIndex))
  }
  const openModal = (type, product = null) => {
    setModalType(type)
    setSelectedProduct(product)
    setShow(true)
  }
  const openAssignModal = (data) => {
    setAssignData({
      sku: data.sku,
    })
    setAssignModal(true)
  }
  const handleToggleShow = () => {
    if (modalType === 'edit' || show) {
      setShow(false)
      setSelectedProduct(null)
      setModalType('')
    } else {
      setShow(true)
      setModalType('create')
    }
  }
  const handleCreateProduct = () => {
    dispatch(PostProductBulkUpsert([assignData])).unwrap()
    setAssignModal(false)
  }
  const filteredProducts = useMemo(() => {
    return product.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
  }, [search, product])
  const paginated = filteredProducts.slice(0, itemsPerPage)

  return (
    <Container className="mt-5">
      <Row className="mb-4 align-items-center">
        {!show && (
          <Col xs="12" md="6" className="mb-2 mb-md-0">
            <div className="d-flex flex-column flex-sm-row gap-2">
              <Input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} style={{backgroundColor:'transparent'}} className="custom-text" />
              <Input type="select" value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} style={{backgroundColor:'transparent'}} className="custom-text">
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </Input>
            </div>
          </Col>
        )}

        <Col xs="12" md={show ? '12' : '6'}>
          <div className="d-flex flex-column flex-sm-row justify-content-center justify-content-md-end gap-2">
            <Button color="primary" onClick={handleToggleShow}>
              <Icon icon="mdi:plus" width={18} className="me-1" />
              {modalType === 'edit' || show ? 'View List' : 'Add Product'}
            </Button>
          </div>
        </Col>
      </Row>

      {show ? (
        <CreateProduct setShow={setShow} selectedProduct={selectedProduct} modalType={modalType} />
      ) : (
        <Table bordered hover responsive className="shadow-sm rounded">
          <thead className="">
            <tr>
              <th>#</th>
              <th>Product</th>
              <th>Sku</th>
              <th>Ingredients</th>
              <th>Shelf Life</th>
              <th>Base Price</th>
              <th>Sell Price</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="12" className="text-center py-4">
                  <Spinner size="sm" className="me-2" />
                  Loading products...
                </td>
              </tr>
            ) : paginated?.length > 0 ? (
              paginated.map((prod, index) => (
                <tr key={prod.dpid}>
                  <td className="custom-text">{index + 1}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      {prod.imagePath && (
                        <img
                          src={prod.imagePath}
                          alt={prod.name}
                          style={{
                            width: 50,
                            height: 50,
                            objectFit: 'cover',
                            marginRight: 10,
                            borderRadius: 6,
                          }}
                        />
                      )}
                      <div>
                        <div className="fw-bold custom-text">{prod.name}</div>
                        <small className="custom-text">{prod.productDescription}</small>
                      </div>
                    </div>
                  </td>
                  <td className="custom-text">{prod.sku || '-'}</td>
                  <td className="custom-text">{prod.ingredients || '-'}</td>
                  <td className="custom-text">{prod.shelfLife || '-'}</td>
                  <td className="custom-text">{prod.basePrice}</td>
                  <td className="custom-text">{prod.sellPrice}</td>
                  <td className="text-center">
                    <div className="d-flex flex-column flex-sm-row justify-content-center gap-2">
                      <Button color="info" size="sm" className="text-white w-md-auto" title="View Product" onClick={() => openViewModal(prod)}>
                        <Icon icon="mdi:eye" width={16} />
                      </Button>
                      <Button color="danger" size="sm" title="Assign-Product" className="w-sm-auto" onClick={() => openAssignModal(prod)}>
                        <Icon icon="mdi:source-branch" width={16} />
                      </Button>
                      <Button color="warning" size="sm" className="text-white w-md-auto" title="Edit Product" onClick={() => openModal('edit', prod)}>
                        <Icon icon="mdi:pencil" width={16} />
                      </Button>
                      <Button
                        color="danger"
                        size="sm"
                        className="text-white w-md-auto"
                        title="Delete Product"
                        onClick={() => openDeleteModal(prod.dpid)}>
                        <Icon icon="mdi:delete" width={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12" className="text-center text-muted py-4">
                  No Product Found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
      <Modal isOpen={deleteModal} toggle={() => setDeleteModal(!deleteModal)} centered>
        <ModalHeader>Delete Product</ModalHeader>
        <ModalBody>Are you sure you want to delete this product?</ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setDeleteModal(false)}>
            Cancel
          </Button>
          <Button color="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={assignModal} toggle={() => setAssignModal(!assignModal)} centered>
        <ModalHeader>Assign Product</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label>Sku</Label>
              <Input value={assignData.sku} onChange={(e) => setAssignData({ ...assignData, name: e.target.value })} />
            </FormGroup>
            <FormGroup>
              <Label>Branches</Label>
              <Select
                isMulti
                options={branchOptions}
                value={branchOptions.filter((o) => Array.isArray(assignData.branches) && assignData.branches.includes(o.value))}
                styles={customSelectStyles}
                onChange={(val) => handleChange('branches', val)}
                placeholder="Select bracnhes"
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setAssignModal(false)}>
            Cancel
          </Button>
          <Button color="danger" onClick={handleCreateProduct} disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                Loading...
              </>
            ) : (
              'Submit'
            )}
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={viewModal} toggle={closeViewModal} size="lg" centered>
        <ModalHeader toggle={closeViewModal} className="bg-light">
          <span className="fw-bold">Product Details</span>
        </ModalHeader>

        <ModalBody className="">
          {ViewselectedProduct && (
            <div className="container-fluid">
              {/* IMAGE + BASIC INFO */}
              <div className="row mb-4 align-items-center">
                <div className="col-md-3 text-center">
                  <img
                    src={ViewselectedProduct.imagePath || '/placeholder.png'}
                    alt="product"
                    className="img-fluid rounded border"
                    style={{ maxHeight: '120px' }}
                  />
                </div>

                <div className="col-md-9">
                  <h5 className="fw-bold mb-1">{ViewselectedProduct.name}</h5>
                  <div className="text-muted small mb-2">SKU: {ViewselectedProduct.sku || '-'}</div>

                  <span className={`badge ${ViewselectedProduct.taxApplied ? 'bg-success' : 'bg-secondary'}`}>
                    {ViewselectedProduct.taxApplied ? 'Tax Applied' : 'No Tax'}
                  </span>
                </div>
              </div>

              <hr />

              {/* PRICES */}
              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="border rounded p-3 h-100">
                    <div className="text-muted small">Sell Price</div>
                    <div className="fs-5 fw-bold text-primary">${ViewselectedProduct.sellPrice}</div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="border rounded p-3 h-100">
                    <div className="text-muted small">Base Price</div>
                    <div className="fs-5 fw-bold">${ViewselectedProduct.basePrice}</div>
                  </div>
                </div>
              </div>

              {/* DETAILS */}
              <div className="row mb-3">
                <div className="col-md-6 mb-3">
                  <div className="text-muted small">Shelf Life</div>
                  <div className="fw-semibold">{ViewselectedProduct.shelfLife || '-'}</div>
                </div>

                <div className="col-md-6 mb-3">
                  <div className="text-muted small">Ingredients</div>
                  <div className="fw-semibold">{ViewselectedProduct.ingredients || '-'}</div>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6 mb-3">
                  <div className="text-muted small">Product Contains</div>
                  <div className="fw-semibold">{ViewselectedProduct.productContains || '-'}</div>
                </div>

                <div className="col-md-6 mb-3">
                  <div className="text-muted small">Memo</div>
                  <div className="fw-semibold">{ViewselectedProduct.memo || '-'}</div>
                </div>
              </div>

              {/* DESCRIPTION */}
              <div className="row">
                <div className="col-12">
                  <div className="text-muted small mb-1">Description</div>
                  <div className="border rounded p-3 bg-light">{ViewselectedProduct.productDescription || '-'}</div>
                </div>
              </div>
            </div>
          )}
        </ModalBody>

        <ModalFooter className="bg-light">
          <Button color="secondary" onClick={closeViewModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  )
}

export default Page
