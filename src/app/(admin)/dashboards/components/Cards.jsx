import IconifyIcon from '@/components/wrapper/IconifyIcon'
import React from 'react'
import { Card, CardBody, CardFooter, Col, Row } from 'react-bootstrap'

const statsCards = [
  {
    title: 'Total Clicks',
    value: '15,352',
    growth: '3.02%',
    trend: 'up',
    icon: 'solar:globus-outline',
    color: 'primary',
    today: '1.2k',
    weekly: '8.4k',
    progress: '75%',
  },
  {
    title: 'Sales',
    value: '8,764',
    growth: '1.15%',
    trend: 'down',
    icon: 'solar:bag-check-outline',
    color: 'primary',
    today: '840',
    weekly: '5.1k',
    progress: '62%',
  },
  {
    title: 'Events',
    value: '5,123',
    growth: '4.78%',
    trend: 'up',
    icon: 'solar:calendar-date-outline',
    color: 'primary',
    today: '320',
    weekly: '2.8k',
    progress: '81%',
  },
  {
    title: 'Users',
    value: '12,945',
    growth: '2.35%',
    trend: 'up',
    icon: 'solar:users-group-two-rounded-outline',
    color: 'primary',
    today: '950',
    weekly: '6.7k',
    progress: '70%',
  },
]

const Cards = () => {
  return (
    <>
      <Row className="g-4">
        {statsCards.map((item, index) => (
          <Col md={6} xl={3} key={index}>
            <Card
              className="border-0 rounded-4 overflow-hidden"
              style={{
                boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.12)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.07)'
              }}>
              <CardBody className="p-3 d-flex flex-column gap-2">
                <div className="d-flex align-items-center justify-content-between">
                  <div
                    className={`text-${item.color} rounded-3 d-flex align-items-center justify-content-center`}
                    style={{
                      background: `var(--bs-${item.color}-bg-subtle, rgba(var(--bs-${item.color}-rgb), 0.12))`,
                    }}>
                    <IconifyIcon icon={item.icon} width={26} />
                  </div>
                  <span
                    className={`d-flex align-items-center gap-1 px-3 py-1 rounded-pill fw-semibold`}
                    style={{
                      fontSize: 12,
                      background: item.trend === 'up' ? 'rgba(25,135,84,0.1)' : 'rgba(220,53,69,0.1)',
                      color: item.trend === 'up' ? '#198754' : '#dc3545',
                    }}>
                    <IconifyIcon icon={item.trend === 'up' ? 'bxs:up-arrow' : 'bxs:down-arrow'} width={9} />
                    {item.growth}
                  </span>
                </div>
                <div>
                  <p className="text-muted fw-semibold mb-1 text-uppercase" style={{ fontSize: 11, letterSpacing: '0.07em' }}>
                    {item.title}
                  </p>
                  <h2 className="fw-bold mb-0" style={{ fontSize: 30, letterSpacing: '-0.5px' }}>
                    {item.value}
                  </h2>
                  <p className="text-muted mb-0 mt-1" style={{ fontSize: 12 }}>
                    vs last month
                  </p>
                </div>
                <hr className="my-1 opacity-25" />
                <Row className="g-2">
                  <Col xs={6}>
                    <div className="rounded-3 p-2 text-center" style={{ background: 'rgba(0,0,0,0.03)' }}>
                      <p className="text-muted mb-1" style={{ fontSize: 11 }}>
                        Today
                      </p>
                      <h6 className="fw-bold mb-0" style={{ fontSize: 15 }}>
                        {item.today}
                      </h6>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="rounded-3 p-2 text-center" style={{ background: 'rgba(0,0,0,0.03)' }}>
                      <p className="text-muted mb-1" style={{ fontSize: 11 }}>
                        Weekly
                      </p>
                      <h6 className="fw-bold mb-0" style={{ fontSize: 15 }}>
                        {item.weekly}
                      </h6>
                    </div>
                  </Col>
                </Row>
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-muted" style={{ fontSize: 12 }}>
                      Monthly Goal
                    </span>
                    <span className={`fw-bold text-${item.color}`} style={{ fontSize: 13 }}>
                      {item.progress}
                    </span>
                  </div>
                  <div className="rounded-pill overflow-hidden" style={{ height: 6, background: 'rgba(0,0,0,0.06)' }}>
                    <div
                      className={`h-100 rounded-pill bg-${item.color}`}
                      style={{
                        width: item.progress,
                        transition: 'width 1s ease',
                      }}
                    />
                  </div>
                </div>
              </CardBody>
              <div className={`bg-${item.color}`} style={{ height: 3, opacity: 0.7 }} />
            </Card>
          </Col>
        ))}
      </Row>
    </>
  )
}
export default Cards
