import styles from './Card.module.css'

const Card = ({ children, className, pad, ...props }) => (
  <div className={[styles.card, pad && styles.pad, className].filter(Boolean).join(' ')} {...props}>
    {children}
  </div>
)

function CardHead({ children, className, actions }) {
  return (
    <div className={[styles.head, className].filter(Boolean).join(' ')}>
      <div className={styles.headContent}>{children}</div>
      {actions && <div className={styles.headActions}>{actions}</div>}
    </div>
  )
}
CardHead.displayName = 'Card.Head'

function CardBody({ children, className }) {
  return <div className={[styles.body, className].filter(Boolean).join(' ')}>{children}</div>
}
CardBody.displayName = 'Card.Body'

function CardFoot({ children, className }) {
  return <div className={[styles.foot, className].filter(Boolean).join(' ')}>{children}</div>
}
CardFoot.displayName = 'Card.Foot'

Card.Head = CardHead
Card.Body = CardBody
Card.Foot = CardFoot

export default Card
