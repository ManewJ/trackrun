import { supabase } from '../supabase'

// Busca um treinador pelo código de convite.
// Devolve o treinador ({ id, nome, nome_assessoria }) ou null se não existir
// (código vazio ou não encontrado).
// Compartilhada entre RegisterForm (cadastro) e AvisoVinculo ("tenho um código").
export async function buscarTreinadorPorCodigo(codigoDigitado) {
  const codigoLimpo = codigoDigitado.trim().toUpperCase()

  if (codigoLimpo === '') {
    return null
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('id, nome, nome_assessoria')
    .eq('codigo_convite', codigoLimpo)
    .maybeSingle()

  if (error) return null
  return data
}