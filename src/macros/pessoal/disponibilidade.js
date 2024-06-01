const Configs = require("../../configs/configs");
const Pessoal = require("../../models/pessoal");

async function pessoalExibirDisponibilidades() {
  try {
    const configs = new Configs()
    const userEmail = configs.getUserEmail()
    console.log(userEmail)

    const membros = new Pessoal('Membros')
    const membrosDados = await membros.read();

    const diagramaDisponib = new Pessoal('Diagrama de Disponibilidade')
    const diagramaDisponibDados = await diagramaDisponib.read()

    const diasSemana = Object.keys(diagramaDisponibDados[0])
    const horarios = diagramaDisponibDados.map(item => item['Horário'])

    const relacaoHoraDiaMembro = Object.fromEntries(
      horarios.map(hora => [hora, 
        Object.fromEntries(diasSemana.map(dia => [dia, []]))]
      )
    )

    for (const membro of membrosDados) {
      membro['Disponibilidade'].split(';').map(item => {
        const diaHora = item.split(',')
        relacaoHoraDiaMembro[diaHora[1]][diaHora[0]].push(membro['Nome'])
      })
    }

    for (const horaDiaMembro of Object.entries(relacaoHoraDiaMembro)) {
      const hora = horaDiaMembro[0]
      const diasMembros = horaDiaMembro[1]

      const filter = {'Horário': hora}

      for (const dia of Object.keys(diasMembros)) {
        if (diasMembros[dia].length === 0) continue
        await diagramaDisponib.update(diagramaDisponibDados, filter, {
          field: dia,
          value: `${diasMembros[dia]}`,
          type: 'stringValue'
        })
      }
    }

  } catch(error) {
    console.error(error.message)
    console.error(error.stack)
    throw error
  }
}

module.exports = {
  pessoalExibirDisponibilidades
}