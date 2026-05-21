'use client'
import Image from 'next/image'
import avatar2 from '@/assets/images/users/avatar-2.jpg'
import avatar3 from '@/assets/images/users/avatar-3.jpg'
import avatar4 from '@/assets/images/users/avatar-4.jpg'
import avatar5 from '@/assets/images/users/avatar-5.jpg'
import Card from '@/components/ui/Card'
import styles from './user.module.css'

const USERS = [
  { img: avatar2, date: '24 Apr 2025', name: 'Phyllis Ballard', email: 'phyllis@vendral.io' },
  { img: avatar3, date: '22 Apr 2025', name: 'Homer Guzman',    email: 'homer@vendral.io' },
  { img: avatar4, date: '18 Apr 2025', name: 'Brian Porter',    email: 'brian@vendral.io' },
  { img: avatar5, date: '15 Apr 2025', name: 'Nancy Gonzales',  email: 'nancy@vendral.io' },
]

const User = () => (
  <Card>
    <Card.Head>
      <span className="panel-title">Recent Users</span>
    </Card.Head>
    <div className={styles.list}>
      {USERS.map((u) => (
        <div key={u.email} className={styles.row}>
          <Image src={u.img} alt={u.name} width={32} height={32} className={styles.avatar} />
          <div className={styles.info}>
            <span className={styles.name}>{u.name}</span>
            <span className={styles.email}>{u.email}</span>
          </div>
          <span className={styles.date}>{u.date}</span>
        </div>
      ))}
    </div>
  </Card>
)

export default User
