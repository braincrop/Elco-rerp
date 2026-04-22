'use client'
import React, { useState, useMemo } from 'react'
import { Table, Button, Container, Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label, Row, Col } from 'reactstrap'
import { Icon } from '@iconify/react'

const initialProducts = [
  {
    id: 1,
    branch: 'IB 23 - Baptist Hospital',
    username: 'Elizabeth',
    code: 'bghpqv',
    ReservedDate: '12/24/2023 9:33:54 PM',
    ventedDate: '12/24/2023 9:33:54 PM',
    vended: 'true',
    expire: 'notset',
  },
  {
    id: 2,
    branch: 'IB 11 - City Medical Center',
    username: 'Michael',
    code: 'xkqp92',
    ReservedDate: '01/05/2024 10:15:22 AM',
    ventedDate: '01/05/2024 10:18:40 AM',
    vended: 'false',
    expire: '01/20/2024',
  },
  {
    id: 3,
    branch: 'IB 45 - Green Valley Clinic',
    username: 'Samantha',
    code: 'plm873',
    ReservedDate: '02/10/2024 3:55:01 PM',
    ventedDate: '02/10/2024 4:02:15 PM',
    vended: 'true',
    expire: 'notset',
  },
  {
    id: 4,
    branch: 'IB 08 - Northside Health',
    username: 'Robert',
    code: 'qwe921',
    ReservedDate: '03/02/2024 1:12:09 PM',
    ventedDate: '03/02/2024 1:30:44 PM',
    vended: 'false',
    expire: '03/15/2024',
  },
  {
    id: 5,
    branch: 'IB 17 - Oakwood Hospital',
    username: 'Emily',
    code: 'zmn552',
    ReservedDate: '04/18/2024 8:45:19 AM',
    ventedDate: '04/18/2024 8:50:40 AM',
    vended: 'true',
    expire: 'notset',
  },
  {
    id: 6,
    branch: 'IB 33 - Riverside Medical',
    username: 'Daniel',
    code: 'tyu839',
    ReservedDate: '05/14/2024 6:22:33 PM',
    ventedDate: '05/14/2024 6:24:48 PM',
    vended: 'true',
    expire: 'notset',
  },
  {
    id: 7,
    branch: 'IB 29 - Highland Hospital',
    username: 'Sophia',
    code: 'vbd728',
    ReservedDate: '06/01/2024 9:10:11 AM',
    ventedDate: '06/01/2024 9:14:19 AM',
    vended: 'false',
    expire: '06/16/2024',
  },
  {
    id: 8,
    branch: 'IB 40 - Meadowbrook Clinic',
    username: 'James',
    code: 'wrk441',
    ReservedDate: '07/21/2024 11:53:21 AM',
    ventedDate: '07/21/2024 12:00:05 PM',
    vended: 'true',
    expire: 'notset',
  },
  {
    id: 9,
    branch: 'IB 56 - Hopewell Health Center',
    username: 'Ava',
    code: 'nch629',
    ReservedDate: '08/09/2024 4:19:58 PM',
    ventedDate: '08/09/2024 4:30:27 PM',
    vended: 'true',
    expire: 'notset',
  },
  {
    id: 10,
    branch: 'IB 72 - Lakeside Hospital',
    username: 'Benjamin',
    code: 'gkp188',
    ReservedDate: '09/12/2024 2:41:34 PM',
    ventedDate: '09/12/2024 2:50:49 PM',
    vended: 'false',
    expire: '09/25/2024',
  },
]

const Page = () => {
  const [products, setProducts] = useState(initialProducts)
  const [search, setSearch] = useState('')
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [vended, setVended] = useState('');
  const [deleteModal, setDeleteModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [viewData, setViewData] = useState(null);

  const openViewModal = (item) => {
    setViewData(item)
    setViewModal(true)
  }

  const openDeleteModal = (index) => {
    setSelectedIndex(index)
    setDeleteModal(true)
  }
  const confirmDelete = () => {
    const updated = products.filter((_, i) => i !== selectedIndex)
    setProducts(updated)
    setDeleteModal(false)
  }
  const filteredProducts = useMemo(() => {
    return products?.filter((p) => p.code.toLowerCase().includes(search.toLowerCase()))
  }, [search, products])

  const paginated = filteredProducts.slice(0, itemsPerPage)

  return (
    <Container className="mt-5">
      <Row className="mb-4 d-flex justify-content-between">
        <Col md="4" className="d-flex gap-2">
          <Col>
            <Input type="text" placeholder="Branch - User - code" value={search} onChange={(e) => setSearch(e.target.value)}  style={{backgroundColor:'transparent'}} className="custom-text"/>
          </Col>
          <Col>
            <Input type="select" value={vended} onChange={(e) => setVended(e.target.value)}  style={{backgroundColor:'transparent'}} className="custom-text">
              <option value="" disabled>
                --IsVended--
              </option>
              <option value="true">true</option>
              <option value="false">false</option>
            </Input>
          </Col>
        </Col>
        <Col md="2">
          <Input type="select" value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} style={{backgroundColor:'transparent'}} className="custom-text">
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </Input>
        </Col>
      </Row>
      <Table bordered hover responsive className="shadow-sm rounded">
        <thead>
          <tr>
            <th>#</th>
            <th>Branch</th>
            <th>Username</th>
            <th>Code</th>
            {/* <th>Product</th> */}
            <th>Reserved Date</th>
            <th>Vented Date</th>
            <th>Vended</th>
            <th>Expire</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginated?.length > 0 ? (
            paginated?.map((prod, index) => (
              <tr key={prod.id}>
                <td>{index + 1}</td>
                <td>{prod.branch}</td>
                <td>{prod.username}</td>
                <td>{prod.code}</td>
                {/* <td>{prod.product}</td> */}
                <td>{prod.ReservedDate}</td>
                <td>{prod.ventedDate}</td>
                <td>{prod.vended}</td>
                <td>{prod.expire}</td>
                <td className="text-center">
                  <Button color="info" size="sm" onClick={() => openViewModal(prod)} className='me-1'>
                    <Icon icon="mdi:eye" width={16} />
                  </Button>
                  <Button color="danger" size="sm" onClick={() => openDeleteModal(index)}>
                    <Icon icon="mdi:delete" width={16} />
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center text-muted py-4">
                No Reservation Found
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      <Modal isOpen={deleteModal} toggle={() => setDeleteModal(!deleteModal)} centered>
        <ModalHeader>Delete Reservation</ModalHeader>
        <ModalBody>Are you sure you want to delete this Reservation?</ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setDeleteModal(false)}>
            Cancel
          </Button>
          <Button color="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={viewModal} toggle={() => setViewModal(!viewModal)} centered>
        <ModalHeader toggle={() => setViewModal(false)}>Reservation Detail</ModalHeader>
        <ModalBody>
          {viewData && (
            <div>
              <p>
                <strong>Branch:</strong> {viewData.branch}
              </p>
              <p>
                <strong>Username:</strong> {viewData.username}
              </p>
              <p>
                <strong>Code:</strong> {viewData.code}
              </p>
              <p>
                <strong>Reserved Date:</strong> {viewData.ReservedDate}
              </p>
              <p>
                <strong>Vented Date:</strong> {viewData.ventedDate}
              </p>
              <p>
                <strong>Vended:</strong> {viewData.vended}
              </p>
              <p>
                <strong>Expire:</strong> {viewData.expire}
              </p>
            </div>
          )}
        </ModalBody>

        <ModalFooter>
          <Button color="secondary" onClick={() => setViewModal(false)}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  )
}

export default Page
