import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import Header from './Header'

// PainelTreinador — tela principal do treinador logado
function PainelTreinador() {

  const [perfil, setPerfil] = useState(null)
  const [pendentes, setPendentes] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [textoBotaoCopiar, setTextoBotaoCopiar] = useState('Copiar')

  useEffect(() => {
    async function buscarPerfil() {
      const { data: { user } } = await supabase.auth.getUser()

      const { data, error } = await supabase
        .from('profiles')
        .select('id, nome, nome_assessoria, codigo_convite')
        .eq('id', user.id)
        .single()

      if (!error) {
        setPerfil(data)
      }

      // busca a lista de pendentes logo em seguida, já com o id em mãos
      await buscarPendentes(user.id)

      setCarregando(false)
    }

    buscarPerfil()
  }, [])

  // busca todos os atletas pendentes do treinador logado
  // extraída para fora do useEffect, pra poder ser chamada de novo depois de aceitar/recusar
  async function buscarPendentes(idDoTreinador) {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, nome')
      .eq('treinador_id', idDoTreinador)
      .eq('status_vinculo', 'pendente')

    if (!error) {
      setPendentes(data)
    }
  }

  // copia o código pra área de transferência e dá feedback visual temporário
  async function handleCopiar() {
    await navigator.clipboard.writeText(perfil.codigo_convite)
    setTextoBotaoCopiar('Copiado! ✓')

    setTimeout(() => {
      setTextoBotaoCopiar('Copiar')
    }, 2000)
  }

  // aceita o vínculo: o atleta já tem treinador_id apontando pra mim,
  // só muda o status de 'pendente' para 'aceito'
  async function handleAceitar(idDoAtleta) {
    const { error } = await supabase
      .from('profiles')
      .update({ status_vinculo: 'aceito' })
      .eq('id', idDoAtleta)

    if (!error) {
      // atualiza a lista na tela, sem precisar recarregar a página
      await buscarPendentes(perfil.id)
    }
  }

  // recusa o vínculo: mantém o treinador_id (histórico de quem convidou),
  // só muda o status para 'recusado' — evita a condição treinador_id IS NULL,
  // que causava o 403 na policy de UPDATE
  async function handleRecusar(idDoAtleta) {
    const { error } = await supabase
      .from('profiles')
      .update({ status_vinculo: 'recusado' })
      .eq('id', idDoAtleta)

    if (!error) {
      await buscarPendentes(perfil.id)
    }
  }

  if (carregando) {
    return (
      <div className="text-white">
        <Header />
        <p className="text-zinc-400 text-sm">Carregando painel...</p>
      </div>
    )
  }

  return (
    <div className="text-white">
      <Header />

      <h1 className="text-3xl font-bold mb-1">
        {perfil?.nome_assessoria || perfil?.nome}
      </h1>
      <p className="text-zinc-400 text-sm mb-8">
        Gerencie seus atletas e solicitações
      </p>

      {/* card do código de convite */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 flex items-center justify-between gap-3 mb-8">
        <div>
          <p className="text-xs text-zinc-500 mb-1">Seu código de convite</p>
          <p className="text-xl font-bold tracking-widest text-amber-400">
            {perfil?.codigo_convite}
          </p>
        </div>

        <button
          type="button"
          onClick={handleCopiar}
          className="bg-[#FF4500] text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors whitespace-nowrap"
        >
          {textoBotaoCopiar}
        </button>
      </div>

      {/* lista de solicitações pendentes */}
      <div className="mb-4 flex items-center gap-2">
        <h2 className="text-sm font-bold tracking-widest text-zinc-300">
          SOLICITAÇÕES PENDENTES
        </h2>
        {pendentes.length > 0 && (
          <span className="bg-amber-400 text-zinc-900 text-xs font-bold px-2 py-0.5 rounded-full">
            {pendentes.length}
          </span>
        )}
      </div>

      {pendentes.length === 0 ? (
        <p className="text-zinc-500 text-sm">
          Nenhuma solicitação no momento. Compartilhe seu código para receber atletas.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {pendentes.map((atleta) => (
            <div
              key={atleta.id}
              className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 flex items-center justify-between gap-3"
            >
              <p className="text-sm">{atleta.nome}</p>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleAceitar(atleta.id)}
                  className="bg-[#FF4500] text-white text-xs font-bold px-3 py-1.5 rounded-md hover:bg-orange-600 transition-colors"
                >
                  Aceitar
                </button>
                <button
                  type="button"
                  onClick={() => handleRecusar(atleta.id)}
                  className="bg-transparent text-zinc-400 border border-zinc-700 text-xs px-3 py-1.5 rounded-md hover:bg-zinc-800 transition-colors"
                >
                  Recusar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}

export default PainelTreinador