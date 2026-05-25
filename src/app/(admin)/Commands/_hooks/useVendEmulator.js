'use client'
import { useState } from 'react'
import { PostWsDispense, PostWsTestMotor } from '@/redux/slice/WebSocketCommands/WebSocketSlice'
import Notify from '@/components/Notify'

/**
 * useVendEmulator
 *
 * Abstracts the dispense/test-motor/emergency-stop commands so the
 * calling component is decoupled from the implementation.
 *
 * mode === 'emulated'  → local state mutation only (no network call)
 * mode === 'live'      → dispatches PostWsDispense / PostWsTestMotor
 *                        to the real socket endpoint via Redux
 *
 * Swap point: changing `mode` in Settings is the only change needed
 * when the physical connection is ready.
 */
export function useVendEmulator({ mode, deviceId, dispatch, slots, setSlots }) {
  const [dispensingCode, setDispensingCode] = useState(null)
  const [commandLog, setCommandLog] = useState([])

  const addLog = (action, slotCode, status) => {
    setCommandLog((prev) =>
      [{ id: Date.now(), time: new Date(), action, slotCode, status }, ...prev].slice(0, 20)
    )
  }

  const dispense = async (slot) => {
    if (!slot) return Notify('error', 'No slot selected')
    if (!slot.active) return Notify('error', 'Slot is inactive')
    if (slot.stock <= 0) return Notify('error', 'Slot is out of stock')

    setDispensingCode(slot.code)

    if (mode === 'live') {
      if (!deviceId) {
        setDispensingCode(null)
        return Notify('error', 'No device selected')
      }
      const result = await dispatch(
        PostWsDispense({ id: deviceId, motorNo: slot.motorNo, slotCode: slot.code })
      )
      const ok = !result.error
      addLog('Dispense', slot.code, ok ? 'success' : 'error')
      setDispensingCode(null)
    } else {
      // Emulated: animate for 1.2 s then decrement stock
      await new Promise((r) => setTimeout(r, 1200))
      setSlots((prev) =>
        prev.map((s) => (s.code === slot.code ? { ...s, stock: Math.max(0, s.stock - 1) } : s))
      )
      addLog('Dispense', slot.code, 'success')
      setDispensingCode(null)
      Notify('success', `Slot ${slot.code} dispensed (emulated)`)
    }
  }

  const testMotor = async (slot) => {
    if (!slot) return Notify('error', 'No slot selected')

    if (mode === 'live') {
      if (!deviceId) return Notify('error', 'No device selected')
      const result = await dispatch(
        PostWsTestMotor({ id: deviceId, motorNo: slot.motorNo, slotCode: slot.code })
      )
      addLog('Test Motor', slot.code, result.error ? 'error' : 'success')
    } else {
      addLog('Test Motor', slot.code, 'success')
      Notify('success', `Motor ${slot.motorNo} test OK (emulated)`)
    }
  }

  const emergencyStop = () => {
    setDispensingCode(null)
    addLog('Emergency Stop', '—', 'warn')
    Notify('error', 'Emergency stop triggered')
  }

  return { dispense, testMotor, emergencyStop, commandLog, dispensingCode }
}
