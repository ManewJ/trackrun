function ProgressBar({ progresso }) { //esse componente espera receber algo de fora chamado "progresso" é a prop.
    return (
    <div className="mb-5">
      <div className="flex justify-between mb-1">
        <span className="text-[10px] text-neutral-500 uppercase tracking-widest">
          Progresso
        </span>
        <span className="text-[10px] text-orange-500 font-medium">
          {progresso}%
        </span>
      </div>
      <div className="h-0.5 bg-neutral-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-orange-500 rounded-full transition-all duration-300"
          style={{ width: `${progresso}%` }} //aqui eu uso o valor da prop para definir a largura da barra dinamicamente.Se o progresso for 75, a barra fica com 75% de largura.
        ></div>
      </div>
    </div>
  )
}

export default ProgressBar