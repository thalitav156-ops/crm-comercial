'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#020617',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Link
        href="/lead"
        style={{
          background: '#2563eb',
          padding: '20px 50px',
          borderRadius: '18px',
          color: 'white',
          textDecoration: 'none',
          fontSize: '32px',
          fontWeight: 'bold',
          boxShadow: '0 0 30px rgba(37,99,235,0.4)',
          transition: '0.3s'
        }}
      >
        Entrar no VYNTRA
      </Link>
    </div>
  )
}