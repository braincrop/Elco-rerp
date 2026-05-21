'use client'
import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import { useDispatch, useSelector } from 'react-redux'
import { AllSalelogs, GetAllSaleLogs } from '@/redux/slice/SaleLogs/SaleLogSlice'
import Notify from '@/components/Notify'
import { allBranch, GetAllBranch } from '@/redux/slice/Branch/branchSlice'
import DataTable from '@/components/ui/DataTable'
import Button from '@/components/ui/Button'
import Field from '@/components/ui/Field'
import Badge from '@/components/ui/Badge'

const customSelectStyles = {
  control: (base) => ({
    ...base,
    backgroundColor: 'var(--surface)',
    borderColor: 'var(--line)',
    color: 'var(--ink)',
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: 'var(--surface)',
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? 'var(--line)' : 'var(--surface)',
    color: 'var(--ink)',
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: 'var(--line)',
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: 'var(--ink)',
  }),
  singleValue: (base) => ({
    ...base,
    color: 'var(--ink)',
  }),
}

const summaryCardStyle = {
  background: 'var(--surface)',
  border: '1px solid var(--line)',
  borderRadius: '10px',
  padding: '20px',
  flex: 1,
  minWidth: '140px',
}

const SaleLogsTable = ({ salelogs, loading }) => {
  const paymentLogs = salelogs || []

  const columns = [
    { key: 'index', label: '#', render: (_, __, idx) => idx + 1, width: '50px' },
    { key: 'uuId', label: 'UUID', render: (val) => val?.slice(0, 10) },
    { key: 'receiptNo', label: 'Receipt No' },
    { key: 'branch', label: 'Branch', render: (val) => val ? `${val.name} (ID: ${val.id})` : '-' },
    { key: 'buyerDisplay', label: 'Buyer', render: (val) => val?.personalInfoSummary || '-' },
    { key: 'buyerDisplay', label: 'Buyer Status', render: (val) => val?.status || '-' },
    { key: 'paymentMethodName', label: 'Payment Method' },
    { key: 'paymentMethodId', label: 'Payment ID' },
    { key: 'subTotal', label: 'SubTotal' },
    { key: 'total', label: 'Total' },
    {
      key: 'erpSyncStatus',
      label: 'ERP Sync',
      render: (val) => (
        <Badge variant={val ? 'good' : 'warn'}>
          {val === null ? 'Not Synced' : val}
        </Badge>
      ),
    },
    { key: 'transactionTime', label: 'Transaction Time', render: (val) => val ? new Date(val).toLocaleString() : '-' },
    { key: 'successfulItemCount', label: 'Success Count' },
    { key: 'unsuccessfulItemCount', label: 'Failed Count' },
    {
      key: 'successfulItems',
      label: 'Successful Items',
      render: (val) =>
        val?.length > 0
          ? val.map((prod, i) => (
              <div key={i} style={{ marginBottom: '6px', padding: '6px 8px', background: 'var(--line)', borderRadius: '6px', fontSize: '12px' }}>
                <div>SKU: {prod.sku}</div>
                <div>Qty: {prod.quantity}</div>
                <div>Price: {prod.price}</div>
              </div>
            ))
          : 'None',
    },
    {
      key: 'unsuccessfulItems',
      label: 'Unsuccessful Items',
      render: (val) =>
        val?.length > 0
          ? val.map((prod, i) => (
              <div key={i} style={{ marginBottom: '6px', padding: '6px 8px', background: 'var(--surface)', border: '1px solid var(--bad)', borderRadius: '6px', fontSize: '12px' }}>
                {JSON.stringify(prod)}
              </div>
            ))
          : 'None',
    },
  ]

  if (!loading && paymentLogs.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: 'var(--ink-3)', fontSize: '16px', fontWeight: 600 }}>
        No Sale Log Found
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
        <div style={summaryCardStyle}>
          <p style={{ color: 'var(--ink-3)', marginBottom: '4px', fontSize: '13px' }}>Total Transactions</p>
          <h2 style={{ color: 'var(--ink)', margin: 0 }}>{paymentLogs.length}</h2>
        </div>
        <div style={summaryCardStyle}>
          <p style={{ color: 'var(--ink-3)', marginBottom: '4px', fontSize: '13px' }}>Total Successful Items</p>
          <h2 style={{ color: 'var(--ink)', margin: 0 }}>{paymentLogs.reduce((sum, item) => sum + item.successfulItemCount, 0)}</h2>
        </div>
        <div style={summaryCardStyle}>
          <p style={{ color: 'var(--ink-3)', marginBottom: '4px', fontSize: '13px' }}>Total Unsuccessful Items</p>
          <h2 style={{ color: 'var(--ink)', margin: 0 }}>{paymentLogs.reduce((sum, item) => sum + item.unsuccessfulItemCount, 0)}</h2>
        </div>
        <div style={summaryCardStyle}>
          <p style={{ color: 'var(--ink-3)', marginBottom: '4px', fontSize: '13px' }}>Grand Total Amount</p>
          <h2 style={{ color: 'var(--ink)', margin: 0 }}>{paymentLogs.reduce((sum, item) => sum + item.total, 0)}</h2>
        </div>
      </div>
      <DataTable columns={columns} data={paymentLogs} rowKey="uuId" loading={loading} emptyText="No Sale Log Found" />
    </div>
  )
}

