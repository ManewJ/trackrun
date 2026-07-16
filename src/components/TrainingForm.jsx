import { useState } from 'react'
import { motion } from 'motion/react'
import { supabase } from '../supabase'
import ProgressBar from './ProgressBar'
import SensacaoTags from './SensacaoTags'
import Header from './Header'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay },
})

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

  async function handleSubmit(e) {
    e.preventDefault()

    // busca o usuário logado direto do Supabase — sem depender de props
    const { data: { user } } = await supabase.auth.getUser()

    // salva o treino no banco vinculado ao atleta logado
    const { error } = await supabase
      .from('treinos')
      .insert({
        atleta_id: user.id,
        distancia,
        tempo,
        sensacao,
        observacoes,
      })

    if (error) {
      console.error('Erro ao salvar treino:', error.message)
      return
    }

    // só chama onRegistrar depois de confirmar que salvou no banco
    onRegistrar({ distancia, tempo, sensacao, observacoes })
  }

  return (
    <>
      <Header />

      <form onSubmit={handleSubmit} className="max-w-md">

        <motion.div {...fadeUp(0)} className="mb-1">
          <p className="text-orange-500 text-base lg:text-sm font-medium tracking-widest uppercase mb-1">
            TrackRun.
          </p>
          <h2 className="text-2xl lg:text-xl font-medium text-white">Registro de treino</h2>
          <p className="text-sm lg:text-xs text-neutral-300 lg:text-neutral-500 mb-5">
            Preencha os dados da sua sessão
          </p>
        </motion.div>

        <motion.div {...fadeUp(0.1)}>
          <ProgressBar progresso={progresso} />
        </motion.div>

        <motion.div {...fadeUp(0.2)} className="grid grid-cols-2 gap-3 mb-3">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-medium text-neutral-400 lg:text-neutral-500 uppercase tracking-widest">
              Distância
            </label>
            {/* div relativa — permite posicionar o "km" por cima do input */}
            <div className="relative">
              <input
                type="number"
                step="0.1"
                value={distancia}
                onChange={(e) => setDistancia(e.target.value)}
                placeholder="Ex: 10.5"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg h-10 pl-3 pr-9 text-white text-sm placeholder-neutral-700
                 focus:border-orange-500 outline-none transition-colors"
              />
              {/* "km" só aparece quando o campo tem algum valor digitado */}
              {distancia !== '' && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm pointer-events-none">
                  km
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-medium text-neutral-400 lg:text-neutral-500 uppercase tracking-widest">
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
        </motion.div>

        <motion.div {...fadeUp(0.3)} className="mb-4">
          <label className="text-[10px] font-medium text-neutral-400 lg:text-neutral-500 uppercase tracking-widest mb-1 block">
            Sensação geral
          </label>
          <SensacaoTags onSelecionar={setSensacao} />
        </motion.div>

        <motion.div {...fadeUp(0.4)} className="flex flex-col gap-1 mb-5">
          <label className="text-[10px] font-medium text-neutral-400 lg:text-neutral-500 uppercase tracking-widest">
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
        </motion.div>

        <motion.div {...fadeUp(0.5)}>
          <button
            type="submit"
            className="w-full border border-orange-500 bg-orange-500 hover:bg-transparent
             hover:text-orange-500 text-white transition-all duration-300 rounded-lg h-12 text-sm font-medium tracking-widest uppercase"
          >
            Registrar treino
          </button>
        </motion.div>

      </form>
    </>
  )
}

export default TrainingForm