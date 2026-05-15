'use client'
import React, { useEffect, useState } from 'react'
import { Row, Col, FormGroup, Label, Input, Button, Card, Container, Table } from 'reactstrap'
import Select from 'react-select'
import { useDispatch, useSelector } from 'react-redux'
import { AllSalelogs, GetAllSaleLogs } from '@/redux/slice/SaleLogs/SaleLogSlice'
import Notify from '@/components/Notify'
import { allDevices, GetAllDevices } from '@/redux/slice/devicesSlice/DevicesSlice'
import { useTheme } from '@/context/BrandingContext'
import { allBranch, GetAllBranch } from '@/redux/slice/Branch/branchSlice'
// import { GetSalesLogs } from "store/salesSlice"

const PaymentMethodsUITable = ({ salelogs }) => {
  const paymentLogs = salelogs || []
  if (!paymentLogs || paymentLogs.length === 0) {
    return (
      <div
        style={{
          color: '#000',
          padding: '50px',
          textAlign: 'center',
          background: '#1e293b',
          borderRadius: '20px',
          fontSize: '22px',
          fontWeight: '600',
        }}>
        No Sale Log Found
      </div>
    )
  }
  return (
    <div style={{ color: '#fff', padding: '30px', borderRadius: '20px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* SUMMARY CARDS */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4,1fr)',
            gap: '20px',
            marginBottom: '30px',
          }}>
          <div style={{ background: '#1e293b', padding: '20px', borderRadius: '20px' }}>
            <p>Total Transactions</p>
            <h2>{paymentLogs.length}</h2>
          </div>

          <div style={{ background: '#1e293b', padding: '20px', borderRadius: '20px' }}>
            <p>Total Successful Items</p>
            <h2>{paymentLogs.reduce((sum, item) => sum + item.successfulItemCount, 0)}</h2>
          </div>

          <div style={{ background: '#1e293b', padding: '20px', borderRadius: '20px' }}>
            <p>Total Unsuccessful Items</p>
            <h2>{paymentLogs.reduce((sum, item) => sum + item.unsuccessfulItemCount, 0)}</h2>
          </div>

          <div style={{ background: '#1e293b', padding: '20px', borderRadius: '20px' }}>
            <p>Grand Total Amount</p>
            <h2>{paymentLogs.reduce((sum, item) => sum + item.total, 0)}</h2>
          </div>
        </div>
        <Table bordered hover responsive className="shadow-sm rounded">
          <thead>
            <tr>
              <th>#</th>
              <th>UUID</th>
              <th>Receipt No</th>
              <th>Branch</th>
              <th>Buyer</th>
              <th>Buyer Status</th>
              <th>Payment Method</th>
              <th>Payment ID</th>
              <th>SubTotal</th>
              <th>Total</th>
              <th>ERP Sync</th>
              <th>Transaction Time</th>
              <th>Success Count</th>
              <th>Failed Count</th>
              <th>Successful Items</th>
              <th>Unsuccessful Items</th>
            </tr>
          </thead>
          <tbody>
            {paymentLogs.map((item, index) => (
              <tr key={item.uuId}>
                <td className="text-white">{index + 1}</td>
                <td className="text-white">{item.uuId.slice(0, 10)}</td>
                <td className="text-white">{item.receiptNo}</td>
                <td className="text-white">
                  {item.branch?.name} (ID: {item.branch?.id})
                </td>
                <td className="text-white">{item.buyerDisplay?.personalInfoSummary}</td>
                <td className="text-white">{item.buyerDisplay?.status}</td>
                <td className="text-white">{item.paymentMethodName}</td>
                <td className="text-white">{item.paymentMethodId}</td>
                <td className="text-white">{item.subTotal}</td>
                <td className="text-white">{item.total}</td>
                <td className="text-white">{item.erpSyncStatus === null ? 'Not Synced' : item.erpSyncStatus}</td>
                <td className="text-white">{new Date(item.transactionTime).toLocaleString()}</td>
                <td className="text-white">{item.successfulItemCount}</td>
                <td className="text-white">{item.unsuccessfulItemCount}</td>
                <td className="text-white">
                  {item.successfulItems?.length > 0
                    ? item.successfulItems.map((prod, i) => (
                        <div
                          key={i}
                          style={{
                            marginBottom: '8px',
                            padding: '8px',
                            background: '#334155',
                            borderRadius: '10px',
                          }}>
                          <div>SKU: {prod.sku}</div>
                          <div>Qty: {prod.quantity}</div>
                          <div>Price: {prod.price}</div>
                        </div>
                      ))
                    : 'No Successful Items'}
                </td>
                <td className="text-white">
                  {item.unsuccessfulItems?.length > 0
                    ? item.unsuccessfulItems.map((prod, i) => (
                        <div
                          key={i}
                          style={{
                            marginBottom: '8px',
                            padding: '8px',
                            background: '#7f1d1d',
                            borderRadius: '10px',
                          }}>
                          <div>{JSON.stringify(prod)}</div>
                        </div>
                      ))
                    : 'No Failed Items'}
                </td>
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
  const { branch } = useSelector(allBranch)
  const { salelogs, loading, saleLogsFetched } = useSelector(AllSalelogs)
  const dispatch = useDispatch()
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    machines: [],
    payments: [],
    HasSuccessfulItems: '',
    HasUnsuccessfulItems: '',
  })
  // const [loading, setLoading] = useState(false)

  const Machines = branch?.map((cat) => ({
    value: cat.branchId,
    label: cat.name,
  }))

  const Payments = [
    { value: '1', label: 'Cash' },
    { value: '2', label: 'Card' },
    { value: '3', label: 'Online' },
  ]
  useEffect(() => {
    dispatch(GetAllBranch())
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
      // setLoading(true)
      const payload = {
        FromDate: filters.startDate,
        ToDate: filters.endDate,
        Branchids: filters.machines,
        PaymentMethodId: filters.payments,
        HasSuccessfulItems: filters.HasSuccessfulItems === 'true' ? true : filters.HasSuccessfulItems === 'false' ? false : null,
        HasUnsuccessfulItems: filters.HasUnsuccessfulItems === 'true' ? true : filters.HasUnsuccessfulItems === 'false' ? false : null,
      }
      console.log('API payload →', payload)
      await dispatch(GetAllSaleLogs(payload)).unwrap()
      await new Promise((r) => setTimeout(r, 1200))
    } catch (err) {
      console.error(err)
    } finally {
      // setLoading(false)
      setFilters({
        startDate: '',
        endDate: '',
        machines: [],
        payments: [],
        HasSuccessfulItems: '',
        HasUnsuccessfulItems: '',
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
              <Label className="text-white">SuccessFull Items</Label>
              <Input
                type="select"
                name="HasSuccessfulItems"
                value={filters.HasSuccessfulItems}
                onChange={handleChange}
                style={{ background: 'transparent' }}>
                <option value="">-- Any Sale Status --</option>
                <option value="true" className="custom-text">
                  true
                </option>
                <option value="false" className="custom-text">
                  false
                </option>
              </Input>
            </FormGroup>
          </Col>

          <Col md="6">
            <FormGroup>
              <Label className="text-white">UnSuccessFull Items</Label>
              <Input
                type="select"
                name="HasUnsuccessfulItems"
                value={filters.HasUnsuccessfulItems}
                onChange={handleChange}
                style={{ background: 'transparent' }}>
                <option value="">-- Any Sale Status --</option>
                <option value="true" className="custom-text">
                  true
                </option>
                <option value="false" className="custom-text">
                  false
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
      {(loading || saleLogsFetched) && (
        <Card className="p-4 mt-4" style={{ backgroundColor: theme.primaryColor }}>
          <h5 className="mb-4 text-white">Sales Logs Results</h5>
          {loading ? <div className="text-center text-white py-5">Loading Sale Logs...</div> : <PaymentMethodsUITable salelogs={salelogs} />}
        </Card>
      )}
    </Container>
  )
}
