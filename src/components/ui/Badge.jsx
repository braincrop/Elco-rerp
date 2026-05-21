import styles from './Badge.module.css'

const DOT_VARIANTS = new Set(['good', 'warn', 'bad', 'info'])

export const Badge = ({ variant = 'neutral', dot = true, children, className }) => {
  const cls = [styles.badge, styles[variant], className].filter(Boolean).join(' ')
  return (
    <span className={cls}>
      {dot && DOT_VARIANTS.has(variant) && <span className={styles.dot} aria-hidden="true" />}
      {children}
    </span>
  )
}

export default Badge
