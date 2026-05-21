import styles from './Button.module.css'

export const Button = ({
  variant = 'primary',
  size,
  busy = false,
  icon,
  iconRight,
  children,
  className,
  type = 'button',
  ...props
}) => {
  const cls = [
    styles.btn,
    styles[variant],
    size === 'sm' && styles.sm,
    busy && styles.busy,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button type={type} className={cls} aria-busy={busy || undefined} {...props}>
      {busy ? (
        <span className={styles.spinner} aria-hidden="true" />
      ) : (
        <>
          {icon && <span className={styles.iconSlot}>{icon}</span>}
          {children && <span>{children}</span>}
          {iconRight && <span className={styles.iconSlot}>{iconRight}</span>}
        </>
      )}
    </button>
  )
}

export default Button
