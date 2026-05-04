import React, { useEffect, useState } from 'react'
import {
  Card,
  CardBody,
  CardHeader,
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
  Form,
} from 'reactstrap'
import Select from 'react-select'
import { Icon } from '@iconify/react'
import { useDispatch, useSelector } from 'react-redux'
import { allBranch, GetAllBranch } from '@/redux/slice/Branch/branchSlice'
import { allCategories, GetSingleCategory } from '@/redux/slice/categories/CategorySlice'
import { allProducts, GetAllProduct, GetSingleProduct, PostProduct } from '@/redux/slice/Products/productSlice'
import { allItemCategory, GetItemCategory } from '@/redux/slice/ItemCategory/ItemCategorySlice'
import { PostRestuarantItemData } from '@/redux/slice/RestuarantItem/RestuarantItemSlice'
import Notify from '../Notify'
import { useTheme } from '@/context/BrandingContext'

// const customSelectStyles = {
//   control: (base) => ({
//     ...base,
//     backgroundColor: '#22282e',
//     borderColor: '#3a4551',
//     color: '#fff',
//   }),

//   valueContainer: (base) => ({
//     ...base,
//     color: '#fff',
//   }),

//   input: (base) => ({
//     ...base,
//     color: '#fff', // 👈 typing text
//   }),

//   placeholder: (base) => ({
//     ...base,
//     color: '#ccc', // 👈 placeholder text
//   }),

//   menu: (base) => ({
//     ...base,
//     backgroundColor: '#22282e',
//   }),

//   option: (base, state) => ({
//     ...base,
//     backgroundColor: state.isFocused ? '#333' : '#22282e',
//     color: '#fff',
//   }),

//   multiValue: (base) => ({
//     ...base,
//     backgroundColor: '#333',
//   }),

//   multiValueLabel: (base) => ({
//     ...base,
//     color: '#fff',
//   }),

//   multiValueRemove: (base) => ({
//     ...base,
//     color: '#fff',
//     ':hover': {
//       backgroundColor: '#555',
//       color: '#fff',
//     },
//   }),

//   singleValue: (base) => ({
//     ...base,
//     color: '#fff',
//   }),
// }

