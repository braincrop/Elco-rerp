'use client'
import React, { useEffect, useState } from 'react'
import { Row, Col, FormGroup, Label, Input, Button, Card, Container } from 'reactstrap'
import Select from 'react-select'
import { useDispatch, useSelector } from 'react-redux'
import { AllSalelogs, GetAllSaleLogs } from '@/redux/slice/SaleLogs/SaleLogSlice'
import Notify from '@/components/Notify'
import { allDevices, GetAllDevices } from '@/redux/slice/devicesSlice/DevicesSlice'
// import { GetSalesLogs } from "store/salesSlice"

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: '#282f36', // black background
    borderColor: state.isFocused ? '#3a4551' : '#3a4551', // white border when focused
    boxShadow: 'none',
    '&:hover': {
      borderColor: '#3a4551',
    },
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: '#282f36', // black menu background
    color: '#fff',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#282f36' : state.isFocused ? '#282f36' : '#282f36',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#333',
    },
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: '#333', // selected option chip background
    color: '#fff',
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: '#fff',
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: '#fff',
    ':hover': {
      backgroundColor: '#ff0000', // red hover for remove
      color: 'white',
    },
  }),
}
export default function SalesLogsHistory() {
  const { devices } = useSelector(allDevices)
  const { salelogs } = useSelector(AllSalelogs)
  const dispatch = useDispatch()
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

  console.log('filters', filters)
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
        startDate: filters.startDate,
        endDate: filters.endDate,
        machine1: filters.machines,
        payment1: filters.payments,
        status: filters.saleStatus,
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
      <Card className="p-4">
        <h4 className="mb-4">Sales Logs History</h4>
        <Row>
          <Col md="6">
            <FormGroup>
              <Label>Start Date</Label>
              <Input type="date" name="startDate" value={filters.startDate} onChange={handleChange} />
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <Label>End Date</Label>
              <Input type="date" name="endDate" value={filters.endDate} onChange={handleChange} />
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <Label>Select Machine</Label>
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
              <Label>Select Payment</Label>
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
              <Label>Sale Status</Label>
              <Input type="select" name="saleStatus" value={filters.saleStatus} onChange={handleChange}>
                <option value="">-- Any Sale Status --</option>
                <option value="0">Success</option>
                <option value="1">Failure</option>
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
    </Container>
  )
}
