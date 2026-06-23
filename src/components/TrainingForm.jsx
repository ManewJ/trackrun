import { useState } from 'react'
import ProgressBar from './ProgressBar'
import SensacaoTags from './SensacaoTags'

function TrainingForm({ onRegistrar }) {
  const [distancia, setDistancia] = useState('')
  const [tempo, setTempo] = useState('')
  const [sensacao, setSensacao] = useState(null)
  const [observacoes, setObservacoes] = useState('')

  const camposPreenchidos = [
    distancia !== '',
    tempo !== '',
    sensacao !== null,
    observacoes !== '',
  ].filter(Boolean).length

  const progresso = Math.round((camposPreenchidos / 4) * 100)

  function handleSubmit(e) {
    e.preventDefault()
    onRegistrar({ distancia, tempo, sensacao, observacoes })
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md">
      <div className="mb-1">
        <p className="text-orange-500 text-sm font-medium tracking-widest uppercase mb-1">
          TrackRun.
        </p>
        <h2 className="text-xl font-medium text-white">Registro de treino</h2>
        <p className="text-xs text-neutral-500 mb-5">Preencha os dados da sua sessão</p>
      </div>

      <ProgressBar progresso={progresso} />

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-medium text-neutral-500 uppercase tracking-widest">
            Distância (km)
          </label>
          <input
            type="number"
            step="0.1"
            value={distancia}
            onChange={(e) => setDistancia(e.target.value)}
            placeholder="Ex: 10.5"
            className="bg-neutral-900 border border-neutral-800 rounded-lg h-10 px-3 text-white text-sm placeholder-neutral-700
             focus:border-orange-500 outline-none transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-medium text-neutral-500 uppercase tracking-widest">
            Tempo total
          </label>
          <input
            type="text"
            value={tempo}
            onChange={(e) => setTempo(e.target.value)}
            placeholder="Ex: 58:42"
            className="bg-neutral-900 border border-neutral-800 rounded-lg h-10 px-3 text-white text-sm placeholder-neutral-700
             focus:border-orange-500 outline-none transition-colors"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="text-[10px] font-medium text-neutral-500 uppercase tracking-widest mb-1 block">
          Sensação geral
        </label>
        <SensacaoTags onSelecionar={setSensacao} />
      </div>

      <div className="flex flex-col gap-1 mb-5">
        <label className="text-[10px] font-medium text-neutral-500 uppercase tracking-widest">
          Observações
        </label>
        <textarea
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          placeholder="Como foi o treino? Algum detalhe importante..."
          rows={3}
          className="bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-white text-sm placeholder-neutral-700
           focus:border-orange-500 outline-none transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        className="w-full border border-orange-500 bg-orange-500 hover:bg-transparent hover:text-orange-500 text-white transition-all duration-300 rounded-lg h-12 text-sm font-medium tracking-widest uppercase"
      >
        Registrar treino
      </button>
    </form>
  )
}

export default TrainingForm