const CreateRestuarantItem = ({ onBack }) => {
    const { theme } = useTheme()
    const selectColor = theme?.primaryColor 
    const customSelectStyles = {
      control: (base) => ({
        ...base,
        backgroundColor: selectColor,
        borderColor: ' #3a4551',
        color: '#fff',
      }),
      menu: (base) => ({
        ...base,
        backgroundColor: selectColor,
        border:'1px solid #3a4551'
      }),
      option: (base, state) => ({
        ...base,
        backgroundColor: state.isFocused ?' #3d4153' : selectColor,
        color: '#fff',
      }),
      multiValue: (base) => ({
        ...base,
        backgroundColor: selectColor,
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
  const dispatch = useDispatch()
  const { branch } = useSelector(allBranch)
  const { itemCat } = useSelector(allItemCategory)
  const { product, loading } = useSelector(allProducts)
  const [formData, setFormData] = useState({
    branchId: '',
    categoryIds: [],
    productId: '',
    editProduct: { name: '', barcode: '', buyPrice: '', sellPrice: '' },
  })
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newProduct, setNewProduct] = useState({ name: '', buyPrice: '', sellPrice: '', categoryIds: [] })

  useEffect(() => {
    dispatch(GetAllBranch())
    dispatch(GetAllProduct())
  }, [])

  const branchOptions = branch?.map((b) => ({ value: b.branchId, label: b.name }))
  const categoryOptions = itemCat?.map((c) => ({ value: c.itemSubCategoryID, label: c.categoryName }))
  const productOptions = product?.map((p) => ({ value: p.dpid, label: p.name }))

  const handleChange = (type, value) => {
    if (type === 'branch') {
      setFormData({
        branchId: value,
        categoryIds: [],
        productId: '',
        editProduct: { name: '', barcode: '', buyPrice: '', sellPrice: '' },
      })
      dispatch(GetItemCategory({ BranchId: value }))
    }
    if (type === 'category') {
      const ids = value.map((c) => c.value)
      setFormData((prev) => ({ ...prev, categoryIds: ids, productId: '', editProduct: { name: '', barcode: '', buyPrice: '', sellPrice: '' } }))
      setNewProduct((prev) => ({ ...prev, categoryIds: ids }))
    }
    if (type === 'product') {
      if (!value) {
        setFormData((prev) => ({
          ...prev,
          productId: '',
          editProduct: { name: '', barcode: '', buyPrice: '', sellPrice: '' },
        }))
        return
      }
      const full = product.find((p) => p.dpid === value.value)
      setFormData((prev) => ({
        ...prev,
        productId: value.value,
        editProduct: {
          name: full?.name || '',
          barcode: full?.barcode || '',
          buyPrice: full?.basePrice || '',
          sellPrice: full?.sellPrice || '',
        },
      }))
    }
  }
  const handleUpdateProduct = () => {
    const payload = {
      branchId: formData.branchId,
      itemSubCategoryIds: formData.categoryIds,
      productId: formData.productId,
      name: formData.editProduct.name,
      barcode: formData.editProduct.barcode,
      buyPrice: formData.editProduct.buyPrice,
      sellPrice: formData.editProduct.sellPrice,
    }
    if(formData.editProduct.name === '' || formData.editProduct.barcode === '' 
      || formData.editProduct.buyPrice === '' || formData.editProduct.sellPrice === '') 
      return Notify('error', 'All fields are required')
    dispatch(PostRestuarantItemData(payload)).unwrap()
    setFormData({
      branchId: '',
      categoryIds: [],
      productId: '',
      editProduct: { name: '', barcode: '', buyPrice: '', sellPrice: '' },
    })
  }

  const handleCreateProduct = () => {
    dispatch(PostProduct(newProduct)).unwrap()
    setShowCreateModal(false)
    setNewProduct({ name: '', barcode: '', buyPrice: '', sellPrice: '' })
  }

  return (
    <>
      <Card className="shadow-sm">
        <CardHeader className="text-white d-flex justify-content-between align-items-center flex-wrap">
          <h4 className="custom-text">Create Restaurant Item</h4>
          <Button color="primary" onClick={() => onBack()}>
            <Icon icon="mdi:arrow-left" width="16" height="16" className="me-1" />
            Back
          </Button>
        </CardHeader>
        <CardBody>
          <Row className="g-3">
            <Col md={4}>
              <Label className="custom-text">Branch</Label>
              <Input type="select" value={formData.branchId} onChange={(e) => handleChange('branch', e.target.value)} style={{backgroundColor:selectColor,color:'#fff'}}>
                <option value="">Select Branch</option>
                {branchOptions?.map((b) => (
                  <option key={b.value} value={b.value}>
                    {b.label}
                  </option>
                ))}
              </Input>
            </Col>
            <Col md={4}>
              <Label className="custom-text">Categories</Label>
              <Select
                isMulti
                isDisabled={!formData.branchId}
                options={categoryOptions}
                value={categoryOptions?.filter((c) => formData.categoryIds.includes(c.value))}
                styles={customSelectStyles}
                onChange={(val) => handleChange('category', val)}
                placeholder="Select categories"
              />
            </Col>
            <Col md={4}>
              <Label className="custom-text">Product</Label>
              <Select
                options={productOptions}
                isSearchable
                isClearable
                styles={customSelectStyles}
                isLoading={loading}
                value={productOptions?.find((p) => p.value === formData.productId) || null}
                onChange={(val) => handleChange('product', val)}
                placeholder="Search product..."
                noOptionsMessage={() => (
                  <Button
                    size="sm"
                    color="primary"
                    onMouseDown={(e) => {
                      e.preventDefault()
                      setShowCreateModal(true)
                    }}>
                    + Create New Product
                  </Button>
                )}
              />
            </Col>
          </Row>
          {formData.productId && formData.branchId && formData.categoryIds.length > 0 && (
            <Card className="mt-4">
              <CardHeader className='custom-text'>Create Selected Product</CardHeader>
              <CardBody>
                <Row>
                  <Col md={6}>
                    <Label className="custom-text">Name <span style={{ color: '#e57373' }}>*</span></Label>
                    <Input
                      required
                      className='custom-text'
                       style={{backgroundColor:'transparent'}}
                      value={formData.editProduct.name}
                      onChange={(e) => setFormData({ ...formData, editProduct: { ...formData.editProduct, name: e.target.value } })}
                    />
                  </Col>
                  <Col md={6}>
                    <Label className="custom-text">Barcode <span style={{ color: '#e57373' }}>*</span></Label>
                    <Input
                      required
                      className='custom-text'
                       style={{backgroundColor:'transparent'}}
                      value={formData.editProduct.barcode}
                      onChange={(e) => setFormData({ ...formData, editProduct: { ...formData.editProduct, barcode: e.target.value } })}
                    />
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col md={6}>
                    <Label className="custom-text">Buy Price <span style={{ color: '#e57373' }}>*</span></Label>
                    <Input
                      type="number"
                      className='custom-text'
                       style={{backgroundColor:'transparent'}}
                      required
                      value={formData.editProduct.buyPrice}
                      onChange={(e) => setFormData({ ...formData, editProduct: { ...formData.editProduct, buyPrice: e.target.value } })}
                    />
                  </Col>
                  <Col md={6}>
                    <Label className="custom-text">Sell Price <span style={{ color: '#e57373' }}>*</span></Label>
                    <Input
                      type="number"
                      className='custom-text'
                      style={{backgroundColor:'transparent'}}
                      required
                      value={formData.editProduct.sellPrice}
                      onChange={(e) => setFormData({ ...formData, editProduct: { ...formData.editProduct, sellPrice: e.target.value } })}
                    />
                  </Col>
                </Row>

                <div className="text-end mt-3">
                  <Button color="primary" onClick={handleUpdateProduct}>
                    Create Item
                  </Button>
                </div>
              </CardBody>
            </Card>
          )}
        </CardBody>
      </Card>
      <Modal isOpen={showCreateModal} toggle={() => setShowCreateModal(false)} centered>
        <ModalHeader toggle={() => setShowCreateModal(false)}>Create New Product</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label className='custom-text' >Product Name</Label>
              <Input value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
            </FormGroup>
            <FormGroup>
              <Label className='custom-text'>Categories</Label>
              <Select
                isMulti
                options={categoryOptions}
                value={categoryOptions?.filter((c) => formData.categoryIds.includes(c.value))}
                styles={customSelectStyles}
                onChange={(val) => handleChange('category', val)}
                placeholder="Select categories"
              />
            </FormGroup>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label className="custom-text">Buy Price</Label>
                  <Input type="number" value={newProduct.buyPrice} onChange={(e) => setNewProduct({ ...newProduct, buyPrice: e.target.value })}  style={{backgroundColor:'transparent'}}/>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className="custom-text">Sell Price</Label>
                  <Input type="number" value={newProduct.sellPrice} onChange={(e) => setNewProduct({ ...newProduct, sellPrice: e.target.value })}  style={{backgroundColor:'transparent'}}/>
                </FormGroup>
              </Col>
            </Row>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setShowCreateModal(false)}>
            Cancel
          </Button>
          <Button color="primary" onClick={handleCreateProduct} disabled={loading}>
            {loading && <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />}
            Create Product
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}

export default CreateRestuarantItem
