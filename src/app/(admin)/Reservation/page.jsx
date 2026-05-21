'use client'
import React, { useState, useMemo } from 'react'
import DataTable from '@/components/ui/DataTable'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import RowDrawer from '@/components/ui/RowDrawer'
import SvgIcon from '@/components/ui/SvgIcon'
import Toolbar from '@/components/ui/Toolbar'
import Chip from '@/components/ui/Chip'

const initialProducts = [
  { id: 1, branch: 'IB 23 - Baptist Hospital', username: 'Elizabeth', code: 'bghpqv', ReservedDate: '12/24/2023 9:33:54 PM', ventedDate: '12/24/2023 9:33:54 PM', vended: 'true', expire: 'notset' },
  { id: 2, branch: 'IB 11 - City Medical Center', username: 'Michael', code: 'xkqp92', ReservedDate: '01/05/2024 10:15:22 AM', ventedDate: '01/05/2024 10:18:40 AM', vended: 'false', expire: '01/20/2024' },
  { id: 3, branch: 'IB 45 - Green Valley Clinic', username: 'Samantha', code: 'plm873', ReservedDate: '02/10/2024 3:55:01 PM', ventedDate: '02/10/2024 4:02:15 PM', vended: 'true', expire: 'notset' },
  { id: 4, branch: 'IB 08 - Northside Health', username: 'Robert', code: 'qwe921', ReservedDate: '03/02/2024 1:12:09 PM', ventedDate: '03/02/2024 1:30:44 PM', vended: 'false', expire: '03/15/2024' },
  { id: 5, branch: 'IB 17 - Oakwood Hospital', username: 'Emily', code: 'zmn552', ReservedDate: '04/18/2024 8:45:19 AM', ventedDate: '04/18/2024 8:50:40 AM', vended: 'true', expire: 'notset' },
  { id: 6, branch: 'IB 33 - Riverside Medical', username: 'Daniel', code: 'tyu839', ReservedDate: '05/14/2024 6:22:33 PM', ventedDate: '05/14/2024 6:24:48 PM', vended: 'true', expire: 'notset' },
  { id: 7, branch: 'IB 29 - Highland Hospital', username: 'Sophia', code: 'vbd728', ReservedDate: '06/01/2024 9:10:11 AM', ventedDate: '06/01/2024 9:14:19 AM', vended: 'false', expire: '06/16/2024' },
  { id: 8, branch: 'IB 40 - Meadowbrook Clinic', username: 'James', code: 'wrk441', ReservedDate: '07/21/2024 11:53:21 AM', ventedDate: '07/21/2024 12:00:05 PM', vended: 'true', expire: 'notset' },
  { id: 9, branch: 'IB 56 - Hopewell Health Center', username: 'Ava', code: 'nch629', ReservedDate: '08/09/2024 4:19:58 PM', ventedDate: '08/09/2024 4:30:27 PM', vended: 'true', expire: 'notset' },
  { id: 10, branch: 'IB 72 - Lakeside Hospital', username: 'Benjamin', code: 'gkp188', ReservedDate: '09/12/2024 2:41:34 PM', ventedDate: '09/12/2024 2:50:49 PM', vended: 'false', expire: '09/25/2024' },
]

const Page = () => {
  const [products, setProducts] = useState(initialProducts)
  const [search, setSearch] = useState('')
  const [vendedFilter, setVendedFilter] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [deleteModal, setDeleteModal] = useState(false)
  const [viewDrawer, setViewDrawer] = useState(false)
  const [viewData, setViewData] = useState(null)

  const openViewDrawer = (item) => {
    setViewData(item)
    setViewDrawer(true)
  }

  const openDeleteModal = (id) => {
    setSelectedIndex(id)
    setDeleteModal(true)
  }

  const confirmDelete = () => {
    setProducts((prev) => prev.filter((p) => p.id !== selectedIndex))
    setDeleteModal(false)
  }

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.code.toLowerCase().includes(search.toLowerCase()) ||
        p.branch.toLowerCase().includes(search.toLowerCase()) ||
        p.username.toLowerCase().includes(search.toLowerCase())
      const matchVended = vendedFilter === '' || p.vended === vendedFilter
      return matchSearch && matchVended
    })
  }, [search, vendedFilter, products])

  const columns = [
    { key: 'index', label: '#', render: (_, __, idx) => idx + 1, width: '50px' },
    { key: 'branch', label: 'Branch' },
    { key: 'username', label: 'Username' },
    { key: 'code', label: 'Code' },
    { key: 'ReservedDate', label: 'Reserved Date' },
    { key: 'ventedDate', label: 'Vented Date' },
    {
      key: 'vended',
      label: 'Vended',
      render: (val) => (
        <Badge variant={val === 'true' ? 'good' : 'bad'} dot>
          {val}
        </Badge>
      ),
    },
    { key: 'expire', label: 'Expire' },
    {
      key: 'actions',
      label: 'Actions',
      align: 'center',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <Button variant="ghost" size="sm" icon={<SvgIcon id="i-eye" />} onClick={() => openViewDrawer(row)} />
          <Button variant="danger-outline" size="sm" icon={<SvgIcon id="i-trash" />} onClick={() => openDeleteModal(row.id)} />
        </div>
      ),
    },
  ]

  return (
    <div className="page-content">
      <div className="page-head">
        <div>
          <h1 className="page-title">Reservations</h1>
          <p className="page-sub">View and manage reservations</p>
        </div>
      </div>

      <div className="card">
        <div className="card-pad">
          <Toolbar
            onSearch={setSearch}
            searchPlaceholder="Search by branch, username or code..."
            actions={null}
          >
            <Chip active={vendedFilter === ''} onClick={() => setVendedFilter('')}>All</Chip>
            <Chip active={vendedFilter === 'true'} onClick={() => setVendedFilter('true')}>Vended</Chip>
            <Chip active={vendedFilter === 'false'} onClick={() => setVendedFilter('false')}>Not Vended</Chip>
          </Toolbar>
          <DataTable
            columns={columns}
            data={filteredProducts}
            rowKey="id"
            emptyText="No Reservation Found"
          />
        </div>
      </div>

      <RowDrawer
        open={viewDrawer}
        onClose={() => setViewDrawer(false)}
        title="Reservation Detail"
        subtitle={viewData ? `Code: ${viewData.code}` : ''}
        footer={
          <Button variant="ghost" onClick={() => setViewDrawer(false)}>Close</Button>
        }
      >
        {viewData && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              ['Branch', viewData.branch],
              ['Username', viewData.username],
              ['Code', viewData.code],
              ['Reserved Date', viewData.ReservedDate],
              ['Vented Date', viewData.ventedDate],
              ['Vended', viewData.vended],
              ['Expire', viewData.expire],
            ].map(([label, value]) => (
              <div key={label} style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: 'var(--ink-3)', minWidth: '120px', fontWeight: 500 }}>{label}:</span>
                <span style={{ color: 'var(--ink)' }}>{value}</span>
              </div>
            ))}
          </div>
        )}
      </RowDrawer>

      <Modal
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Delete Reservation"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteModal(false)}>Cancel</Button>
            <Button variant="danger-outline" onClick={confirmDelete}>Delete</Button>
          </>
        }
      >
        <p style={{ color: 'var(--ink-2)' }}>Are you sure you want to delete this Reservation?</p>
      </Modal>
    </div>
  )
}

export default Page
