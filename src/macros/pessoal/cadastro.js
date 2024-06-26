const Configs = require("../../configs/configs");
const Pessoal = require("../../models/pessoal");

async function pessoalRegistrarOuAtualizarCadastro(formData) {
  try {
    const membros = new Pessoal('Membros')
    const dadosMembros = await membros.read();

    const userEmail = formData.EMAIL

    const emailCadastrado = dadosMembros.some(item => item['EMAIL'] === userEmail)
    if (emailCadastrado) {
      const filter = {'EMAIL': userEmail}
      for (const campo of Object.keys(formData)) {
        await membros.update(dadosMembros, filter ,{
          value: `${formData[campo]}`,
          field: campo,
          type: 'stringValue'
        })
      }

      return `Cadastro atualizado com sucesso para o email ${userEmail}`;
    }

    formData['EMAIL'] = userEmail
    await membros.append([formData])
    membros.flush()
    return `Cadastro registrado com sucesso para o email ${userEmail}`

  } catch(error) {
    console.error(error.stack)
    throw error
  }
}

async function pessoalObterCadastro(emailInput) {
  try {
    const userEmail = emailInput

    const membros = new Pessoal('Membros')
    const dadosMembros = await membros.read();

    const registroSolicitado = dadosMembros.filter(item => item['EMAIL'] === userEmail)
    if (!registroSolicitado[0]) throw new Error(`Cadastro inexistente para o email ${userEmail}`)

    console.log(`Cadastro recuperado com sucesso para o email ${userEmail}`)
    
    return registroSolicitado[0]

  } catch(error) {
    console.error(error.stack)
    throw error
  }
}

module.exports = {
  pessoalRegistrarOuAtualizarCadastro,
  pessoalObterCadastro
}