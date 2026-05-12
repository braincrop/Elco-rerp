// 'use client'
// import React, { useEffect, useState } from 'react'
// import { Input, Spinner } from 'reactstrap'
// import { socketInstance } from '../../../api/axiosConfig'
// import { useTheme } from '@/context/BrandingContext'
// import { allDevices, GetAllDevices } from '@/redux/slice/devicesSlice/DevicesSlice'
// import { useDispatch, useSelector } from 'react-redux'
// import VirtualVmSplash from '@/components/VirtualVMSplash/VirtualVmSplash'
// import { motion } from "framer-motion";
// import "bootstrap/dist/css/bootstrap.min.css";
// import {
//   Settings,
//   Package,
//   Power,
//   Wifi,
//   Wrench,
//   ShoppingCart,
//   Plus,
//   Minus,
//   Save,
//   RefreshCw,
//   AlertTriangle,
//   CheckCircle2,
//   Edit3,
//   X,
// } from "lucide-react";
// const apiKey = process.env.NEXT_PUBLIC_API_KEY

// const Page = () => {
//   const [selectedDevice, setSelectedDevice] = useState('')
//   const [videoLoading, setVideoLoading] = useState(false)
//   const [videoUrl, setVideoUrl] = useState('')
//   const { theme } = useTheme()
//   const { devices, loading } = useSelector(allDevices)
//   const dispatch = useDispatch()

//   // fallback local video

//   useEffect(() => {
//     dispatch(GetAllDevices())
//   }, [])

//   const localVideo = '/video/3198159-hd_1920_1080_25fps.mp4'

//   // API FUNCTION
//   const GetAllVmSplash = async (ip) => {
//     try {
//       setVideoLoading(true)
//       const response = await socketInstance.get(`v1/VmSplash/GetSplashPath/${ip}`, {
//         headers: {
//           'Content-Type': 'application/json',
//           'x-api-key': apiKey,
//         },
//       })

//       console.log('response', response)
//       const apiVideo = response?.data?.data

//       if (apiVideo) {
//         setVideoUrl(apiVideo)
//       } else {
//         setVideoUrl(localVideo)
//       }
//     } catch (error) {
//       console.log(error)
//       setVideoUrl(localVideo)
//     } finally {
//       setVideoLoading(false)
//     }
//   }
//   const handleInputValueChange = (e) => {
//     const ip = e.target.value
//     setSelectedDevice(ip)
//     if (ip) {
//       GetAllVmSplash(ip)
//     }
//   }
//   return (
//     <div
//       className="position-relative overflow-hidden"
//       style={{
//         minHeight: '100vh',
//         backgroundColor: !videoUrl ? theme.primaryColor : 'transparent',
//       }}>
//       {(videoUrl || localVideo) && (
//         <video
//           src={videoUrl || localVideo}
//           autoPlay
//           muted
//           loop
//           playsInline
//           className="position-absolute top-0 start-0 w-100 h-100"
//           style={{
//             objectFit: 'cover',
//             zIndex: 0,
//           }}
//         />
//       )}
//       <div
//         className="position-absolute top-0 start-0 w-100 h-100"
//         style={{
//           backgroundColor: 'rgba(0,0,0,0.4)',
//           zIndex: 1,
//         }}
//       />
//       <div className="position-relative p-4" style={{ zIndex: 2 }}>
//         <VirtualVmSplash />
//         <div className="mb-4">
//           <h4 className="text-white mb-3 fw-bold">Select Device</h4>
//           <Input
//             type="select"
//             value={selectedDevice}
//             disabled={loading}
//             onChange={handleInputValueChange}
//             style={{
//               backgroundColor: '#ffffff',
//               borderRadius: '12px',
//               height: '50px',
//               border: 'none',
//               fontWeight: 500,
//             }}>
//             {loading ? (
//               <option>Loading devices...</option>
//             ) : (
//               <>
//                 <option value="">Select Device</option>
//                 {devices?.map((device) => (
//                   <option key={device.id} value={device.ip}>
//                     {device.deviceName} ({device.ip})
//                   </option>
//                 ))}
//               </>
//             )}
//           </Input>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Page
'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Input, Spinner } from 'reactstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
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
import { useTheme } from '@/context/BrandingContext'
import { Eye, EyeOff } from 'lucide-react'
import { allDevices, GetAllDevices } from '@/redux/slice/devicesSlice/DevicesSlice'
import { useDispatch, useSelector } from 'react-redux'
import VirtualVmSplash from '@/components/VirtualVMSplash/VirtualVmSplash'
import { socketInstance } from '@/api/axiosConfig'

