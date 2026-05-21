import React, { useEffect, useMemo, useState } from 'react'
import { Card, CardBody, CardHeader, Form, FormGroup, Label, Input, Button, Row, Col, Badge } from 'reactstrap'
import { Icon } from '@iconify/react'
import { AllUserManagement, GetUser } from '@/redux/slice/UserManegement/UserManagementSlice'
import { useDispatch, useSelector } from 'react-redux'
import { getDecodedToken } from '@/utils/decodeJwt'

const UserInformation = () => {
  const [editing, setEditing] = useState(false)
  const dispatch = useDispatch()
  const { singleUser } = useSelector(AllUserManagement)
  // const tokenID = useMemo(() => getDecodedToken()?.sub || null, [])
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    phone: '',
    dob: '',
    TwoFactorEnabled: '',
  })

  // useEffect(() => {
  //   if (tokenID) {
  //     dispatch(GetUser(tokenID))
  //   }
  // }, [tokenID])

  useEffect(() => {
    if (singleUser) {
      setForm({
        firstName: singleUser.firstName || '',
        lastName: singleUser.lastName || '',
        email: singleUser.email || '',
        username: singleUser.userName || '',
        phone: singleUser.phoneNumber || '',
        dob: singleUser.dateOfBirth ? singleUser.dateOfBirth.split('T')[0] : '',
        TwoFactorEnabled: singleUser.twoFactorEnabled || '',
      })
    }
  }, [singleUser])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  return (
    <div>
      <div className="d-flex align-items-center gap-2 mb-4">
        <div className="bg-primary bg-opacity-10 text-primary rounded-3 p-2">
          <Icon icon="mdi:account-circle" width={22} />
        </div>
        <div>
          <h5 className="mb-0 fw-semibold custom-text">User Information</h5>
          <small className="text-muted">Manage your personal details</small>
        </div>
      </div>
      <Card className="border-0 rounded-3 mb-4 shadow-lg">
        <CardBody className="d-flex align-items-center gap-3 py-3">
          <div
            className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold"
            style={{ width: 60, height: 60, fontSize: 22 }}>
            {singleUser.firstName ? singleUser.firstName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div className="fw-semibold custom-text">
              {form.firstName} {form.lastName}
            </div>
            <div className="custom-text" style={{ fontSize: 13 }}>
              @{form.username}
            </div>
            <Badge color="success" className="mt-1" pill>
              Active
            </Badge>
          </div>
          <Button color="outline-primary" size="sm" className="ms-auto rounded-2">
            <Icon icon="mdi:camera" width={15} className="me-1" />
            Change Photo
          </Button>
        </CardBody>
      </Card>

      <Card className="shadow-lg rounded-3 border-0">
        <CardHeader className="bg-white border-bottom d-flex align-items-center justify-content-between py-3">
          <span className="fw-semibold custom-text" style={{ fontSize: 14 }}>
            Personal Details
          </span>
          <Button color={editing ? 'outline-secondary' : 'outline-primary'} size="sm" className="rounded-2" onClick={() => setEditing(!editing)}>
            <Icon icon={editing ? 'mdi:close' : 'mdi:pencil'} width={14} className="me-1" />
            {editing ? 'Cancel' : 'Edit'}
          </Button>
        </CardHeader>
        <CardBody className="p-4">
          <Form>
            <Row className="g-3">
              <Col md={6}>
                <FormGroup>
                  <Label className="fw-medium custom-text" style={{ fontSize: 12 }}>
                    USERNAME
                  </Label>
                  <Input
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    disabled={!editing}
                    className="rounded-2 custom-text"
                    style={{ backgroundColor: 'transparent' }}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className="fw-medium custom-text" style={{ fontSize: 12 }}>
                    EMAIL
                  </Label>
                  <Input
                    name="email"
                    style={{ backgroundColor: 'transparent' }}
                    value={form.email}
                    onChange={handleChange}
                    disabled={!editing}
                    className="rounded-2 custom-text"
                  />
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup>
                  <Label className="fw-medium custom-text" style={{ fontSize: 12 }}>
                    PHONE
                  </Label>
                  <Input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    disabled={!editing}
                    className="rounded-2 custom-text"
                    style={{ backgroundColor: 'transparent' }}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className="fw-medium custom-text" style={{ fontSize: 12 }}>
                    DATE OF BIRTH
                  </Label>
                  <Input
                    type="date"
                    name="dob"
                    value={form.dob}
                    onChange={handleChange}
                    disabled={!editing}
                    className="rounded-2 custom-text"
                    style={{ backgroundColor: 'transparent' }}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className="fw-medium custom-text" style={{ fontSize: 12 }}>
                    TwoFactorEnabled
                  </Label>
                  <Input
                    name="TwoFactorEnabled"
                    value={form.TwoFactorEnabled}
                    onChange={handleChange}
                    disabled={!editing}
                    className="rounded-2 custom-text"
                    style={{ backgroundColor: 'transparent' }}
                  />
                </FormGroup>
              </Col>
            </Row>
            {editing && (
              <div className="d-flex gap-2 mt-3">
                <Button color="primary" className="rounded-2 px-4">
                  <Icon icon="mdi:content-save" width={15} className="me-1" />
                  Save Changes
                </Button>
                <Button color="outline-secondary" className="rounded-2" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
              </div>
            )}
          </Form>
        </CardBody>
      </Card>
    </div>
  )
}

export default UserInformation
