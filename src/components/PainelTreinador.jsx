import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import Header from './Header'
import { CheckCircle2, Zap } from 'lucide-react'

const labelsSensacao = {
  leve: 'Leve',
  moderado: 'Moderado',
  pesado: 'Pesado',
  limite: 'No limite',
}

// PainelTreinador — tela principal do treinador logado
function PainelTreinador() {

  const [perfil, setPerfil] = useState(null)
  const [pendentes, setPendentes] = useState([])
  const [atletasAceitos, setAtletasAceitos] = useState([])
  const [gruposTreinos, setGruposTreinos] = useState([])
  const [semTreinoRecente, setSemTreinoRecente] = useState([])
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

      await buscarPendentes(user.id)
      await buscarDadosAtletas(user.id)

      setCarregando(false)
    }

    buscarPerfil()
  }, [])

  // busca todos os atletas pendentes do treinador logado
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

  // busca atletas aceitos + treinos dos últimos 7 dias, agrupados por data
  async function buscarDadosAtletas(idDoTreinador) {
    const { data: aceitos } = await supabase
      .from('profiles')
      .select('id, nome')
      .eq('treinador_id', idDoTreinador)
      .eq('status_vinculo', 'aceito')

    setAtletasAceitos(aceitos || [])

    if (!aceitos || aceitos.length === 0) {
      setGruposTreinos([])
      setSemTreinoRecente([])
      return
    }

    const idsAtletas = aceitos.map((a) => a.id)

    // calcula a data de 7 dias atrás
    const seteDiasAtras = new Date()
    seteDiasAtras.setDate(seteDiasAtras.getDate() - 7)

    const { data: treinos } = await supabase
      .from('treinos')
      .select('id, atleta_id, distancia, tempo, sensacao, status, observacoes, created_at')
      .in('atleta_id', idsAtletas)
      .gte('created_at', seteDiasAtras.toISOString())
      .order('created_at', { ascending: false })

    // mapa id -> nome, pra não precisar buscar de novo em cada treino
    const mapaNomes = {}
    aceitos.forEach((a) => { mapaNomes[a.id] = a.nome })

    // agrupa os treinos por data (chave = "28/07/2026")
    const grupos = {}
    const idsComTreino = new Set()

    ;(treinos || []).forEach((treino) => {
      idsComTreino.add(treino.atleta_id)

      const data = new Date(treino.created_at)
      const chave = data.toLocaleDateString('pt-BR')

      if (!grupos[chave]) {
        grupos[chave] = {
          data: chave,
          diaSemana: data.toLocaleDateString('pt-BR', { weekday: 'long' }),
          treinos: [],
        }
      }

      grupos[chave].treinos.push({ ...treino, nomeAtleta: mapaNomes[treino.atleta_id] })
    })

    setGruposTreinos(Object.values(grupos))

    // atletas aceitos que não aparecem em nenhum treino recente
    const semTreino = aceitos.filter((a) => !idsComTreino.has(a.id))
    setSemTreinoRecente(semTreino)
  }

  // copia o código pra área de transferência e dá feedback visual temporário
  async function handleCopiar() {
    await navigator.clipboard.writeText(perfil.codigo_convite)
    setTextoBotaoCopiar('Copiado! ✓')

    setTimeout(() => {
      setTextoBotaoCopiar('Copiar')
    }, 2000)
  }

  async function handleAceitar(idDoAtleta) {
    const { error } = await supabase
      .from('profiles')
      .update({ status_vinculo: 'aceito' })
      .eq('id', idDoAtleta)

    if (!error) {
      await buscarPendentes(perfil.id)
      await buscarDadosAtletas(perfil.id)
    }
  }

  async function handleRecusar(idDoAtleta) {
    const { error } = await supabase
      .from('profiles')
      .update({ status_vinculo: 'recusado' })
      .eq('id', idDoAtleta)

    if (!error) {
      await buscarPendentes(perfil.id)
    }
  }

  // saudação conforme o horário
  function saudacaoAtual() {
    const hora = new Date().getHours()
    if (hora < 12) return 'Bom dia'
    if (hora < 18) return 'Boa tarde'
    return 'Boa noite'
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

      <p className="text-xl font-medium mb-1">
        {saudacaoAtual()}, {perfil?.nome}
      </p>
      <p className="text-zinc-400 text-sm mb-6">
        {perfil?.nome_assessoria || 'Gerencie seus atletas e solicitações'}
      </p>

      {/* cards de métrica */}
      <div className="grid grid-cols-3 gap-2.5 mb-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-3">
          <p className="text-2xl font-medium text-white mb-0.5">{atletasAceitos.length}</p>
          <p className="text-[11px] text-zinc-500 leading-tight">Alunos ativos</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-3">
          <p className="text-2xl font-medium text-amber-400 mb-0.5">{pendentes.length}</p>
          <p className="text-[11px] text-zinc-500 leading-tight">Solicitações pendentes</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-3">
          <p className="text-2xl font-medium text-orange-300 mb-0.5">{semTreinoRecente.length}</p>
          <p className="text-[11px] text-zinc-500 leading-tight">Sem treino recente</p>
        </div>
      </div>

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
        <p className="text-zinc-500 text-sm mb-8">
          Nenhuma solicitação no momento. Compartilhe seu código para receber atletas.
        </p>
      ) : (
        <div className="flex flex-col gap-2 mb-8">
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

      {/* treinos da semana, agrupados por data */}
      <h2 className="text-sm font-bold tracking-widest text-zinc-300 mb-4">
        TREINOS DA SEMANA
      </h2>

      {gruposTreinos.length === 0 ? (
        <p className="text-zinc-500 text-sm">
          Nenhum treino registrado pelos seus atletas nos últimos 7 dias.
        </p>
      ) : (
        gruposTreinos.map((grupo) => (
          <div key={grupo.data} className="mb-5">
            <p className="text-xs text-zinc-500 uppercase tracking-wide mb-2">
              {grupo.data} · {grupo.diaSemana}
            </p>

            <div className="flex flex-col gap-2">
              {grupo.treinos.map((treino) => (
                <div
                  key={treino.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <p className="text-sm flex-1">
                      {treino.nomeAtleta}
                      <span className="text-zinc-500"> · {treino.distancia} km</span>
                    </p>

                    {treino.status === 'concluido' && (
                      <span className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap">
                        <CheckCircle2 size={13} />
                        Concluído
                      </span>
                    )}
                    {treino.status === 'nao_concluido' && (
                      <span className="flex items-center gap-1 bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap">
                        <Zap size={13} />
                        Quebrei
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-zinc-400 mt-1">
                    {treino.tempo} min · {labelsSensacao[treino.sensacao] ?? '—'}
                  </p>

                  {treino.observacoes && (
                    <div className="mt-2.5 ml-0 bg-[#1E1613] border-l-2 border-orange-600 px-3 py-2 rounded-r-md">
                      <p className="text-xs text-zinc-300">{treino.observacoes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {/* divisor com efeito de brilho — linha fixa, título com mais respiro abaixo */}
      {semTreinoRecente.length > 0 && (
        <>
          <div className="relative mt-8 mb-10">
            <div className="absolute inset-x-0 top-1/2 h-px bg-[#FF4500]/50" />
            <div className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 bg-[#FF4500] blur-md opacity-40" />
          </div>

          <h2 className="text-sm font-bold tracking-widest text-zinc-500 mb-3">
            SEM TREINO RECENTE
          </h2>

          <div className="flex flex-col gap-2">
            {semTreinoRecente.map((atleta) => (
              <div
                key={atleta.id}
                className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3"
              >
                <p className="text-sm text-zinc-400">
                  {atleta.nome}
                  <span className="text-zinc-600"> · nenhum treino registrado</span>
                </p>
              </div>
            ))}
          </div>
        </>
      )}

    </div>
  )
}

export default PainelTreinador