'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import SvgIcon from '@/components/ui/SvgIcon'
import styles from '../VirtualMachine.module.css'

const STEPS = [
  'Connecting to machine controller…',
  'Checking serial / TCP protocol adapter…',
  'Loading product slot layout…',
  'Syncing stock and motor status…',
  'Preparing admin control panel…',
]

export default function SplashBoot({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [activeStep, setActiveStep] = useState(0)
  const [logs, setLogs] = useState(['Booting virtual vending machine…'])

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(100, prev + 4)
        const nextStep = Math.min(STEPS.length - 1, Math.floor((next / 100) * STEPS.length))
        setActiveStep(nextStep)
        if (next % 20 === 0) {
          setLogs((old) => [
            ...old.slice(-5),
            `[${new Date().toLocaleTimeString()}] ${STEPS[nextStep]}`,
          ])
        }
        if (next >= 100) {
          clearInterval(timer)
          setTimeout(onComplete, 500)
        }
        return next
      })
    }, 90)
    return () => clearInterval(timer)
  }, [onComplete])

  return (
    <div className={styles.splashPage}>
      <div className={styles.splashGlow1} />
      <div className={styles.splashGlow2} />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={styles.splashCard}
      >
        <div className={styles.splashGrid}>
          {/* Left — progress */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div className={styles.splashIconWrap}>
                <SvgIcon id="i-screen" className="ic-sm" />
              </div>
              <div>
                <p className={styles.splashEyebrow}>Starting system</p>
                <h1 className={styles.splashTitle}>Virtual Vending Machine</h1>
              </div>
            </div>

            <div className={styles.splashInner}>
              <div className={styles.splashProgressLabel}>
                <span className={styles.splashProgressSub}>Real-time startup progress</span>
                <span className={styles.splashProgressPct}>{progress}%</span>
              </div>
              <div className={styles.splashTrack}>
                <div className={styles.splashFill} style={{ width: `${progress}%` }} />
              </div>

              <div className={styles.splashSteps}>
                {STEPS.map((step, i) => {
                  const done = i < activeStep || progress === 100
                  const active = i === activeStep && progress < 100
                  return (
                    <div
                      key={step}
                      className={[
                        styles.splashStep,
                        done && styles.splashStepDone,
                        active && styles.splashStepActive,
                      ].filter(Boolean).join(' ')}
                    >
                      {done ? (
                        <SvgIcon id="i-check" className="ic-sm" style={{ color: 'var(--good)', flex: 'none' }} />
                      ) : active ? (
                        <SvgIcon id="i-arrow" className="ic-sm" style={{ color: 'var(--warn)', flex: 'none' }} />
                      ) : (
                        <div className={styles.splashStepDot} />
                      )}
                      <span>{step}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right — live logs */}
          <div className={styles.splashLogsCard}>
            <p className={styles.splashLogsTitle}>Live Logs</p>
            <div className={styles.splashLogScroll}>
              {logs.map((log, i) => (
                <motion.p
                  key={`${log}-${i}`}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={styles.splashLogLine}
                >
                  {log}
                </motion.p>
              ))}
              {progress >= 100 && (
                <p className={[styles.splashLogLine, styles.splashLogOk].join(' ')}>
                  System ready. Opening control dashboard…
                </p>
              )}
            </div>

            <button type="button" className={styles.splashSkipBtn} onClick={onComplete}>
              Skip
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
