'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'
import ImportarExcel from '../components/ImportarExcel'

export default function Home() {

  const [clientes, setClientes] =
    useState<any[]>([])

  const [selecionados, setSelecionados] =
    useState<number[]>([])

  const [busca, setBusca] =
    useState('')

  const [filtroStatus, setFiltroStatus] =
    useState('Todos')

  const [mensagemCampanha, setMensagemCampanha] =
    useState(
`Olá {{cliente}}, tudo bem? 😊

Estamos entrando em contato para apresentar novamente nosso catálogo atualizado e verificar novas oportunidades comerciais.

Posso lhe enviar nosso catálogo atualizado?

Fico à disposição 🚀`
    )

  const [logs, setLogs] =
    useState<any[]>([])

  const [enviando, setEnviando] =
    useState(false)

  async function buscarClientes() {

    const { data } =
      await supabase
        .from('clientes')
        .select('*')
        .order('id', {
          ascending: false
        })

    if (data) {
      setClientes(data)
    }
  }

  useEffect(() => {

    buscarClientes()

    const interval =
      setInterval(() => {
        buscarClientes()
      }, 3000)

    return () =>
      clearInterval(interval)

  }, [])

  function toggleSelecionado(
    id: number
  ) {

    if (
      selecionados.includes(id)
    ) {

      setSelecionados(
        selecionados.filter(
          item => item !== id
        )
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
      .update({
        status
      })
      .eq('id', id)

    buscarClientes()
  }

  async function excluirCliente(
    id: number
  ) {

    const confirmar =
      confirm('Excluir lead?')

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
      telefone.replace(/\D/g, '')

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

    if (
      selecionados.length === 0
    ) {
      alert(
        'Selecione clientes'
      )
      return
    }

    setEnviando(true)

    for (
      let i = 0;
      i < selecionados.length;
      i++
    ) {

      const cliente =
        clientes.find(
          c =>
            c.id ===
            selecionados[i]
        )

      if (!cliente) continue

      const numero =
        cliente.telefone
          ?.replace(/\D/g, '')

      const mensagem =
        mensagemCampanha.replace(
          '{{cliente}}',
          cliente.razao_social
        )

      window.open(
        `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`,
        '_blank'
      )

      await supabase
        .from('clientes')
        .update({
          status:
            'Contatado'
        })
        .eq(
          'id',
          cliente.id
        )

      setLogs(prev => [
        {
          empresa:
            cliente.razao_social,
          telefone:
            cliente.telefone,
          data:
            new Date()
              .toLocaleString()
        },
        ...prev
      ])

      await new Promise(
        resolve =>
          setTimeout(
            resolve,
            5000
          )
      )
    }

    setEnviando(false)

    buscarClientes()

    alert(
      'Campanha disparada'
    )
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

        filtroStatus ===
          'Todos'

        ||

        cliente.status ===
          filtroStatus

      return (
        buscaMatch &&
        statusMatch
      )
    })

  const totalLeads =
    clientes.length

  const novos =
    clientes.filter(
      c =>
        c.status ===
        'Novo Lead'
    ).length

  const negociacao =
    clientes.filter(
      c =>
        c.status ===
        'Negociação'
    ).length

  const fechados =
    clientes.filter(
      c =>
        c.status ===
        'Fechado'
    ).length

  return (

    <div style={container}>

      <h1 style={title}>
        CRM Comercial Giotto
      </h1>

      <p style={subtitle}>
        Central Inteligente de Reativação Comercial
      </p>

      {/* DASHBOARD */}

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

      {/* IMPORTAÇÃO */}

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

      {/* CAMPANHA */}

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

      {/* FILTROS */}

      <div style={filterBox}>

        <input
          placeholder='Pesquisar cliente...'
          value={busca}
          onChange={(e) =>
            setBusca(
              e.target.value
            )
          }
          style={inputStyle}
        />

        <select
          value={filtroStatus}
          onChange={(e) =>
            setFiltroStatus(
              e.target.value
            )
          }
          style={selectStyle}
        >

          <option>
            Todos
          </option>

          <option>
            Novo Lead
          </option>

          <option>
            Contatado
          </option>

          <option>
            Negociação
          </option>

          <option>
            Fechado
          </option>

        </select>

      </div>

      {/* TABELA */}

      <div style={tableBox}>

        <table style={tableStyle}>

          <thead>

            <tr>

              <th style={thStyle}>
                Selecionar
              </th>

              <th style={thStyle}>
                Empresa
              </th>

              <th style={thStyle}>
                Telefone
              </th>

              <th style={thStyle}>
                Status
              </th>

              <th style={thStyle}>
                Ações
              </th>

            </tr>

          </thead>

          <tbody>

            {clientesFiltrados.map(
              (cliente) => (

                <tr
                  key={cliente.id}
                  style={rowStyle}
                >

                  <td style={tdStyle}>

                    <input
                      type='checkbox'
                      checked={
                        selecionados.includes(
                          cliente.id
                        )
                      }
                      onChange={() =>
                        toggleSelecionado(
                          cliente.id
                        )
                      }
                    />

                  </td>

                  <td style={tdStyle}>

                    <strong>
                      {
                        cliente.razao_social
                      }
                    </strong>

                    <br />

                    <small>
                      CNPJ:
                      {
                        cliente.cnpj
                      }
                    </small>

                  </td>

                  <td style={tdStyle}>
                    {
                      cliente.telefone
                    }
                  </td>

                  <td style={tdStyle}>

                    <span
                      style={{
                        ...statusBadge,

                        background:
                          cliente.status ===
                          'Fechado'
                            ? '#2563eb'
                            : cliente.status ===
                              'Negociação'
                            ? '#ea580c'
                            : cliente.status ===
                              'Contatado'
                            ? '#16a34a'
                            : '#9333ea'
                      }}
                    >
                      {
                        cliente.status
                      }
                    </span>

                  </td>

                  <td style={tdStyle}>

                    <div style={buttonGroup}>

                      <button
                        onClick={() =>
                          abrirWhatsapp(
                            cliente.telefone,
                            cliente.razao_social
                          )
                        }
                        style={whatsappButton}
                      >
                        WhatsApp
                      </button>

                      <button
                        onClick={() =>
                          atualizarStatus(
                            cliente.id,
                            'Negociação'
                          )
                        }
                        style={negociacaoButton}
                      >
                        Negociação
                      </button>

                      <button
                        onClick={() =>
                          atualizarStatus(
                            cliente.id,
                            'Fechado'
                          )
                        }
                        style={fechadoButton}
                      >
                        Fechado
                      </button>

                      <button
                        onClick={() =>
                          excluirCliente(
                            cliente.id
                          )
                        }
                        style={deleteButton}
                      >
                        Excluir
                      </button>

                    </div>

                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

      {/* LOGS */}

      <div style={boxStyle}>

        <h2>
          Logs de Campanha
        </h2>

        {
          logs.length === 0
          &&
          <p>
            Nenhuma campanha enviada.
          </p>
        }

        {
          logs.map(
            (log, index) => (

              <div
                key={index}
                style={logItem}
              >

                <strong>
                  {log.empresa}
                </strong>

                <p>
                  {log.telefone}
                </p>

                <small>
                  {log.data}
                </small>

              </div>

            )
          )
        }

      </div>

    </div>
  )
}

/* ESTILOS */

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
  gridTemplateColumns:
    'repeat(4,1fr)',
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

const filterBox = {
  marginTop: '35px',
  display: 'flex',
  gap: '15px'
}

const inputStyle = {
  flex: 1,
  padding: '18px',
  borderRadius: '14px',
  border: '1px solid #334155',
  background: '#0f172a',
  color: 'white',
  fontSize: '16px'
}

const selectStyle = {
  width: '220px',
  padding: '18px',
  borderRadius: '14px',
  border: '1px solid #334155',
  background: '#0f172a',
  color: 'white'
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

const tableBox = {
  background: '#111827',
  marginTop: '35px',
  borderRadius: '25px',
  overflow: 'hidden'
}

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse' as const
}

const thStyle = {
  textAlign: 'left' as const,
  padding: '24px',
  background: '#0f172a',
  fontSize: '18px'
}

const tdStyle = {
  padding: '24px'
}

const rowStyle = {
  borderBottom:
    '1px solid #1e293b'
}

const statusBadge = {
  padding: '10px 18px',
  borderRadius: '12px',
  color: 'white',
  fontWeight: 'bold'
}

const buttonGroup = {
  display: 'flex',
  gap: '10px',
  flexWrap: 'wrap' as const
}

const whatsappButton = {
  background: '#16a34a',
  border: 'none',
  padding: '12px 18px',
  borderRadius: '12px',
  color: 'white',
  cursor: 'pointer'
}

const negociacaoButton = {
  background: '#ea580c',
  border: 'none',
  padding: '12px 18px',
  borderRadius: '12px',
  color: 'white',
  cursor: 'pointer'
}

const fechadoButton = {
  background: '#2563eb',
  border: 'none',
  padding: '12px 18px',
  borderRadius: '12px',
  color: 'white',
  cursor: 'pointer'
}

const deleteButton = {
  background: '#dc2626',
  border: 'none',
  padding: '12px 18px',
  borderRadius: '12px',
  color: 'white',
  cursor: 'pointer'
}

const logItem = {
  marginTop: '15px',
  padding: '20px',
  background: '#0f172a',
  borderRadius: '14px'
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