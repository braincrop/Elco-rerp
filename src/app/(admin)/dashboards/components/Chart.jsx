'use client'
import React from 'react'
import ReactApexChart from 'react-apexcharts'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import CountryMap from './CountryMap'
import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap'
const Chart = () => {
  const salesChart = {
    series: [
      {
        name: 'Page Views',
        type: 'bar',
        data: [34, 65, 46, 68, 49, 61, 42, 44, 78, 52, 63, 67],
      },
      {
        name: 'Clicks',
        type: 'area',
        data: [8, 12, 7, 17, 21, 11, 5, 9, 7, 29, 12, 35],
      },
      {
        name: 'Conversion Ratio',
        type: 'area',
        data: [12, 16, 11, 22, 28, 25, 15, 29, 35, 45, 42, 48],
      },
    ],
    chart: {
      height: 313,
      type: 'line',
      toolbar: {
        show: false,
      },
    },
    stroke: {
      dashArray: [0, 0, 2],
      width: [0, 2, 2],
      curve: 'smooth',
    },
    fill: {
      opacity: [1, 1, 1],
      type: ['solid', 'gradient', 'gradient'],
      gradient: {
        type: 'vertical',
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90],
      },
    },
    markers: {
      size: [0, 0],
      strokeWidth: 2,
      hover: {
        size: 4,
      },
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      min: 0,
      axisBorder: {
        show: false,
      },
    },
    grid: {
      show: true,
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
      padding: {
        top: 0,
        right: -2,
        bottom: 0,
        left: 10,
      },
    },
    legend: {
      show: true,
      horizontalAlign: 'center',
      offsetX: 0,
      offsetY: 5,
      markers: {
        // width: 9,
        // height: 9,
        // radius: 6,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 0,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: '30%',
        barHeight: '70%',
        borderRadius: 3,
      },
    },
    colors: ['#1a80f8', '#17c553', '#7942ed'],
    tooltip: {
      shared: true,
      y: [
        {
          formatter: function (y) {
            if (typeof y !== 'undefined') {
              return y.toFixed(1) + 'k'
            }
            return y
          },
        },
        {
          formatter: function (y) {
            if (typeof y !== 'undefined') {
              return y.toFixed(1) + 'k'
            }
            return y
          },
        },
      ],
    },
  }
  return (
    <>
      <Row className="g-4">
        <Col lg={6}>
          <Card className="border-0 rounded-4 h-100" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}>
            <CardHeader className="border-0 bg-transparent px-4 pt-4 pb-0">
              <div className="d-flex align-items-center justify-content-between">
                {/* Title */}
                <div className="d-flex align-items-center gap-2">
                  <div
                    className="bg-primary bg-opacity-10 text-primary rounded-3 d-flex align-items-center justify-content-center"
                    style={{ width: 36, height: 36 }}>
                    <IconifyIcon icon="solar:chart-2-outline" width={18} />
                  </div>
                  <div>
                    <h5 className="fw-bold mb-0">Top Pages</h5>
                    <p className="text-muted mb-0" style={{ fontSize: 11 }}>
                      Traffic performance
                    </p>
                  </div>
                </div>

                {/* Filter Buttons */}
                <div className="d-flex align-items-center rounded-3 p-1 gap-1" style={{ background: 'rgba(0,0,0,0.04)' }}>
                  {['ALL', '1M', '6M', '1Y'].map((label) => (
                    <button
                      key={label}
                      type="button"
                      className="btn btn-sm border-0 rounded-2 fw-semibold"
                      style={{
                        fontSize: 11,
                        padding: '4px 10px',
                        background: label === 'ALL' ? '#fff' : 'transparent',
                        color: label === 'ALL' ? '#0d6efd' : '#6c757d',
                        boxShadow: label === 'ALL' ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={(e) => {
                        if (label !== 'ALL') e.currentTarget.style.color = '#0d6efd'
                      }}
                      onMouseLeave={(e) => {
                        if (label !== 'ALL') e.currentTarget.style.color = '#6c757d'
                      }}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <hr className="mt-3 mb-0 opacity-10" />
            </CardHeader>
            <CardBody className="px-4 pt-3 pb-2">
              <div dir="ltr">
                <ReactApexChart options={salesChart} series={salesChart.series} height={300} type="area" className="apex-charts" />
              </div>
            </CardBody>
          </Card>
        </Col>
        <CountryMap />
      </Row>
    </>
  )
}
export default Chart
