import styles from './Chip.module.css'

export const Chip = ({ active, onClick, children, className }) => (
  <button
    type="button"
    className={[styles.chip, active && styles.active, className].filter(Boolean).join(' ')}
    onClick={onClick}
  >
    {children}
  </button>
)

export default Chip
