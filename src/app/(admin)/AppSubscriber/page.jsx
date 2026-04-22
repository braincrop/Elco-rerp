'use client'
import React, { useState, useMemo } from 'react'
import { Table, Button, Container, Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label, Row, Col } from 'reactstrap'
import { Icon } from '@iconify/react'

const initialProducts = [
  {
    id: 1,
    firstname: 'Oscar',
    lastname: 'Ruiz',
    birthday: '01/01/2023',
    email: 'Oscar@ruiz',
    phonenumber: '1234567890',
    zipcode: '12345',
    isSubscriber: 'true',
  },
  {
    id: 2,
    firstname: 'Emily',
    lastname: 'Johnson',
    birthday: '02/15/2022',
    email: 'emily.johnson@example.com',
    phonenumber: '9876543210',
    zipcode: '90210',
    isSubscriber: 'false',
  },
  {
    id: 3,
    firstname: 'Liam',
    lastname: 'Williams',
    birthday: '03/10/2021',
    email: 'liam.williams@mail.com',
    phonenumber: '5553331199',
    zipcode: '33101',
    isSubscriber: 'true',
  },
  {
    id: 4,
    firstname: 'Ava',
    lastname: 'Brown',
    birthday: '11/25/2020',
    email: 'ava.brown@domain.com',
    phonenumber: '4422109988',
    zipcode: '44011',
    isSubscriber: 'false',
  },
  {
    id: 5,
    firstname: 'Noah',
    lastname: 'Davis',
    birthday: '09/18/2019',
    email: 'noah.davis@mail.com',
    phonenumber: '2233445566',
    zipcode: '77001',
    isSubscriber: 'true',
  },
  {
    id: 6,
    firstname: 'Sophia',
    lastname: 'Miller',
    birthday: '07/30/2022',
    email: 'sophia.miller@example.com',
    phonenumber: '6677889900',
    zipcode: '60601',
    isSubscriber: 'false',
  },
  {
    id: 7,
    firstname: 'James',
    lastname: 'Wilson',
    birthday: '04/09/2020',
    email: 'james.wilson@company.com',
    phonenumber: '1122334455',
    zipcode: '30301',
    isSubscriber: 'true',
  },
  {
    id: 8,
    firstname: 'Mia',
    lastname: 'Moore',
    birthday: '08/11/2021',
    email: 'mia.moore@mail.com',
    phonenumber: '7788990011',
    zipcode: '21201',
    isSubscriber: 'false',
  },
  {
    id: 9,
    firstname: 'Benjamin',
    lastname: 'Taylor',
    birthday: '05/04/2018',
    email: 'ben.taylor@example.com',
    phonenumber: '4433221100',
    zipcode: '85001',
    isSubscriber: 'true',
  },
  {
    id: 10,
    firstname: 'Charlotte',
    lastname: 'Anderson',
    birthday: '12/14/2022',
    email: 'charlotte.anderson@mail.com',
    phonenumber: '5566778899',
    zipcode: '10001',
    isSubscriber: 'false',
  },
]

const Page = () => {
  const [products, setProducts] = useState(initialProducts)
  const [search, setSearch] = useState('')
  const [itemsPerPage, setItemsPerPage] = useState(5)

  const filteredProducts = useMemo(() => {
    return products.filter((p) => p.email.toLowerCase().includes(search.toLowerCase()))
  }, [search, products])
  const paginated = filteredProducts.slice(0, itemsPerPage)

  return (
    <Container className="mt-5">
      <Row className="mb-4">
        <Col md="2">
          <Input type="text" placeholder="Search Email" value={search} onChange={(e) => setSearch(e.target.value)}  style={{backgroundColor:'transparent'}} className="custom-text"/>
        </Col>
        <Col md="2">
          <Input type="select" value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))}  style={{backgroundColor:'transparent'}} className="custom-text">
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </Input>
        </Col>
        <Col md="8" className="text-end">
          <Button color="primary" onClick={() => openModal('create')}>
            <Icon icon="mdi:plus" width={18} className="me-2" />
            Create New
          </Button>
        </Col>
      </Row>
      <Table bordered hover responsive className="shadow-sm rounded">
        <thead className="">
          <tr>
            <th>#</th>
            <th>FirstName</th>
            <th>LastName</th>
            <th>BirthDay</th>
            <th>Email</th>
            <th>PhoneNumber</th>
            <th>ZipCode</th>
            <th>Is Subscriber</th>
          </tr>
        </thead>

        <tbody>
          {paginated.length > 0 ? (
            paginated.map((prod, index) => (
              <tr key={prod.id}>
                <td>{index + 1}</td>
                <td>{prod.firstname}</td>
                <td>{prod.lastname}</td>
                <td>{prod.birthday}</td>
                <td>{prod.email}</td>
                <td>{prod.phonenumber}</td>
                <td>{prod.zipcode}</td>
                <td className="text-center">
                  <FormGroup switch>
                    <Input
                      type="switch"
                      id={`subscriberSwitch-${prod.id}`}
                    //   onChange={() => handleToggle(prod.id)} 
                    />
                    
                  </FormGroup>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center text-muted py-4">
                No Subscriber Found
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  )
}

export default Page
