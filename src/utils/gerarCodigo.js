// utils/gerarCodigo.js
// Gera um código de convite no formato TR-XXXXX
// Usado no cadastro do profissional (RegisterForm) e no botão
// "Regenerar" do painel do treinador — mesma regra, um lugar só.

// aqui eu uso o principio DRY (Don't Repeat Yourself) para evitar duplicação de código.

export function gerarCodigoConvite() {
  return 'TR-' + Math.random().toString(36).substring(2, 7).toUpperCase()
}