const SpreadsheetManager = require("../managers/spreadsheetManager");

class Usuarios {
  constructor(usuariosSpreadId, sheetName) {
    this.spreadsheetManager = new SpreadsheetManager(usuariosSpreadId)
    this.spreadsheetManager.setSheetName(sheetName)
  }

  read() {
    return this.spreadsheetManager.read()
  }

  append(data) {
    return this.spreadsheetManager.append(data)
  }

}

module.exports = Usuarios;