import Link from 'next/link'

const PageTitle = ({ title, subName }) => (
  <div style={{ marginBottom: 20 }}>
    <h4 style={{ margin: 0, fontWeight: 600, color: 'var(--ink)' }}>{title}</h4>
    <ol style={{ display: 'flex', alignItems: 'center', gap: 4, listStyle: 'none', margin: '4px 0 0', padding: 0, fontSize: 13, color: 'var(--ink-3)' }}>
      <li><Link href="" style={{ color: 'inherit', textDecoration: 'none' }}>{subName}</Link></li>
      <li style={{ opacity: .5 }}>›</li>
      <li style={{ color: 'var(--ink-2)' }}>{title}</li>
    </ol>
  </div>
)

export default PageTitle
