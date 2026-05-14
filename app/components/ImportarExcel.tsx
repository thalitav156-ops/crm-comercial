'use client'

import * as XLSX from 'xlsx'
import { supabase } from '../services/supabase'

export default function ImportarExcel() {

  async function importarExcel(
    event: any
  ) {

    const file =
      event.target.files[0]

    if (!file) return

    const data =
      await file.arrayBuffer()

    const workbook =
      XLSX.read(data)

    const sheet =
      workbook.Sheets[
        workbook.SheetNames[0]
      ]

    const jsonData: any[] =
      XLSX.utils.sheet_to_json(sheet)

    let importados = 0

    for (const linha of jsonData) {

      const razaoSocial =
        linha['Cliente'] || ''

      const telefone =
        linha['Fone (1)'] || ''

      const cnpj =
        linha['Cnpj/Cpf'] || ''

      const email =
        linha['Email Comercial'] || ''

      const status =
        linha['Classificacao'] || 'Novo Lead'

      if (
        !razaoSocial ||
        !telefone
      ) {
        continue
      }

      const telefoneLimpo =
        String(telefone)
          .replace(/\D/g, '')

      const telefoneWhatsapp =
        telefoneLimpo.length >= 10
          ? `55${telefoneLimpo}`
          : ''

      await supabase
        .from('clientes')
        .insert([
          {
            razao_social:
              razaoSocial,

            telefone:
              telefoneWhatsapp,

            cnpj:
              cnpj,

            email:
              email,

            status:
              status
          }
        ])

      importados++
    }

    alert(
      `${importados} clientes importados com sucesso`
    )
  }

  return (
    <div
      style={{
        marginTop: '20px'
      }}
    >

      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={importarExcel}
        style={{
          width: '100%',
          padding: '18px',
          borderRadius: '12px',
          border: '1px solid #334155',
          background: '#0f172a',
          color: 'white',
          fontSize: '16px'
        }}
      />

    </div>
  )
}