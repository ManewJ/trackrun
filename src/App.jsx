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
  const [tipoUsuario, setTipoUsuario] = useState(null) // 'atleta' ou 'profissional'

  // tipoUsuario define qual painel mostrar depois do login

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session) {
        setUsuarioLogado(true)

        // busca o perfil do usuário logado pra saber se é atleta ou profissional
        const { data: perfil } = await supabase
          .from('profiles')
          .select('tipo')
          .eq('id', data.session.user.id)
          .single()

        if (perfil) {
          setTipoUsuario(perfil.tipo)
        }

        // se for atleta, verifica se ele já tem treinos registrados
        if (perfil?.tipo === 'atleta') {
          const { count } = await supabase
            .from('treinos')
            .select('*', { count: 'exact', head: true })
            .eq('atleta_id', data.session.user.id)

          if (count > 0) {
            setVerTreinos(true)
          }
        }
      }
      setVerificando(false)
    })
  }, [])

  async function handleLoginSucesso() {
    setUsuarioLogado(true)

    // depois do login, busca o tipo do usuário
    const { data: { user } } = await supabase.auth.getUser()

    const { data: perfil } = await supabase
      .from('profiles')
      .select('tipo')
      .eq('id', user.id)
      .single()

    if (perfil) {
      setTipoUsuario(perfil.tipo)
    }

    // se for atleta, verifica se ele já tem treinos registrados
    if (perfil?.tipo === 'atleta') {
      const { count } = await supabase
        .from('treinos')
        .select('*', { count: 'exact', head: true })
        .eq('atleta_id', user.id)

      // se já tem pelo menos um treino, abre direto no feed
      if (count > 0) {
        setVerTreinos(true)
      }
    }
  }

  function handleRegistrar(dadosTreino) {
    setTreinoRegistrado(dadosTreino)
  }

  function handleNovoRegistro() {
    setTreinoRegistrado(null)
    setVerTreinos(false)
  }

  if (verificando) return null

  return (
    <div className="h-screen overflow-hidden flex bg-black">

      {/* fundo mobile */}
      <div
        className="lg:hidden fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/corrida-sol.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/70"></div>
      </div>

      <LeftPanel />

      {/* painel direito — rola internamente enquanto o LeftPanel fica fixo */}
      <div className="relative flex-1 overflow-y-auto flex items-start justify-center p-6 lg:p-8">
        <div className="w-full max-w-md py-8">
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
                    onLoginSucesso={handleLoginSucesso}
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
                    onCadastroSucesso={handleLoginSucesso}
                    onVoltarLogin={() => setTela('login')}
                  />
                </motion.div>
              )

            ) : tipoUsuario === 'profissional' ? (

              <motion.div
                key="profissional"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-white text-center">
                  <p className="text-[#FF4500] font-bold tracking-widest text-sm mb-6">TRACKRUN.</p>
                  <h1 className="text-3xl font-bold mb-2">Painel do treinador</h1>
                  <p className="text-zinc-400 text-sm">Em breve...</p>
                </div>
              </motion.div>

            ) : verTreinos ? (

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
