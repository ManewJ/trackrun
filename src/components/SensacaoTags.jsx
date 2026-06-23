import { useState } from 'react'
import { Wind, Activity, Dumbbell, Heart } from 'lucide-react'

const opcoes = [
  { valor: 'leve', label: 'Leve', icone: Wind },
  { valor: 'moderado', label: 'Moderado', icone: Activity },
  { valor: 'pesado', label: 'Pesado', icone: Dumbbell },
  { valor: 'limite', label: 'No limite', icone: Heart },
]

function SensacaoTags({ onSelecionar }) {
  const [selecionada, setSelecionada] = useState(null)

  function handleClick(valor) {
    const novoValor = selecionada === valor ? null : valor
    setSelecionada(novoValor)
    onSelecionar(novoValor)
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {opcoes.map((opcao) => {
        const Icone = opcao.icone
        return (
          <button
            key={opcao.valor}
            type="button"
            onClick={() => handleClick(opcao.valor)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all
              ${selecionada === opcao.valor
                ? 'bg-orange-500/10 border border-orange-500 text-orange-500'
                : 'bg-neutral-900 border border-neutral-800 text-neutral-500'
              }
              ${selecionada && selecionada !== opcao.valor ? 'opacity-70' : ''}
            `}
          >
            <Icone size={13} />
            {opcao.label}
          </button>
        )
      })}
    </div>
  )
}

export default SensacaoTags