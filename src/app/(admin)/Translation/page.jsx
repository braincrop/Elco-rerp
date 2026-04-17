'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Table, Button, Container, Modal, ModalHeader, ModalBody, ModalFooter, Spinner, FormGroup, Label } from 'reactstrap'
import { Icon } from '@iconify/react'
import CreateLanguage from '../../../components/CreateLanguage/createLanguage'
import Select from 'react-select'
import { allTranslation, AssignTranslationToBranch, Translation, TranslationDelete } from '@/redux/slice/Translation/TranslationSlice'
import { allBranch, GetAllBranch } from '@/redux/slice/Branch/branchSlice'

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
  const dispatch = useDispatch()
  const { translation, loading } = useSelector(allTranslation)
  const { branch } = useSelector(allBranch)
  const [view, setView] = useState('list')
  const [mode, setMode] = useState('create')
  const [selectedUser, setSelectedUser] = useState(null)
  const [deleteModal, setDeleteModal] = useState(false)
  const [AssignModal, setAssignModal] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [assignBranches, setassignBranches] = useState([])
  const [assignVal, setAssignVal] = useState()

  useEffect(() => {
    dispatch(Translation())
    dispatch(GetAllBranch())
  }, [])

  const Branches = branch?.map((cat) => ({
    value: cat.branchId,
    label: cat.name,
  }))

  const openCreate = () => {
    setMode('create')
    setSelectedUser(null)
    setView('form')
  }
  const backToList = () => {
    setView('list')
    setSelectedUser(null)
    dispatch(Translation())
  }
  const openEdit = (user) => {
    setMode('edit')
    setSelectedUser(user)
    setView('form')
  }

  const openDelete = (id) => {
    setDeleteId(id)
    setDeleteModal(true)
  }
  const openAssignModal = (index) => {
    setAssignModal(true)
    setAssignVal(index)
  }
  const confirmDelete = async () => {
    await dispatch(TranslationDelete(deleteId)).unwrap()
    setDeleteModal(false)
  }
  const handleAssignTranslation = () => {
    const data = {
      translationId: assignVal,
      branchIds: assignBranches
    }
    dispatch(AssignTranslationToBranch(data)).unwrap()
    setAssignModal(false)
  }

  return (
    <Container className="mt-5">
      {view === 'list' && (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold">Translation</h2>
            <Button color="primary" onClick={openCreate}>
              Add New
            </Button>
          </div>
          <Table bordered responsive>
            <thead>
              <tr>
                <th>Language Name</th>
                <th>Language Code</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    <Spinner size="sm" className="me-2" />
                    Loading language...
                  </td>
                </tr>
              ) : translation?.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">
                    No Data Found
                  </td>
                </tr>
              ) : (
                translation?.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name || '-'}</td>
                    <td>{item.lang || '-'}</td>
                    <td>
                      <div className="d-flex flex-column flex-sm-row justify-content-center gap-2">
                        <Button
                          size="sm"
                          color="info"
                          className="me-1 w-sm-auto"
                          onClick={() => openAssignModal(item.translationId)}
                          title="Assign Branches">
                          <Icon icon="mdi:account-key" />
                        </Button>
                        <Button size="sm" color="warning" className="me-1 w-sm-auto" onClick={() => openEdit(item)}>
                          <Icon icon="mdi:pencil" />
                        </Button>
                        <Button size="sm" color="danger" className="me-1 w-sm-auto" onClick={() => openDelete(item.lang)}>
                          <Icon icon="mdi:delete" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </>
      )}
      {view === 'form' && <CreateLanguage mode={mode} initialData={selectedUser} onBack={backToList} />}
      <Modal isOpen={deleteModal} toggle={() => setDeleteModal(false)} centered>
        <ModalHeader>Delete User</ModalHeader>
        <ModalBody>Are you sure?</ModalBody>
        <ModalFooter>
          <Button onClick={() => setDeleteModal(false)}>Cancel</Button>
          <Button color="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={AssignModal} centered toggle={() => setAssignModal(false)}>
        <ModalHeader toggle={() => setAssignModal(false)}>
          <Icon icon="mdi:playlist-edit" className="me-2" />
          Assign Branches
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label>Available Branches</Label>
            <Select
              isMulti
              options={Branches}
              value={Branches?.filter((option) => (assignBranches || []).some((v) => String(v) === String(option.value)))}
              onChange={(selectedOptions) => setassignBranches(selectedOptions ? selectedOptions.map((o) => o.value) : [])}
              styles={customSelectStyles}
              placeholder="Select Branches..."
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" outline onClick={() => setAssignModal(false)}>
            Cancel
          </Button>
          <Button color="primary" disabled={loading} onClick={handleAssignTranslation}>
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
