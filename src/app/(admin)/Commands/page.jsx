'use client'
import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { allDevices, GetAllDevices } from '@/redux/slice/devicesSlice/DevicesSlice'
import { allProducts, GetMachineProducts } from '@/redux/slice/Products/productSlice'
import {
  AllWebSocketCommandSlice,
  PostUpdateVendiSplash,
  PostWsUpdateCategories,
  PostWsUpdateLanguages,
  PostWsUpdateproducts,
} from '@/redux/slice/WebSocketCommands/WebSocketSlice'
import { socketInstance } from '@/api/axiosConfig'
import Notify from '@/components/Notify'
import Button from '@/components/ui/Button'
import SvgIcon from '@/components/ui/SvgIcon'

import { useVendEmulator } from './_hooks/useVendEmulator'
import SplashBoot        from './_components/SplashBoot'
import SlotGrid          from './_components/SlotGrid'
import SplashView        from './_components/SplashView'
import CommandPanel      from './_components/CommandPanel'
import MachineSettings   from './_components/MachineSettings'
import SlotEditDrawer    from './_components/SlotEditDrawer'
import styles            from './VirtualMachine.module.css'

/* ─── Default fallback slots (shown before device is selected) ─── */
const FALLBACK_SLOTS = [
  { code: 'A1', motorNo: 1, row: 'A', productName: 'Potato Chips',  price: 150, stock: 7,  capacity: 10, active: true, category: 'Snacks',    image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=300&auto=format&fit=crop&q=70' },
  { code: 'A2', motorNo: 2, row: 'A', productName: 'Peanuts',        price: 120, stock: 5,  capacity: 10, active: true, category: 'Snacks',    image: 'https://images.unsplash.com/photo-1559048199-641a0ac8b55e?w=300&auto=format&fit=crop&q=70' },
  { code: 'A3', motorNo: 3, row: 'A', productName: 'Candy Pack',     price:  90, stock: 9,  capacity: 10, active: true, category: 'Candy',     image: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=300&auto=format&fit=crop&q=70' },
  { code: 'A4', motorNo: 4, row: 'A', productName: 'Popcorn',        price: 180, stock: 6,  capacity: 10, active: true, category: 'Snacks',    image: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=300&auto=format&fit=crop&q=70' },
  { code: 'A5', motorNo: 5, row: 'A', productName: 'Nuts Mix',       price: 220, stock: 2,  capacity: 10, active: true, category: 'Snacks',    image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=300&auto=format&fit=crop&q=70' },
  { code: 'B1', motorNo: 6, row: 'B', productName: 'Chocolate Bar',  price: 130, stock: 8,  capacity: 10, active: true, category: 'Chocolate', image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=300&auto=format&fit=crop&q=70' },
  { code: 'B2', motorNo: 7, row: 'B', productName: 'Mini Cookies',   price: 110, stock: 3,  capacity: 10, active: true, category: 'Bakery',    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=300&auto=format&fit=crop&q=70' },
  { code: 'B3', motorNo: 8, row: 'B', productName: 'Fries Pack',     price: 160, stock: 10, capacity: 10, active: true, category: 'Snacks',    image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=300&auto=format&fit=crop&q=70' },
  { code: 'B4', motorNo: 9, row: 'B', productName: 'Mint Gum',       price:  80, stock: 9,  capacity: 10, active: false, category: 'Candy',   image: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=300&auto=format&fit=crop&q=70' },
  { code: 'B5', motorNo:10, row: 'B', productName: 'Protein Bar',    price: 250, stock: 1,  capacity: 10, active: true, category: 'Healthy',   image: 'https://images.unsplash.com/photo-1622484212850-eb596d769edc?w=300&auto=format&fit=crop&q=70' },
  { code: 'C1', motorNo:11, row: 'C', productName: 'Energy Drink',   price: 280, stock: 7,  capacity: 10, active: true, category: 'Drinks',    image: 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=300&auto=format&fit=crop&q=70' },
  { code: 'C2', motorNo:12, row: 'C', productName: 'Lemon Soda',     price: 180, stock: 6,  capacity: 10, active: true, category: 'Drinks',    image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=300&auto=format&fit=crop&q=70' },
  { code: 'C3', motorNo:13, row: 'C', productName: 'Energy Drink',   price: 280, stock: 4,  capacity: 10, active: true, category: 'Drinks',    image: 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=300&auto=format&fit=crop&q=70' },
  { code: 'C4', motorNo:14, row: 'C', productName: 'Lemon Soda',     price: 180, stock: 0,  capacity: 10, active: true, category: 'Drinks',    image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=300&auto=format&fit=crop&q=70' },
  { code: 'C5', motorNo:15, row: 'C', productName: 'Orange Juice',   price: 210, stock: 5,  capacity: 10, active: true, category: 'Drinks',    image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=300&auto=format&fit=crop&q=70' },
]

const DEFAULT_SETTINGS = {
  dispenseMode: 'emulated',   // 'emulated' | 'live'
  slotsPerRow: 5,
  rows: ['A', 'B', 'C', 'D'],
  lowStockThreshold: 2,
  autoRefresh: 0,
}

const SETTINGS_KEY = 'vvm_settings'

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS
  } catch { return DEFAULT_SETTINGS }
}

function saveSettings(s) {
  try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)) } catch {}
}

/* ─── Health colour ─── */
function healthColor(pct) {
  if (pct >= 60) return 'var(--good)'
  if (pct >= 30) return 'var(--warn)'
  return 'var(--bad)'
}

/* ══════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════ */
export default function VirtualMachinePage() {
  const dispatch = useDispatch()

  /* ── Redux state ── */
  const { devices, loading: devLoading } = useSelector(allDevices)
  const { machineProducts, loadingproducts } = useSelector(allProducts)
  const { Wsloading } = useSelector(AllWebSocketCommandSlice)

  /* ── Local state ── */
  const [showSplash, setShowSplash] = useState(true)
  const [viewMode,  setViewMode]    = useState('products') // 'products' | 'splash'
  const [videoUrl,  setVideoUrl]    = useState('')
  const [selectedDevice, setSelectedDevice] = useState('')
  const [selectedDeviceObj, setSelectedDeviceObj] = useState(null)

  const [slots,        setSlots]        = useState(FALLBACK_SLOTS)
  const [selectedSlot, setSelectedSlot] = useState(FALLBACK_SLOTS[0])
  const [editSlot,     setEditSlot]     = useState(null) // null = drawer closed

  const [showSettings, setShowSettings] = useState(false)
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)

  const [jumpCode, setJumpCode] = useState('')
  const jumpRef = useRef(null)

  /* ── Load settings from localStorage on mount ── */
  useEffect(() => { setSettings(loadSettings()) }, [])

  /* ── Persist settings whenever they change ── */
  useEffect(() => { saveSettings(settings) }, [settings])

  /* ── Fetch devices on mount ── */
  useEffect(() => { dispatch(GetAllDevices()) }, [dispatch])

  /* ── Seed slots from API response ── */
  useEffect(() => {
    if (!machineProducts?.length) return
    const seeded = machineProducts.flatMap((cat, ci) =>
      (cat.products || []).map((item, pi) => {
        const row = String.fromCharCode(65 + ci)   // A, B, C…
        return {
          code:        `${row}${pi + 1}`,
          motorNo:     ci * (cat.products?.length || 0) + pi + 1,
          row,
          productName: item.product?.product_name   ?? null,
          price:       item.product?.product_price  ?? null,
          stock:       item.product?.stock          ?? 0,
          capacity:    10,
          image:       item.product?.product_photo  ?? null,
          active:      true,
          category:    cat.name,
        }
      })
    )
    setSlots(seeded)
    setSelectedSlot(seeded[0] ?? null)
  }, [machineProducts])

  /* ── Auto-refresh ── */
  useEffect(() => {
    if (!selectedDevice || !settings.autoRefresh) return
    const id = setInterval(() => dispatch(GetMachineProducts(selectedDevice)), settings.autoRefresh * 1000)
    return () => clearInterval(id)
  }, [selectedDevice, settings.autoRefresh, dispatch])

  /* ── Vend emulator ── */
  const { dispense, testMotor, emergencyStop, commandLog, dispensingCode } = useVendEmulator({
    mode:     settings.dispenseMode,
    deviceId: selectedDevice,
    dispatch,
    slots,
    setSlots,
  })

  /* ── Stats ── */
  const stats = useMemo(() => {
    const total  = slots.length
    const active = slots.filter((s) => s.active).length
    const low    = slots.filter((s) => s.stock > 0 && s.stock <= settings.lowStockThreshold).length
    const stock  = slots.reduce((sum, s) => sum + s.stock, 0)
    const health = total ? Math.round(slots.filter((s) => s.stock > 0).length / total * 100) : 0
    return { total, active, low, stock, health }
  }, [slots, settings.lowStockThreshold])

  /* ── Device select handler ── */
  const handleDeviceChange = async (e) => {
    const ip = e.target.value
    setSelectedDevice(ip)
    const obj = devices.find((d) => d.ip === ip) || null
    setSelectedDeviceObj(obj)
    if (ip) {
      dispatch(GetMachineProducts(ip))
      // Fetch splash video
      try {
        const apiKey = process.env.NEXT_PUBLIC_API_KEY
        const res = await socketInstance.get(`v1/VmSplash/GetSplashPath/${ip}`, {
          headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
        })
        setVideoUrl(res?.data?.data || '')
      } catch {
        setVideoUrl('')
      }
    } else {
      setVideoUrl('')
      setSelectedDeviceObj(null)
    }
  }

  /* ── Select slot by code (from keypad) ── */
  const handleSelectByCode = useCallback((code) => {
    const code2 = code.toUpperCase().trim()
    const found = slots.find((s) => s.code === code2)
    if (found) {
      setSelectedSlot(found)
    } else {
      Notify('error', `Slot ${code2} not found`)
    }
  }, [slots])

  /* ── Quick-jump input ── */
  const handleJumpKey = (e) => {
    if (e.key === 'Enter') {
      handleSelectByCode(jumpCode)
      setJumpCode('')
    }
  }

  /* ── Keyboard navigation ── */
  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      const idx = slots.findIndex((s) => s.code === selectedSlot?.code)
      if (idx < 0) return
      if (e.key === 'ArrowRight' && idx < slots.length - 1) setSelectedSlot(slots[idx + 1])
      if (e.key === 'ArrowLeft'  && idx > 0)                setSelectedSlot(slots[idx - 1])
      if (e.key === 'ArrowDown') {
        const next = slots.find((s, i) => i > idx && s.row !== selectedSlot.row)
        if (next) setSelectedSlot(next)
      }
      if (e.key === 'ArrowUp') {
        const prev = [...slots].reverse().find((s, i) => slots.length - 1 - i < idx && s.row !== selectedSlot.row)
        if (prev) setSelectedSlot(prev)
      }
      if (e.key === 'Enter') dispense(selectedSlot)
      if (e.key === 'e' || e.key === 'E') setEditSlot(selectedSlot)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [selectedSlot, slots, dispense])

  /* ── Save slot from edit drawer ── */
  const handleSaveSlot = (updated) => {
    setSlots((prev) => prev.map((s) => (s.code === updated.code ? updated : s)))
    if (selectedSlot?.code === updated.code) setSelectedSlot(updated)
    Notify('success', `Slot ${updated.code} updated`)
  }

  /* ── Sync commands ── */
  const requireDevice = () => { if (!selectedDevice) { Notify('error', 'Select a device first'); return false } return true }

  const handleSyncSplash = () => {
    if (!requireDevice()) return
    dispatch(PostUpdateVendiSplash({ id: selectedDevice, updatedData: { type: 'string', data: 'string' } }))
  }
  const handleSyncProducts = () => {
    if (!requireDevice()) return
    dispatch(PostWsUpdateproducts({ id: selectedDevice, updatedData: { type: 'string', data: 'string' } }))
  }
  const handleSyncLanguage = () => {
    if (!requireDevice()) return
    dispatch(PostWsUpdateLanguages({ id: selectedDevice, updatedData: { type: 'string', data: 'string' } }))
  }
  const handleSyncCategory = () => {
    if (!requireDevice()) return
    dispatch(PostWsUpdateCategories({ id: selectedDevice, updatedData: { type: 'string', data: 'string' } }))
  }

  /* ── Boot splash ── */
  if (showSplash) return <SplashBoot onComplete={() => setShowSplash(false)} />

  /* ══════════════════════════════
     RENDER
  ══════════════════════════════ */
  return (
    <div className={styles.page}>

      {/* ── Header ── */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.eyebrow}>Digital Twin</span>
          <h1 className={styles.pageTitle}>Virtual Vending Machine</h1>
          <p className={styles.pageSub}>
            Inspect, override and dispense remotely. Admin can assign products, update stock,
            test motors and push commands to the real machine via socket.
          </p>
        </div>

        <div className={styles.headerRight}>
          {/* Device selector + status + settings */}
          <div className={styles.headerTop}>
            <select
              className={styles.deviceSelect}
              value={selectedDevice}
              disabled={devLoading}
              onChange={handleDeviceChange}
            >
              {devLoading
                ? <option>Loading devices…</option>
                : <>
                    <option value="">— Select device —</option>
                    {devices?.map((d) => (
                      <option key={d.id} value={d.ip}>
                        {d.deviceName || d.name} ({d.ip})
                      </option>
                    ))}
                  </>
              }
            </select>

            {selectedDevice
              ? <span className={styles.onlinePill}>Online</span>
              : <span className={styles.offlinePill}>No device</span>
            }

            <Button variant="ghost" size="sm" onClick={() => setShowSettings(true)}>
              <SvgIcon id="i-cog" className="ic-sm" /> Settings
            </Button>
          </div>

          {/* Sync buttons */}
          <div className={styles.syncBtns}>
            <Button variant="ghost" size="sm" busy={Wsloading} onClick={handleSyncSplash}>
              Sync Splash
            </Button>
            <Button variant="ghost" size="sm" busy={Wsloading} onClick={handleSyncLanguage}>
              Sync Language
            </Button>
            <Button variant="ghost" size="sm" busy={Wsloading} onClick={handleSyncProducts}>
              Sync Product
            </Button>
            <Button variant="ghost" size="sm" busy={Wsloading} onClick={handleSyncCategory}>
              Sync Category
            </Button>
          </div>
        </div>
      </header>

      {/* ── Stats row ── */}
      <div className={styles.statsRow}>
        {[
          { label: 'Total Slots',  value: stats.total  },
          { label: 'Active Slots', value: stats.active },
          { label: 'Low Stock',    value: stats.low    },
          { label: 'Total Stock',  value: stats.stock  },
        ].map(({ label, value }) => (
          <div key={label} className={styles.statCard}>
            <p className={styles.statLabel}>{label}</p>
            <p className={styles.statVal}>{value}</p>
          </div>
        ))}
      </div>

      {/* Machine health bar */}
      <div className={styles.healthWrap}>
        <span className={styles.healthLabel}>Machine health</span>
        <div className={styles.healthTrack}>
          <div
            className={styles.healthFill}
            style={{ width: `${stats.health}%`, background: healthColor(stats.health) }}
          />
        </div>
        <span className={styles.healthPct}>{stats.health}%</span>
        <span style={{ fontSize: 11, color: 'var(--ink-4)' }}>
          ({slots.filter((s) => s.stock > 0).length} of {stats.total} slots stocked)
        </span>
      </div>

      {/* ── Main grid ── */}
      <div className={styles.grid}>

        {/* ── Machine Shell (left) ── */}
        <div className={styles.vmShell}>
          {/* Shell header */}
          <div className={styles.vmShellHead}>
            {/* View toggle */}
            <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,.07)', borderRadius: 'var(--radius-sm)', padding: 3 }}>
              {['products', 'splash'].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setViewMode(v)}
                  style={{
                    padding: '4px 12px', fontSize: 12, fontWeight: 600,
                    borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer',
                    background: viewMode === v ? 'rgba(255,255,255,.14)' : 'transparent',
                    color: viewMode === v ? '#f1ede0' : 'rgba(255,255,255,.4)',
                    textTransform: 'capitalize', transition: 'all .15s',
                  }}
                >
                  {v === 'products' ? '⬜ Product Slots' : '🎬 Splash Preview'}
                </button>
              ))}
            </div>

            {/* Quick-jump input */}
            <input
              ref={jumpRef}
              className={styles.jumpInput}
              placeholder="Jump to slot…"
              value={jumpCode}
              onChange={(e) => setJumpCode(e.target.value.toUpperCase().slice(0, 3))}
              onKeyDown={handleJumpKey}
              maxLength={3}
            />

            {/* Device badge */}
            {selectedDeviceObj && (
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,.35)', fontFamily: 'monospace' }}>
                {selectedDeviceObj.deviceName} · {selectedDeviceObj.ip}
              </span>
            )}
          </div>

          {/* Shell body */}
          <div className={styles.vmBody}>
            {viewMode === 'products' && (
              <>
                {!selectedDevice ? (
                  <div className={styles.noDevice}>
                    <span className={styles.noDeviceIcon}>🖥️</span>
                    <p className={styles.noDeviceText}>Select a device to load its slot layout</p>
                    <p className={styles.noDeviceSub}>Showing demo data — use the dropdown above</p>
                  </div>
                ) : loadingproducts ? (
                  <div className={styles.noDevice}>
                    <p className={styles.noDeviceText}>Loading products…</p>
                  </div>
                ) : null}

                {/* Slot grid always renders (shows demo or real data) */}
                <SlotGrid
                  slots={slots}
                  selectedSlot={selectedSlot}
                  onSelectSlot={setSelectedSlot}
                  dispensingCode={dispensingCode}
                  settings={settings}
                />
              </>
            )}

            {viewMode === 'splash' && (
              <SplashView
                videoUrl={videoUrl}
                deviceName={selectedDeviceObj?.deviceName}
              />
            )}
          </div>
        </div>

        {/* ── Control Panel (right) ── */}
        <CommandPanel
          selectedSlot={selectedSlot}
          onSelectByCode={handleSelectByCode}
          dispense={dispense}
          testMotor={testMotor}
          emergencyStop={emergencyStop}
          commandLog={commandLog}
          dispensingCode={dispensingCode}
          isLive={settings.dispenseMode === 'live'}
        />
      </div>

      {/* ── Drawers ── */}
      <MachineSettings
        open={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onChange={setSettings}
        slots={slots}
      />

      <SlotEditDrawer
        slot={editSlot}
        onSave={handleSaveSlot}
        onClose={() => setEditSlot(null)}
      />
    </div>
  )
}
