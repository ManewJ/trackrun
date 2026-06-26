import { useState } from 'react'
import { supabase } from '../supabase'

// RegisterForm — tela de criação de conta
// recebe onCadastroSucesso: função chamada quando o cadastro der certo
// recebe onVoltarLogin: função chamada quando o usuário quer voltar pro login
function RegisterForm({ onCadastroSucesso, onVoltarLogin }) {

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [tipo, setTipo] = useState('atleta') // atleta é o padrão

  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(null)

  async function handleCadastro() {
    setCarregando(true)
    setErro(null)

    // passo 1 — cria o usuário no sistema de autenticação do Supabase
    const { data, error } = await supabase.auth.signUp({ email, password: senha })

    if (error) {
      setErro('Não foi possível criar a conta. Tente novamente.')
      setCarregando(false)
      return
    }

    // passo 2 — salva o nome e tipo na tabela profiles
    // data.user.id é o id gerado automaticamente pelo Supabase
    
   const { error: erroProfile } = await supabase
    .from('profiles')
    .insert({ id: data.user.id, nome, email, tipo })

   if (erroProfile) {
    setErro(`Erro: ${erroProfile.message}`) // mostra o erro real na tela
    setCarregando(false)
    return
}

    // tudo certo — avisa o App.jsx
    onCadastroSucesso()
  }

  return (
    <div className="text-white">

      {/* cabeçalho */}
      <p className="text-[#FF4500] font-bold tracking-widest text-sm mb-6">TRACKRUN.</p>
      <h1 className="text-3xl font-bold mb-1">Crie sua conta</h1>
      <p className="text-zinc-400 text-sm mb-8">Comece a registrar sua evolução</p>

      {/* campo de nome */}
      <div className="mb-4">
        <label className="text-xs tracking-widest text-zinc-400 block mb-2">NOME</label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Seu nome completo"
          className="w-full bg-zinc-800 text-white rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#FF4500]"
        />
      </div>

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
          placeholder="Mínimo 6 caracteres"
          className="w-full bg-zinc-800 text-white rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#FF4500]"
        />
      </div>

      {/* seletor de tipo — atleta ou profissional */}
      <div className="mb-8">
        <label className="text-xs tracking-widest text-zinc-400 block mb-3">VOCÊ É</label>
        <div className="grid grid-cols-2 gap-3">

          <button
            type="button"
            onClick={() => setTipo('atleta')}
            className={`py-3 rounded-lg text-sm font-bold tracking-widest transition-colors ${
              tipo === 'atleta'
                ? 'bg-[#FF4500] text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            ATLETA
          </button>

          <button
            type="button"
            onClick={() => setTipo('profissional')}
            className={`py-3 rounded-lg text-sm font-bold tracking-widest transition-colors ${
              tipo === 'profissional'
                ? 'bg-[#FF4500] text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            PROFISSIONAL
          </button>

        </div>
      </div>

      {/* mensagem de erro */}
      {erro && (
        <p className="text-red-400 text-sm mb-4">{erro}</p>
      )}

      {/* botão de cadastro */}
      <button
        type="button"
        onClick={handleCadastro}
        disabled={carregando}
        className="w-full bg-[#FF4500] text-white font-bold tracking-widest py-4 rounded-lg
         hover:bg-orange-600 transition-colors disabled:opacity-50 mb-4"
      >
        {carregando ? 'CRIANDO CONTA...' : 'CRIAR CONTA'}
      </button>

      {/* link pra voltar pro login */}
      <p className="text-center text-zinc-400 text-sm">
        Já tem conta?{' '}
        <button
          type="button"
          onClick={onVoltarLogin}
          className="text-[#FF4500] hover:underline"
        >
          Entrar
        </button>
      </p>

    </div>
  )
}

export default RegisterForm