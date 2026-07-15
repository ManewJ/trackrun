import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import Header from './Header'

// PainelTreinador — tela principal do treinador logado
function PainelTreinador() {

  const [perfil, setPerfil] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [textoBotaoCopiar, setTextoBotaoCopiar] = useState('Copiar')

  useEffect(() => {
    async function buscarPerfil() {
      const { data: { user } } = await supabase.auth.getUser()

      const { data, error } = await supabase
        .from('profiles')
        .select('id, nome, nome_assessoria, codigo_convite')
        .eq('id', user.id)
        .single()

      if (!error) {
        setPerfil(data)
      }

      setCarregando(false)
    }

    buscarPerfil()
  }, [])

  // copia o código pra área de transferência e dá feedback visual temporário
  async function handleCopiar() {
    await navigator.clipboard.writeText(perfil.codigo_convite)
    setTextoBotaoCopiar('Copiado! ✓')

    // depois de 2 segundos, volta o texto ao normal
    setTimeout(() => {
      setTextoBotaoCopiar('Copiar')
    }, 2000)
  }

  if (carregando) {
    return (
      <div className="text-white">
        <Header />
        <p className="text-zinc-400 text-sm">Carregando painel...</p>
      </div>
    )
  }

  return (
    <div className="text-white">
      <Header />

      <h1 className="text-3xl font-bold mb-1">
        {perfil?.nome_assessoria || perfil?.nome}
      </h1>
      <p className="text-zinc-400 text-sm mb-8">
        Gerencie seus atletas e solicitações.
      </p>

      {/* card do código de convite */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 flex items-center justify-between gap-3 mb-8">
        <div>
          <p className="text-xs text-zinc-500 mb-1">Seu código de convite</p>
          <p className="text-xl font-bold tracking-widest text-amber-400">
            {perfil?.codigo_convite}
          </p>
        </div>

        <button
          type="button"
          onClick={handleCopiar}
          className="bg-[#FF4500] text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors whitespace-nowrap"
        >
          {textoBotaoCopiar}
        </button>
      </div>

      {/* lista de pendentes entra aqui no próximo passo */}
    </div>
  )
}

export default PainelTreinador