const Configs = require("../configs/configs");
const Pessoal = require("../models/pessoal");
const PlanilhaAtiva = require("../models/planilhaAtiva");


async function pessoalRegistrarOuAtualizarCadastro() {
  try {

    const configs = new Configs()
    const userEmail = configs.getUserEmail()

    const planilhaAtiva = new PlanilhaAtiva('Cadastro')
    const dadosAtiva = await planilhaAtiva.read()
    
    if (dadosAtiva.length !== 1)
      throw new Error('Permitido apenas um cadastro por requisição')

    if (Object.values(dadosAtiva[0]).some(item => !item)) 
      throw new Error('Todos os campos disponíveis são obrigatórios')

    const dadosJson = dadosAtiva[0]

    const membros = new Pessoal('Membros')
    const dadosMembros = await membros.read();

    const emailCadastrado = dadosMembros.some(item => item['Email'] === userEmail)
    if (emailCadastrado) {
      const filter = {'Email': userEmail}
      for (const campo of Object.keys(dadosJson)) {
        await membros.update(dadosMembros, filter ,{
          value: `${dadosJson[campo]}`,
          field: campo,
          type: 'stringValue'
        })
      }

      console.log(`Cadastro atualizado com sucesso para o email ${userEmail}`)
      return;
    }

    dadosJson['Email'] = userEmail
    await membros.append([dadosJson])
    console.log(`Cadastro registrado com sucesso para o email ${userEmail}`)

  } catch(error) {
    console.error(error.message)
    console.error(error.stack)
    throw error
  }
}

async function pessoalObterCadastro() {
  try {
    const configs = new Configs()
    const userEmail = configs.getUserEmail()

    const planilhaAtiva = new PlanilhaAtiva('Cadastro')

    const membros = new Pessoal('Membros')
    const dadosMembros = await membros.read();

    const registroSolicitado = dadosMembros.filter(item => item['Email'] === userEmail)
    if (!registroSolicitado[0]) throw new Error(`Cadastro inexistente para o email ${userEmail}`)

    
    await planilhaAtiva.overwrite(registroSolicitado)
    console.log(`Cadastro recuperado com sucesso para o email ${userEmail}`)

  } catch(error) {
    console.error(error.message)
    console.error(error.stack)
    throw error
  }
}

module.exports = {
  pessoalRegistrarOuAtualizarCadastro,
  pessoalObterCadastro
}