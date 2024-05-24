function onOpen() {
  const ui = SpreadsheetApp.getUi();

  ui.createMenu('Pessoal')
    .addItem('1. Atualizar escalas', 'pessoalRegistrarOuAtualizarCadastro')
    .addSeparator()
    .addToUi();

  ui.createMenu('Animais')
    .addItem('1. Macro 1', 'todo')
    .addSeparator()
    .addToUi();

  ui.createMenu('Recursos')
    .addItem('1. Macro 1', 'todo')
    .addSeparator()
    .addToUi();
}
