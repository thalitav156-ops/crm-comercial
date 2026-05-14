'use client'

export default function LeadPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#020617',
        color: 'white',
        padding: '40px',
        fontFamily: 'Arial'
      }}
    >
      <h1
        style={{
          fontSize: '48px',
          fontWeight: 'bold',
          marginBottom: '20px'
        }}
      >
        VYNTRA
      </h1>

      <p
        style={{
          fontSize: '22px',
          color: '#94a3b8'
        }}
      >
        Sistema carregado com sucesso.
      </p>

      <div
        style={{
          marginTop: '40px',
          background: '#111827',
          padding: '30px',
          borderRadius: '20px'
        }}
      >
        <h2
          style={{
            marginBottom: '20px'
          }}
        >
          Clientes
        </h2>

        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse'
          }}
        >
          <thead>
            <tr>
              <th style={th}>Nome</th>
              <th style={th}>Telefone</th>
              <th style={th}>Status</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td style={td}>Maria Oliveira</td>
              <td style={td}>(11) 99999-1111</td>
              <td style={td}>Ativo</td>
            </tr>

            <tr>
              <td style={td}>Carlos Souza</td>
              <td style={td}>(11) 98888-2222</td>
              <td style={td}>Negociação</td>
            </tr>

            <tr>
              <td style={td}>Fernanda Lima</td>
              <td style={td}>(11) 97777-3333</td>
              <td style={td}>Inativo</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

const th = {
  textAlign: 'left' as const,
  padding: '14px',
  borderBottom: '1px solid #1e293b'
}

const td = {
  padding: '14px',
  borderBottom: '1px solid #1e293b'
}