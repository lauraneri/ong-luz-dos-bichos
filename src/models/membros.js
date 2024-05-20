const Configs = require("../configs/configs");
const SpreadsheetManager = require("../managers/spreadsheetManager");

class Membros {
  constructor(sheetName) {
    this.configs = new Configs()
    this.spreadsheetManager = new SpreadsheetManager(this.configs.getSpreadsheetIdByName('members'))
    this.spreadsheetManager.setSheetName(sheetName)
  }

  setSheetName(newSheetName) {
    this.spreadsheetManager.setSheetName(newSheetName)
  }

  read() {
    return this.spreadsheetManager.read()
  }

  append(data) {
    return this.spreadsheetManager.append(data)
  }

}

module.exports = Membros;