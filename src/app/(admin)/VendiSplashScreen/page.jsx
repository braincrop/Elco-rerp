'use client'
import React, { useState, useMemo, useEffect } from 'react'
import { Table, Button, Container, Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label, Row, Col, Spinner } from 'reactstrap'
import { Icon } from '@iconify/react'
import {
  allVendiSplashMachine,
  DeleteVendiMachine,
  GetAllVendiMachine,
  PostVendiMachine,
  UpdatedVendiMachine,
} from '@/redux/slice/VendingSplashMachine/VendingSplashMachine'
import { useDispatch, useSelector } from 'react-redux'
import Select from 'react-select'
import { postVideo } from '../../../api/VideoApi/videoHelperApi'
import { allDevices, GetAllDevices } from '@/redux/slice/devicesSlice/DevicesSlice'
import Notify from '@/components/Notify'
import Link from 'next/link'

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: '#282f36', // black background
    borderColor: state.isFocused ? '#3a4551' : '#3a4551', // white border when focused
    boxShadow: 'none',
    '&:hover': {
      borderColor: '#3a4551',
    },
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: '#282f36', // black menu background
    color: '#fff',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#282f36' : state.isFocused ? '#282f36' : '#282f36',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#333',
    },
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: '#333', // selected option chip background
    color: '#fff',
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: '#fff',
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: '#fff',
    ':hover': {
      backgroundColor: '#ff0000', // red hover for remove
      color: 'white',
    },
  }),
}
const Page = () => {
  const dispatch = useDispatch()
  const { VendiMachine, loading } = useSelector(allVendiSplashMachine)
  const { devices } = useSelector(allDevices)
  const [search, setSearch] = useState('')
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [deleteModal, setDeleteModal] = useState(false)
  const [showUploadSuccess, setShowUploadSuccess] = useState(false)
  const [uploadingField, setUploadingField] = useState(null)
  const [VendiSplashMachine, setVendiSplashMachine] = useState({
    name: '',
    memo: '',
    path: '',
    starttime: '',
    endtime: '',
    vendronDeviceInfoIds: [],
  })

  useEffect(() => {
    dispatch(GetAllVendiMachine())
    dispatch(GetAllDevices())
  }, [])

  const openModal = (type, item = null) => {
    console.log('item', item)
    setModalType(type)
    if (type === 'edit' && item) {
      setVendiSplashMachine({
        name: item.name || '',
        id: item.vmSplashId,
        path: item.path || '',
        memo: item.memo || '',
        starttime: item.startTime || '',
        endtime: item.endTime || '',
        vendronDeviceInfoIds: item.vendronDeviceInfoIds || [],
      })
    } else {
      setVendiSplashMachine({
        name: '',
        path: '',
        memo: '',
        starttime: '',
        endtime: '',
        vendronDeviceInfoIds: '',
      })
    }
    setModalOpen(true)
  }
  const validateForm = () => {
    if (!VendiSplashMachine.name?.trim()) {
      Notify('error', 'Splash Screen name is required')
      return false
    }
    if (!VendiSplashMachine.starttime) {
      Notify('error', 'Start Time are required')
      return false
    }
    if (!VendiSplashMachine.endtime) {
      Notify('error', 'End Time are required')
      return false
    }
    const ids = VendiSplashMachine.vendronDeviceInfoIds
    if (!Array.isArray(ids) || ids.length === 0) {
      Notify('error', 'Assigned Device are required')
      return false
    }
    return true
  }
  const saveVendiScreen = async () => {
    if (!validateForm()) return
    if (modalType === 'create') {
      dispatch(PostVendiMachine(VendiSplashMachine)).unwrap()
      setModalOpen(false)
    }
    if (modalType === 'edit') {
      await dispatch(
        UpdatedVendiMachine({
          id: VendiSplashMachine.id,
          updatedData: {
            name: VendiSplashMachine.name,
            path: VendiSplashMachine.path,
            memo: VendiSplashMachine.memo,
            startTime: VendiSplashMachine.starttime,
            endTime: VendiSplashMachine.endtime,
            vendronDeviceInfoIds: VendiSplashMachine.vendronDeviceInfoIds,
          },
        }),
      ).unwrap()
      setModalOpen(false)
    }
  }

  const openDeleteModal = (index) => {
    setSelectedIndex(index)
    setDeleteModal(true)
  }
  const confirmDelete = async () => {
    try {
      await dispatch(DeleteVendiMachine(selectedIndex)).unwrap()
      setDeleteModal(false)
      console.log('Deleted successfully!')
    } catch (error) {
      console.error('Failed to delete:', error)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setVendiSplashMachine((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const uploadVideo = async (file, fieldName) => {
    try {
      setUploadingField(fieldName)
      const formData = new FormData()
      formData.append('file', file)
      const res = await postVideo(formData)
      setVendiSplashMachine((prev) => ({
        ...prev,
        [fieldName]: res?.data?.url,
      }))
      setShowUploadSuccess(true)
      setTimeout(() => {
        setShowUploadSuccess(false)
      }, 3000)
    } catch (err) {
      console.log('received-error', err)
      Notify('error', err?.message)
      console.error(err)
    } finally {
      setUploadingField(null)
    }
  }

  const handleImageChange = (e) => {
    const { name, files } = e.target
    if (files?.length) {
      uploadVideo(files[0], name)
    }
  }
  const isButtonDisabled = loading || uploadingField !== null
  // const filteredProducts = useMemo(() => {
  //   return VendiMachine.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
  // }, [search, VendiMachine])
  // const paginated = filteredProducts.slice(0, itemsPerPage)

  return (
    <Container className="mt-5">
      <Row className="mb-4 align-items-center">
        <Col xs="12" md="6" className="mb-2 mb-md-0">
          <div className="d-flex flex-column flex-sm-row gap-2">
            <Input type="text" placeholder="Search Machine..." value={search} onChange={(e) => setSearch(e.target.value)}  style={{backgroundColor:'transparent'}} className="custom-text"/>
            <Input type="select" value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))}  style={{backgroundColor:'transparent'}} className="custom-text">
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </Input>
          </div>
        </Col>
        <Col xs="12" md="6">
          <div className="d-flex flex-column flex-sm-row justify-content-center justify-content-md-end gap-2">
            <Button color="primary" onClick={() => openModal('create')}>
              <Icon icon="mdi:plus" width={18} className="me-2" />
              Create New
            </Button>
          </div>
        </Col>
      </Row>
      <Table bordered hover responsive className="shadow-sm rounded">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Memo</th>
            <th>Image Path</th>
            <th>Created On</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Assigned Devices</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={9} className="text-center mt-2">
                <Spinner size="sm" /> Loading...
              </td>
            </tr>
          ) : VendiMachine?.length > 0 ? (
            VendiMachine.map((item, index) => (
              <tr key={item.vmSplashId}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.memo}</td>
                <td>
                  <a href={item.path} target="_blank" rel="noopener noreferrer" className="text-primary fw-semibold text-decoration-underline">
                    View Video
                  </a>
                </td>
                <td>{new Date(item.createdOn).toLocaleString()}</td>
                <td>{new Date(item.startTime).toLocaleString()}</td>
                <td>{new Date(item.endTime).toLocaleString()}</td>
                <td>
                  {item.vendronDeviceInfoIds?.length > 0 ? (
                    <span className="badge bg-success">{item?.vendronDeviceInfoIds.join(', ')} Devices</span>
                  ) : (
                    <span className="badge bg-secondary">Not Assigned</span>
                  )}
                </td>
                <td className="text-center">
                  <div className="d-flex flex-column flex-sm-row justify-content-center gap-2">
                    <Button color="warning" size="sm" className="text-white w-md-auto" onClick={() => openModal('edit', item)}>
                      <Icon icon="mdi:pencil" width={16} />
                    </Button>
                    <Button color="danger" size="sm" className="text-white w-md-auto" onClick={() => openDeleteModal(item.vmSplashId)}>
                      <Icon icon="mdi:delete" width={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center text-muted py-4">
                No Splash Screen
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal isOpen={modalOpen} centered>
        <ModalHeader toggle={() => setModalOpen(!modalOpen)}>{modalType === 'create' ? 'Create Splash Screen' : 'Edit Splash Screen'}</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label>
              Name <span style={{ color: '#e57373' }}>*</span>
            </Label>
            <Input type="text" name="name" value={VendiSplashMachine.name || ''} onChange={handleInputChange} style={{backgroundColor:'transparent'}}/>
          </FormGroup>
          <FormGroup>
            <Label>Memo</Label>
            <Input type="text" name="memo" value={VendiSplashMachine.memo || ''} onChange={handleInputChange} style={{backgroundColor:'transparent'}}/>
          </FormGroup>
          <FormGroup>
            <Label>File</Label>
            <div className="position-relative">
              <Input type="file" name="path" onChange={handleImageChange} disabled={uploadingField === 'path'} style={{backgroundColor:'transparent'}}/>
              {uploadingField === 'path' && (
                <div
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                  }}>
                  <Spinner size="sm" />
                </div>
              )}
            </div>
            {showUploadSuccess && !uploadingField && <small className="text-success d-block mt-2">✔ Uploaded Successfully</small>}
          </FormGroup>

          <FormGroup>
            <Label>
              Start Time <span style={{ color: '#e57373' }}>*</span>
            </Label>
            <Input type="datetime-local" name="starttime" value={VendiSplashMachine.starttime || ''} onChange={handleInputChange} style={{backgroundColor:'transparent'}}/>
          </FormGroup>
          <FormGroup>
            <Label>
              End Time <span style={{ color: '#e57373' }}>*</span>
            </Label>
            <Input type="datetime-local" name="endtime" value={VendiSplashMachine.endtime || ''} onChange={handleInputChange} style={{backgroundColor:'transparent'}}/>
          </FormGroup>
          <FormGroup>
            <Label for="vendronDeviceInfoIds">
              Assigned Devices <span style={{ color: '#e57373' }}>*</span>
            </Label>
            <Select
              isMulti
              isSearchable={true}
              name="vendronDeviceInfoIds"
              options={devices?.map((device) => ({
                value: device.id,
                label: device.name,
              }))}
              value={devices
                .filter((device) => VendiSplashMachine?.vendronDeviceInfoIds.includes(device.id))
                .map((device) => ({ value: device.id, label: device.name }))}
              onChange={(selectedOptions) => {
                setVendiSplashMachine((prev) => ({
                  ...prev,
                  vendronDeviceInfoIds: selectedOptions.map((option) => option.value),
                }))
              }}
              styles={customStyles}
              classNamePrefix="select"
              placeholder="Select Devices"
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
          <Button color="primary" onClick={saveVendiScreen} disabled={isButtonDisabled}>
            {(loading || uploadingField) && <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />}
            {uploadingField ? 'Uploading...' : loading ? 'Saving...' : modalType === 'create' ? 'Create' : 'Save'}
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={deleteModal} centered>
        <ModalHeader>Delete Splash Screen</ModalHeader>
        <ModalBody>Are you sure you want to delete this Splash Screen?</ModalBody>
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
