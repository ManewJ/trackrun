import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { supabase } from './supabase'
import LeftPanel from './components/LeftPanel'
import TrainingForm from './components/TrainingForm'
import ConfirmCard from './components/ConfirmCard'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import AtletaFeed from './components/AtletaFeed'


function App() {
  const [usuarioLogado, setUsuarioLogado] = useState(false)
  const [verificando, setVerificando] = useState(true)
  const [tela, setTela] = useState('login') // 'login' ou 'cadastro'
  const [treinoRegistrado, setTreinoRegistrado] = useState(null)
  const [verTreinos, setVerTreinos] = useState(false)

  // verTreinos = true -> mostra o feed
  // verTreinos = false -> mostra formulário ou confirmação

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setUsuarioLogado(true)
      }
      setVerificando(false)
    })
  }, [])

  function handleRegistrar(dadosTreino) {
    setTreinoRegistrado(dadosTreino)
  }

  function handleNovoRegistro() {
    setTreinoRegistrado(null)
    setVerTreinos(false) // volta pro formulário
  }

  if (verificando) return null

  return (
    <div className="min-h-screen flex bg-black">

      {/* fundo mobile */}
      <div
        className="lg:hidden fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/corrida-sol.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/70"></div>
      </div>

      <LeftPanel />

      <div className="relative flex-1 flex items-center justify-center p-6 lg:p-8">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">

            {!usuarioLogado ? (

              tela === 'login' ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.3 }}
                >
                  <LoginForm
                    onLoginSucesso={() => setUsuarioLogado(true)}
                    onIrParaCadastro={() => setTela('cadastro')}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="cadastro"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.3 }}
                >
                  <RegisterForm
                    onCadastroSucesso={() => setUsuarioLogado(true)}
                    onVoltarLogin={() => setTela('login')}
                  />
                </motion.div>
              )

            ) : verTreinos ? (

              // está logado e quer ver o feed
              <motion.div
                key="feed"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
              >
                <AtletaFeed onNovoRegistro={handleNovoRegistro} />
              </motion.div>

            ) : treinoRegistrado === null ? (

              // logado, sem treino registrado
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

              // logado, treino registrado — mostra confirmação
              <motion.div
                key="confirm"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
              >
                <ConfirmCard
                  treino={treinoRegistrado}
                  onNovoRegistro={handleNovoRegistro}
                  onVerTreinos={() => setVerTreinos(true)}
                />
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

    </div>
  )
}

export default App