export default function SalesLogsHistory() {
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
      const payload = {
        FromDate: filters.startDate,
        ToDate: filters.endDate,
        Branchids: filters.machines,
        PaymentMethodId: filters.payments,
        HasSuccessfulItems: filters.HasSuccessfulItems === 'true' ? true : filters.HasSuccessfulItems === 'false' ? false : null,
        HasUnsuccessfulItems: filters.HasUnsuccessfulItems === 'true' ? true : filters.HasUnsuccessfulItems === 'false' ? false : null,
      }
      await dispatch(GetAllSaleLogs(payload)).unwrap()
      await new Promise((r) => setTimeout(r, 1200))
    } catch (err) {
      console.error(err)
    } finally {
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
    <div className="page-content">
      <div className="page-head">
        <div>
          <h1 className="page-title">Sales Logs History</h1>
          <p className="page-sub">Filter and review transaction logs</p>
        </div>
      </div>

      <div className="card">
        <div className="card-pad">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            <Field label="Start Date">
              <input className="field-input" type="date" name="startDate" value={filters.startDate} onChange={handleChange} />
            </Field>
            <Field label="End Date">
              <input className="field-input" type="date" name="endDate" value={filters.endDate} onChange={handleChange} />
            </Field>
            <Field label="Select Machine">
              <Select
                isMulti
                styles={customSelectStyles}
                options={Machines}
                value={(Machines || []).filter((m) => filters.machines.includes(m.value))}
                onChange={(s) => handleMultiChange('machines', s)}
                placeholder="Select Machine"
              />
            </Field>
            <Field label="Select Payment">
              <Select
                isMulti
                styles={customSelectStyles}
                options={Payments}
                value={Payments.filter((p) => filters.payments.includes(p.value))}
                onChange={(s) => handleMultiChange('payments', s)}
                placeholder="Select Payment"
              />
            </Field>
            <Field label="Successful Items">
              <select className="field-input" name="HasSuccessfulItems" value={filters.HasSuccessfulItems} onChange={handleChange}>
                <option value="">-- Any --</option>
                <option value="true">true</option>
                <option value="false">false</option>
              </select>
            </Field>
            <Field label="Unsuccessful Items">
              <select className="field-input" name="HasUnsuccessfulItems" value={filters.HasUnsuccessfulItems} onChange={handleChange}>
                <option value="">-- Any --</option>
                <option value="true">true</option>
                <option value="false">false</option>
              </select>
            </Field>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="accent" busy={loading} onClick={generateSalesLog}>
              Generate Sales Log History
            </Button>
          </div>
        </div>
      </div>

      {(loading || saleLogsFetched) && (
        <div className="card" style={{ marginTop: '16px' }}>
          <div className="card-pad">
            <h2 className="page-title" style={{ marginBottom: '16px' }}>Sales Logs Results</h2>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--ink-3)' }}>Loading Sale Logs...</div>
            ) : (
              <SaleLogsTable salelogs={salelogs} loading={loading} />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
