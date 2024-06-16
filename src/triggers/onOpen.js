function onOpen() {
  const ui = SpreadsheetApp.getUi();

  ui.createMenu('Pessoal')
    .addItem('1. Exibir disponibilidades', 'pessoalExibirDisponibilidades')
    .addSeparator()
    .addItem('2. Obter eventos semanais', 'pessoalObterEventosSemanais')
    .addSeparator()
    .addItem('3. Atribuir responsáveis', 'pessoalAtribuirResponsaveisPorAtividade')
    .addSeparator()
    .addItem('4. Adicionar responsáveis ao calendário', 'pessoalInserirResponsavelCalendario')
    .addToUi();

  ui.createMenu('Animais')
    .addItem('1. Macro 1', 'todo')
    .addToUi();

  ui.createMenu('Recursos')
    .addItem('1. Macro 1', 'todo')
    .addSeparator()
    .addToUi();
}
