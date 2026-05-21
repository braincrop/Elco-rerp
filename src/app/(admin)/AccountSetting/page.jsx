'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { Row, Col, Card, CardBody, Badge } from 'reactstrap'
import { Icon } from '@iconify/react'
import UserInformation from './components/UserInformation'
import ResetPassword from './components/ResetPassword'
import SetAuthenticator from './components/SetAuthenticator'
import { getDecodedToken } from '../../../utils/decodeJwt'
import { useDispatch, useSelector } from 'react-redux'
import { Spinner } from 'reactstrap';
import { AllUserManagement, GetUser } from '@/redux/slice/UserManegement/UserManagementSlice'

const menuItems = [
  {
    id: 'user-info',
    label: 'User Information',
    icon: 'mdi:account-circle-outline',
    description: 'Name, phone, address',
    color: 'primary',
    component: <UserInformation />,
  },
  {
    id: 'reset-password',
    label: 'Reset Password',
    icon: 'mdi:lock-reset',
    description: 'Change your password',
    color: 'warning',
    component: <ResetPassword />,
  },
  {
    id: 'authenticator',
    label: 'Set Authenticator',
    icon: 'mdi:shield-check-outline',
    description: 'Two-factor authentication',
    color: 'success',
    badge: '2FA',
    component: <SetAuthenticator />,
  },
]

const SettingsPage = () => {
  const { singleUser,loading } = useSelector(AllUserManagement)
  const [active, setActive] = useState('user-info')
  const current = menuItems.find((m) => m.id === active)
  const dispatch = useDispatch();
  const tokenID = useMemo(() => getDecodedToken()?.sub || null, [])

 useEffect(() => {
    if (tokenID) {
      dispatch(GetUser(tokenID))
    }
  }, [tokenID])

   if (loading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
        <Spinner style={{ width: 56, height: 56, borderWidth: 3, color: '#0d6efd' }} />
        <h6 className="fw-semibold mt-4 mb-1">Loading your settings</h6>
        <p className="text-muted mb-0" style={{ fontSize: 13 }}>Please wait…</p>
      </div>
    )
  }
  if (!tokenID) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
        <Icon icon="mdi:alert-circle-outline" width={48} className="text-danger mb-3" />
        <h6 className="fw-semibold mb-1">Session Expired</h6>
        <p className="text-muted mb-0" style={{ fontSize: 13 }}>Please login again.</p>
      </div>
    )
    }

  return (
    <div className="container-fluid py-4 px-3 px-md-4 ">
      <div className="mb-4">
        <h4 className="fw-semibold mb-1 custom-text">Account Settings</h4>
        <p className="text-muted mb-0 " style={{ fontSize: 14 }}>
          Manage your account preferences and security settings
        </p>
      </div>

      <Row className="g-4 ">
        <Col xs={12} md={4} lg={3}>
          <Card className="border-0 shadow-sm rounded-3 mb-3">
            <CardBody className="text-center py-4">
              <div
                className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold mx-auto mb-3"
                style={{ width: 64, height: 64, fontSize: 24 }}>
                {singleUser.firstName ? singleUser.firstName.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="fw-semibold mb-1 custom-text">{singleUser.userName || 'Unknown User'}</div>
              <div className="text-muted mb-2" style={{ fontSize: 13 }}>
                {singleUser.email || 'No email provided'}
              </div>
              <Badge color="success" pill>
                Active Account
              </Badge>
            </CardBody>
          </Card>

          <Card className="shadow-lg rounded-3 border-0 shadow-sm overflow-hidden">
            <CardBody className="p-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActive(item.id)}
                  className={`w-100 border-0 rounded-2 text-start d-flex align-items-center gap-3 px-3 py-2 mb-1 ${
                    active === item.id ? `bg-${item.color} bg-opacity-10` : 'bg-transparent'
                  }`}
                  style={{ transition: 'background .15s', cursor: 'pointer' }}>
                  <div
                    className={`rounded-2 d-flex align-items-center justify-content-center flex-shrink-0 ${
                      active === item.id ? `bg-${item.color} bg-opacity-25 text-${item.color}` : 'bg-light text-muted'
                    }`}
                    style={{ width: 34, height: 34 }}>
                    <Icon icon={item.icon} width={18} />
                  </div>
                  <div className="flex-grow-1 min-width-0">
                    <div className={`fw-medium ${active === item.id ? `text-${item.color}` : 'text-dark'}`} style={{ fontSize: 13 }}>
                      {item.label}
                    </div>
                    <div className="text-muted text-truncate" style={{ fontSize: 11 }}>
                      {item.description}
                    </div>
                  </div>
                  {item.badge && (
                    <Badge color={item.color} pill style={{ fontSize: 10 }}>
                      {item.badge}
                    </Badge>
                  )}
                  {active === item.id && <Icon icon="mdi:chevron-right" width={16} className={`text-${item.color} flex-shrink-0`} />}
                </button>
              ))}
            </CardBody>
          </Card>
        </Col>

        {/* RIGHT CONTENT */}
        <Col xs={12} md={8} lg={9}>
          {current?.component}
        </Col>
      </Row>
    </div>
  )
}

export default SettingsPage
