type Cliente = {
  nome: string
  telefone: string
  status: string
}

type Props = {
  clientes: Cliente[]
}

export default function TabelaClientes({
  clientes
}: Props) {

  return (
    <div
      style={{
        marginTop: '40px',
        background: '#0f172a',
        borderRadius: '20px',
        overflow: 'hidden',
        border: '1px solid #1e293b'
      }}
    >
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          color: 'white'
        }}
      >
        <thead
          style={{
            background: '#1e293b'
          }}
        >
          <tr>
            <th style={{ padding: '20px', textAlign: 'left' }}>
              Nome
            </th>

            <th style={{ padding: '20px', textAlign: 'left' }}>
              Telefone
            </th>

            <th style={{ padding: '20px', textAlign: 'left' }}>
              Status
            </th>
          </tr>
        </thead>

        <tbody>
          {clientes.map((cliente, index) => (
            <tr key={index}>
              <td style={{ padding: '20px' }}>
                {cliente.nome}
              </td>

              <td style={{ padding: '20px' }}>
                {cliente.telefone}
              </td>

              <td style={{ padding: '20px' }}>
                {cliente.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}