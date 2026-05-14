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
        href='/lead'
        style={{
          background: '#2563eb',
          color: 'white',
          padding: '20px 40px',
          borderRadius: '20px',
          textDecoration: 'none',
          fontSize: '24px',
          fontWeight: 'bold'
        }}
      >
        Abrir CRM Comercial
      </Link>

    </div>

  )
}