const initialSlots = [
  {
    code: 'A1',
    motorNo: 1,
    row: 'A',
    productName: 'Potato Chips',
    price: 150,
    stock: 7,
    capacity: 10,
    image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=300&auto=format&fit=crop&q=70',
    active: true,
    category: 'Snacks',
  },
  {
    code: 'A2',
    motorNo: 2,
    row: 'A',
    productName: 'Peanuts',
    price: 120,
    stock: 5,
    capacity: 10,
    image: 'https://images.unsplash.com/photo-1559048199-641a0ac8b55e?w=300&auto=format&fit=crop&q=70',
    active: true,
    category: 'Snacks',
  },
  {
    code: 'A3',
    motorNo: 3,
    row: 'A',
    productName: 'Candy Pack',
    price: 90,
    stock: 9,
    capacity: 10,
    image: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=300&auto=format&fit=crop&q=70',
    active: true,
    category: 'Candy',
  },
  {
    code: 'A4',
    motorNo: 4,
    row: 'A',
    productName: 'Popcorn',
    price: 180,
    stock: 6,
    capacity: 10,
    image: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=300&auto=format&fit=crop&q=70',
    active: true,
    category: 'Snacks',
  },
  {
    code: 'A5',
    motorNo: 5,
    row: 'A',
    productName: 'Nuts Mix',
    price: 220,
    stock: 4,
    capacity: 10,
    image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=300&auto=format&fit=crop&q=70',
    active: true,
    category: 'Snacks',
  },
  {
    code: 'B1',
    motorNo: 6,
    row: 'B',
    productName: 'Chocolate Bar',
    price: 130,
    stock: 8,
    capacity: 10,
    image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=300&auto=format&fit=crop&q=70',
    active: true,
    category: 'Chocolate',
  },
  {
    code: 'B2',
    motorNo: 7,
    row: 'B',
    productName: 'Mini Cookies',
    price: 110,
    stock: 3,
    capacity: 10,
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=300&auto=format&fit=crop&q=70',
    active: true,
    category: 'Bakery',
  },
  {
    code: 'B3',
    motorNo: 8,
    row: 'B',
    productName: 'Fries Pack',
    price: 160,
    stock: 10,
    capacity: 10,
    image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=300&auto=format&fit=crop&q=70',
    active: true,
    category: 'Snacks',
  },
  {
    code: 'B4',
    motorNo: 9,
    row: 'B',
    productName: 'Mint Gum',
    price: 80,
    stock: 9,
    capacity: 10,
    image: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=300&auto=format&fit=crop&q=70',
    active: false,
    category: 'Candy',
  },
  {
    code: 'B5',
    motorNo: 10,
    row: 'B',
    productName: 'Protein Bar',
    price: 250,
    stock: 2,
    capacity: 10,
    image: 'https://images.unsplash.com/photo-1622484212850-eb596d769edc?w=300&auto=format&fit=crop&q=70',
    active: true,
    category: 'Healthy',
  },
  ...Array.from({ length: 10 }).map((_, i) => ({
    code: `C${i + 1}`,
    motorNo: 11 + i,
    row: 'C',
    productName: i % 2 === 0 ? 'Energy Drink' : 'Lemon Soda',
    price: i % 2 === 0 ? 280 : 180,
    stock: Math.max(1, 9 - i),
    capacity: 10,
    image:
      i % 2 === 0
        ? 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=300&auto=format&fit=crop&q=70'
        : 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=300&auto=format&fit=crop&q=70',
    active: true,
    category: 'Drinks',
  })),
  ...Array.from({ length: 10 }).map((_, i) => ({
    code: `D${i + 1}`,
    motorNo: 21 + i,
    row: 'D',
    productName: i % 2 === 0 ? 'Orange Juice' : 'Iced Tea',
    price: i % 2 === 0 ? 210 : 190,
    stock: Math.max(0, 8 - i),
    capacity: 10,
    image:
      i % 2 === 0
        ? 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=300&auto=format&fit=crop&q=70'
        : 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&auto=format&fit=crop&q=70',
    active: true,
    category: 'Drinks',
  })),
]
const vvmStyles = `
.vvm-root {
  min-height: 100vh;
  background: #050708;
  color: #f8fafc;
}

.vvm-page {
  max-width: 1440px;
}

.vvm-eyebrow {
  color: #facc15;
  font-size: 0.85rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.32em;
}

.vvm-title {
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 950;
  color: #fff;
  line-height: 1;
}

.vvm-muted {
  color: #94a3b8;
}

.vvm-btn {
  border: 0;
  border-radius: 1.15rem;
  padding: 0.8rem 1rem;
  font-weight: 900;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: 0.18s ease;
}

.vvm-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.vvm-btn-primary {
  background: #facc15;
  color: #071014;
}

.vvm-btn-primary:hover:not(:disabled) {
  background: #fde047;
}

.vvm-btn-soft {
  background: rgba(255,255,255,0.08);
  color: #fff;
  border: 1px solid rgba(255,255,255,0.1);
}

.vvm-btn-soft:hover:not(:disabled) {
  background: rgba(255,255,255,0.14);
}

.vvm-btn-danger {
  background: rgba(239,68,68,0.1);
  color: #fecaca;
  border: 1px solid rgba(248,113,113,0.28);
}

.vvm-card {
  background: rgba(255,255,255,0.045);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 1.6rem;
  box-shadow: 0 20px 60px rgba(0,0,0,0.24);
}

.vvm-machine-shell {
  background: #111416;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 2.5rem;
  box-shadow: 0 30px 90px rgba(0,0,0,0.38);
}

.vvm-glass-outer {
  // background: linear-gradient(180deg, #101826 0%, #020617 52%, #000 100%);
  // border: 8px solid #050607;
  border-radius: 2rem;
  box-shadow: inset 0 0 70px rgba(255,255,255,0.04);
}

.vvm-glass-inner {
  border-radius: 1.5rem;
  border: 1px solid rgba(186,230,253,0.1);
  background: rgba(186,230,253,0.035);
  box-shadow: inset 0 0 80px rgba(125,211,252,0.08);
}

.vvm-row-label {
  background: #facc15;
  color: #071014;
  border-radius: 0.55rem;
  padding: 0.35rem 0.6rem;
  font-size: 0.75rem;
  font-weight: 950;
}

.vvm-line {
  height: 1px;
  background: rgba(255,255,255,0.1);
  flex: 1;
}

.vvm-slot-grid-small {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

.vvm-slot-grid-large {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

@media (min-width: 768px) {
  .vvm-slot-grid-small {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
  .vvm-slot-grid-large {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
}

@media (min-width: 1200px) {
  .vvm-slot-grid-large {
    grid-template-columns: repeat(10, minmax(0, 1fr));
  }
}

.vvm-slot {
  width: 100%;
  text-align: left;
  overflow: hidden;
  border-radius: 1.2rem;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.075);
  color: #fff;
  padding: 0.5rem;
  transition: 0.18s ease;
}

.vvm-slot:hover {
  background: rgba(255,255,255,0.13);
}

.vvm-slot-selected {
  border-color: #fde047;
  background: rgba(254,240,138,0.14);
  box-shadow: 0 0 30px rgba(250,204,21,0.28);
}

.vvm-slot-disabled {
  opacity: 0.45;
  filter: grayscale(1);
}

.vvm-slot-image-wrap {
  position: relative;
  height: 82px;
  overflow: hidden;
  border-radius: 0.9rem;
  background: rgba(0,0,0,0.35);
}

.vvm-slot-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.vvm-slot-shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(0deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.08) 65%, transparent 100%);
}

.vvm-slot-code {
  position: absolute;
  left: 0.35rem;
  bottom: 0.35rem;
  background: rgba(0,0,0,0.75);
  color: #fff;
  font-size: 0.65rem;
  font-weight: 950;
  padding: 0.2rem 0.38rem;
  border-radius: 0.35rem;
}

.vvm-dispensing-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.68);
  color: #fff;
  font-size: 0.8rem;
  font-weight: 900;
}

.vvm-product-name {
  font-size: 0.78rem;
  font-weight: 850;
  color: #fff;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.vvm-price {
  color: #fde68a;
  font-size: 0.72rem;
  font-weight: 950;
}

.vvm-stock-ok {
  color: #86efac;
  font-size: 0.68rem;
}

.vvm-stock-low {
  color: #fca5a5;
  font-size: 0.68rem;
}

.vvm-stock-bar {
  height: 0.38rem;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(255,255,255,0.1);
}

.vvm-stock-fill-ok {
  height: 100%;
  border-radius: 999px;
  background: #4ade80;
}

.vvm-stock-fill-low {
  height: 100%;
  border-radius: 999px;
  background: #f87171;
}

.vvm-panel {
  height: 100%;
  background: #111416;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 2rem;
  box-shadow: 0 30px 90px rgba(0,0,0,0.38);
}

.vvm-online-pill {
  background: rgba(16,185,129,0.1);
  color: #6ee7b7;
  border-radius: 999px;
  padding: 0.35rem 0.7rem;
  font-size: 0.75rem;
  font-weight: 850;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.vvm-lcd-shell {
  border: 1px solid rgba(103,232,249,0.22);
  background: rgba(103,232,249,0.1);
  border-radius: 1.3rem;
}

.vvm-lcd-screen {
  min-height: 90px;
  background: #dff8ff;
  color: #0f172a;
  border-radius: 1rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.vvm-keypad-box {
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.05);
  border-radius: 1.3rem;
}

.vvm-keypad-display {
  background: #000;
  color: #bef264;
  border-radius: 0.8rem;
  padding: 0.55rem 0.8rem;
  min-width: 105px;
  font-size: 1.25rem;
  font-weight: 950;
  letter-spacing: 0.16em;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.vvm-key {
  border-radius: 0.8rem;
  border: 1px solid rgba(255,255,255,0.1);
  background: #1e293b;
  color: #fff;
  padding: 0.85rem 0.5rem;
  font-weight: 950;
}

.vvm-key:hover {
  background: #334155;
}

.vvm-command-box {
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(0,0,0,0.28);
  border-radius: 1.3rem;
}

.vvm-push-button {
  width: 100%;
  max-width: 430px;
  border-radius: 1.25rem;
  border: 4px solid #321a10;
  background: #fff4d2;
  color: #b91c1c;
  padding: 1rem 2rem;
  font-size: 2rem;
  font-weight: 950;
  letter-spacing: 0.25em;
  box-shadow: 0 16px 45px rgba(0,0,0,0.32);
}

.vvm-push-button:hover {
  background: #fff;
}

.vvm-editor {
  background: #15181b;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 2rem;
  box-shadow: 0 30px 90px rgba(0,0,0,0.35);
}

.vvm-input {
  width: 100%;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(0,0,0,0.34);
  color: #fff;
  border-radius: 0.9rem;
  padding: 0.8rem 0.95rem;
  outline: none;
}

.vvm-input:focus {
  border-color: #facc15;
}

.vvm-close-btn {
  border: 0;
  border-radius: 999px;
  background: rgba(255,255,255,0.1);
  color: #fff;
  height: 38px;
  width: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.vvm-close-btn:hover {
  background: rgba(255,255,255,0.16);
}

.vvm-splash {
  min-height: 100vh;
  background: #050708;
  color: #fff;
  position: relative;
  overflow: hidden;
}

.vvm-splash-glow-one {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 520px;
  height: 520px;
  transform: translate(-50%, -50%);
  border-radius: 999px;
  background: rgba(250,204,21,0.1);
  filter: blur(70px);
}

.vvm-splash-glow-two {
  position: absolute;
  right: 4rem;
  bottom: 4rem;
  width: 300px;
  height: 300px;
  border-radius: 999px;
  background: rgba(103,232,249,0.1);
  filter: blur(70px);
}

.vvm-splash-card {
  position: relative;
  width: 100%;
  max-width: 1100px;
  background: rgba(16,19,21,0.92);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 2.5rem;
  box-shadow: 0 35px 100px rgba(0,0,0,0.5);
  backdrop-filter: blur(12px);
}

.vvm-splash-icon {
  height: 64px;
  width: 64px;
  border-radius: 1.5rem;
  background: #facc15;
  color: #071014;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 18px 40px rgba(250,204,21,0.18);
}

.vvm-progress-track {
  height: 1rem;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(255,255,255,0.1);
}

.vvm-progress-fill {
  height: 100%;
  border-radius: 999px;
  background: #facc15;
}

.vvm-step {
  border-radius: 1.1rem;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.035);
  color: #94a3b8;
  padding: 0.8rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-weight: 850;
}

.vvm-step-active {
  border-color: rgba(250,204,21,0.34);
  background: rgba(250,204,21,0.1);
  color: #fef3c7;
}

.vvm-step-done {
  border-color: rgba(110,231,183,0.22);
  background: rgba(52,211,153,0.1);
  color: #a7f3d0;
}

.vvm-step-dot {
  height: 20px;
  width: 20px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.22);
}

.vvm-log-screen {
  height: 360px;
  overflow: hidden;
  border-radius: 1.25rem;
  border: 1px solid rgba(190,242,100,0.1);
  background: #000;
  color: #bef264;
  padding: 1rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.9rem;
}

.vvm-log-time {
  color: #64748b;
}
`
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
          <p className="vvm-eyebrow mb-1" style={{ fontSize: '0.7rem' }}>
            Control
          </p>
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
              <p className="h5 fw-black mb-1">
                {selectedSlot.code} / Motor {selectedSlot.motorNo}
              </p>
              <p className="fw-bold mb-1">{selectedSlot.productName}</p>
              <p className="mb-0 small">
                PKR {selectedSlot.price} | Stock {selectedSlot.stock}
              </p>
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
          <p className="vvm-eyebrow mb-1" style={{ fontSize: '0.7rem' }}>
            Admin Editor
          </p>
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
            <button
              type="button"
              onClick={() => update('stock', Math.min(form.capacity, form.stock + 1))}
              className="vvm-btn vvm-btn-soft rounded-start-0">
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
  )
}

