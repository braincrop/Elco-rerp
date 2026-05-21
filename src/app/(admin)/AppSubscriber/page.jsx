'use client'
import React, { useState, useMemo } from 'react'
import DataTable from '@/components/ui/DataTable'
import Toggle from '@/components/ui/Toggle'
import Toolbar from '@/components/ui/Toolbar'

const initialProducts = [
  { id: 1, firstname: 'Oscar', lastname: 'Ruiz', birthday: '01/01/2023', email: 'Oscar@ruiz', phonenumber: '1234567890', zipcode: '12345', isSubscriber: 'true' },
  { id: 2, firstname: 'Emily', lastname: 'Johnson', birthday: '02/15/2022', email: 'emily.johnson@example.com', phonenumber: '9876543210', zipcode: '90210', isSubscriber: 'false' },
  { id: 3, firstname: 'Liam', lastname: 'Williams', birthday: '03/10/2021', email: 'liam.williams@mail.com', phonenumber: '5553331199', zipcode: '33101', isSubscriber: 'true' },
  { id: 4, firstname: 'Ava', lastname: 'Brown', birthday: '11/25/2020', email: 'ava.brown@domain.com', phonenumber: '4422109988', zipcode: '44011', isSubscriber: 'false' },
  { id: 5, firstname: 'Noah', lastname: 'Davis', birthday: '09/18/2019', email: 'noah.davis@mail.com', phonenumber: '2233445566', zipcode: '77001', isSubscriber: 'true' },
  { id: 6, firstname: 'Sophia', lastname: 'Miller', birthday: '07/30/2022', email: 'sophia.miller@example.com', phonenumber: '6677889900', zipcode: '60601', isSubscriber: 'false' },
  { id: 7, firstname: 'James', lastname: 'Wilson', birthday: '04/09/2020', email: 'james.wilson@company.com', phonenumber: '1122334455', zipcode: '30301', isSubscriber: 'true' },
  { id: 8, firstname: 'Mia', lastname: 'Moore', birthday: '08/11/2021', email: 'mia.moore@mail.com', phonenumber: '7788990011', zipcode: '21201', isSubscriber: 'false' },
  { id: 9, firstname: 'Benjamin', lastname: 'Taylor', birthday: '05/04/2018', email: 'ben.taylor@example.com', phonenumber: '4433221100', zipcode: '85001', isSubscriber: 'true' },
  { id: 10, firstname: 'Charlotte', lastname: 'Anderson', birthday: '12/14/2022', email: 'charlotte.anderson@mail.com', phonenumber: '5566778899', zipcode: '10001', isSubscriber: 'false' },
]

const Page = () => {
  const [products, setProducts] = useState(initialProducts)
  const [search, setSearch] = useState('')

  const filteredProducts = useMemo(() => {
    return products.filter((p) => p.email.toLowerCase().includes(search.toLowerCase()))
  }, [search, products])

  const columns = [
    { key: 'index', label: '#', render: (_, __, idx) => idx + 1, width: '50px' },
    { key: 'firstname', label: 'First Name' },
    { key: 'lastname', label: 'Last Name' },
    { key: 'birthday', label: 'Birthday' },
    { key: 'email', label: 'Email' },
    { key: 'phonenumber', label: 'Phone Number' },
    { key: 'zipcode', label: 'Zip Code' },
    {
      key: 'isSubscriber',
      label: 'Is Subscriber',
      align: 'center',
      render: (val) => (
        <Toggle
          checked={val === 'true'}
          onChange={() => {}}
        />
      ),
    },
  ]

  return (
    <div className="page-content">
      <div className="page-head">
        <div>
          <h1 className="page-title">App Subscribers</h1>
          <p className="page-sub">View all app subscribers</p>
        </div>
      </div>

      <div className="card">
        <div className="card-pad">
          <Toolbar onSearch={setSearch} searchPlaceholder="Search by email..." />
          <DataTable
            columns={columns}
            data={filteredProducts}
            rowKey="id"
            emptyText="No Subscriber Found"
          />
        </div>
      </div>
    </div>
  )
}

export default Page
