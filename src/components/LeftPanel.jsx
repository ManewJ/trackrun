function LeftPanel() {
  return (
    <div
      className="hidden lg:flex flex-1 relative flex-col justify-end p-12 overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/images/corrida-sol.jpg')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40"></div>

      <div className="relative z-10 inline-flex items-center gap-2 self-start text-orange-500 text-xs font-medium tracking-widest uppercase border border-orange-500/50 rounded-full px-3 py-1 mb-4 animate-pulse">
        TrackRun.
      </div>

      <h1 className="relative z-10 text-4xl font-semibold text-white leading-tight uppercase tracking-tight mb-2 max-w-lg">
        Cada km <br />
        é uma <span className="text-orange-500">vitória.</span>
      </h1>

      <p className="relative z-10 text-sm text-neutral-200 max-w-xs mb-8">
        Registre sua corrida, acompanhe sua evolução e nunca perca um treino.
      </p>

      <div className="relative z-10 flex gap-8">
        <div>
          <p className="text-xl font-semibold text-white">847</p>
          <p className="text-[10px] text-orange-500/70 uppercase tracking-wide">Treinos</p>
        </div>
        <div>
          <p className="text-xl font-semibold text-white">12.4k</p>
          <p className="text-[10px] text-orange-500/70 uppercase tracking-wide">Km</p>
        </div>
        <div>
          <p className="text-xl font-semibold text-white">JP</p>
          <p className="text-[10px] text-orange-500/70 uppercase tracking-wide">João Pessoa</p>
        </div>
      </div>
    </div>
  )
}

export default LeftPanel