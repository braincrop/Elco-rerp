import Toggle from './Toggle'
import styles from './ToggleRow.module.css'

export const ToggleRow = ({ label, description, checked, onChange, disabled, id }) => (
  <div className={styles.row}>
    <div className={styles.text}>
      <label htmlFor={id} className={styles.label}>{label}</label>
      {description && <p className={styles.desc}>{description}</p>}
    </div>
    <Toggle id={id} checked={checked} onChange={onChange} disabled={disabled} />
  </div>
)

export default ToggleRow
