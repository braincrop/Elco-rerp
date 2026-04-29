'use client'
import React, { useEffect, useState } from 'react'
import { Card, CardBody, Input, Row, Col, Alert, Spinner } from 'reactstrap'
import { Icon } from '@iconify/react'
import { useDispatch, useSelector } from 'react-redux'
import { allDevices, GetAllDevices } from '@/redux/slice/devicesSlice/DevicesSlice'
import {
  AllWebSocketCommandSlice,
  PostUpdateVendiSplash,
  PostWsUpdateCategories,
  PostWsUpdateLanguages,
  PostWsUpdateproducts,
} from '@/redux/slice/WebSocketCommands/WebSocketSlice'
import { useTheme } from '@/context/BrandingContext'

const Page = () => {
  const dispatch = useDispatch()
  const { theme } = useTheme()
  const [selectedDevice, setSelectedDevice] = useState('')
  const { Wsloading } = useSelector(AllWebSocketCommandSlice)
  const { devices, loading } = useSelector(allDevices)
  const [activeCard, setActiveCard] = useState(null)

  useEffect(() => {
    dispatch(GetAllDevices())
  }, [])

  const handleUpdateSplash = async () => {
    if (!selectedDevice) return
    setActiveCard('splash')
    try {
      await dispatch(
        PostUpdateVendiSplash({
          id: selectedDevice,
          updatedData: {
            type: 'string',
            data: 'string',
          },
        }),
      ).unwrap()
    } finally {
      setActiveCard(null)
    }
  }

  const handleUpdateproducts = async () => {
    if (!selectedDevice) return
    setActiveCard('product')
    try {
      await dispatch(
        PostWsUpdateproducts({
          id: selectedDevice,
          updatedData: {
            type: 'string',
            data: 'string',
          },
        }),
      ).unwrap()
    } finally {
      setActiveCard(null)
    }
  }

  const handleUpdateLanguages = async () => {
    if (!selectedDevice) return
    setActiveCard('language')
    try {
      await dispatch(
        PostWsUpdateLanguages({
          id: selectedDevice,
          updatedData: {
            type: 'string',
            data: 'string',
          },
        }),
      ).unwrap()
    } finally {
      setActiveCard(null)
    }
  }

  const handleUpdateCategory = async () => {
    if (!selectedDevice) return
    setActiveCard('category')
    try {
      await dispatch(
        PostWsUpdateCategories({
          id: selectedDevice,
          updatedData: {
            type: 'string',
            data: 'string',
          },
        }),
      ).unwrap()
    } finally {
      setActiveCard(null)
    }
  }

  const isSplashLoading = activeCard === 'splash'
  const isProductLoading = activeCard === 'product'
  const isLanguageLoading = activeCard === 'language'
  const isCategoryLoading = activeCard === 'category'
  const isCardDisabled = loading || !selectedDevice || activeCard !== null
  const cardClass = `text-center p-4 h-100 shadow-sm cursor-pointer ${isCardDisabled ? 'opacity-50' : ''}`

  const cardStyle = {
    cursor: isCardDisabled ? 'not-allowed' : 'pointer',
    pointerEvents: isCardDisabled ? 'none' : 'auto',
  }
  return (
    <div className="container py-4">
      <div className="p-3" style={{ backgroundColor: theme.primaryColor }}>
        <h5 className="mb-3">Select Devices</h5>
        <Input
          type="select"
          className="mb-4"
          value={selectedDevice}
          disabled={loading}
          onChange={(e) => setSelectedDevice(e.target.value)}
          style={{ backgroundColor: 'transparent' }}>
          {loading ? (
            <option>Loading devices...</option>
          ) : (
            <>
              <option value="">Select Device</option>
              {devices
                // ?.filter((d) => d.isActive)
                .map((device) => (
                  <option key={device.id} value={device.ip} style={{ color: '#000' }}>
                    {device.deviceName} ({device.ip})
                  </option>
                ))}
            </>
          )}
        </Input>
        <Row className="g-3">
          <Col md="6">
            <Card className={cardClass} style={cardStyle} onClick={handleUpdateSplash}>
              {isSplashLoading && (
                <div className="custom-card-overlay">
                  <Spinner size="sm" />
                </div>
              )}
              <Icon icon="solar:gallery-linear" width="40" className="mb-2 text-success d-block mx-auto" />
              <h6 className="fw-bold">Update Splash</h6>
              <p className="text-muted mb-0">Refresh the device splash screen</p>
            </Card>
          </Col>

          <Col md="6">
            <Card className={cardClass} style={cardStyle} onClick={handleUpdateproducts}>
              {isProductLoading && (
                <div className="custom-card-overlay">
                  <Spinner size="sm" />
                </div>
              )}

              <Icon icon="solar:box-linear" width="40" className="mb-2 text-success d-block mx-auto" />
              <h6 className="fw-bold">Update Product</h6>
              <p className="text-muted mb-0">Update vending product info</p>
            </Card>
          </Col>

          <Col md="6">
            <Card className={cardClass} style={cardStyle} onClick={handleUpdateLanguages}>
              {isLanguageLoading && (
                <div className="custom-card-overlay">
                  <Spinner size="sm" />
                </div>
              )}
              <Icon icon="ion:language-sharp" width="40" className="mb-2 text-success d-block mx-auto" />
              <h6 className="fw-bold">Update Languages</h6>
              <p className="text-muted mb-0">Sync Languages to Vending Machines</p>
            </Card>
          </Col>
          <Col md="6">
            <Card className={cardClass} style={cardStyle} onClick={handleUpdateCategory}>
              {isCategoryLoading && (
                <div className="custom-card-overlay">
                  <Spinner size="sm" />
                </div>
              )}
              <Icon icon="mdi:shape-outline" width="40" className="mb-2 text-success d-block mx-auto" />
              <h6 className="fw-bold">Update Category</h6>
              <p className="text-muted mb-0">Sync Category to Vending Machines</p>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default Page
