function LeftPanel() {
  return (
    <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-neutral-900 to-black flex-col justify-end p-12 overflow-hidden">
      
      <div className="inline-flex items-center gap-2 self-start text-orange-500 text-xs font-medium tracking-widest uppercase border border-orange-500/50 rounded-full px-3 py-1 mb-4 animate-pulse">       
        TrackRun.
      </div>

      <h1 className="text-4xl font-semibold text-white leading-tight uppercase tracking-tight mb-2">
        Cada km <br />
        é uma <span className="text-orange-500">vitória.</span>
      </h1>

      <p className="text-sm text-neutral-500 max-w-xs mb-8">
        Registre sua corrida, acompanhe sua evolução e nunca perca um treino.
      </p>

      <div className="flex gap-8">
        <div>
          <p className="text-xl font-semibold text-white">847</p>
          <p className="text-[10px] text-neutral-500 uppercase tracking-wide">Treinos</p>
        </div>
        <div>
          <p className="text-xl font-semibold text-white">12.4k</p>
          <p className="text-[10px] text-neutral-500 uppercase tracking-wide">Km</p>
        </div>
        <div>
          <p className="text-xl font-semibold text-white">JP</p>
          <p className="text-[10px] text-neutral-500 uppercase tracking-wide">João Pessoa</p>
        </div>
      </div>

    </div>
  )
}

export default LeftPanel