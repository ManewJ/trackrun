import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import { buscarTreinadorPorCodigo } from '../utils/buscarTreinador'

// AvisoVinculo — mostra o status do vínculo do atleta com o treinador
// (pendente ou recusado), e oferece um campo pra vincular a um treinador
// quando o atleta está sem vínculo ou foi recusado.
// Usado tanto no TrainingForm quanto no AtletaFeed, pra garantir que o atleta
// veja o aviso independente de já ter treinos registrados ou não.

function AvisoVinculo() {
  const [meuId, setMeuId] = useState(null)
  const [vinculo, setVinculo] = useState(null)
  // temVinculoAtivo: true quando status é 'pendente' ou 'aceito' — nesses
  // casos não faz sentido oferecer o campo de código
  const [temVinculoAtivo, setTemVinculoAtivo] = useState(false)

  // Fase 3, Bloco 4 — campo "tenho um código"
  const [codigo, setCodigo] = useState('')
  // statusCodigo: 'vazio' | 'validando' | 'valido' | 'invalido'
  const [statusCodigo, setStatusCodigo] = useState('vazio')
  const [treinadorEncontrado, setTreinadorEncontrado] = useState(null)
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    buscarVinculo()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function buscarVinculo() {
    const { data: { user } } = await supabase.auth.getUser()
    setMeuId(user.id)

    const { data: meuPerfil, error } = await supabase
      .from('profiles')
      .select('status_vinculo, treinador_id')
      .eq('id', user.id)
      .single()

    if (error || !meuPerfil) return

    // pendente ou aceito: já tem vínculo em andamento, não oferece o campo
    const vinculoAtivo =
      meuPerfil.status_vinculo === 'pendente' ||
      meuPerfil.status_vinculo === 'aceito'

    setTemVinculoAtivo(vinculoAtivo)

    const precisaAvisar =
      meuPerfil.status_vinculo === 'pendente' ||
      meuPerfil.status_vinculo === 'recusado'

    if (!precisaAvisar || !meuPerfil.treinador_id) {
      setVinculo(null)
      return
    }

    const { data: perfilTreinador } = await supabase
      .from('profiles')
      .select('nome, nome_assessoria')
      .eq('id', meuPerfil.treinador_id)
      .single()

    setVinculo({
      status: meuPerfil.status_vinculo,
      nomeTreinador: perfilTreinador?.nome_assessoria || perfilTreinador?.nome || 'seu treinador',
    })
  }

  // roda quando o campo de código perde o foco (onBlur)
  async function validarCodigo() {
    const codigoLimpo = codigo.trim().toUpperCase()

    if (codigoLimpo === '') {
      setStatusCodigo('vazio')
      setTreinadorEncontrado(null)
      return
    }

    setStatusCodigo('validando')
    const treinador = await buscarTreinadorPorCodigo(codigoLimpo)

    if (treinador) {
      setStatusCodigo('valido')
      setTreinadorEncontrado(treinador)
    } else {
      setStatusCodigo('invalido')
      setTreinadorEncontrado(null)
    }
  }

  // envia a solicitação de vínculo com o treinador encontrado
  async function handleEnviarSolicitacao() {
    if (!treinadorEncontrado) return

    setEnviando(true)

    // busca o boas_vindas_vistas atual, pra resetar só a chave 'pendente'
    // (é uma solicitação nova — o atleta deve ver a tela de boas-vindas de novo)
    const { data: perfilAtual } = await supabase
      .from('profiles')
      .select('boas_vindas_vistas')
      .eq('id', meuId)
      .single()

    const vistas = perfilAtual?.boas_vindas_vistas || {}

    const { error } = await supabase
      .from('profiles')
      .update({
        treinador_id: treinadorEncontrado.id,
        status_vinculo: 'pendente',
        boas_vindas_vistas: { ...vistas, pendente: false },
      })
      .eq('id', meuId)

    if (!error) {
      // limpa o formulário e recarrega o vínculo pra refletir o novo estado
      setCodigo('')
      setStatusCodigo('vazio')
      setTreinadorEncontrado(null)
      await buscarVinculo()
    }

    setEnviando(false)
  }

  return (
    <>
      {/* aviso permanente de pendente ou recusado */}
      {vinculo?.status === 'pendente' && (
        <div className="bg-amber-400/10 border border-amber-400/30 rounded-lg px-4 py-3 mb-4">
          <p className="text-amber-400 text-sm">
            Aguardando aprovação de <strong>{vinculo.nomeTreinador}</strong>
          </p>
        </div>
      )}

      {vinculo?.status === 'recusado' && (
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 mb-4">
          <p className="text-zinc-300 text-sm">
            Sua solicitação para <strong>{vinculo.nomeTreinador}</strong> não foi aceita.
          </p>
        </div>
      )}

      {/* campo "tenho um código" — só aparece sem vínculo ativo (pendente/aceito) */}
      {!temVinculoAtivo && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 mb-6">
          <p className="text-zinc-400 text-xs tracking-widest mb-2">TEM UM CÓDIGO DE TREINADOR?</p>

          <div className="flex gap-2">
            <input
              type="text"
              value={codigo}
              onChange={(e) => {
                setCodigo(e.target.value)
                setStatusCodigo('vazio')
              }}
              onBlur={validarCodigo}
              placeholder="Ex.: TR-4CCA1"
              className="flex-1 bg-zinc-800 text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#FF4500] uppercase"
            />

            <button
              type="button"
              onClick={handleEnviarSolicitacao}
              disabled={statusCodigo !== 'valido' || enviando}
              className="bg-[#FF4500] text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {enviando ? 'Enviando...' : 'Vincular'}
            </button>
          </div>

          {statusCodigo === 'validando' && (
            <p className="text-zinc-500 text-xs mt-2">Verificando código...</p>
          )}
          {statusCodigo === 'valido' && (
            <p className="text-emerald-400 text-xs mt-2">
              ✓ {treinadorEncontrado.nome_assessoria || treinadorEncontrado.nome}
            </p>
          )}
          {statusCodigo === 'invalido' && (
            <p className="text-red-400 text-xs mt-2">
              Código não encontrado.
            </p>
          )}
        </div>
      )}
    </>
  )
}

export default AvisoVinculo