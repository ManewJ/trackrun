import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import Header from './Header'
import AvisoVinculo from './AvisoVinculo'
import { Trash2 } from 'lucide-react'

const labelsSensacao = {
  leve: 'Leve',
  moderado: 'Moderado',
  pesado: 'Pesado',
  limite: 'No limite',
}

function AtletaFeed({ onNovoRegistro }) {
  const [treinos, setTreinos] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    async function buscarTreinos() {
      const { data, error } = await supabase
        .from('treinos')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error) {
        setTreinos(data)
      }

      setCarregando(false)
    }

    buscarTreinos()
  }, [])

  async function handleDeletar(id) {
    // remove do banco de dados
    const { error } = await supabase
      .from('treinos')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Erro ao deletar treino:', error.message)
      return
    }

    // remove da lista local sem precisar recarregar tudo do banco
    setTreinos((anterior) => anterior.filter((treino) => treino.id !== id))
  }

  if (carregando) {
    return (
      <div className="text-zinc-400 text-sm text-center">Carregando treinos...</div>
    )
  }

  return (
    <div className="w-full text-white">

      <Header />
      <h1 className="text-2xl font-bold mb-1">Meus treinos</h1>
      <p className="text-zinc-400 text-sm mb-6">Seu histórico de corridas</p>

      <AvisoVinculo />

      {treinos.length === 0 ? (
        <div className="text-center text-zinc-500 text-sm py-12">
          Nenhum treino registrado ainda.
        </div>
      ) : (
        <div className="flex flex-col gap-3 mb-6">
          {treinos.map((treino) => (
            <div
              key={treino.id}
              className="group bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-4 shadow-[0_0_20px_rgba(255,69,0,0.11)] relative"
            >
              {/* botão de deletar — aparece ao passar o mouse */}
              <button
                type="button"
                onClick={() => handleDeletar(treino.id)}
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-600 hover:text-red-500"
                aria-label="Deletar treino"
              >
                <Trash2 size={15} />
              </button>

              {/* linha principal com labels */}
              <div className="flex items-center gap-5 mb-3">

                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Distância</p>
                  <p className="text-base font-bold text-white">{treino.distancia} <span className="text-xs text-zinc-500 font-normal">km</span></p>
                </div>

                <div className="w-px h-8 bg-zinc-700" />

                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Tempo</p>
                  <p className="text-base font-medium text-white">{treino.tempo}</p>
                </div>

                <div className="w-px h-8 bg-zinc-700" />

                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Sensação</p>
                  <p className="text-base font-medium text-white">{labelsSensacao[treino.sensacao] ?? '—'}</p>
                </div>

              </div>

              {/* observações */}
              {treino.observacoes && (
                <p className="text-sm text-zinc-400 mb-2">{treino.observacoes}</p>
              )}

              {/* data */}
              <p className="text-xs text-zinc-600">
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

      <button
        type="button"
        onClick={onNovoRegistro}
        className="w-full border border-orange-500 bg-orange-500 hover:bg-transparent
         hover:text-orange-500 text-white transition-all duration-300 rounded-lg h-11 text-xs font-bold tracking-widest uppercase"
      >
        + Novo registro
      </button>

    </div>
  )
}

export default AtletaFeed