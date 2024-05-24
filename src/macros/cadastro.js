const Pessoal = require("../models/pessoal");
const PlanilhaAtiva = require("../models/planilhaAtiva");

async function pessoalRegistrarOuAtualizarCadastro() {
  try {
    const planilhaAtiva = new PlanilhaAtiva('Cadastro')
    const dadosAtiva = await planilhaAtiva.read()

    const membros = new Pessoal('Membros')
    await membros.append(dadosAtiva)

  } catch(error) {
    console.error(error.message)
    console.error(error.stack)
    throw error
  }
}

module.exports = {
  pessoalRegistrarOuAtualizarCadastro
}