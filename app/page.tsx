'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'
import ImportarExcel from '../components/ImportarExcel'

export default function Home() {

  const [clientes, setClientes] =
    useState<any[]>([])

  const [busca, setBusca] =
    useState('')

  const [filtroStatus, setFiltroStatus] =
    useState('Todos')

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
`Olá ${empresa}, tudo bem?

Sentimos sua falta por aqui 😊

Gostaríamos de apresentar novamente nossa linha de produtos e verificar oportunidades para retomarmos nossa parceria.

Posso lhe enviar nosso catálogo atualizado e melhores condições disponíveis no momento.

Fico à disposição 🚀`

    window.open(
      `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`,
      '_blank'
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

        ||

        cliente.cnpj
          ?.includes(busca)

      const statusMatch =

        filtroStatus === 'Todos'

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
        Gestão inteligente de clientes e leads
      </p>

      {/* DASHBOARD */}

      <div style={dashboardGrid}>

        <div style={cardBlue}>
          <h2>{totalLeads}</h2>
          <p>Total de Leads</p>
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
          Importar Clientes Inativos
        </h2>

        <p style={description}>
          O sistema identifica automaticamente:
          Razão Social, Telefone, CNPJ e E-mail da planilha.
        </p>

        <ImportarExcel />

        <button style={importButton}>
          Sistema faz leitura automática da planilha
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
                            : '#2563eb'
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

const importButton = {
  width: '100%',
  marginTop: '25px',
  padding: '20px',
  borderRadius: '14px',
  border: 'none',
  background: '#16a34a',
  color: 'white',
  fontWeight: 'bold',
  fontSize: '18px'
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