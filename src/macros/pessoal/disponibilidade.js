const Configs = require("../../configs/configs");
const Pessoal = require("../../models/pessoal");
const CalendarManager = require("../../managers/calendarManager")

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

    const shortDiasSemana = {
      'Segunda-Feira':'SEG.',
      'Terça-Feira':'TER.',
      'Quarta-Feira':'QUA.',
      'Quinta-Feira':'QUI.',
      'Sexta-Feira':'SEX.',
      'Sábado':'SÁB.',
      'Domingo':'DOM.'
    }

    const periodos = diagramaDisponibDados.map(item => item['PERÍODO'])

    const relacaoHoraDiaMembro = Object.fromEntries(
      periodos.map(periodo => [periodo, 
        Object.fromEntries(diasSemana.map(dia => [dia, []]))]
      )
    )

    for (const membro of membrosDados) {
      membro['DISPONIBILIDADE'].split(';').map(item => {
        const diaHora = item.split(',')
        relacaoHoraDiaMembro[diaHora[1]][shortDiasSemana[diaHora[0]]].push(membro['EMAIL'])
      })
    }

    for (const horaDiaMembro of Object.entries(relacaoHoraDiaMembro)) {
      const hora = horaDiaMembro[0]
      const diasMembros = horaDiaMembro[1]

      const filter = {'PERÍODO': hora}

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
    throw error
  }
}

async function pessoalObterEventosSemanais() {
  try {
    const configs = new Configs()
    const userEmail = configs.getUserEmail()
    console.log(userEmail)

    const calendarManager = new CalendarManager()

    const atividades = new Pessoal('Atividades')

    const eventosDaSemana = await calendarManager.getUpcomingEvents()

    const atividadesParaComplementar = []

    for (const evento of eventosDaSemana) {
      const startDate = new Date(evento['startDate'])

      atividadesParaComplementar.push({
        'ID EVENTO': evento['id'],
        'ATIVIDADE': evento['summary'],
        'DESCRIÇÃO': evento['description'],
        'DIA DA SEMANA': startDate.toLocaleDateString('pt-BR', {weekday: "short"}).toUpperCase(),
        'LOCAL': evento['location'],
        'DATA': startDate.toLocaleDateString('pt-BR'),
        'HORA': startDate.toLocaleTimeString('pt-BR'),
      })
    }

    await atividades.overwrite(atividadesParaComplementar)
    
  } catch(error) {
    console.error(error.stack)
    throw error
  }
}

async function pessoalAtribuirResponsaveisPorAtividade() {
  try {
    const configs = new Configs()
    const userEmail = configs.getUserEmail()
    console.log(userEmail)

    const membros = new Pessoal('Membros')
    const membrosDados = await membros.read();

    const diagramaDisponib = new Pessoal('Diagrama de Disponibilidade')
    const diagramaDisponibDados = await diagramaDisponib.read()

    const atividades = new Pessoal('Atividades')
    const atividadesDados = await atividades.read()

    for (const atividade of atividadesDados) {
      const hora = parseInt(atividade['HORA'].match(/\d{2}/))
      const periodo = hora <= 12 ? 'Manhã' : hora <= 18 ? 'Tarde' : 'Noite'
      const matchDisponivel = diagramaDisponibDados
        .filter(item => item['PERÍODO'] === periodo)
        .map(item => item[atividade['DIA DA SEMANA']])[0];

      atividade['RESPONSÁVEL'] = matchDisponivel

      await atividades.update(atividadesDados, 
        {'DATA': atividade['DATA'], 'HORA': atividade['HORA']}, 
        {field: 'RESPONSÁVEL', value: matchDisponivel, type: 'stringValue'})
    }
  } catch(error) {
    console.error(error.stack)
    throw error
  }
}

async function pessoalInserirResponsavelCalendario() {
  const configs = new Configs()
  const userEmail = configs.getUserEmail()
  console.log(userEmail)

  const calendarManager = new CalendarManager()

  const atividades = new Pessoal('Atividades')
  const atividadesDados = await atividades.read()

  await calendarManager.insertAttendees(atividadesDados)
}

module.exports = {
  pessoalExibirDisponibilidades,
  pessoalObterEventosSemanais,
  pessoalAtribuirResponsaveisPorAtividade,
  pessoalInserirResponsavelCalendario
}