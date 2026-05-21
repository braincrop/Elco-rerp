'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { vvmStyles } from '../../../components/VirtualMachineStyle'
import {
  Settings,
  Package,
  Power,
  Wifi,
  Wrench,
  ShoppingCart,
  Plus,
  Minus,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Edit3,
  X,
} from 'lucide-react'
import { Eye, EyeOff } from 'lucide-react'
import { allDevices, GetAllDevices } from '@/redux/slice/devicesSlice/DevicesSlice'
import { useDispatch, useSelector } from 'react-redux'
import { socketInstance } from '@/api/axiosConfig'
import {
  AllWebSocketCommandSlice,
  PostUpdateVendiSplash,
  PostWsUpdateCategories,
  PostWsUpdateLanguages,
  PostWsUpdateproducts,
} from '@/redux/slice/WebSocketCommands/WebSocketSlice'
import Notify from '@/components/Notify'
import { allProducts, GetMachineProducts } from '@/redux/slice/Products/productSlice'

const initialSlots = [
  { code: 'A1', motorNo: 1, row: 'A', productName: 'Potato Chips', price: 150, stock: 7, capacity: 10, image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=300&auto=format&fit=crop&q=70', active: true, category: 'Snacks' },
  { code: 'A2', motorNo: 2, row: 'A', productName: 'Peanuts', price: 120, stock: 5, capacity: 10, image: 'https://images.unsplash.com/photo-1559048199-641a0ac8b55e?w=300&auto=format&fit=crop&q=70', active: true, category: 'Snacks' },
  { code: 'A3', motorNo: 3, row: 'A', productName: 'Candy Pack', price: 90, stock: 9, capacity: 10, image: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=300&auto=format&fit=crop&q=70', active: true, category: 'Candy' },
  { code: 'A4', motorNo: 4, row: 'A', productName: 'Popcorn', price: 180, stock: 6, capacity: 10, image: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=300&auto=format&fit=crop&q=70', active: true, category: 'Snacks' },
  { code: 'A5', motorNo: 5, row: 'A', productName: 'Nuts Mix', price: 220, stock: 4, capacity: 10, image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=300&auto=format&fit=crop&q=70', active: true, category: 'Snacks' },
  { code: 'B1', motorNo: 6, row: 'B', productName: 'Chocolate Bar', price: 130, stock: 8, capacity: 10, image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=300&auto=format&fit=crop&q=70', active: true, category: 'Chocolate' },
  { code: 'B2', motorNo: 7, row: 'B', productName: 'Mini Cookies', price: 110, stock: 3, capacity: 10, image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=300&auto=format&fit=crop&q=70', active: true, category: 'Bakery' },
  { code: 'B3', motorNo: 8, row: 'B', productName: 'Fries Pack', price: 160, stock: 10, capacity: 10, image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=300&auto=format&fit=crop&q=70', active: true, category: 'Snacks' },
  { code: 'B4', motorNo: 9, row: 'B', productName: 'Mint Gum', price: 80, stock: 9, capacity: 10, image: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=300&auto=format&fit=crop&q=70', active: false, category: 'Candy' },
  { code: 'B5', motorNo: 10, row: 'B', productName: 'Protein Bar', price: 250, stock: 2, capacity: 10, image: 'https://images.unsplash.com/photo-1622484212850-eb596d769edc?w=300&auto=format&fit=crop&q=70', active: true, category: 'Healthy' },
  ...Array.from({ length: 10 }).map((_, i) => ({
    code: `C${i + 1}`, motorNo: 11 + i, row: 'C',
    productName: i % 2 === 0 ? 'Energy Drink' : 'Lemon Soda',
    price: i % 2 === 0 ? 280 : 180, stock: Math.max(1, 9 - i), capacity: 10,
    image: i % 2 === 0 ? 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=300&auto=format&fit=crop&q=70' : 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=300&auto=format&fit=crop&q=70',
    active: true, category: 'Drinks',
  })),
  ...Array.from({ length: 10 }).map((_, i) => ({
    code: `D${i + 1}`, motorNo: 21 + i, row: 'D',
    productName: i % 2 === 0 ? 'Orange Juice' : 'Iced Tea',
    price: i % 2 === 0 ? 210 : 190, stock: Math.max(0, 8 - i), capacity: 10,
    image: i % 2 === 0 ? 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=300&auto=format&fit=crop&q=70' : 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&auto=format&fit=crop&q=70',
    active: true, category: 'Drinks',
  })),
]

function joinClasses(...items) {
  return items.filter(Boolean).join(' ')
}

function SlotCard({ slot, selected, onClick, mode, dispensing }) {
  const stockPct = Math.round((slot.stock / slot.capacity) * 100)
  const lowStock = slot.stock <= 2

  return (
    <motion.button
      type="button"
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onClick(slot)}
      className={joinClasses('vvm-slot', selected && 'vvm-slot-selected', !slot.active && 'vvm-slot-disabled')}>
      <div className="vvm-slot-image-wrap">
        <img src={slot.image} alt={slot.productName} className="vvm-slot-image" />
        <div className="vvm-slot-shade" />
        <div className="vvm-slot-code">{slot.code}</div>
        {dispensing && <div className="vvm-dispensing-overlay">Dispensing...</div>}
      </div>

      <div className="mt-2">
        <p className="vvm-product-name">{slot.productName}</p>
        <div className="d-flex align-items-center justify-content-between gap-2">
          <span className="vvm-price">PKR {slot.price}</span>
          <span className={lowStock ? 'vvm-stock-low' : 'vvm-stock-ok'}>Stock {slot.stock}</span>
        </div>
      </div>

      <div className="vvm-stock-bar mt-2">
        <div className={lowStock ? 'vvm-stock-fill-low' : 'vvm-stock-fill-ok'} style={{ width: `${stockPct}%` }} />
      </div>

      {mode === 'admin' && (
        <div className="d-flex align-items-center justify-content-between mt-2 small text-secondary">
          <span>Motor {slot.motorNo}</span>
          <Edit3 size={13} />
        </div>
      )}
    </motion.button>
  )
}

function MachineKeypad({ selectedSlot, onDispense, onTestMotor, commandStatus, mode, onModeChange }) {
  const [enteredCode, setEnteredCode] = useState('')
  const keys = ['A', 'B', 'C', 'D', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'CLR', 'OK']

  return (
    <div className="vvm-panel p-4 p-md-5 d-flex flex-column">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <p className="vvm-eyebrow mb-1" style={{ fontSize: '0.7rem' }}>Control</p>
          <h2 className="h5 fw-black text-white mb-0">Machine Panel</h2>
        </div>
        <div className="vvm-online-pill">
          <Wifi size={15} /> Online
        </div>
      </div>

      <div className="vvm-lcd-shell p-3">
        <div className="d-flex align-items-center justify-content-between small text-info mb-2 opacity-75">
          <span>Selected Slot</span>
          <span>{mode === 'admin' ? 'ADMIN' : 'CUSTOMER'}</span>
        </div>
        <div className="vvm-lcd-screen p-3">
          {selectedSlot ? (
            <>
              <p className="h5 fw-black mb-1">{selectedSlot.code} / Motor {selectedSlot.motorNo}</p>
              <p className="fw-bold mb-1">{selectedSlot.productName}</p>
              <p className="mb-0 small">PKR {selectedSlot.price} | Stock {selectedSlot.stock}</p>
            </>
          ) : (
            <p className="h5 fw-black mb-0">Select a slot</p>
          )}
        </div>
      </div>

      <div className="vvm-keypad-box p-3 mt-4">
        <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
          <div className="vvm-keypad-display">{enteredCode || '----'}</div>
          <button
            type="button"
            onClick={() => onModeChange(mode === 'admin' ? 'customer' : 'admin')}
            className="vvm-btn vvm-btn-soft py-2 px-3 small">
            {mode === 'admin' ? 'Customer Mode' : 'Admin Mode'}
          </button>
        </div>

        <div className="row g-2">
          {keys.map((key) => (
            <div className="col-3" key={key}>
              <button
                type="button"
                onClick={() => {
                  if (key === 'CLR') return setEnteredCode('')
                  if (key === 'OK') return
                  setEnteredCode((v) => (v + key).slice(0, 4))
                }}
                className="vvm-key w-100">
                {key}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="row g-3 mt-2">
        <div className="col-6">
          <button
            type="button"
            onClick={onDispense}
            disabled={!selectedSlot || selectedSlot.stock <= 0 || !selectedSlot.active}
            className="vvm-btn vvm-btn-primary w-100 py-3">
            <ShoppingCart size={17} /> Dispense
          </button>
        </div>
        <div className="col-6">
          <button type="button" onClick={onTestMotor} disabled={!selectedSlot} className="vvm-btn vvm-btn-soft w-100 py-3">
            <Wrench size={17} /> Test
          </button>
        </div>
      </div>

      <div className="vvm-command-box p-3 mt-4">
        <p className="small fw-bold text-secondary text-uppercase mb-2">Last Command</p>
        <div className="d-flex align-items-start gap-3 small text-white">
          {commandStatus.type === 'success' ? (
            <CheckCircle2 className="text-success mt-1" size={20} />
          ) : (
            <AlertTriangle className="text-warning mt-1" size={20} />
          )}
          <p className="mb-0">{commandStatus.message}</p>
        </div>
      </div>

      <div className="mt-auto pt-4">
        <button className="vvm-btn vvm-btn-danger w-100">
          <Power size={17} /> Emergency Stop
        </button>
      </div>
    </div>
  )
}

function AdminEditor({ slot, onSave, onClose }) {
  const [form, setForm] = useState(slot)

  useEffect(() => {
    setForm(slot)
  }, [slot])

  if (!slot || !form) return null

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="vvm-editor p-4 p-md-5">
      <div className="d-flex align-items-start justify-content-between gap-3 mb-4">
        <div>
          <p className="vvm-eyebrow mb-1" style={{ fontSize: '0.7rem' }}>Admin Editor</p>
          <h3 className="h4 fw-black text-white mb-0">Edit Slot {slot.code}</h3>
        </div>
        <button type="button" onClick={onClose} className="vvm-close-btn">
          <X size={17} />
        </button>
      </div>

      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label small fw-bold text-secondary">Product Name</label>
          <input value={form.productName} onChange={(e) => update('productName', e.target.value)} className="vvm-input" />
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-bold text-secondary">Category</label>
          <input value={form.category} onChange={(e) => update('category', e.target.value)} className="vvm-input" />
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-bold text-secondary">Price</label>
          <input type="number" value={form.price} onChange={(e) => update('price', Number(e.target.value))} className="vvm-input" />
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-bold text-secondary">Motor No</label>
          <input type="number" value={form.motorNo} onChange={(e) => update('motorNo', Number(e.target.value))} className="vvm-input" />
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-bold text-secondary">Stock</label>
          <div className="input-group">
            <button type="button" onClick={() => update('stock', Math.max(0, form.stock - 1))} className="vvm-btn vvm-btn-soft rounded-end-0">
              <Minus size={16} />
            </button>
            <input type="number" value={form.stock} onChange={(e) => update('stock', Number(e.target.value))} className="vvm-input rounded-0" />
            <button type="button" onClick={() => update('stock', Math.min(form.capacity, form.stock + 1))} className="vvm-btn vvm-btn-soft rounded-start-0">
              <Plus size={16} />
            </button>
          </div>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-bold text-secondary">Capacity</label>
          <input type="number" value={form.capacity} onChange={(e) => update('capacity', Number(e.target.value))} className="vvm-input" />
        </div>
        <div className="col-12">
          <label className="form-label small fw-bold text-secondary">Image URL</label>
          <input value={form.image} onChange={(e) => update('image', e.target.value)} className="vvm-input" />
        </div>
      </div>

      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mt-4">
        <label className="d-inline-flex align-items-center gap-3 bg-dark bg-opacity-25 rounded-4 px-3 py-2 text-white fw-bold">
          <input type="checkbox" checked={form.active} onChange={(e) => update('active', e.target.checked)} className="form-check-input m-0" />
          Slot Active
        </label>
        <button type="button" onClick={() => onSave(form)} className="vvm-btn vvm-btn-primary">
          <Save size={17} /> Save Slot
        </button>
      </div>
    </motion.div>
  )
}

function SplashScreen({ onComplete }) {
  const steps = [
    'Connecting to machine controller...',
    'Checking serial / TCP protocol adapter...',
    'Loading product slot layout...',
    'Syncing stock and motor status...',
    'Preparing admin control panel...',
  ]

  const [progress, setProgress] = useState(0)
  const [activeStep, setActiveStep] = useState(0)
  const [logs, setLogs] = useState(['Booting virtual vending machine...'])

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(100, prev + 4)
        const nextStep = Math.min(steps.length - 1, Math.floor((next / 100) * steps.length))
        setActiveStep(nextStep)
        if (next % 20 === 0) {
          setLogs((old) => [...old.slice(-4), steps[nextStep]])
        }
        if (next >= 100) {
          clearInterval(timer)
          setTimeout(onComplete, 550)
        }
        return next
      })
    }, 90)
    return () => clearInterval(timer)
  }, [onComplete])

  return (
    <div className="vvm-wrapper">
      <div className="vvm-splash d-flex align-items-center justify-content-center p-3 p-md-4">
        <style>{vvmStyles}</style>
        <div className="vvm-splash-glow-one" />
        <div className="vvm-splash-glow-two" />
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="vvm-splash-card p-4 p-md-5">
          <div className="row g-4 g-lg-5">
            <div className="col-lg-7">
              <div className="d-flex align-items-center gap-3 mb-4">
                <div className="vvm-splash-icon">
                  <ShoppingCart size={32} />
                </div>
                <div>
                  <p className="vvm-eyebrow mb-2">Starting System</p>
                  <h1 className="vvm-title mb-0">Virtual Vending Machine</h1>
                </div>
              </div>

              <div className="vvm-card p-4">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <span className="small fw-bold text-secondary">Real-time startup progress</span>
                  <span className="font-monospace h5 fw-black text-warning mb-0">{progress}%</span>
                </div>
                <div className="vvm-progress-track">
                  <motion.div className="vvm-progress-fill" animate={{ width: `${progress}%` }} transition={{ duration: 0.2 }} />
                </div>

                <div className="d-grid gap-3 mt-4">
                  {steps.map((step, index) => {
                    const done = index < activeStep || progress === 100
                    const active = index === activeStep && progress < 100
                    return (
                      <div key={step} className={joinClasses('vvm-step', done && 'vvm-step-done', active && 'vvm-step-active')}>
                        {done ? (
                          <CheckCircle2 className="text-success" size={21} />
                        ) : active ? (
                          <RefreshCw className="text-warning" size={21} />
                        ) : (
                          <div className="vvm-step-dot" />
                        )}
                        <span className="small">{step}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="vvm-card p-4 bg-black bg-opacity-25">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <p className="small fw-black text-secondary text-uppercase mb-0">Live Logs</p>
                  <div className="vvm-online-pill">
                    <Wifi size={15} /> Online
                  </div>
                </div>

                <div className="vvm-log-screen">
                  {logs.map((log, index) => (
                    <motion.p key={`${log}-${index}`} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mb-3">
                      <span className="vvm-log-time">[{new Date().toLocaleTimeString()}]</span> {log}
                    </motion.p>
                  ))}
                  {progress < 100 ? (
                    <p className="text-warning mb-0">Waiting for next machine event...</p>
                  ) : (
                    <p className="text-success mb-0">System ready. Opening control dashboard...</p>
                  )}
                </div>

                <button type="button" onClick={onComplete} className="vvm-btn vvm-btn-soft w-100 mt-4">
                  Skip Splash Screen
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function Page() {
  const { machineProducts, loadingproducts } = useSelector(allProducts)
  const [showSplash, setShowSplash] = useState(true)
  const [videoLoading, setVideoLoading] = useState(false)
  const [showProducts, setShowProducts] = useState(true)
  const [videoUrl, setVideoUrl] = useState('')
  const [slots, setSlots] = useState(initialSlots)
  const [selectedSlot, setSelectedSlot] = useState(initialSlots[0])
  const [mode, setMode] = useState('admin')
  const { devices, loading } = useSelector(allDevices)
  const [dispensingCode, setDispensingCode] = useState(null)
  const [selectedDevice, setSelectedDevice] = useState('')
  const [commandStatus, setCommandStatus] = useState({
    type: 'info',
    message: 'Machine connected. Select a slot to dispense or edit settings.',
  })
  const dispatch = useDispatch()
  const [selectedCategory, setSelectedCategory] = useState(null)
  const apiKey = process.env.NEXT_PUBLIC_API_KEY

  const stats = useMemo(() => {
    const total = slots.length
    const active = slots.filter((x) => x.active).length
    const low = slots.filter((x) => x.stock <= 2).length
    const stock = slots.reduce((sum, x) => sum + x.stock, 0)
    return { total, active, low, stock }
  }, [slots])

  useEffect(() => {
    dispatch(GetAllDevices())
  }, [])

  const categoryData = machineProducts || []

  useEffect(() => {
    if (categoryData?.length > 0 && !selectedCategory) {
      setSelectedCategory(categoryData[0])
    }
  }, [categoryData])

  const filteredProducts = selectedCategory?.products || []

  const updateSelectedFromSlots = (updatedSlots, code) => {
    const updated = updatedSlots.find((x) => x.code === code)
    if (updated) setSelectedSlot(updated)
  }

  const productRows = useMemo(() => {
    return filteredProducts.reduce((acc, item, index) => {
      const product = item.product
      const rowKey = index < 4 ? 'A' : index < 8 ? 'B' : index < 12 ? 'C' : 'D'
      const slotData = {
        code: `${product?.product_sku || product?.id}-${index}`,
        image: product?.product_photo,
        productName: product?.product_name,
        price: product?.product_price,
        stock: product?.stock || 0,
        capacity: 10,
        active: true,
        motorNo: index + 1,
        row: rowKey,
      }
      acc[rowKey] = acc[rowKey] || []
      acc[rowKey].push(slotData)
      return acc
    }, {})
  }, [filteredProducts])

  const localVideo = '/video/3198159-hd_1920_1080_25fps.mp4'

  const GetAllVmSplash = async (ip) => {
    try {
      setVideoLoading(true)
      const response = await socketInstance.get(`v1/VmSplash/GetSplashPath/${ip}`, {
        headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
      })
      const apiVideo = response?.data?.data
      setVideoUrl(apiVideo || localVideo)
    } catch (error) {
      console.log(error)
      setVideoUrl(localVideo)
    } finally {
      setVideoLoading(false)
    }
  }

  const handleInputValueChange = (e) => {
    const ip = e.target.value
    setSelectedDevice(ip)
    if (ip) {
      GetAllVmSplash(ip)
      dispatch(GetMachineProducts(ip))
    }
  }

  const dispense = async () => {
    if (!selectedSlot) return
    setDispensingCode(selectedSlot.code)
    setCommandStatus({ type: 'info', message: `Sending dispense command to motor ${selectedSlot.motorNo}...` })
    setTimeout(() => {
      setSlots((prev) => {
        const updated = prev.map((slot) => (slot.code === selectedSlot.code ? { ...slot, stock: Math.max(0, slot.stock - 1) } : slot))
        updateSelectedFromSlots(updated, selectedSlot.code)
        return updated
      })
      setDispensingCode(null)
      setCommandStatus({
        type: 'success',
        message: `Dispense successful for slot ${selectedSlot.code}. Backend should call protocol command for motor ${selectedSlot.motorNo}.`,
      })
    }, 1200)
  }

  const testMotor = () => {
    if (!selectedSlot) return
    setCommandStatus({ type: 'success', message: `Motor test command sent for ${selectedSlot.code} / Motor ${selectedSlot.motorNo}.` })
  }

  const saveSlot = (updatedSlot) => {
    setSlots((prev) => {
      const updated = prev.map((slot) => (slot.code === updatedSlot.code ? updatedSlot : slot))
      updateSelectedFromSlots(updated, updatedSlot.code)
      return updated
    })
    setCommandStatus({ type: 'success', message: `Slot ${updatedSlot.code} settings saved successfully.` })
  }

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />
  }

  const handleUpdateSplash = async () => {
    if (!selectedDevice) { Notify('error', 'Please select a device.'); return }
    try {
      await dispatch(PostUpdateVendiSplash({ id: selectedDevice, updatedData: { type: 'string', data: 'string' } })).unwrap()
    } catch (error) {
      console.log('Error updating splash:', error)
    }
  }

  const handleUpdateproducts = async () => {
    if (!selectedDevice) { Notify('error', 'Please select a device.'); return }
    try {
      await dispatch(PostWsUpdateproducts({ id: selectedDevice, updatedData: { type: 'string', data: 'string' } })).unwrap()
    } catch (error) {
      console.log('Error updating products:', error)
    }
  }

  const handleUpdateLanguages = async () => {
    if (!selectedDevice) { Notify('error', 'Please select a device.'); return }
    try {
      await dispatch(PostWsUpdateLanguages({ id: selectedDevice, updatedData: { type: 'string', data: 'string' } })).unwrap()
    } catch (error) {
      console.log('Error updating languages:', error)
    }
  }

  const handleUpdateCategory = async () => {
    if (!selectedDevice) { Notify('error', 'Please select a device.'); return }
    try {
      await dispatch(PostWsUpdateCategories({ id: selectedDevice, updatedData: { type: 'string', data: 'string' } })).unwrap()
    } catch (error) {
      console.log('Error updating categories:', error)
    }
  }

  return (
    <div className="vvm-wrapper">
      <div className="vvm-root py-4 py-md-5">
        <style>{vvmStyles}</style>
        <div className="container-fluid vvm-page">
          <header className="d-flex flex-row align-items-center gap-4 mb-4">
            <div>
              <p className="vvm-eyebrow mb-2">Digital Twin</p>
              <h1 className="vvm-title mb-3">Virtual Vending Machine</h1>
              <p className="vvm-muted mb-0" style={{ maxWidth: 760 }}>
                Admin can assign products, update stock, test motors, and send dispense commands to the real vending machine through backend protocol integration.
              </p>
            </div>
            <div className="d-flex flex-wrap gap-2">
              <button type="button" className="vvm-btn vvm-btn-soft" onClick={handleUpdateSplash}>
                <RefreshCw size={17} /> Sync Splash
              </button>
              <button type="button" className="vvm-btn vvm-btn-soft" onClick={handleUpdateLanguages}>
                <RefreshCw size={17} /> Sync language
              </button>
              <button type="button" className="vvm-btn vvm-btn-soft" onClick={handleUpdateproducts}>
                <RefreshCw size={17} /> Sync Product
              </button>
              <button type="button" className="vvm-btn vvm-btn-soft" onClick={handleUpdateCategory}>
                <RefreshCw size={17} /> Sync Category
              </button>
            </div>
          </header>

          <div className="row g-3 mb-4">
            {[
              ['Total Slots', stats.total, Package],
              ['Active Slots', stats.active, CheckCircle2],
              ['Low Stock', stats.low, AlertTriangle],
              ['Total Stock', stats.stock, ShoppingCart],
            ].map(([label, value, Icon]) => (
              <div className="col-6 col-lg-3" key={label}>
                <div className="vvm-card p-4 h-100">
                  <div className="d-flex align-items-center justify-content-between">
                    <p className="small fw-bold text-secondary mb-0">{label}</p>
                    <Icon className="text-warning" size={21} />
                  </div>
                  <p className="display-6 fw-black text-white mb-0 mt-2">{value}</p>
                </div>
              </div>
            ))}
          </div>

          <main className="row g-4">
            <section className="col-xl-9">
              <div className="vvm-machine-shell p-3 p-md-4">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
                  <div>
                    <h2 className="h3 fw-black text-white mb-1">Product Display</h2>
                    <p className="small text-secondary mb-0">Click any slot to select it. In admin mode, edit product and motor settings below.</p>
                  </div>
                  <div className="badge rounded-pill border border-secondary text-secondary bg-black bg-opacity-25 px-3 py-2">Machine ID: VM-001</div>
                  <div className="gap-2">
                    <select
                      className="vvm-input"
                      value={selectedDevice}
                      disabled={loading}
                      onChange={handleInputValueChange}
                      style={{ minWidth: '220px' }}
                    >
                      {loading ? (
                        <option>Loading devices...</option>
                      ) : (
                        <>
                          <option value="">Select Device</option>
                          {devices?.map((device) => (
                            <option key={device.id} value={device.ip}>
                              {device.deviceName} ({device.ip})
                            </option>
                          ))}
                        </>
                      )}
                    </select>
                  </div>
                  <div className="align-items-center">
                    <button type="button" onClick={() => setShowProducts(!showProducts)} className="btn btn-light rounded-pill px-4 fw-semibold gap-2">
                      {showProducts ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div
                  className="vvm-glass-outer p-3 p-md-4 position-relative overflow-hidden"
                  style={{ minHeight: '100vh' }}>
                  <video
                    src={videoUrl || localVideo}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="position-absolute top-0 start-0 w-100 h-100"
                    style={{ objectFit: 'cover', zIndex: 0 }}
                  />
                  <div
                    className="position-absolute top-0 start-0 w-100 h-100"
                    style={{ background: 'rgba(0,0,0,0.35)', zIndex: 1 }}
                  />
                  <div className="position-relative" style={{ zIndex: 2 }}>
                    {showProducts && (
                      <>
                        <div className="vvm-glass-inner p-3 p-md-4">
                          {!selectedDevice ? (
                            <div className="text-center py-5">
                              <h5 className="text-warning mb-0">Please select a device</h5>
                            </div>
                          ) : (
                            <>
                              <div className="d-flex flex-wrap gap-2 mb-4">
                                {categoryData.map((category) => (
                                  <button
                                    key={category.id}
                                    type="button"
                                    onClick={() => setSelectedCategory(category)}
                                    className={`btn rounded-pill px-4 text-capitalize ${selectedCategory?.id === category.id ? 'btn-primary' : 'btn-outline-light'}`}>
                                    {category.name}
                                  </button>
                                ))}
                              </div>
                              {loadingproducts ? (
                                <div className="text-center py-5">
                                  <div className="spinner-border text-light" />
                                  <p className="text-secondary mt-2 mb-0">Loading products...</p>
                                </div>
                              ) : selectedCategory && filteredProducts.length > 0 ? (
                                Object.keys(productRows).map((row) => (
                                  <div key={row} className="mb-4 last-mb-0">
                                    <div className="d-flex align-items-center gap-3 mb-2">
                                      <span className="vvm-row-label">ROW {row}</span>
                                      <div className="vvm-line" />
                                    </div>
                                    <div className={row === 'A' || row === 'B' ? 'vvm-slot-grid-small' : 'vvm-slot-grid-large'}>
                                      {productRows[row].map((slot, index) => (
                                        <SlotCard
                                          key={`${slot.code}-${index}`}
                                          slot={slot}
                                          selected={selectedSlot?.code === slot.code}
                                          onClick={setSelectedSlot}
                                          mode={mode}
                                          dispensing={dispensingCode === slot.code}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                ))
                              ) : selectedCategory ? (
                                <div className="text-center py-5">
                                  <p className="text-secondary mb-0">No Product Found</p>
                                </div>
                              ) : null}
                            </>
                          )}
                        </div>
                        <div className="d-flex justify-content-center mt-4">
                          <motion.button whileTap={{ scale: 0.96 }} type="button" onClick={dispense} className="vvm-push-button">
                            PUSH
                          </motion.button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <aside className="col-xl-3">
              <MachineKeypad
                selectedSlot={selectedSlot}
                onDispense={dispense}
                onTestMotor={testMotor}
                commandStatus={commandStatus}
                mode={mode}
                onModeChange={setMode}
              />
            </aside>
          </main>

          {mode === 'admin' && (
            <div className="mt-4">
              <AdminEditor slot={selectedSlot} onSave={saveSlot} onClose={() => setMode('customer')} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
