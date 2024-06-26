const Configs = require("../configs/configs");
const SpreadsheetManager = require("../managers/spreadsheetManager");

class Pessoal {
  constructor(sheetName) {
    this.configs = new Configs()
    this.spreadsheetManager = new SpreadsheetManager()
    this.spreadsheetManager.setSheetName(sheetName)
    this.spreadsheetManager.setSpreadsheetId(this.configs.getSpreadsheetIdByName('people'))
  }

  setSheetName(newSheetName) {
    this.spreadsheetManager.setSheetName(newSheetName)
  }

  async read(as = 'json') {
    return await this.spreadsheetManager.read(as)
  }

  async append(data) {
    return await this.spreadsheetManager.append(data)
  }

  async overwrite(data) {
    return await this.spreadsheetManager.overwrite(data)
  }

  async update(data, filters, newValue) {
    return await this.spreadsheetManager.update(data, filters, newValue)
  }

  flush() {
    this.spreadsheetManager.flush
  }

}

module.exports = Pessoal;