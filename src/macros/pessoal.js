const Membros = require("../models/membros");

function atualizarEscalas() {
  const spreadsheet = new Membros()

  spreadsheet.setSheetName('Membros')
  const datas = spreadsheet.read()
  console.log(datas)
}

module.exports = {
  atualizarEscalas
}