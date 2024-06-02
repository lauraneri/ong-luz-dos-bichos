const Configs = require("../../configs/configs");
const Pessoal = require("../../models/pessoal");

async function pessoalRegistrarOuAtualizarCadastro(formData) {
  try {
    const configs = new Configs()
    const userEmail = configs.getUserEmail()

    const membros = new Pessoal('Membros')
    const dadosMembros = await membros.read();

    const emailCadastrado = dadosMembros.some(item => item['Email'] === userEmail)
    if (emailCadastrado) {
      const filter = {'Email': userEmail}
      for (const campo of Object.keys(formData)) {
        await membros.update(dadosMembros, filter ,{
          value: `${formData[campo]}`,
          field: campo,
          type: 'stringValue'
        })
      }

      return `Cadastro atualizado com sucesso para o email ${userEmail}`;
    }

    formData['Email'] = userEmail
    await membros.append([formData])
    return `Cadastro registrado com sucesso para o email ${userEmail}`

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

    const membros = new Pessoal('Membros')
    const dadosMembros = await membros.read();

    const registroSolicitado = dadosMembros.filter(item => item['Email'] === userEmail)
    if (!registroSolicitado[0]) throw new Error(`Cadastro inexistente para o email ${userEmail}`)

    console.log(`Cadastro recuperado com sucesso para o email ${userEmail}`)
    return registroSolicitado[0]

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