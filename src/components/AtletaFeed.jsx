import { useEffect, useState } from 'react'
import { supabase } from '../supabase'

const labelsSensacao = {
  leve: 'Leve',
  moderado: 'Moderado',
  pesado: 'Pesado',
  limite: 'No limite',
}

// AtletaFeed — lista todos os treinos do atleta logado
// recebe onNovoRegistro: função para ir ao formulário
function AtletaFeed({ onNovoRegistro }) {
  const [treinos, setTreinos] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    // quando o componente abre, busca os treinos do atleta no banco
    async function buscarTreinos() {
      const { data, error } = await supabase
        .from('treinos')
        .select('*')
        .order('created_at', { ascending: false }) // mais recente primeiro

      if (!error) {
        setTreinos(data)
      }

      setCarregando(false)
    }

    buscarTreinos()
  }, []) // [] significa: roda só uma vez, quando o componente abre

  if (carregando) {
    return (
      <div className="text-zinc-400 text-sm text-center">Carregando treinos...</div>
    )
  }

  return (
    <div className="w-full text-white">

      {/* cabeçalho */}
      <p className="text-[#FF4500] font-bold tracking-widest text-sm mb-6">TRACKRUN.</p>
      <h1 className="text-3xl font-bold mb-1">Meus treinos</h1>
      <p className="text-zinc-400 text-sm mb-8">Seu histórico de corridas</p>

      {/* lista vazia */}
      {treinos.length === 0 ? (
        <div className="text-center text-zinc-500 text-sm py-12">
          Nenhum treino registrado ainda.
        </div>
      ) : (

        // lista de treinos
        <div className="flex flex-col gap-3 mb-6">
          {treinos.map((treino) => (
            <div
              key={treino.id}
              className="bg-zinc-900 border border-zinc-800 rounded-lg p-4"
            >
              <div className="grid grid-cols-2 gap-2">

                <div>
                  <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Distância</p>
                  <p className="text-base font-medium">{treino.distancia} km</p>
                </div>

                <div>
                  <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Tempo</p>
                  <p className="text-base font-medium">{treino.tempo}</p>
                </div>

                <div>
                  <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Sensação</p>
                  <p className="text-sm font-medium">{labelsSensacao[treino.sensacao] ?? '—'}</p>
                </div>

                <div>
                  <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Observações</p>
                  <p className="text-xs text-zinc-300 line-clamp-2">{treino.observacoes || '—'}</p>
                </div>

              </div>

              {/* data do treino */}
              <p className="text-[10px] text-zinc-600 mt-3">
                {new Date(treino.created_at).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>

            </div>
          ))}
        </div>
      )}

      {/* botão novo registro */}
      <button
        type="button"
        onClick={onNovoRegistro}
        className="w-full bg-[#FF4500] hover:bg-orange-600 transition-colors rounded-lg h-11
         text-white text-xs font-bold tracking-widest uppercase"
      >
        + Novo registro
      </button>

    </div>
  )
}

export default AtletaFeed