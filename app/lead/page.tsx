'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'
import ImportarExcel from '../components/ImportarExcel'

export default function Home() {

  const [clientes, setClientes] = useState<any[]>([])
  const [selecionados, setSelecionados] = useState<number[]>([])
  const [busca, setBusca] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('Todos')
  const [logs, setLogs] = useState<any[]>([])
  const [enviando, setEnviando] = useState(false)

  const [mensagemCampanha, setMensagemCampanha] = useState(`Olá {{cliente}}, tudo bem? 😊

Estamos entrando em contato para apresentar novamente nosso catálogo atualizado e verificar novas oportunidades comerciais.

Posso lhe enviar nosso catálogo atualizado?

Fico à disposição 🚀`)

  async function buscarClientes() {

    const { data } = await supabase
      .from('clientes')
      .select('*')
      .order('id', { ascending: false })

    if (data) {
      setClientes(data)
    }
  }

  useEffect(() => {

    buscarClientes()

    const interval = setInterval(() => {
      buscarClientes()
    }, 3000)

    return () => clearInterval(interval)

  }, [])

  function toggleSelecionado(id: number) {

    if (selecionados.includes(id)) {

      setSelecionados(
        selecionados.filter(item => item !== id)
      )

    } else {

      setSelecionados([
        ...selecionados,
        id
      ])
    }
  }

  async function atualizarStatus(
    id: number,
    status: string
  ) {

    await supabase
      .from('clientes')
      .update({ status })
      .eq('id', id)

    buscarClientes()
  }

  async function excluirCliente(id: number) {

    const confirmar = confirm('Excluir lead?')

    if (!confirmar) return

    await supabase
      .from('clientes')
      .delete()
      .eq('id', id)

    buscarClientes()
  }

  function abrirWhatsapp(
    telefone: string,
    empresa: string
  ) {

    const numero =
      telefone?.replace(/\D/g, '')

    const mensagem =
      mensagemCampanha.replace(
        '{{cliente}}',
        empresa
      )

    window.open(
      `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`,
      '_blank'
    )
  }

  async function dispararCampanha() {

    if (selecionados.length === 0) {
      alert('Selecione clientes')
      return
    }

    setEnviando(true)

    for (let i = 0; i < selecionados.length; i++) {

      const cliente =
        clientes.find(
          c => c.id === selecionados[i]
        )

      if (!cliente) continue

      abrirWhatsapp(
        cliente.telefone,
        cliente.razao_social
      )

      await atualizarStatus(
        cliente.id,
        'Contatado'
      )

      setLogs(prev => [
        {
          empresa: cliente.razao_social,
          telefone: cliente.telefone,
          data: new Date().toLocaleString()
        },
        ...prev
      ])

      await new Promise(resolve =>
        setTimeout(resolve, 5000)
      )
    }

    setEnviando(false)

    alert('Campanha disparada')
  }

  const clientesFiltrados =
    clientes.filter(cliente => {

      const buscaMatch =

        cliente.razao_social
          ?.toLowerCase()
          .includes(
            busca.toLowerCase()
          )

        ||

        cliente.telefone
          ?.includes(busca)

      const statusMatch =

        filtroStatus === 'Todos'
        ||
        cliente.status === filtroStatus

      return buscaMatch && statusMatch
    })

  const totalLeads = clientes.length

  const novos =
    clientes.filter(
      c => c.status === 'Novo Lead'
    ).length

  const negociacao =
    clientes.filter(
      c => c.status === 'Negociação'
    ).length

  const fechados =
    clientes.filter(
      c => c.status === 'Fechado'
    ).length

  return (

    <div style={container}>

      <h1 style={title}>
        CRM Comercial Giotto
      </h1>

      <p style={subtitle}>
        Central Inteligente de Reativação Comercial
      </p>

      <div style={dashboardGrid}>

        <div style={cardBlue}>
          <h2>{totalLeads}</h2>
          <p>Total Leads</p>
        </div>

        <div style={cardPurple}>
          <h2>{novos}</h2>
          <p>Novos Leads</p>
        </div>

        <div style={cardOrange}>
          <h2>{negociacao}</h2>
          <p>Negociação</p>
        </div>

        <div style={cardGreen}>
          <h2>{fechados}</h2>
          <p>Fechados</p>
        </div>

      </div>

      <div style={boxStyle}>

        <h2>
          Importar Clientes
        </h2>

        <p style={description}>
          Sistema identifica automaticamente:
          Razão Social,
          Telefone,
          CNPJ
          e E-mail.
        </p>

        <ImportarExcel />

      </div>

      <div style={boxStyle}>

        <h2>
          Disparo de Campanha
        </h2>

        <textarea
          value={mensagemCampanha}
          onChange={(e) =>
            setMensagemCampanha(
              e.target.value
            )
          }
          style={textareaStyle}
        />

        <button
          onClick={dispararCampanha}
          disabled={enviando}
          style={campanhaButton}
        >

          {
            enviando
              ? 'Disparando campanha...'
              : 'Disparar Campanha'
          }

        </button>

      </div>

    </div>
  )
}

const container = {
  minHeight: '100vh',
  background: '#020617',
  color: 'white',
  padding: '30px',
  fontFamily: 'Arial'
}

const title = {
  fontSize: '60px',
  fontWeight: 'bold'
}

const subtitle = {
  color: '#94a3b8',
  marginTop: '10px'
}

const dashboardGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4,1fr)',
  gap: '20px',
  marginTop: '35px'
}

const boxStyle = {
  background: '#111827',
  padding: '35px',
  borderRadius: '25px',
  marginTop: '35px'
}

const description = {
  color: '#94a3b8',
  marginTop: '10px',
  marginBottom: '25px'
}

const textareaStyle = {
  width: '100%',
  minHeight: '180px',
  padding: '20px',
  marginTop: '20px',
  borderRadius: '14px',
  border: '1px solid #334155',
  background: '#0f172a',
  color: 'white',
  fontSize: '16px'
}

const campanhaButton = {
  width: '100%',
  marginTop: '20px',
  padding: '20px',
  borderRadius: '14px',
  border: 'none',
  background: '#16a34a',
  color: 'white',
  fontWeight: 'bold',
  fontSize: '18px',
  cursor: 'pointer'
}

const cardBlue = {
  background:
    'linear-gradient(135deg,#2563eb,#1d4ed8)',
  padding: '35px',
  borderRadius: '25px'
}

const cardPurple = {
  background:
    'linear-gradient(135deg,#9333ea,#7e22ce)',
  padding: '35px',
  borderRadius: '25px'
}

const cardOrange = {
  background:
    'linear-gradient(135deg,#f97316,#c2410c)',
  padding: '35px',
  borderRadius: '25px'
}

const cardGreen = {
  background:
    'linear-gradient(135deg,#16a34a,#15803d)',
  padding: '35px',
  borderRadius: '25px'
}