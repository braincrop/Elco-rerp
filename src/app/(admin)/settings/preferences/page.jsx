'use client'
import { useLayoutContext } from '@/context/useLayoutContext'
import Card from '@/components/ui/Card'
import styles from './preferences.module.css'

const THEMES = [
  { value: 'light',  label: 'Light',  desc: 'Clean white surfaces' },
  { value: 'dark',   label: 'Dark',   desc: 'Easy on the eyes' },
  { value: 'system', label: 'System', desc: 'Follows OS setting' },
]

export default function PreferencesPage() {
  const { themePreference, changeTheme } = useLayoutContext()

  return (
    <Card>
      <Card.Head>
        <span className="panel-title">Preferences</span>
        <span className="panel-sub">Appearance and display settings.</span>
      </Card.Head>
      <Card.Body>
        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Theme</p>
        <div className={styles.themeGrid}>
          {THEMES.map((t) => (
            <button
              key={t.value}
              type="button"
              className={[styles.themeCard, themePreference === t.value && styles.active].filter(Boolean).join(' ')}
              onClick={() => changeTheme(t.value)}
            >
              <div className={[styles.preview, styles[t.value]].join(' ')} aria-hidden="true">
                <div className={styles.previewBar} />
                <div className={styles.previewContent}>
                  <div className={styles.previewBlock} />
                  <div className={styles.previewBlock} />
                </div>
              </div>
              <span className={styles.themeLabel}>{t.label}</span>
              <span className={styles.themeDesc}>{t.desc}</span>
            </button>
          ))}
        </div>
      </Card.Body>
    </Card>
  )
}
