type Props = {
  titulo: string
  valor: string
}

export default function CardDashboard({
  titulo,
  valor
}: Props) {

  return (
    <div
      style={{
        background: '#0f172a',
        padding: '25px',
        borderRadius: '20px',
        border: '1px solid #1e293b',
        minWidth: '220px'
      }}
    >
      <p
        style={{
          color: '#94a3b8',
          marginBottom: '10px'
        }}
      >
        {titulo}
      </p>

      <h2
        style={{
          color: 'white',
          fontSize: '32px'
        }}
      >
        {valor}
      </h2>
    </div>
  )
}