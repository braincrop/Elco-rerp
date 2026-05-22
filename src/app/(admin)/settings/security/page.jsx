'use client'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Field from '@/components/ui/Field'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import TwoFactorModal from '@/components/ui/TwoFactorModal'
import Notify from '@/components/Notify'
import {
  Fetch2FAStatus,
  Disable2FA,
  FetchBackupCodes,
  RegenBackupCodes,
  SendEmailOTP,
  selectTwoFactor,
} from '@/redux/slice/TwoFactor/TwoFactorSlice'

const PROVIDER_LABEL = { Authenticator: 'Authenticator App', Email: 'Email OTP' }

export default function SecurityPage() {
  const dispatch = useDispatch()
  const { enabled, activatedAt, provider, loading, backupCodes } = useSelector(selectTwoFactor)

  const [form, setForm] = useState({ current: '', next: '', confirm: '' })
  const [pwLoading, setPwLoading] = useState(false)
  const [show2FAModal, setShow2FAModal] = useState(false)
  const [showDisable, setShowDisable] = useState(false)
  const [showBackupCodes, setShowBackupCodes] = useState(false)
  const [disableCode, setDisableCode] = useState('')
  const [regenCode, setRegenCode] = useState('')
  const [showRegen, setShowRegen] = useState(false)

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }))

  useEffect(() => {
    dispatch(Fetch2FAStatus())
  }, [dispatch])

  const handleSave = async (e) => {
    e.preventDefault()
    if (form.next !== form.confirm) return Notify('error', 'New passwords do not match')
    if (form.next.length < 8) return Notify('error', 'Password must be at least 8 characters')
    setPwLoading(true)
    try {
      Notify('success', 'Password updated')
      setForm({ current: '', next: '', confirm: '' })
    } finally {
      setPwLoading(false)
    }
  }

  const handleDisable2FA = async () => {
    if (!disableCode) return Notify('error', 'Enter your verification code')
    const result = await dispatch(Disable2FA({ code: disableCode }))
    if (!result.error) {
      setShowDisable(false)
      setDisableCode('')
    }
  }

  const handleViewBackupCodes = () => {
    dispatch(FetchBackupCodes())
    setShowBackupCodes(true)
  }

  const handleRegen = async () => {
    if (!regenCode) return Notify('error', 'Enter your verification code to authorize')
    const result = await dispatch(RegenBackupCodes({ code: regenCode }))
    if (!result.error) {
      setShowRegen(false)
      setRegenCode('')
      setShowBackupCodes(true)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Password Card */}
      <Card>
        <Card.Head>
          <span className="panel-title">Password</span>
          <span className="panel-sub">Change your account password.</span>
        </Card.Head>
        <Card.Body>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 400 }}>
            <Field label="Current Password">
              <input type="password" value={form.current} onChange={set('current')} autoComplete="current-password" />
            </Field>
            <Field label="New Password">
              <input type="password" value={form.next} onChange={set('next')} autoComplete="new-password" />
            </Field>
            <Field label="Confirm New Password">
              <input type="password" value={form.confirm} onChange={set('confirm')} autoComplete="new-password" />
            </Field>
            <div>
              <Button type="submit" disabled={pwLoading}>{pwLoading ? 'Saving…' : 'Update Password'}</Button>
            </div>
          </form>
        </Card.Body>
      </Card>

      {/* 2FA Card */}
      <Card>
        <Card.Head>
          <span className="panel-title">Two-Factor Authentication</span>
          <span className="panel-sub">Add an extra layer of security to your account.</span>
        </Card.Head>
        <Card.Body>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 480 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13.5, color: 'var(--ink-2)' }}>Status:</span>
              <Badge variant={enabled ? 'good' : 'neutral'}>{enabled ? 'Enabled' : 'Not enabled'}</Badge>
              {enabled && provider && (
                <span style={{ fontSize: 12.5, color: 'var(--ink-3)' }}>
                  via {PROVIDER_LABEL[provider] ?? provider}
                </span>
              )}
              {enabled && activatedAt && (
                <span style={{ fontSize: 12, color: 'var(--ink-4)' }}>
                  · since {new Date(activatedAt).toLocaleDateString()}
                </span>
              )}
            </div>

            {!enabled ? (
              <div>
                <p style={{ fontSize: 13.5, color: 'var(--ink-3)', margin: '0 0 14px' }}>
                  Protect your account with a one-time code from an authenticator app or your email.
                </p>
                <Button type="button" onClick={() => setShow2FAModal(true)}>
                  Enable 2FA
                </Button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <p style={{ fontSize: 13.5, color: 'var(--ink-3)', margin: 0 }}>
                  Two-factor authentication is active. Your account is protected.
                </p>

                {/* Backup Codes */}
                {showBackupCodes && (
                  <div style={{ background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: 'var(--radius-sm)', padding: 16 }}>
                    <p style={{ fontSize: 12, color: 'var(--ink-3)', margin: '0 0 10px', fontWeight: 500 }}>Backup Codes</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                      {backupCodes.map((c, i) => (
                        <code key={i} style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 13, padding: '5px 10px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>{c}</code>
                      ))}
                    </div>
                    <Button variant="ghost" size="sm" type="button" onClick={() => setShowBackupCodes(false)}>Hide</Button>
                  </div>
                )}

                {/* Regenerate confirm */}
                {showRegen && (
                  <div style={{ background: 'var(--warn-bg)', border: '1px solid var(--warn)', borderRadius: 'var(--radius-sm)', padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <p style={{ fontSize: 13, color: 'var(--ink-2)', margin: 0 }}>
                      Enter your {provider === 'Email' ? 'email OTP' : 'authenticator'} code to generate new backup codes. Old codes will be invalidated.
                    </p>
                    {provider === 'Email' && (
                      <Button variant="ghost" size="sm" type="button" onClick={() => dispatch(SendEmailOTP())} disabled={loading}>
                        Resend email OTP
                      </Button>
                    )}
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="000000"
                      value={regenCode}
                      onChange={(e) => setRegenCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      style={{ padding: '8px 12px', fontSize: 14, borderRadius: 'var(--radius-sm)', border: '1px solid var(--line-2)', background: 'var(--surface)', color: 'var(--ink)', outline: 'none', width: 140, fontFamily: 'monospace', letterSpacing: '0.2em' }}
                    />
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Button variant="ghost" size="sm" type="button" onClick={() => { setShowRegen(false); setRegenCode('') }}>Cancel</Button>
                      <Button size="sm" type="button" onClick={handleRegen} disabled={loading || regenCode.length !== 6}>Regenerate</Button>
                    </div>
                  </div>
                )}

                {/* Disable confirm */}
                {showDisable && (
                  <div style={{ background: 'var(--bad-bg)', border: '1px solid var(--bad)', borderRadius: 'var(--radius-sm)', padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <p style={{ fontSize: 13, color: 'var(--ink-2)', margin: 0 }}>
                      Enter your {provider === 'Email' ? 'email OTP' : 'authenticator'} code to disable 2FA.
                    </p>
                    {provider === 'Email' && (
                      <Button variant="ghost" size="sm" type="button" onClick={() => dispatch(SendEmailOTP())} disabled={loading}>
                        Resend email OTP
                      </Button>
                    )}
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="000000"
                      value={disableCode}
                      onChange={(e) => setDisableCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      style={{ padding: '8px 12px', fontSize: 14, borderRadius: 'var(--radius-sm)', border: '1px solid var(--line-2)', background: 'var(--surface)', color: 'var(--ink)', outline: 'none', width: 140, fontFamily: 'monospace', letterSpacing: '0.2em' }}
                    />
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Button variant="ghost" size="sm" type="button" onClick={() => { setShowDisable(false); setDisableCode('') }}>Cancel</Button>
                      <Button variant="danger-outline" size="sm" type="button" onClick={handleDisable2FA} disabled={loading || disableCode.length !== 6}>Disable 2FA</Button>
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                {!showRegen && !showDisable && (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <Button variant="ghost" size="sm" type="button" onClick={handleViewBackupCodes} disabled={loading}>
                      View backup codes
                    </Button>
                    <Button variant="ghost" size="sm" type="button" onClick={() => setShowRegen(true)}>
                      Regenerate codes
                    </Button>
                    <Button variant="danger-outline" size="sm" type="button" onClick={() => setShowDisable(true)}>
                      Disable 2FA
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card.Body>
      </Card>

      <TwoFactorModal open={show2FAModal} onClose={() => setShow2FAModal(false)} />
    </div>
  )
}
