import styles from './SegControl.module.css'

export const SegControl = ({ options, value, onChange }) => (
  <div className={styles.seg} role="group">
    {options.map((opt) => (
      <button
        key={opt.value}
        type="button"
        className={[styles.seg__btn, value === opt.value && styles.active]
          .filter(Boolean)
          .join(' ')}
        onClick={() => onChange(opt.value)}
        aria-pressed={value === opt.value}
      >
        {opt.label}
      </button>
    ))}
  </div>
)

export default SegControl
