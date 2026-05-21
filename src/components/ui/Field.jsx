import styles from './Field.module.css'

export const Field = ({
  label,
  helper,
  error,
  required,
  id,
  children,
  className,
  inline,
}) => (
  <div className={[styles.field, inline && styles.inline, className].filter(Boolean).join(' ')}>
    {label && (
      <label htmlFor={id} className={styles.label}>
        {label}
        {required && <span className={styles.req} aria-hidden="true">*</span>}
      </label>
    )}
    <div className={styles.control}>{children}</div>
    {error ? (
      <p className={styles.error}>{error}</p>
    ) : helper ? (
      <p className={styles.helper}>{helper}</p>
    ) : null}
  </div>
)

export default Field
