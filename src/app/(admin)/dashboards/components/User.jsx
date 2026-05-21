import Image from 'next/image'
import React from 'react'
import avatar2 from '@/assets/images/users/avatar-2.jpg'
import avatar3 from '@/assets/images/users/avatar-3.jpg'
import avatar4 from '@/assets/images/users/avatar-4.jpg'
import avatar5 from '@/assets/images/users/avatar-5.jpg'
import avatar6 from '@/assets/images/users/avatar-6.jpg'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import Link from 'next/link'
import { Card, CardBody, CardTitle, Col, Row } from 'react-bootstrap'
import { currentYear } from '@/context/constants'
const User = () => {
  return (
    <>
      <Row className="g-4 mt-2">
        <Col xl={5}>
          <Card className="border-0 rounded-4" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}>
            {/* Header */}
            <CardBody className="">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-2">
                  <div
                    className="bg-primary bg-opacity-10 text-primary rounded-3 d-flex align-items-center justify-content-center"
                    >
                    <IconifyIcon icon="solar:users-group-rounded-outline" width={18} />
                  </div>
                  <div>
                    <h5 className="fw-bold mb-0">New Users</h5>
                    <p className="text-muted mb-0" style={{ fontSize: 11 }}>
                      Recently joined
                    </p>
                  </div>
                </div>
                <Link href="" className="btn btn-sm btn-primary rounded-3 d-flex align-items-center gap-1" style={{ fontSize: 12 }}>
                  <IconifyIcon icon="ic:sharp-plus" width={15} />
                  Add User
                </Link>
              </div>
              <hr className="mt-3 mb-0 opacity-10" />
            </CardBody>

            {/* Table */}
            <div className="table-responsive">
              <table className="table mb-0 align-middle">
                <thead>
                  <tr style={{ background: 'rgba(0,0,0,0.02)' }}>
                    {['Date', 'User', 'Status', 'Username'].map((h) => (
                      <th
                        key={h}
                        className="border-0 py-2 px-3 fw-semibold text-uppercase"
                        style={{ fontSize: 10, letterSpacing: '0.06em', color: '#9ca3af' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { date: `24 Apr`, img: avatar2, name: 'Dan Adrick', status: 'Verified', username: '@omions' },
                    { date: `24 Apr`, img: avatar3, name: 'Daniel Olsen', status: 'Verified', username: '@alliates' },
                    { date: `20 Apr`, img: avatar4, name: 'Jack Roldan', status: 'Pending', username: '@griys' },
                    { date: `18 Apr`, img: avatar5, name: 'Betty Cox', status: 'Verified', username: '@reffon' },
                    { date: `18 Apr`, img: avatar6, name: 'Carlos Johnson', status: 'Blocked', username: '@bebo' },
                  ].map((u, i) => {
                    const statusMap = {
                      Verified: { bg: 'rgba(25,135,84,0.1)', color: '#198754' },
                      Pending: { bg: 'rgba(255,193,7,0.1)', color: '#b45309' },
                      Blocked: { bg: 'rgba(220,53,69,0.1)', color: '#dc3545' },
                    }
                    const s = statusMap[u.status]
                    return (
                      <tr
                        key={i}
                        style={{ borderBottom: '0.5px solid rgba(0,0,0,0.05)', transition: 'background .12s' }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.02)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                        <td className="px-3 py-2" style={{ fontSize: 12, color: '#9ca3af', whiteSpace: 'nowrap' }}>
                          {u.date}
                        </td>
                        <td className="px-3 py-2">
                          <div className="d-flex align-items-center gap-2">
                            <Image src={u.img} alt={u.name} className="rounded-circle" style={{ width: 30, height: 30, objectFit: 'cover' }} />
                            <span className="fw-medium" style={{ fontSize: 13 }}>
                              {u.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <span className="rounded-pill px-2 py-1 fw-semibold" style={{ fontSize: 11, background: s.bg, color: s.color }}>
                            {u.status}
                          </span>
                        </td>
                        <td className="px-3 py-2" style={{ fontSize: 12, color: '#6c757d' }}>
                          {u.username}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div
              className="d-flex align-items-center justify-content-between px-3 py-3 border-top"
              style={{ borderColor: 'rgba(0,0,0,0.05) !important' }}>
              <span className="text-muted" style={{ fontSize: 12 }}>
                Showing <span className="fw-semibold text-dark">5</span> of <span className="fw-semibold text-dark">587</span>
              </span>
              <ul className="pagination pagination-sm m-0 gap-1">
                {[
                  { icon: 'tdesign:arrow-left', label: 'prev' },
                  { label: '1', active: true },
                  { label: '2' },
                  { label: '3' },
                  { icon: 'tdesign:arrow-right', label: 'next' },
                ].map((p, i) => (
                  <li key={i} className={`page-item ${p.active ? 'active' : ''}`}>
                    <Link
                      href=""
                      className="page-link rounded-2 border-0 d-flex align-items-center justify-content-center"
                      style={{ width: 28, height: 28, fontSize: 12, padding: 0 }}>
                      {p.icon ? <IconifyIcon icon={p.icon} width={13} /> : p.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </Col>

        {/* RECENT ORDERS */}
        <Col xl={7}>
          <Card className="border-0 rounded-4" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}>
            <CardBody className="">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-2">
                  <div
                    className="bg-warning bg-opacity-10 text-warning rounded-3 d-flex align-items-center justify-content-center"
                  >
                    <IconifyIcon icon="solar:bag-5-outline" width={18} />
                  </div>
                  <div>
                    <h5 className="fw-bold mb-0">Recent Orders</h5>
                    <p className="text-muted mb-0" style={{ fontSize: 11 }}>
                      Latest transactions
                    </p>
                  </div>
                </div>
                <Link href="" className="btn btn-sm btn-primary rounded-3 d-flex align-items-center gap-1" style={{ fontSize: 12 }}>
                  <IconifyIcon icon="ic:sharp-plus" width={15} />
                  Create Order
                </Link>
              </div>
              <hr className="mt-3 mb-0 opacity-10" />
            </CardBody>

            {/* Table */}
            <div className="table-responsive">
              <table className="table mb-0 align-middle">
                <thead>
                  <tr style={{ background: 'rgba(0,0,0,0.02)' }}>
                    {['Order ID', 'Date', 'Customer', 'Phone', 'Address', 'Payment', 'Status'].map((h) => (
                      <th
                        key={h}
                        className="border-0 py-2 px-3 fw-semibold text-uppercase"
                        style={{ fontSize: 10, letterSpacing: '0.06em', color: '#9ca3af', whiteSpace: 'nowrap' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      id: '#TZ5625',
                      date: '29 Apr',
                      name: 'Anna M. Hines',
                      phone: '(+1)-555-1564-261',
                      address: 'Burr Ridge, IL',
                      pay: 'Credit Card',
                      status: 'Completed',
                    },
                    {
                      id: '#TZ9652',
                      date: '25 Apr',
                      name: 'Judith H. Fritsche',
                      phone: '(+57)-305-5579-759',
                      address: 'Sullivan, KY',
                      pay: 'Credit Card',
                      status: 'Completed',
                    },
                    {
                      id: '#TZ5984',
                      date: '25 Apr',
                      name: 'Peter T. Smith',
                      phone: '(+33)-655-5187-93',
                      address: 'Yreka, CA',
                      pay: 'PayPal',
                      status: 'Completed',
                    },
                    {
                      id: '#TZ3625',
                      date: '21 Apr',
                      name: 'Emmanuel J. Delcid',
                      phone: '(+30)-693-5553-637',
                      address: 'Atlanta, GA',
                      pay: 'PayPal',
                      status: 'Processing',
                    },
                    {
                      id: '#TZ8652',
                      date: '18 Apr',
                      name: 'William J. Cook',
                      phone: '(+91)-855-5446-150',
                      address: 'Rosenberg, TX',
                      pay: 'Credit Card',
                      status: 'Processing',
                    },
                  ].map((o, i) => {
                    const statusMap = {
                      Completed: { bg: 'rgba(25,135,84,0.1)', color: '#198754', dot: '#198754' },
                      Processing: { bg: 'rgba(13,110,253,0.1)', color: '#0d6efd', dot: '#0d6efd' },
                    }
                    const s = statusMap[o.status]
                    return (
                      <tr
                        key={i}
                        style={{ borderBottom: '0.5px solid rgba(0,0,0,0.05)', transition: 'background .12s' }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.02)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                        <td className="px-3 py-2">
                          <span className="fw-semibold" style={{ fontSize: 12, color: '#0d6efd' }}>
                            {o.id}
                          </span>
                        </td>
                        <td className="px-3 py-2" style={{ fontSize: 12, color: '#9ca3af', whiteSpace: 'nowrap' }}>
                          {o.date}
                        </td>
                        <td className="px-3 py-2">
                          <span className="fw-medium" style={{ fontSize: 13 }}>
                            {o.name}
                          </span>
                        </td>
                        <td className="px-3 py-2" style={{ fontSize: 12, color: '#6c757d', whiteSpace: 'nowrap' }}>
                          {o.phone}
                        </td>
                        <td className="px-3 py-2" style={{ fontSize: 12, color: '#6c757d', whiteSpace: 'nowrap' }}>
                          {o.address}
                        </td>
                        <td className="px-3 py-2">
                          <span className="rounded-pill px-2 py-1" style={{ fontSize: 11, background: 'rgba(0,0,0,0.04)', color: '#6c757d' }}>
                            {o.pay === 'Credit Card' ? (
                              <>
                                <IconifyIcon icon="solar:card-outline" width={12} className="me-1" />
                                Credit
                              </>
                            ) : (
                              <>
                                <IconifyIcon icon="logos:paypal" width={12} className="me-1" />
                                PayPal
                              </>
                            )}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <span
                            className="rounded-pill px-2 py-1 fw-semibold d-flex align-items-center gap-1"
                            style={{ fontSize: 11, background: s.bg, color: s.color, width: 'fit-content' }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot, display: 'inline-block' }} />
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="d-flex align-items-center justify-content-between px-3 py-3 border-top">
              <span className="text-muted" style={{ fontSize: 12 }}>
                Showing <span className="fw-semibold text-dark">5</span> of <span className="fw-semibold text-dark">90,521</span>
              </span>
              <ul className="pagination pagination-sm m-0 gap-1">
                {[
                  { icon: 'tdesign:arrow-left', label: 'prev' },
                  { label: '1', active: true },
                  { label: '2' },
                  { label: '3' },
                  { icon: 'tdesign:arrow-right', label: 'next' },
                ].map((p, i) => (
                  <li key={i} className={`page-item ${p.active ? 'active' : ''}`}>
                    <Link
                      href=""
                      className="page-link rounded-2 border-0 d-flex align-items-center justify-content-center"
                      style={{ width: 28, height: 28, fontSize: 12, padding: 0 }}>
                      {p.icon ? <IconifyIcon icon={p.icon} width={13} /> : p.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </Col>
      </Row>
    </>
  )
}
export default User
