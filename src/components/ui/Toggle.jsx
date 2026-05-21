import styles from './Toggle.module.css'

export const Toggle = ({ checked, onChange, disabled, id }) => (
  <button
    role="switch"
    aria-checked={checked}
    id={id}
    disabled={disabled}
    className={[styles.toggle, checked && styles.on].filter(Boolean).join(' ')}
    onClick={() => onChange?.(!checked)}
    type="button"
  >
    <span className={styles.thumb} />
  </button>
)

export default Toggle
