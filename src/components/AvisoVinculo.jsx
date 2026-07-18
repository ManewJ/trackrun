import { useEffect, useState } from 'react'
import { supabase } from '../supabase'

// AvisoVinculo — mostra o status do vínculo do atleta com o treinador
// (pendente ou recusado). Não mostra nada se não houver vínculo, ou se aceito.
// Usado tanto no TrainingForm quanto no AtletaFeed, pra garantir que o atleta
// veja o aviso independente de já ter treinos registrados ou não.

function AvisoVinculo() {
  const [vinculo, setVinculo] = useState(null)

  useEffect(() => {
    async function buscarVinculo() {
      const { data: { user } } = await supabase.auth.getUser()

      const { data: meuPerfil, error } = await supabase
        .from('profiles')
        .select('status_vinculo, treinador_id')
        .eq('id', user.id)
        .single()

      if (error || !meuPerfil) return

      const precisaAvisar =
        meuPerfil.status_vinculo === 'pendente' ||
        meuPerfil.status_vinculo === 'recusado'

      if (!precisaAvisar || !meuPerfil.treinador_id) {
        setVinculo(null)
        return
      }

      const { data: perfilTreinador } = await supabase
        .from('profiles')
        .select('nome, nome_assessoria')
        .eq('id', meuPerfil.treinador_id)
        .single()

      setVinculo({
        status: meuPerfil.status_vinculo,
        nomeTreinador: perfilTreinador?.nome_assessoria || perfilTreinador?.nome || 'seu treinador',
      })
    }

    buscarVinculo()
  }, [])

  if (vinculo?.status === 'pendente') {
    return (
      <div className="bg-amber-400/10 border border-amber-400/30 rounded-lg px-4 py-3 mb-6">
        <p className="text-amber-400 text-sm">
          Aguardando aprovação de <strong>{vinculo.nomeTreinador}</strong>
        </p>
      </div>
    )
  }

  if (vinculo?.status === 'recusado') {
    return (
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 mb-6">
        <p className="text-zinc-300 text-sm">
          Sua solicitação para <strong>{vinculo.nomeTreinador}</strong> não foi aceita.
        </p>
      </div>
    )
  }

  return null
}

export default AvisoVinculo