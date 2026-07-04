import { supabase } from '../supabase'

// Header — barra superior com identidade do app e botão de logout
// aparece nas telas internas (feed do atleta, painel do treinador)
function Header() {

  async function handleLogout() {
    // encerra a sessão no Supabase — limpa o token salvo no navegador
    await supabase.auth.signOut()
    // a página recarrega sozinha porque o App.jsx escuta a sessão no useEffect
    window.location.reload()
  }

  return (
    <div className="w-full flex items-center justify-between mb-6">

      {/* nome do app — mesmo estilo pulsante do LeftPanel */}
      <div className="inline-flex items-center gap-2 text-orange-500 text-xs font-medium tracking-widest uppercase border
       border-orange-500/50 rounded-full px-3 py-1">
        TrackRun.
      </div>

      {/* botão de logout */}
      <button
        type="button"
        onClick={handleLogout}
        className="text-zinc-400 hover:text-orange-500 text-xs font-medium tracking-widest uppercase transition-colors"
      >
        Sair
      </button>

    </div>
  )
}

export default Header