export default function Page() {
  const { theme } = useTheme()
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
  const apiKey = process.env.NEXT_PUBLIC_API_KEY
  const stats = useMemo(() => {
    const total = slots.length
    const active = slots.filter((x) => x.active).length
    const low = slots.filter((x) => x.stock <= 2).length
    const stock = slots.reduce((sum, x) => sum + x.stock, 0)
    return { total, active, low, stock }
  }, [slots])

  const rows = useMemo(() => {
    return slots.reduce((acc, slot) => {
      acc[slot.row] = acc[slot.row] || []
      acc[slot.row].push(slot)
      return acc
    }, {})
  }, [slots])

  useEffect(() => {
    dispatch(GetAllDevices())
  }, [])

  const updateSelectedFromSlots = (updatedSlots, code) => {
    const updated = updatedSlots.find((x) => x.code === code)
    if (updated) setSelectedSlot(updated)
  }

  const localVideo = '/video/3198159-hd_1920_1080_25fps.mp4'
  const GetAllVmSplash = async (ip) => {
    try {
      setVideoLoading(true)
      const response = await socketInstance.get(`v1/VmSplash/GetSplashPath/${ip}`, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
      })

      console.log('response', response)
      const apiVideo = response?.data?.data

      if (apiVideo) {
        setVideoUrl(apiVideo)
      } else {
        setVideoUrl(localVideo)
      }
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
    setCommandStatus({
      type: 'success',
      message: `Motor test command sent for ${selectedSlot.code} / Motor ${selectedSlot.motorNo}.`,
    })
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

  return (
    <div className="vvm-root py-4 py-md-5">
      <style>{vvmStyles}</style>
      <div className="container-fluid vvm-page">
        <header className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center justify-content-between gap-4 mb-4">
          <div>
            <p className="vvm-eyebrow mb-2">Digital Twin</p>
            <h1 className="vvm-title mb-3">Virtual Vending Machine</h1>
            <p className="vvm-muted mb-0" style={{ maxWidth: 760 }}>
              Admin can assign products, update stock, test motors, and send dispense commands to the real vending machine through backend protocol
              integration.
            </p>
          </div>
          <div className="d-flex flex-wrap gap-3">
            <button type="button" className="vvm-btn vvm-btn-soft">
              <RefreshCw size={17} /> Sync Machine
            </button>
            <button type="button" className="vvm-btn vvm-btn-primary">
              <Settings size={17} /> Settings
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
                  {/* <h6 className="text-white mb-3 fw-bold">Select Device</h6> */}
                  <Input type="select" value={selectedDevice} disabled={loading} onChange={handleInputValueChange}>
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
                  </Input>
                </div>
                <div className="align-items-center">
                  <button type="button" onClick={() => setShowProducts(!showProducts)} className="btn btn-light rounded-pill px-4 fw-semibold gap-2">
                    {showProducts ? (
                      <>
                        <EyeOff size={18} />
                      </>
                    ) : (
                      <>
                        <Eye size={18} />
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div
                className="vvm-glass-outer p-3 p-md-4 position-relative overflow-hidden"
                style={{
                  minHeight: '100vh',
                }}>
                <video
                  src={videoUrl || localVideo}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="position-absolute top-0 start-0 w-100 h-100"
                  style={{
                    objectFit: 'cover',
                    zIndex: 0,
                  }}
                />

                <div
                  className="position-absolute top-0 start-0 w-100 h-100"
                  style={{
                    background: 'rgba(0,0,0,0.35)',
                    zIndex: 1,
                  }}
                />
                <div
                  className="position-relative"
                  style={{
                    zIndex: 2,
                  }}>
                  {showProducts && (
                    <>
                      <div className="vvm-glass-inner p-3 p-md-4">
                        {Object.keys(rows).map((row) => (
                          <div key={row} className="mb-4 last-mb-0">
                            <div className="d-flex align-items-center gap-3 mb-2">
                              <span className="vvm-row-label">ROW {row}</span>

                              <div className="vvm-line" />
                            </div>

                            <div className={row === 'A' || row === 'B' ? 'vvm-slot-grid-small' : 'vvm-slot-grid-large'}>
                              {rows[row].map((slot) => (
                                <SlotCard
                                  key={slot.code}
                                  slot={slot}
                                  selected={selectedSlot?.code === slot.code}
                                  onClick={setSelectedSlot}
                                  mode={mode}
                                  dispensing={dispensingCode === slot.code}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
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
  )
}
