const Configs = require("../../configs/configs");
const Pessoal = require("../../models/pessoal");
const CalendarManager = require("../../managers/calandarManager")

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
    const horarios = diagramaDisponibDados.map(item => item['HORÁRIO'])

    const relacaoHoraDiaMembro = Object.fromEntries(
      horarios.map(hora => [hora, 
        Object.fromEntries(diasSemana.map(dia => [dia, []]))]
      )
    )

    for (const membro of membrosDados) {
      membro['DISPONIBILIDADE'].split(';').map(item => {
        const diaHora = item.split(',')
        relacaoHoraDiaMembro[diaHora[1]][diaHora[0]].push(membro['NOME'])
      })
    }

    for (const horaDiaMembro of Object.entries(relacaoHoraDiaMembro)) {
      const hora = horaDiaMembro[0]
      const diasMembros = horaDiaMembro[1]

      const filter = {'HORÁRIO': hora}

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

async function pessoalObterEventosSemanais() {
  try {
    const configs = new Configs()
    const calendarManager = new CalendarManager()

    const diagramaTarefas = new Pessoal('Diagrama de Tarefas')
    const diagramaTarefasDados = await diagramaTarefas.read()

    await diagramaTarefas.overwrite([{}])

    const horarios = diagramaTarefasDados.map(item => Object.fromEntries([['HORÁRIO', item['HORÁRIO']]]))
    console.log(horarios)

    await diagramaTarefas.append(horarios)

    const userEmail = configs.getUserEmail()
    console.log(userEmail)

    const eventosDaSemana = await calendarManager.getUpcomingEvents()
    console.log(eventosDaSemana)

    for (const evento of eventosDaSemana) {
  
      const startDate = new Date(evento['startDate'])
      const diaSemana = startDate.toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase()
      const horario = `${startDate.getHours() + 1}h${startDate.getMinutes() || '00'}`

      const filter = {'HORÁRIO': horario}
      await diagramaTarefas.update(diagramaTarefasDados, filter, {
        value: evento['summary'],
        field: diaSemana,
        type: 'stringValue'
      })
    }

    
  } catch(error) {
    console.error(error.message)
    console.error(error.stack)
    throw error
  }
}

module.exports = {
  pessoalExibirDisponibilidades,
  pessoalObterEventosSemanais
}