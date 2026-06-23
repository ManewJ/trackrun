import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import LeftPanel from './components/LeftPanel'
import TrainingForm from './components/TrainingForm'
import ConfirmCard from './components/ConfirmCard'

function App() {
  const [treinoRegistrado, setTreinoRegistrado] = useState(null)

  // esse é o estado mais importante do app inteiro. quando é null, significa
  // "nenhum treino registrado ainda" -> mostra o formulário. quando tem um
  // objeto dentro, significa "treino registrado" -> mostra a confirmação.

  function handleRegistrar(dadosTreino) {
    setTreinoRegistrado(dadosTreino)
  }

  function handleNovoRegistro() {
    setTreinoRegistrado(null)
  }

  return (
    <div className="min-h-screen flex bg-black">

      {/* layout mobile: fundo com imagem do corredor */}
      <div
        className="lg:hidden fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/corrida-sol.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/70"></div>
      </div>

      {/* painel esquerdo — só aparece em desktop */}
      <LeftPanel />

      {/* área do formulário */}
      <div className="relative flex-1 flex items-center justify-center p-6 lg:p-8">
        <div className="w-full max-w-md">
          {/* interruptor entre formulário e confirmação com animação suave */}
          <AnimatePresence mode="wait">
            {treinoRegistrado === null ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
              >
                <TrainingForm onRegistrar={handleRegistrar} />
              </motion.div>
            ) : (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
              >
                <ConfirmCard treino={treinoRegistrado} onNovoRegistro={handleNovoRegistro} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

    </div>
  )
}

export default App