'use client'
import WorldVectorMap from '@/components/VectorMap/WorldMap'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import React from 'react'
import { Card, CardBody, CardHeader, CardTitle, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row } from 'react-bootstrap'
const CountryMap = () => {
  const salesLocationOptions = {
    map: 'world',
    zoomOnScroll: true,
    zoomButtons: false,
    markersSelectable: true,
    markers: [
      {
        name: 'Canada',
        coords: [56.1304, -106.3468],
      },
      {
        name: 'Brazil',
        coords: [-14.235, -51.9253],
      },
      {
        name: 'Russia',
        coords: [61, 105],
      },
      {
        name: 'China',
        coords: [35.8617, 104.1954],
      },
      {
        name: 'United States',
        coords: [37.0902, -95.7129],
      },
    ],
    markerStyle: {
      initial: {
        fill: '#7f56da',
      },
      selected: {
        fill: '#1bb394',
      },
    },
    labels: {
      markers: {},
    },
    regionStyle: {
      initial: {
        fill: 'rgba(169,183,197, 0.3)',
        fillOpacity: 1,
      },
    },
  }
  return (
    <>
     <Col lg={6}>
  <Card
    className="border-0 rounded-4 card-height-100"
    style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}
  >
    <CardHeader className="border-0 bg-transparent px-4 pt-4 pb-0">
      <div className="d-flex align-items-center justify-content-between">

        {/* Title */}
        <div className="d-flex align-items-center gap-2">
          <div
            className="bg-info bg-opacity-10 text-info rounded-3 d-flex align-items-center justify-content-center"
            style={{ width: 36, height: 36 }}
          >
            <IconifyIcon icon="solar:map-point-outline" width={18} />
          </div>
          <div>
            <h5 className="fw-bold mb-0">Sessions by Country</h5>
            <p className="text-muted mb-0" style={{ fontSize: 11 }}>Live geographic traffic</p>
          </div>
        </div>

        {/* Dropdown */}
        <Dropdown>
          <DropdownToggle
            variant="secondary"
            className="btn btn-sm border-0 rounded-3 d-flex align-items-center gap-1 fw-semibold"
            style={{
              fontSize: 12,
              background: 'rgba(0,0,0,0.04)',
              color: '#6c757d',
              padding: '6px 12px',
            }}
          >
            View Data
            <IconifyIcon icon="bx:bx-chevron-down" width={16} />
          </DropdownToggle>
          <DropdownMenu className="dropdown-menu-end border-0 shadow rounded-3" style={{ fontSize: 13 }}>
            <DropdownItem href="">
              <IconifyIcon icon="mdi:download-outline" width={15} className="me-2 text-muted" />
              Download
            </DropdownItem>
            <DropdownItem href="">
              <IconifyIcon icon="mdi:export" width={15} className="me-2 text-muted" />
              Export
            </DropdownItem>
            <DropdownItem href="">
              <IconifyIcon icon="mdi:import" width={15} className="me-2 text-muted" />
              Import
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <hr className="mt-3 mb-0 opacity-10" />
    </CardHeader>

    <CardBody className="px-4 pt-3">
      <Row className="align-items-center">

        {/* Map */}
        <Col lg={7}>
          <div style={{ height: 280 }}>
            <WorldVectorMap height="280px" width="100%" options={salesLocationOptions} />
          </div>
        </Col>

        {/* Country List */}
        <Col lg={5} dir="ltr">
          <div className="d-flex flex-column gap-3">
            {[
              { flag: 'circle-flags:us', name: 'United States', value: '659k', percent: 82, color: '#0d6efd' },
              { flag: 'circle-flags:ru', name: 'Russia',         value: '485k', percent: 70, color: '#0dcaf0' },
              { flag: 'circle-flags:cn', name: 'China',          value: '355k', percent: 65, color: '#ffc107' },
              { flag: 'circle-flags:ca', name: 'Canada',         value: '204k', percent: 55, color: '#198754' },
            ].map((country, i) => (
              <div key={i}>
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <div className="d-flex align-items-center gap-2">
                    <IconifyIcon icon={country.flag} style={{ fontSize: 18 }} />
                    <span className="fw-medium" style={{ fontSize: 13 }}>{country.name}</span>
                  </div>
                  <span className="fw-bold" style={{ fontSize: 13 }}>{country.value}</span>
                </div>
                <div
                  className="rounded-pill overflow-hidden"
                  style={{ height: 5, background: 'rgba(0,0,0,0.06)' }}
                >
                  <div
                    className="h-100 rounded-pill"
                    style={{
                      width: `${country.percent}%`,
                      background: country.color,
                      transition: 'width 1s ease',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Col>
      </Row>
    </CardBody>
  </Card>
</Col>
    </>
  )
}
export default CountryMap
