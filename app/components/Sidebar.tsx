export default function Sidebar() {
  return (
    <div
      style={{
        width: '260px',
        background: '#0f172a',
        minHeight: '100vh',
        padding: '30px',
        borderRight: '1px solid #1e293b'
      }}
    >
      <h2
        style={{
          color: 'white',
          fontSize: '30px',
          fontWeight: 'bold',
          marginBottom: '40px'
        }}
      >
        VYNTRA
      </h2>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          color: '#94a3b8',
          fontSize: '16px'
        }}
      >
        <span>Dashboard</span>
        <span>Clientes</span>
        <span>Campanhas</span>
        <span>WhatsApp</span>
        <span>Importar Excel</span>
        <span>Logs</span>
        <span>Admin</span>
      </div>
    </div>
  )
}