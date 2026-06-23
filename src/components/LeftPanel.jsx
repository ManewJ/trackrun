import { motion } from 'motion/react'

const fadeLeft = (delay = 0) => ({
  initial: { opacity: 0, x: -24 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.5, delay },
})

function LeftPanel() {
  return (
    <div
      className="hidden lg:flex flex-1 relative flex-col justify-end p-12 overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/images/corrida-sol.jpg')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40"></div>

      <motion.div {...fadeLeft(0.1)} className="relative z-10 inline-flex items-center gap-2 self-start text-orange-500 text-xs font-medium tracking-widest uppercase border border-orange-500/50 rounded-full px-3 py-1 mb-4 animate-pulse">
        TrackRun.
      </motion.div>

      <motion.h1 {...fadeLeft(0.2)} className="relative z-10 text-4xl font-semibold text-white leading-tight uppercase tracking-tight mb-2">
        Cada km <br />
        é uma <span className="text-orange-500">vitória.</span>
      </motion.h1>

      <motion.p {...fadeLeft(0.3)} className="relative z-10 text-sm text-neutral-200 max-w-xs mb-8">
        Registre sua corrida, acompanhe sua evolução e nunca perca um treino.
      </motion.p>

      <motion.div {...fadeLeft(0.4)} className="relative z-10 flex gap-8">
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
      </motion.div>
    </div>
  )
}

export default LeftPanel