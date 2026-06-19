const labelsSensacao = {
  leve: 'Leve',
  moderado: 'Moderado',
  pesado: 'Pesado',
  limite: 'No limite',
}

// um objeto que traduz o valor interno pro texto que o usuário vê. chamamos isso de mapeamento. estou usando um objeto como dicionário, ao invés de um monte de if/else.

function ConfirmCard({ treino, onNovoRegistro }) {
  return (
    <div className="max-w-md flex flex-col items-center text-center">
      <div className="w-14 h-14 rounded-full bg-orange-500/10 border
       border-orange-500/40 flex items-center justify-center mb-5">
        <svg
          className="w-6 h-6 text-orange-500"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>

      <h2 className="text-xl font-medium text-white mb-1">Treino registrado!</h2>
      <p className="text-xs text-neutral-500 mb-6">Seu treino foi salvo com sucesso.</p>

      <div className="grid grid-cols-2 gap-2 w-full mb-6">
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-left">
          <p className="text-[9px] text-neutral-500 uppercase tracking-widest mb-1">Distância</p>
          <p className="text-base font-medium text-white">{treino.distancia} km</p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-left">
          <p className="text-[9px] text-neutral-500 uppercase tracking-widest mb-1">Tempo</p>
          <p className="text-base font-medium text-white">{treino.tempo}</p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-left">
          <p className="text-[9px] text-neutral-500 uppercase tracking-widest mb-1">Sensação</p>
          <p className="text-base font-medium text-white">
            {labelsSensacao[treino.sensacao] ?? '—'}
          </p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-left">
          <p className="text-[9px] text-neutral-500 uppercase tracking-widest mb-1">Observações</p>
          <p className="text-xs text-neutral-300 line-clamp-2">
            {treino.observacoes || '—'}
          </p>
        </div>
      </div>

      <button
        onClick={onNovoRegistro}
        className="w-full border border-neutral-700 hover:border-orange-500
         hover:text-orange-500 transition-colors rounded-lg h-11 text-neutral-400 text-xs font-medium tracking-widest uppercase"
      >
        + Novo registro
      </button>
    </div>
  )
}

export default ConfirmCard


















// esse componente recebe os dados do treino via props (distancia, tempo, sensacao, observacoes). recebe uma funcao onNovoRegistro via props (pra avisar o pai quando quiser voltar)
// exibe tudo em formato de "comprovante"

// esse componente nao tem useState, ele só exibe o que recebe. É um componente "burro".