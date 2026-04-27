'use client'
import {
  allRestuarantItem,
  DeleteRestuarantItemData,
  GetRestuarantItem,
  PostRestuarantItemData,
  UpdateRestuarantItem,
} from '@/redux/slice/RestuarantItem/RestuarantItemSlice'
import { useEffect, useState } from 'react'
import { Container, Spinner, FormGroup } from 'react-bootstrap'
import { Icon } from '@iconify/react'
import { useDispatch, useSelector } from 'react-redux'
import { Table, Button, Input, Label, Modal, ModalFooter, ModalHeader, ModalBody } from 'reactstrap'
import { postImage } from '@/api/ImagesApi/imageHelperApi'
import { allProducts, GetAllProduct } from '@/redux/slice/Products/productSlice'
import Notify from '../Notify'

const ItemCategoryView = ({ data, onBack }) => {
  const dispatch = useDispatch()
  const { product } = useSelector(allProducts)
  const [deleteModal, setDeleteModal] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const { restuarantItem, loading } = useSelector(allRestuarantItem)
  const [modalType, setModalType] = useState('create')
  const [itemInput, setItemInput] = useState({
    barcode: '',
    name: '',
    buyPrice: 0,
    sellPrice: 0,
    distinctProductId: '',
    imagePath: '',
    itemSubCategoryIds: [data?.itemSubCategoryID],
  })
  const [modalOpen, setModalOpen] = useState(false)
  const [uploading, setUploading] = useState(false)

  console.log('restuarantItem',restuarantItem)

  useEffect(() => {
    if (data.itemSubCategoryID) {
      dispatch(GetRestuarantItem({
        ItemSubCategoryId: data.itemSubCategoryID,
      }))
    }
    dispatch(GetAllProduct())
  }, [])
  
  const isProductSelected = !!itemInput.distinctProductId
  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name === 'distinctProductId') {
      const selectedProduct = product.find((p) => p.dpid === Number(value))
      if (selectedProduct) {
        setItemInput((prev) => ({
          ...prev,
          distinctProductId: value,
          barcode: selectedProduct.barcode || '',
          name: selectedProduct.name || '',
          buyPrice: selectedProduct.basePrice || '',
          sellPrice: selectedProduct.sellPrice || '',
          imagePath: selectedProduct.imagePath || '',
        }))
      }
    } else {
      setItemInput((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const openModal = (type, item = null) => {
    console.log('edit-data', item)
    setModalType(type)
    if (type === 'edit' && item) {
      setItemInput({
        restaurantItemID: item.restaurantItemID || 0,
        barcode: item.barcode || '',
        name: item.name || '',
        buyPrice: item.buyPrice || 0,
        sellPrice: item.sellPrice || 0,
        distinctProductId: item.distinctProductId || 0,
        imagePath: item.imagePath || '',
        itemSubCategoryIds: item.itemSubCategoryID || data?.itemSubCategoryID,
      })
    } else {
      setItemInput({
        barcode: '',
        name: '',
        buyPrice: 0,
        sellPrice: 0,
        distinctProductId: 0,
        imagePath: '',
        itemSubCategoryIds: data?.itemSubCategoryID,
      })
    }
    setModalOpen(true)
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await postImage(formData)
      setItemInput((prev) => ({ ...prev, imagePath: res?.data.url }))
    } catch (error) {
      console.error(error)
      Notify('error', 'Image upload failed')
    } finally {
      setUploading(false)
    }
  }
  const saveItem = async () => {
    if (!itemInput.name.trim()) {
      return Notify('error', 'Item name is required')
    }
    try {
      const payload = {
        ...itemInput,
        itemSubCategoryIds: Array.isArray(itemInput.itemSubCategoryIds)
          ? itemInput.itemSubCategoryIds.map(Number)
          : [Number(itemInput.itemSubCategoryIds)],
      }
      const data = {
        restaurantItemID: itemInput.restaurantItemID,
        updatedData: payload,
      }
      if (modalType === 'edit') {
        await dispatch(UpdateRestuarantItem(data)).unwrap()
      } else {
        await dispatch(PostRestuarantItemData(payload)).unwrap()
      }
      setModalOpen(false)
    } catch (error) {
      console.error(error)
      Notify('error', 'Failed to save item')
    }
  }
  const openDeleteModal = (index) => {
    setSelectedIndex(index)
    setDeleteModal(true)
  }
  const confirmDelete = () => {
    console.log('index', selectedIndex)
    dispatch(DeleteRestuarantItemData(selectedIndex)).unwrap()
    setDeleteModal(false)
  }

  return (
    <Container>
      <div className="row align-items-center mb-4">
        <div className="col-12 col-md-6 mb-3 mb-md-0">
          <h2 className="fw-bold text-center text-md-start custom-text">Restuarant Item</h2>
        </div>
        <div className="col-12 col-md-6">
          <div className="d-flex flex-column flex-sm-row justify-content-center justify-content-md-end gap-2">
            <Button color="primary" onClick={() => openModal('create')}>
              <Icon icon="mdi:plus" width="16" height="16" className="me-1" />
              Create New
            </Button>
            <Button color="primary" onClick={() => onBack()}>
              <Icon icon="mdi:arrow-left" width="16" height="16" className="me-1" />
              Back to Category
            </Button>
          </div>
        </div>
      </div>
      <Table bordered hover responsive className="shadow-sm rounded">
        <thead className="table-light">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Barcode</th>
            <th>Buy Price</th>
            <th>Sell Price</th>
            <th>Is Perishable</th>
            <th>Is In Catalog</th>
            <th>Tax Category ID</th>
            <th>Image</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="9" className="text-center py-4">
                <Spinner size="sm" className="me-2" /> Loading items...
              </td>
            </tr>
          ) : restuarantItem?.length > 0 ? (
            restuarantItem?.map((item, index) => (
              <tr key={`${item.restaurantItemID}-${index}`}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.barcode}</td>
                <td>{item.buyPrice}</td>
                <td>{item.sellPrice}</td>
                <td>{item.isPerishable ? 'Yes' : 'No'}</td>
                <td>{item.isInCatalog ? 'Yes' : 'No'}</td>
                <td>{item.taxCategoryId ?? '-'}</td>
                <td>{item.imagePath ? <img src={item.imagePath} alt={item.name} width={50} height={50} className="rounded" /> : '-'}</td>
                <td>
                  <div className="d-flex flex-column flex-sm-row justify-content-center gap-2">
                    <Button color="warning" size="sm" className="w-sm-auto" onClick={() => openModal('edit', item)}>
                      <Icon icon="mdi:pencil" width="16" />
                    </Button>
                    <Button color="danger" size="sm" className="w-sm-auto" onClick={() => openDeleteModal(item.restaurantItemID)}>
                      <Icon icon="mdi:delete" width="16" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center text-muted py-4">
                No Records Found
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      <Modal isOpen={modalOpen} centered>
        <ModalHeader toggle={() => setModalOpen(false)}>{modalType === 'create' ? 'Create Item' : 'Edit Item'}</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label>Distinct Product</Label>
            <Input type="select" name="distinctProductId" value={itemInput.distinctProductId || ''} onChange={handleInputChange}>
              <option value="" disabled hidden>
                Select Product--
              </option>
              {product?.map((product) => (
                <option key={product.dpid} value={product.dpid}>
                  {product.name}
                </option>
              ))}
            </Input>
          </FormGroup>
          {isProductSelected && (
            <>
              <FormGroup>
                <Label>Barcode</Label>
                <Input name="barcode" value={itemInput.barcode} onChange={handleInputChange} />
              </FormGroup>

              <FormGroup>
                <Label>Name</Label>
                <Input name="name" value={itemInput.name} onChange={handleInputChange} />
              </FormGroup>

              <FormGroup>
                <Label>Buy Price</Label>
                <Input name="buyPrice" type="number" value={itemInput.buyPrice} onChange={handleInputChange} />
              </FormGroup>

              <FormGroup>
                <Label>Sell Price</Label>
                <Input name="sellPrice" type="number" value={itemInput.sellPrice} onChange={handleInputChange} />
              </FormGroup>

              <FormGroup>
                <Label>Image</Label>
                <Input type="file" onChange={handleImageUpload} />
                {uploading && <Spinner size="sm" className="ms-2" />}
                {itemInput.imagePath && <img src={itemInput.imagePath} alt="item" width={60} className="mt-2" />}
              </FormGroup>
            </>
          )}
        </ModalBody>

        <ModalFooter>
          <Button color="secondary" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
          <Button color="primary" onClick={saveItem} disabled={loading}>
             {loading && <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />}
            {modalType === 'create' ? 'Create' : 'Save'}
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={deleteModal} centered>
        <ModalHeader>Delete Item</ModalHeader>
        <ModalBody>Are you sure you want to delete this Restuarant Item?</ModalBody>
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

export default ItemCategoryView
