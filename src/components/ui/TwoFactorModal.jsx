'use client'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Modal from './Modal'
import Button from './Button'
import { InitSetup2FA, ConfirmSetup2FA, selectTwoFactor } from '@/redux/slice/TwoFactor/TwoFactorSlice'
import styles from './TwoFactorModal.module.css'
import QRCode from 'qrcode'

// step 0 = choose provider, 1 = QR (Authenticator) or OTP sent (Email), 2 = verify code, 3 = backup codes
export default function TwoFactorModal({ open, onClose }) {
  const dispatch = useDispatch()
  const { loading, setupData, backupCodes } = useSelector(selectTwoFactor)

  const [step, setStep] = useState(0)
  const [provider, setProvider] = useState(null)
  const [code, setCode] = useState('')
  const [qrDataUrl, setQrDataUrl] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (open) { setStep(0); setProvider(null); setCode(''); setQrDataUrl(null) }
  }, [open])

  useEffect(() => {
    if (setupData?.qrUri) {
      QRCode.toDataURL(setupData.qrUri, { width: 180, margin: 2 }).then(setQrDataUrl)
    }
  }, [setupData?.qrUri])

  // transition to backup codes once they arrive after ConfirmSetup2FA
  useEffect(() => {
    if (backupCodes.length > 0 && step === 2) {
      setStep(3)
    }
  }, [backupCodes, step])

  const handleSelectProvider = async (chosen) => {
    setProvider(chosen)
    const result = await dispatch(InitSetup2FA(chosen))
    if (result.error) return
    // Authenticator → show QR (step 1); Email → skip QR, go straight to verify (step 2)
    setStep(chosen === 'Authenticator' ? 1 : 2)
  }

  const handleVerify = () => {
    if (code.length !== 6) return
    dispatch(ConfirmSetup2FA({ code, provider }))
  }

  const handleCopyAll = () => {
    navigator.clipboard.writeText(backupCodes.join('\n'))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const titles = {
    0: 'Enable Two-Factor Authentication',
    1: 'Scan QR Code',
    2: 'Enter Verification Code',
    3: 'Save Your Backup Codes',
  }

  return (
    <Modal open={open} onClose={onClose} title={titles[step]} size="sm">
      {/* Step 0 — Choose provider */}
      {step === 0 && (
        <div className={styles.stepWrap}>
          <p className={styles.desc}>Choose how you&apos;d like to generate verification codes.</p>
          <div className={styles.providerGrid}>
            <button type="button" className={styles.providerBtn} onClick={() => handleSelectProvider('Authenticator')} disabled={loading}>
              <span className={styles.providerIcon}>📱</span>
              <span className={styles.providerLabel}>Authenticator App</span>
              <span className={styles.providerHint}>Google Authenticator, Authy, or any TOTP app</span>
            </button>
            <button type="button" className={styles.providerBtn} onClick={() => handleSelectProvider('Email')} disabled={loading}>
              <span className={styles.providerIcon}>📧</span>
              <span className={styles.providerLabel}>Email OTP</span>
              <span className={styles.providerHint}>Receive a one-time code at your registered email</span>
            </button>
          </div>
          <div className={styles.actions}>
            <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
          </div>
        </div>
      )}

      {/* Step 1 — QR code (Authenticator only) */}
      {step === 1 && (
        <div className={styles.stepWrap}>
          <p className={styles.desc}>
            Scan this QR code with your authenticator app, then click Next to verify.
          </p>
          <div className={styles.qrWrap}>
            {qrDataUrl
              ? <img src={qrDataUrl} alt="2FA QR Code" width={180} height={180} />
              : <div className={styles.qrPlaceholder}>{loading ? 'Loading…' : 'QR unavailable'}</div>
            }
          </div>
          {setupData?.secret && (
            <div className={styles.secretWrap}>
              <p className={styles.secretLabel}>Can&apos;t scan? Enter this code manually:</p>
              <code className={styles.secret}>{setupData.secret}</code>
            </div>
          )}
          <div className={styles.actions}>
            <Button variant="ghost" type="button" onClick={() => setStep(0)}>&larr; Back</Button>
            <Button type="button" onClick={() => setStep(2)}>Next &rarr;</Button>
          </div>
        </div>
      )}

      {/* Step 2 — Verify code */}
      {step === 2 && (
        <div className={styles.stepWrap}>
          <p className={styles.desc}>
            {provider === 'Email'
              ? 'A 6-digit code has been sent to your registered email address. Enter it below.'
              : 'Open your authenticator app and enter the 6-digit code shown for this account.'}
          </p>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            className={styles.codeInput}
            placeholder="000000"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            autoFocus
          />
          <div className={styles.actions}>
            <Button variant="ghost" type="button" onClick={() => setStep(provider === 'Authenticator' ? 1 : 0)}>&larr; Back</Button>
            <Button type="button" onClick={handleVerify} disabled={code.length !== 6 || loading}>
              {loading ? 'Verifying…' : 'Verify & Enable'}
            </Button>
          </div>
        </div>
      )}

      {/* Step 3 — Backup codes */}
      {step === 3 && (
        <div className={styles.stepWrap}>
          <p className={styles.desc}>
            Store these backup codes somewhere safe. Each can be used once if you lose access to your {provider === 'Email' ? 'email' : 'authenticator app'}.
          </p>
          <div className={styles.codesGrid}>
            {(backupCodes.length > 0 ? backupCodes : Array(8).fill('XXXX-XXXX')).map((c, i) => (
              <code key={i} className={styles.backupCode}>{c}</code>
            ))}
          </div>
          <div className={styles.actions}>
            <Button variant="ghost" type="button" onClick={handleCopyAll}>
              {copied ? 'Copied!' : 'Copy all'}
            </Button>
            <Button type="button" onClick={onClose}>Done</Button>
          </div>
        </div>
      )}
    </Modal>
  )
}
