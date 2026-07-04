import { useState } from 'react'
import { supabase } from '../supabase'

// LoginForm — tela de entrada do app
// recebe onLoginSucesso: função chamada quando o login for bem-sucedido, para avisar o App.jsx
function LoginForm({ onLoginSucesso, onIrParaCadastro }) {

  // controla o que o usuário digitou nos campos
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  // controla o estado do processo de login (estado de loading)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(null)

  async function handleLogin() {
    setCarregando(true)
    setErro(null) // limpa erro anterior antes de tentar de novo

    // chama o método de login do Supabase com email e senha
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha })

    if (error) {
      setErro('E-mail ou senha incorretos.') // mensagem amigável pro usuário
      setCarregando(false)
      return
    }

    // se não teve erro, avisa o App.jsx que o login funcionou
    onLoginSucesso()
  }

  return (
    <div className="text-white">

      {/* cabeçalho igual ao do TrainingForm */}
      <p className="text-[#FF4500] font-bold tracking-widest text-sm mb-6">TRACKRUN.</p>
      <h1 className="text-3xl font-bold mb-1">Bem-vindo de volta</h1>
      <p className="text-zinc-400 text-sm mb-8">Entre na sua conta para continuar</p>

      {/* campo de e-mail */}
      <div className="mb-4">
        <label className="text-xs tracking-widest text-zinc-400 block mb-2">E-MAIL</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          className="w-full bg-zinc-800 text-white rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#FF4500]"
        />
      </div>

      {/* campo de senha */}
      <div className="mb-6">
        <label className="text-xs tracking-widest text-zinc-400 block mb-2">SENHA</label>
        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="••••••••"
          className="w-full bg-zinc-800 text-white rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#FF4500]"
        />
      </div>

      {/* mensagem de erro — só aparece se algo der errado */}
      {erro && (
        <p className="text-red-400 text-sm mb-4">{erro}</p>
      )}

      {/* botão de login — mesmo efeito hover do TrainingForm */}
      <button
        type="button"
        onClick={handleLogin}
        disabled={carregando}
        className="w-full border border-orange-500 bg-orange-500 hover:bg-transparent hover:text-orange-500 text-white font-bold tracking-widest py-4 rounded-lg transition-all duration-300 disabled:opacity-50 mb-4"
      >
        {carregando ? 'AQUECENDO...' : 'ENTRAR'}
      </button>

      {/* link pra ir pro cadastro */}
      <p className="text-center text-zinc-400 text-sm">
        Não tem conta?{' '}
        <button
          type="button"
          onClick={onIrParaCadastro}
          className="text-[#FF4500] hover:underline"
        >
          Cadastre-se
        </button>
      </p>

    </div>
  )
}

export default LoginForm