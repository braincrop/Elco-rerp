'use client'
import React, { useEffect, useState } from 'react'
import { Table, Button, Container, Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label, Spinner } from 'reactstrap'
import { Icon } from '@iconify/react'
import { useDispatch, useSelector } from 'react-redux'
import { allDevices, DeleteDeviceData, GetAllDevices, PostDevice, UpdatedDevice } from '@/redux/slice/devicesSlice/DevicesSlice'
import Notify from '@/components/Notify'

const Page = () => {
  const dispatch = useDispatch()
  const { devices, loading } = useSelector(allDevices)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState('')
  const [deleteid, setDeleteid] = useState('')
  const [deleteModal, setDeleteModal] = useState(false)
  const [DeviceInput, setDeviceInput] = useState({
    name: '',
    deviceName: '',
    ip: '',
    isActive: '',
    // isConnected: true,
  })

  useEffect(() => {
    dispatch(GetAllDevices())
  }, [])

  const openModal = (type, device = null) => {
    setModalType(type)
    if (type === 'edit' && device) {
      setDeviceInput({
        name: device.name || '',
        deviceName: device.deviceName || '',
        ip: device.ip || '',
        id: device.id,
        isActive: device.isActive,
        // isConnected: device.isConnected,
      })
    } else {
      setDeviceInput({
        name: '',
        deviceName: '',
        ip: '',
        isActive: '',
        // isConnected: true,
      })
    }
    setModalOpen(true)
  }

  const saveDevice = async () => {
    if (!DeviceInput.name?.trim()) {
      Notify('error', 'Device name is required')
      return
    }
    try {
      let resultAction
      if (modalType === 'create') {
        resultAction = await dispatch(PostDevice(DeviceInput))
        if (PostDevice.fulfilled.match(resultAction)) {
          await dispatch(GetAllDevices())
          setModalOpen(false)
        } else {
          Notify('error', resultAction.payload || 'Failed to create device')
        }
      } else if (modalType === 'edit') {
        resultAction = await dispatch(
          UpdatedDevice({
            id: DeviceInput.id,
            updatedData: {
              name: DeviceInput.name,
              deviceName: DeviceInput.deviceName,
              ip: DeviceInput.ip,
              isActive: DeviceInput.isActive,
              isConnected: DeviceInput.isConnected,
            },
          }),
        )
        if (UpdatedDevice.fulfilled.match(resultAction)) {
          await dispatch(GetAllDevices())
          setModalOpen(false)
        } else {
          Notify('error', resultAction.payload || 'Failed to update device')
        }
      }
    } catch (error) {
      console.error(error)
      Notify('error', 'Something went wrong')
    }
  }

 const handleInputChange = (e) => {
  const { name, value } = e.target;
  setDeviceInput((prev) => ({
    ...prev,
    [name]: name === 'isActive' ? value === 'true' : value,
  }));
};

  const opendeleteModal = (index) => {
    setDeleteid(index)
    setDeleteModal(true)
  }
  const deleteCategory = () => {
    dispatch(DeleteDeviceData(deleteid))
    setDeleteModal(false)
  }
  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold custom-text">Devices</h2>
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
            <th>Device Name</th>
            <th>IP Address</th>
            <th>isActive</th>
            <th>isConnected</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" className="text-center py-4">
                <Spinner size="sm" className="me-2" />
                Loading devices...
              </td>
            </tr>
          ) : devices?.length > 0 ? (
            devices.map((device, index) => (
              <tr key={device.id}>
                <td>{index + 1}</td>
                <td>{device.name}</td>
                <td>{device.deviceName}</td>
                <td>{device.ip}</td>
                <td>{device.isActive ? <span className="badge bg-success">Active</span> : <span className="badge bg-secondary">Inactive</span>}</td>
                <td>
                  {device.isConnected ? <span className="badge bg-success">Active</span> : <span className="badge bg-secondary">Inactive</span>}
                </td>
                <td className="text-center">
                  <div className="d-flex flex-column flex-sm-row justify-content-center gap-2">
                    <Button color="warning" size="sm" className="text-white w-md-auto" onClick={() => openModal('edit', device)}>
                      <Icon icon="mdi:pencil" width={16} />
                    </Button>
                    <Button color="danger" size="sm" className="text-white w-md-auto" onClick={() => opendeleteModal(device.id)}>
                      <Icon icon="mdi:delete" width={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center text-muted py-4">
                No Device Found
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      <Modal isOpen={modalOpen} centered>
        <ModalHeader toggle={() => setModalOpen(!modalOpen)}>{modalType === 'create' ? 'Create Device' : 'Edit Device'}</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label>
              Name <span style={{ color: '#e57373' }}>*</span>
            </Label>
            <Input name="name" value={DeviceInput?.name || ''} onChange={handleInputChange} />
          </FormGroup>
          <FormGroup>
            <Label>Device Name</Label>
            <Input name="deviceName" value={DeviceInput?.deviceName || ''} onChange={handleInputChange} />
          </FormGroup>
          <FormGroup>
            <Label>Ip</Label>
            <Input name="ip" value={DeviceInput?.ip || ''} onChange={handleInputChange} />
          </FormGroup>
          <FormGroup>
            <Label>Is Active</Label>
            <Input type="select" name="isActive" value={DeviceInput?.isActive ?? ''} onChange={handleInputChange}>
              <option value="">Select Status</option>
              <option value="true">True</option>
              <option value="false">False</option>
            </Input>
          </FormGroup>
          {/* <FormGroup>
            <Label>Is Connected</Label>
            <Input type="select" name="isConnected" value={DeviceInput?.isConnected ?? ''} onChange={handleInputChange}>
              <option value="">Select Status</option>
              <option value="true">True</option>
              <option value="false">False</option>
            </Input>
          </FormGroup> */}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
          <Button color="primary" onClick={saveDevice} disabled={loading}>
            {loading && <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />}
            {modalType === 'create' ? 'Create' : 'Save'}
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={deleteModal} toggle={() => setDeleteModal(!deleteModal)} centered>
        <ModalHeader toggle={() => setDeleteModal(!deleteModal)}>Delete Device</ModalHeader>
        <ModalBody>
          <p>Are you sure you want to delete this Device?</p>
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
