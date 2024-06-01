function onOpen() {
  const ui = SpreadsheetApp.getUi();

  ui.createMenu('Pessoal')
    .addItem('1. Exibir disponibilidades', 'pessoalExibirDisponibilidades')
    .addToUi();

  ui.createMenu('Animais')
    .addItem('1. Macro 1', 'todo')
    .addToUi();

  ui.createMenu('Recursos')
    .addItem('1. Macro 1', 'todo')
    .addSeparator()
    .addToUi();
}
