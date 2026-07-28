import { motion, useTransform, useMotionValue } from 'motion/react'
import { useEffect } from 'react'

const fadeLeft = (delay = 0) => ({
  initial: { opacity: 0, x: -24 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.5, delay },
})

// recebe imagem e scrollY como props
// scrollY vem do painel direito e move a foto levemente pra cima — efeito parallax
function LeftPanel({ imagem = '/images/corrida-sol.jpg', scrollY = 0 }) {

  // converte o scrollY em deslocamento da foto
  // a cada 1px de scroll no painel direito, a foto sobe 0.15px
  const motionScrollY = useMotionValue(0)

  useEffect(() => {
    motionScrollY.set(scrollY)
  }, [scrollY, motionScrollY])

  const bgY = useTransform(motionScrollY, [0, 1000], ['0%', '-15%'])

  return (
    <div className="hidden lg:flex flex-1 relative flex-col justify-end p-12 overflow-hidden">

      {/* foto com parallax — se move levemente enquanto o feed rola */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center scale-110"
        style={{
          backgroundImage: `url('${imagem}')`,
          y: bgY,
        }}
      />

      <div className="absolute inset-0 bg-linear-to-t from-black via-black/80 to-black/40"></div>

      <motion.div {...fadeLeft(0.1)} className="relative z-10 inline-flex items-center gap-2 self-start
       text-orange-500 text-xs font-medium tracking-widest uppercase border
        border-orange-500/50 rounded-full px-4 py-1.5 mb-5 animate-pulse">
        TrackRun.
      </motion.div>

      <motion.h1 {...fadeLeft(0.2)} className="relative z-10 text-5xl font-semibold text-white leading-tight uppercase tracking-tight mb-3">
        Cada km <br />
        é uma <span className="text-orange-500">vitória.</span>
      </motion.h1>

      <motion.p {...fadeLeft(0.3)} className="relative z-10 text- text-neutral-200 max-w-sm mb-5">
        Registre sua corrida, acompanhe sua evolução e nunca perca um treino.
      </motion.p>

      <motion.div {...fadeLeft(0.4)} className="relative z-10 flex gap-10">
        <div>
          <p className="text-2xl font-semibold text-white">847</p>
          <p className="text-xs text-orange-500/70 uppercase tracking-wide mt-1">Treinos</p>
        </div>
        <div>
          <p className="text-2xl font-semibold text-white">12.4k</p>
          <p className="text-xs text-orange-500/70 uppercase tracking-wide mt-1">Km</p>
        </div>
        <div>
          <p className="text-2xl font-semibold text-white">JP</p>
          <p className="text-xs text-orange-500/70 uppercase tracking-wide mt-1">João Pessoa</p>
        </div>
      </motion.div>
    </div>
  )
}

export default LeftPanel