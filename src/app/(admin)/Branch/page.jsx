'use client'
import React, { useState, useMemo, useEffect } from 'react'
import { Table, Button, Container, Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label, Row, Col } from 'reactstrap'
import { Icon } from '@iconify/react'
import { useDispatch, useSelector } from 'react-redux'
import {
  allBranch,
  DeleteBranchData,
  GetAllBranch,
  PostAssignItemCategory,
  PostBranchData,
  PostItemCategoryBulk,
  UpdatedBranch,
} from '@/redux/slice/Branch/branchSlice'
import { Spinner } from 'react-bootstrap'
import { useRouter } from 'next/navigation';
import Select from 'react-select'
import { allCategories, GetAllCategory } from '@/redux/slice/categories/CategorySlice'
import Notify from '@/components/Notify'
import { AllBranch } from '@/api/branch/branchHelperApi'
import { allDevices, GetAllDevices } from '@/redux/slice/devicesSlice/DevicesSlice'

const customSelectStyles = {
  control: (base) => ({
    ...base,
    backgroundColor: '#000',
    borderColor: '#444',
    color: '#fff',
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: '#000',
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? '#333' : '#000',
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
  const router = useRouter()
  const { branch, loading } = useSelector(allBranch)
  const { category } = useSelector(allCategories)
  const { devices } = useSelector(allDevices)
  const dispatch = useDispatch()
  const [search, setSearch] = useState('')
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState('')
  const [itemCategoryBulkModal, setItemCategoryBulkModal] = useState(false)
  const [selectedDeviceId, setSelectedDeviceId] = useState(null)
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [assginBranchesModal, setAssignBranchesModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [BranchInput, setBranchInput] = useState({
    name: '',
    memo: '',
    companyId: '',
    outletAddress: '',
    vendronDeviceInfoId: '',
  })

  useEffect(() => {
    dispatch(GetAllBranch())
    dispatch(GetAllCategory())
    dispatch(GetAllDevices())
  }, [])

  const openItemCategoryBulkModal = (deviceId) => {
    setSelectedDeviceId(deviceId)
    setSelectedCategories([])
    setItemCategoryBulkModal(true)
  }

  const categoryOptions = category?.map((cat) => ({
    value: cat.dcid,
    label: cat.name,
  }))

  const Devices = devices?.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }))

  const openModal = (type, branch = null) => {
    setModalType(type)
    if (type === 'edit' && branch) {
      setBranchInput({
        name: branch.name || '',
        memo: branch.memo || '',
        companyId: branch.companyId || '',
        outletAddress: branch.outletAddress || '',
        branchId: branch.branchId,
        vendronDeviceInfoId: branch.vendronDeviceInfoId,
      })
    } else {
      setBranchInput({
        name: '',
        memo: '',
        companyId: '',
        outletAddress: '',
        vendronDeviceInfoId: '',
      })
    }
    setModalOpen(true)
  }

  const saveBranch = async () => {
    if (!BranchInput.name?.trim()) {
      Notify('error', 'Branch name is required')
      return
    }
    if (!BranchInput?.vendronDeviceInfoId) {
      Notify('error', 'Vendi Device Id is required')
      return
    }
    try {
      let resultAction
      if (modalType === 'create') {
        resultAction = await dispatch(
          PostBranchData({
            name: BranchInput.name,
            memo: BranchInput.memo,
            outletAddress: BranchInput.outletAddress,
            vendronDeviceInfoId: BranchInput.vendronDeviceInfoId,
          }),
        )
        if (PostBranchData.fulfilled.match(resultAction)) {
          setModalOpen(false)
        } else {
          Notify('error', resultAction.payload || 'Failed to create branch')
        }
      }
      if (modalType === 'edit') {
        resultAction = await dispatch(
          UpdatedBranch({
            branchId: BranchInput.branchId,
            updatedData: {
              name: BranchInput.name,
              memo: BranchInput.memo,
              outletAddress: BranchInput.outletAddress,
              vendronDeviceInfoId: BranchInput.vendronDeviceInfoId,
            },
          }),
        )
        if (UpdatedBranch.fulfilled.match(resultAction)) {
          setModalOpen(false)
        } else {
          Notify('error', resultAction.payload || 'Failed to update branch')
        }
      }
    } catch (error) {
      console.error(error)
      Notify('error', 'Something went wrong')
    }
  }
  const openDeleteModal = (index) => {
    setSelectedIndex(index)
    setDeleteModal(true)
  }

  const openAssignBranchesModal = (index) => {
    setSelectedIndex(index)
    setAssignBranchesModal(true)
  }
  const confirmDelete = () => {
    dispatch(DeleteBranchData(selectedIndex))
    setDeleteModal(false)
  }

  const AssignBranches = () => {
    dispatch(PostAssignItemCategory(selectedIndex)).unwrap()
    setAssignBranchesModal(false)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setBranchInput((prev) => ({ ...prev, [name]: value }))
  }

  const submitItemCategoryBulk = async () => {
    if (!selectedCategories.length) {
      Notify('error', 'Please select at least one category')
      return
    }
    const payload = {
      branchId: selectedDeviceId,
      distinctCategoryIds: selectedCategories.map((item) => item.value),
    }
    try {
      const result = await dispatch(PostItemCategoryBulk(payload))
      if (PostItemCategoryBulk.fulfilled.match(result)) {
        setItemCategoryBulkModal(false)
      } else {
        Notify('error', 'Assignment failed')
      }
    } catch (err) {
      Notify('error', 'Something went wrong')
    }
  }

  const handleSelectChange = (option, name) => {
    setBranchInput((prev) => ({
      ...prev,
      [name]: option?.value || '',
    }))
  }
  const handleCreateDevice = () => {
    router.push('/Devices/VendiDevice') 
  }
  // const filteredProducts = useMemo(() => {
  //   return branch.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
  // }, [search, branch])
  // const paginated = filteredProducts.slice(0, itemsPerPage)

  return (
    <Container className="mt-5">
      <Row className="mb-4 align-items-center g-2">
        <Col xs="12" sm="6" md="3" lg="2">
          <Input type="text" placeholder="Search branch..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </Col>
        <Col xs="12" sm="6" md="3" lg="2">
          <Input type="select" value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </Input>
        </Col>
        <Col lg="6"></Col>
        <Col xs="12" md="6" lg="2" className="self-end">
          <Button color="primary" className="w-100 w-md-auto" onClick={() => openModal('create')}>
            <Icon icon="mdi:plus" width={18} className="me-1" />
            Create New
          </Button>
        </Col>
      </Row>
      <Table bordered hover responsive className="shadow-sm rounded">
        <thead className="table-light align-middle">
          <tr>
            <th>#</th>
            <th>Branch Name</th>
            <th>Address</th>
            <th>Memo</th>
            <th>Mobile Ordering</th>
            <th>Revenue Center</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="7" className="text-center py-4">
                <Spinner size="sm" className="me-2" />
                Loading branches...
              </td>
            </tr>
          ) : branch?.length > 0 ? (
            branch.map((branch, index) => (
              <tr key={branch.branchId}>
                <td>{index + 1}</td>
                <td>{branch.name}</td>
                <td>{branch.outletAddress || '-'}</td>
                <td>{branch.memo || '-'}</td>
                <td>{branch.mobileOrdering === null ? '-' : branch.mobileOrdering ? 'Yes' : 'No'}</td>
                <td>{branch.revenueCenterId || '-'}</td>
                <td className="text-center">
                  <div className="d-flex flex-column flex-sm-row justify-content-center gap-2">
                    <Button
                      color="info"
                      size="sm"
                      title="Assign-Item"
                      className="me-1 w-sm-auto"
                      onClick={() => openItemCategoryBulkModal(branch.branchId)}>
                      <Icon icon="mdi:playlist-edit" width={16} />
                    </Button>
                    <Button
                      color="danger"
                      size="sm"
                      title="Assign-Branch"
                      className="me-1 w-sm-auto"
                      onClick={() => openAssignBranchesModal(branch.branchId)}>
                      <Icon icon="mdi:source-branch" width={16} />
                    </Button>
                    <Button color="warning" size="sm" title="Edit" className="me-1 w-sm-auto" onClick={() => openModal('edit', branch)}>
                      <Icon icon="mdi:pencil" width={16} />
                    </Button>
                    <Button color="danger" size="sm" title="Delete" className="me-1 w-sm-auto" onClick={() => openDeleteModal(branch.branchId)}>
                      <Icon icon="mdi:delete" width={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center text-muted py-4">
                No Branch Found
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal isOpen={modalOpen} centered>
        <ModalHeader toggle={() => setModalOpen(!modalOpen)}>{modalType === 'create' ? 'Create Branch' : 'Edit Branch'}</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label>
              Name <span style={{ color: '#e57373' }}>*</span>
            </Label>
            <Input name="name" value={BranchInput?.name || ''} onChange={handleInputChange} />
          </FormGroup>
          <FormGroup>
            <Label>
              Vendi Device ID <span style={{ color: '#e57373' }}>*</span>
            </Label>
            {!Devices?.length ? (
              <Select
                options={Devices}
                value={Devices.find((item) => item.value === BranchInput?.vendronDeviceInfoId)}
                onChange={(option) => handleSelectChange(option, 'vendronDeviceInfoId')}
                styles={customSelectStyles}
                placeholder="Select Vendi Device..."
              />
            ) : (
              <div className="alert alert-warning d-flex justify-content-between align-items-center">
                <span>No Vendi device found.</span>
                <button type="button" className="btn btn-sm btn-primary" onClick={handleCreateDevice}>
                  Create Device First
                </button>
              </div>
            )}
          </FormGroup>
          <FormGroup>
            <Label>Memo</Label>
            <Input name="memo" value={BranchInput?.memo || ''} onChange={handleInputChange} />
          </FormGroup>
          <FormGroup>
            <Label>CompanyId</Label>
            <Input name="companyId" type="number" value={BranchInput?.companyId || ''} onChange={handleInputChange} />
          </FormGroup>
          <FormGroup>
            <Label>OutletAddress</Label>
            <Input name="outletAddress" value={BranchInput?.outletAddress || ''} onChange={handleInputChange} />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
          <Button color="primary" onClick={saveBranch} disabled={loading}>
            {loading && <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />}
            {modalType === 'create' ? 'Create' : 'Save'}
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={deleteModal} centered>
        <ModalHeader>Delete Branch</ModalHeader>
        <ModalBody>Are you sure you want to delete this Branch?</ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setDeleteModal(false)}>
            Cancel
          </Button>
          <Button color="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={assginBranchesModal} centered toggle={() => setAssignBranchesModal(false)}>
        <ModalHeader toggle={() => setAssignBranchesModal(false)}>
          <Icon icon="mdi:source-branch" className="me-2" />
          Assign Branch
        </ModalHeader>
        <ModalBody className="text-center">
          <Icon icon="mdi:office-building-marker" width={48} className="mb-3 text-primary" />
          <h5 className="mb-2">Confirm Branch Assignment</h5>
          <p className="text-muted mb-0">Are you sure you want to assign this branch to the selected item?</p>
        </ModalBody>
        <ModalFooter className="justify-content-end">
          <Button color="secondary" outline onClick={() => setAssignBranchesModal(false)}>
            Cancel
          </Button>
          <Button color="primary" onClick={AssignBranches} disabled={loading}>
            {loading && <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />}
            <Icon icon="mdi:check-circle-outline" className="me-1" />
            Assign
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={itemCategoryBulkModal} centered toggle={() => setItemCategoryBulkModal(false)}>
        <ModalHeader toggle={() => setItemCategoryBulkModal(false)}>
          <Icon icon="mdi:playlist-edit" className="me-2" />
          Assign Item Categories (Bulk)
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label>Device ID</Label>
            <Input value={selectedDeviceId || ''} disabled />
          </FormGroup>
          <FormGroup>
            <Label>Item Categories</Label>
            <Select
              isMulti
              options={categoryOptions}
              value={selectedCategories}
              onChange={setSelectedCategories}
              styles={customSelectStyles}
              placeholder="Select categories..."
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" outline onClick={() => setItemCategoryBulkModal(false)}>
            Cancel
          </Button>
          <Button color="primary" onClick={submitItemCategoryBulk} disabled={loading}>
            {loading && <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />}
            <Icon icon="mdi:check-circle-outline" className="me-1" />
            Assign
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  )
}

export default Page
