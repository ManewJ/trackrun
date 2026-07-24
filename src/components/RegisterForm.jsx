import { useState } from 'react'
import { supabase } from '../supabase'
import { gerarCodigoConvite } from '../utils/gerarCodigo'
import { buscarTreinadorPorCodigo } from '../utils/buscarTreinador'

// RegisterForm — tela de criação de conta
// recebe onCadastroSucesso: função chamada quando o cadastro der certo
// recebe onVoltarLogin: função chamada quando o usuário quer voltar pro login
function RegisterForm({ onCadastroSucesso, onVoltarLogin }) {

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [tipo, setTipo] = useState('atleta') // atleta é o padrão

  // Fase 3 — vínculo com treinador (lado do atleta)
  const [codigo, setCodigo] = useState('')
  // statusCodigo: 'vazio' | 'validando' | 'valido' | 'invalido'
  const [statusCodigo, setStatusCodigo] = useState('vazio')
  const [treinadorEncontrado, setTreinadorEncontrado] = useState(null)

  // Fase 3 — nome da assessoria (lado do profissional)
  const [nomeAssessoria, setNomeAssessoria] = useState('')

  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(null)

  // Fase 3 — roda quando o campo de código perde o foco (onBlur)
  async function validarCodigo() {
    const codigoLimpo = codigo.trim().toUpperCase()

    // campo vazio não é erro: código é opcional
    if (codigoLimpo === '') {
      setStatusCodigo('vazio')
      setTreinadorEncontrado(null)
      return
    }

    setStatusCodigo('validando')
    const treinador = await buscarTreinadorPorCodigo(codigoLimpo)

    if (treinador) {
      setStatusCodigo('valido')
      setTreinadorEncontrado(treinador)
    } else {
      setStatusCodigo('invalido')
      setTreinadorEncontrado(null)
    }
  }

   async function handleCadastro() {
    setErro(null)

    // validação — roda antes de qualquer chamada ao Supabase

    // verifica se o e-mail tem formato válido (algo@algo.algo)
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

    if (!emailValido) {
      setErro('Digite um e-mail válido.')
      return
    }

    if (senha.length < 6) {
      setErro('A senha precisa ter no mínimo 6 caracteres.')
      return
    }

    // Fase 3 — se o atleta preencheu código, valida DE NOVO aqui
    // (cinto e suspensório: ele pode ter editado o campo depois do onBlur)
    const codigoLimpo = codigo.trim().toUpperCase()
    let treinador = null

    if (tipo === 'atleta' && codigoLimpo !== '') {
      treinador = await buscarTreinadorPorCodigo(codigoLimpo)

      if (!treinador) {
        setErro('Código de treinador não encontrado. Confira o código ou deixe o campo vazio.')
        return
      }
    }

    setCarregando(true)

    // passo 1 — cria o usuário no sistema de autenticação do Supabase
    const { data, error } = await supabase.auth.signUp({ email, password: senha })

    if (error) {
      setErro('Não foi possível criar a conta. Tente novamente.')
      setCarregando(false)
      return
    }

    // passo 2 — monta o perfil conforme o tipo de usuário
    const novoPerfil = { id: data.user.id, nome, email, tipo }

    // Fase 3 — atleta com código válido entra como PENDENTE do treinador
    if (tipo === 'atleta' && treinador) {
      novoPerfil.treinador_id = treinador.id
      novoPerfil.status_vinculo = 'pendente'
    }

    // Fase 3 — profissional ganha código de convite gerado na hora
    if (tipo === 'profissional') {
      novoPerfil.codigo_convite = gerarCodigoConvite()

      if (nomeAssessoria.trim() !== '') {
        novoPerfil.nome_assessoria = nomeAssessoria.trim()
      }
    }

    // passo 3 — salva o perfil na tabela profiles
    const { error: erroProfile } = await supabase
      .from('profiles')
      .insert(novoPerfil)

    if (erroProfile) {
      setErro(`Erro: ${erroProfile.message}`)
      setCarregando(false)
      return
    }

    // tudo certo — avisa o App.jsx
    setNome('')
    setEmail('')
    setSenha('')
    setTipo('atleta')
    setCodigo('')
    setStatusCodigo('vazio')
    setTreinadorEncontrado(null)
    setNomeAssessoria('')
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
      <div className="mb-6">
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

      {/* Fase 3 — campo de código do treinador: só existe pra atleta */}
      {tipo === 'atleta' && (
        <div className="mb-6">
          <label className="text-xs tracking-widest text-zinc-400 block mb-2">
            CÓDIGO DO TREINADOR <span className="text-zinc-600">(OPCIONAL)</span>
          </label>
          <input
            type="text"
            value={codigo}
            onChange={(e) => {
              setCodigo(e.target.value)
              setStatusCodigo('vazio') // editou? o resultado antigo não vale mais
            }}
            onBlur={validarCodigo}
            placeholder="Ex.: TR-4CCA1"
            className="w-full bg-zinc-800 text-white rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#FF4500] uppercase"
          />

          {/* feedback da validação do código */}
          {statusCodigo === 'validando' && (
            <p className="text-zinc-400 text-sm mt-2">Verificando código...</p>
          )}
          {statusCodigo === 'valido' && (
            <p className="text-emerald-400 text-sm mt-2">
              ✓ {treinadorEncontrado.nome_assessoria || treinadorEncontrado.nome}
            </p>
          )}
          {statusCodigo === 'invalido' && (
            <p className="text-red-400 text-sm mt-2">
              Código não encontrado. Confira com seu treinador.
            </p>
          )}
        </div>
      )}

      {/* Fase 3 — campo de assessoria: só existe pra profissional */}
      {tipo === 'profissional' && (
        <div className="mb-6">
          <label className="text-xs tracking-widest text-zinc-400 block mb-2">
            NOME DA ASSESSORIA <span className="text-zinc-600">(OPCIONAL)</span>
          </label>
          <input
            type="text"
            value={nomeAssessoria}
            onChange={(e) => setNomeAssessoria(e.target.value)}
            placeholder="Ex.: JP Assessoria Esportiva"
            className="w-full bg-zinc-800 text-white rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#FF4500]"
          />
        </div>
      )}

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