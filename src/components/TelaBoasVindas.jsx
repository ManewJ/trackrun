import { useEffect, useState } from 'react'
import { supabase } from '../supabase'

function TelaBoasVindas({ onContinuar }) {
  const [estado, setEstado] = useState(null) // 'novato' | 'pendente' | 'recusado' | 'aceito' | null
  const [nomeAssessoria, setNomeAssessoria] = useState('')
  const [nome, setNome] = useState('')
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    async function verificar() {
      const { data: { user } } = await supabase.auth.getUser()

      const { data: perfil } = await supabase
        .from('profiles')
        .select('nome, status_vinculo, treinador_id, boas_vindas_vistas')
        .eq('id', user.id)
        .single()

      if (!perfil) {
        onContinuar()
        return
      }

      setNome(perfil.nome)
      const vistas = perfil.boas_vindas_vistas || {}

      // descobre qual é o estado atual
      let estadoAtual = 'novato'
      if (perfil.status_vinculo === 'pendente') estadoAtual = 'pendente'
      else if (perfil.status_vinculo === 'recusado') estadoAtual = 'recusado'
      else if (perfil.status_vinculo === 'aceito') estadoAtual = 'aceito'

      // se já foi visto, pula direto pro app normal
      if (vistas[estadoAtual]) {
        onContinuar()
        return
      }

      // busca nome da assessoria, se houver treinador
      if (perfil.treinador_id) {
        const { data: treinador } = await supabase
          .from('profiles')
          .select('nome, nome_assessoria')
          .eq('id', perfil.treinador_id)
          .single()

        setNomeAssessoria(treinador?.nome_assessoria || treinador?.nome || '')
      }

      setEstado(estadoAtual)
      setCarregando(false)
    }

    verificar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleContinuar() {
    const { data: { user } } = await supabase.auth.getUser()

    const { data: perfil } = await supabase
      .from('profiles')
      .select('boas_vindas_vistas')
      .eq('id', user.id)
      .single()

    const vistas = perfil?.boas_vindas_vistas || {}

    await supabase
      .from('profiles')
      .update({ boas_vindas_vistas: { ...vistas, [estado]: true } })
      .eq('id', user.id)

    onContinuar()
  }

  if (carregando || !estado) {
    return null
  }

  // monta o título e a mensagem conforme o estado
  const conteudo = {
    novato: {
      titulo: `Seja bem-vindo, ${nome}!`,
      mensagem: 'Vamos iniciar sua jornada — registre seu primeiro treino!',
    },
    pendente: {
      titulo: `Solicitação enviada, ${nome}!`,
      mensagem: `Sua solicitação para ${nomeAssessoria} foi enviada. Aguardando aprovação do seu treinador.`,
    },
    recusado: {
      titulo: `Olá, ${nome}`,
      mensagem: `Sua solicitação para ${nomeAssessoria} não foi aceita.`,
    },
    aceito: {
      titulo: `Parabéns, ${nome}!`,
      mensagem: `Você agora faz parte da ${nomeAssessoria}. Vamos treinar?`,
    },
  }[estado]

  return (
    <div className="text-white text-center max-w-md">
      <p className="text-[#FF4500] font-bold tracking-widest text-sm mb-6">TRACKRUN.</p>
      <h1 className="text-3xl font-bold mb-3">{conteudo.titulo}</h1>
      <p className="text-zinc-400 text-sm mb-8">{conteudo.mensagem}</p>

      <button
        type="button"
        onClick={handleContinuar}
        className="w-full bg-[#FF4500] text-white font-bold tracking-widest py-4 rounded-lg hover:bg-orange-600 transition-colors"
      >
        CONTINUAR
      </button>
    </div>
  )
}

export default TelaBoasVindas