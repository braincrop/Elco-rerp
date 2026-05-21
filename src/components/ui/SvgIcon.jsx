export const SvgIcon = ({ id, className, style }) => (
  <svg className={`ic${className ? ` ${className}` : ''}`} style={style} aria-hidden="true">
    <use href={`#${id}`} />
  </svg>
)

export default SvgIcon
