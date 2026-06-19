import { useState } from 'react'

const opcoes = [
  { valor: 'leve', label: 'Leve' },
  { valor: 'moderado', label: 'Moderado' },
  { valor: 'pesado', label: 'Pesado' },
  { valor: 'limite', label: 'No limite' },
] 

// ao invés de escrever quatro botões manualmente, eu guardo os dados numa lista e faço os botões automaticamente.

function SensacaoTags({ onSelecionar }) { 
  const [selecionada, setSelecionada] = useState(null)  // o estado começa como null, ou seja, nenhuma opção selecionada.SetSelecionada é a função que atualiza o estado, e selecionada é o valor atual do estado.

  function handleClick(valor) {
    const novoValor = selecionada === valor ? null : valor
    setSelecionada(novoValor)
    onSelecionar(novoValor)
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {opcoes.map((opcao) => (
        <button
          key={opcao.valor}
          type="button"
          onClick={() => handleClick(opcao.valor)}
          className={`px-4 py-2 rounded-full text-xs font-medium transition-all
            ${selecionada === opcao.valor
              ? 'bg-orange-500/10 border border-orange-500 text-orange-500'
              : 'bg-neutral-900 border border-neutral-800 text-neutral-500'
            }
            ${selecionada && selecionada !== opcao.valor ? 'opacity-70' : ''}
          `}
        >
          {opcao.label}
        </button>
      ))}
    </div>
  )
}

export default SensacaoTags