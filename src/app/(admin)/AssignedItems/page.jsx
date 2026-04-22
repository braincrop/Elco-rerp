'use client'
import React, { useState, useMemo, useEffect } from 'react'
import { Table, Button, Container, Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label, Row, Col } from 'reactstrap'
import { Icon } from '@iconify/react'
import { allBranch, GetAllBranch } from '@/redux/slice/Branch/branchSlice'
import { useDispatch, useSelector } from 'react-redux'
import { allItemCategory, GetItemCategory } from '@/redux/slice/ItemCategory/ItemCategorySlice'
import { Spinner } from 'react-bootstrap'
import ItemCategoryView from '../../../components/ItemCategoryView/ItemCategoryView'
import CreateRestuarantItem from '../../../components/CreateRestuarantItem/CreateRestuarantItem'

const Page = () => {
  const dispatch = useDispatch()
  const { itemCat, loading } = useSelector(allItemCategory)
  const { branch } = useSelector(allBranch)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [selectedBranchId, setSelectedBranchId] = useState(null)
  const [isViewMode, setIsViewMode] = useState(false)
  const [isitemCreate, setIsItemCreate] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const itemSubCategories = itemCat || []

  useEffect(() => {
    dispatch(GetAllBranch())
  }, [])

  useEffect(() => {
    if (selectedBranchId) {
      dispatch(GetItemCategory({ BranchId: selectedBranchId }))
    }
  }, [selectedBranchId])

  const handleBranchChange = (id) => {
    setSelectedBranchId(id)
  }

  const handleView = (item) => {
    setSelectedCategory(item)
    setIsViewMode(true)
  }
  const handleBack = () => {
    setIsViewMode(false)
    if (selectedBranchId) {
      dispatch(GetItemCategory({ BranchId: selectedBranchId }))
    }
  }

  const handleItem = () => {
    setIsItemCreate(false)
  }

  return (
    <Container className="mt-5">
      {isitemCreate && <CreateRestuarantItem handleItem={handleItem} onBack={() => setIsItemCreate(false)} />}
      {!isitemCreate && isViewMode && <ItemCategoryView data={selectedCategory} onBack={handleBack} />}
      {!isitemCreate && !isViewMode && (
        <>
          <Row className="mb-4 align-items-center">
            <Col md="2" sm="6" className="mb-2 mb-md-0">
              <Input type="select" value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} style={{backgroundColor:'transparent'}} className="custom-text">
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </Input>
            </Col>
            <Col md="3" sm="6" className="mb-2 mb-md-0">
              <Input type="select" value={selectedBranchId || ''} onChange={(e) => handleBranchChange(Number(e.target.value))} style={{backgroundColor:'transparent'}} className="custom-text">
                <option value="" disabled>
                  Select branch...
                </option>
                {branch?.map((b) => (
                  <option key={b.branchId} value={b.branchId}>
                    {b.name}
                  </option>
                ))}
              </Input>
            </Col>
            <Col md="7" className="text-end">
              <Button color="primary" onClick={() => setIsItemCreate(true)}>
                <Icon icon="mdi:plus" width={18} className="me-1" />
                Create Item
              </Button>
            </Col>
          </Row>
          <Table bordered hover responsive className="shadow-sm rounded">
            <thead>
              <tr>
                <th>#</th>
                <th>Category Name</th>
                <th>Category ID</th>
                <th>Sub Category ID</th>
                <th>Comments</th>
                <th>Image</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!selectedBranchId ? (
                <tr>
                  <td colSpan="7" className="text-center text-warning py-4">
                    ⚠️ Please select a branch first
                  </td>
                </tr>
              ) : loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    <Spinner size="sm" className="me-2" />
                    Loading categories...
                  </td>
                </tr>
              ) : itemSubCategories?.length > 0 ? (
                itemSubCategories.map((item, index) => (
                  <tr key={item.itemSubCategoryID}>
                    <td>{index + 1}</td>
                    <td>{item.categoryName}</td>
                    <td>{item.itemCategoryId}</td>
                    <td>{item.itemSubCategoryID}</td>
                    <td>{item.comments ?? '-'}</td>
                    <td>{item.imagePath ? <img src={item.imagePath} width={40} className="rounded" /> : '-'}</td>
                    <td className="text-center">
                      <Button color="info" size="sm" onClick={() => handleView(item)}>
                        <Icon icon="mdi:eye" width={16} />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-4">
                    No Item Categories Found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </>
      )}
    </Container>
  )
}

export default Page
