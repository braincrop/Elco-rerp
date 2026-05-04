'use client'
import React, { useEffect, useState } from 'react'
import { Row, Col, FormGroup, Label, Input, Button, Card, Container ,Table} from 'reactstrap'
import Select from 'react-select'
import { useDispatch, useSelector } from 'react-redux'
import { AllSalelogs, GetAllSaleLogs } from '@/redux/slice/SaleLogs/SaleLogSlice'
import Notify from '@/components/Notify'
import { allDevices, GetAllDevices } from '@/redux/slice/devicesSlice/DevicesSlice'
import { useTheme } from '@/context/BrandingContext'
// import { GetSalesLogs } from "store/salesSlice"

 const PaymentMethodsUITable = ({ salelogs }) => {
  const paymentMethods =
    salelogs?.filter?.paymentMethodOptions?.map((item, index) => ({
      sr: index + 1,
      label: item.text,
      value: item.value,
      disabled: item.disabled,
      selected: item.selected,
    })) || []

  return (
    <div style={{ color: '#fff', padding: '30px', borderRadius: '20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px', marginBottom: '30px' }}>
          <div style={{ background: '#1e293b', padding: '20px', borderRadius: '20px' }}>
            <p>Total Methods</p>
            <h2>{paymentMethods.length}</h2>
          </div>
          <div style={{ background: '#1e293b', padding: '20px', borderRadius: '20px' }}>
            <p>Active Methods</p>
            <h2>{paymentMethods.filter((x) => !x.disabled).length}</h2>
          </div>
          <div style={{ background: '#1e293b', padding: '20px', borderRadius: '20px' }}>
            <p>Selected Method</p>
            <h2>{paymentMethods.find((x) => x.selected)?.label || 'None'}</h2>
          </div>
        </div>
        <Table bordered hover responsive className="shadow-sm rounded">
          <thead>
            <tr>
              <th>#</th>
              <th>Payment Name</th>
              <th>Payment ID</th>
              <th>Status</th>
              <th>Selected</th>
            </tr>
          </thead>
          <tbody>
            {paymentMethods.map((item) => (
              <tr key={item.value}>
                <td className="text-white">{item.sr}</td>
                <td className="text-white">{item.label}</td>
                <td className="text-white">{item.value}</td>
                <td className="text-white">{item.disabled ? 'Disabled' : 'Active'}</td>
                <td className="text-white">{item.selected ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  )
}
export default function SalesLogsHistory() {
  const { theme } = useTheme()
  const selectColor = theme?.primaryColor
  const customStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: selectColor,
      borderColor: ' #3a4551',
      color: '#fff',
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: selectColor,
      border: '1px solid #3a4551',
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? ' #3d4153' : selectColor,
      color: '#fff',
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: selectColor,
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
  const { devices } = useSelector(allDevices)
  const { salelogs } = useSelector(AllSalelogs)
  const dispatch = useDispatch();
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    machines: [],
    payments: [],
    saleStatus: '',
  })
  const [loading, setLoading] = useState(false)

  const Machines = devices?.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }))

  const Payments = [
    { value: 'cash', label: 'Cash' },
    { value: 'card', label: 'Card' },
    { value: 'online', label: 'Online' },
  ]

  console.log('salelogs', salelogs)
  useEffect(() => {
    dispatch(GetAllDevices())
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const handleMultiChange = (name, selected) => {
    setFilters((prev) => ({
      ...prev,
      [name]: selected ? selected.map((s) => s.value) : [],
    }))
  }

  const generateSalesLog = async () => {
    if (!filters.startDate || !filters.endDate) {
      Notify('error', 'Select start and end date')
      return
    }
    try {
      setLoading(true)
      const payload = {
        FromDate: filters.startDate,
        ToDate: filters.endDate,
      }
      console.log('API payload →', payload)
      await dispatch(GetAllSaleLogs(payload)).unwrap()
      await new Promise((r) => setTimeout(r, 1200))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
      setFilters({
        startDate: '',
        endDate: '',
        machines: [],
        payments: [],
        saleStatus: '',
      })
    }
  }

  return (
    <Container className="mt-5">
      <Card className="p-4" style={{ backgroundColor: theme.primaryColor }}>
        <h4 className="mb-4 text-white">Sales Logs History</h4>
        <Row>
          <Col md="6">
            <FormGroup>
              <Label className="text-white">Start Date</Label>
              <Input type="date" name="startDate" value={filters.startDate} onChange={handleChange} style={{ background: 'transparent' }} />
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <Label className="text-white">End Date</Label>
              <Input type="date" name="endDate" value={filters.endDate} onChange={handleChange} style={{ background: 'transparent' }} />
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <Label className="text-white">Select Machine</Label>
              <Select
                isMulti
                styles={customStyles}
                classNamePrefix="select"
                options={Machines}
                value={Machines.filter((m) => filters.machines.includes(m.value))}
                onChange={(s) => handleMultiChange('machines', s)}
                placeholder="Select Machine"
              />
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <Label className="text-white">Select Payment</Label>
              <Select
                isMulti
                styles={customStyles}
                classNamePrefix="select"
                options={Payments}
                value={Payments.filter((p) => filters.payments.includes(p.value))}
                onChange={(s) => handleMultiChange('payments', s)}
                placeholder="Select Payment"
              />
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <Label className="text-white">Sale Status</Label>
              <Input type="select" name="saleStatus" value={filters.saleStatus} onChange={handleChange} style={{ background: 'transparent' }}>
                <option value="">-- Any Sale Status --</option>
                <option value="0" className="custom-text">
                  Success
                </option>
                <option value="1" className="custom-text">
                  Failure
                </option>
              </Input>
            </FormGroup>
          </Col>
        </Row>
        <div className="text-end mt-3">
          <Button color="success" onClick={generateSalesLog} disabled={loading}>
            {loading && <span className="spinner-border spinner-border-sm me-2"></span>}
            Generate Sales Log History
          </Button>
        </div>
      </Card>
      {salelogs?.filter?.paymentMethodOptions?.length > 0 && (
        <Card className="p-4 mt-4" style={{ backgroundColor: theme.primaryColor }}>
          <h5 className="mb-4 text-white">Sales Logs Results</h5>
          <PaymentMethodsUITable salelogs={salelogs} />
        </Card>
      )}
    </Container>
  )
}
