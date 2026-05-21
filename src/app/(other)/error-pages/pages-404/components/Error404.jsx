'use client'
import Image from 'next/image'
import Link from 'next/link'
import error404Img from '@/assets/images/404.svg'
import LightLogo from '@/assets/images/Logo-primidigitals 1 (1).png'

const Error404 = () => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: 24 }}>
    <div style={{ textAlign: 'center', maxWidth: 480 }}>
      <Image src={LightLogo} alt="logo" width={140} height={56} style={{ objectFit: 'contain', marginBottom: 32 }} />
      <Image src={error404Img} alt="404" height={200} style={{ marginBottom: 24 }} />
      <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>Page Not Found</h2>
      <p style={{ color: 'var(--ink-3)', marginBottom: 24 }}>
        The page you&apos;re trying to reach seems to have gone missing in the digital wilderness.
      </p>
      <Link href="/dashboards" style={{
        display: 'inline-block', padding: '10px 24px', background: 'var(--ink)', color: 'var(--bg)',
        borderRadius: 'var(--radius-sm)', textDecoration: 'none', fontWeight: 600, fontSize: 14,
      }}>
        Back to Home
      </Link>
    </div>
  </div>
)

export default Error404
