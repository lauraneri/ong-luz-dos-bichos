const Configs = require("../configs/configs");
const SpreadsheetManager = require("../managers/spreadsheetManager");

class PlanilhaAtiva {
  constructor(sheetName) {
    this.configs = new Configs()
    this.spreadsheetManager = new SpreadsheetManager()
    this.spreadsheetManager.setSheetName(sheetName)
    this.spreadsheetManager.setSpreadsheetId(Configs.getActiveSpreadsheetId())
  }

  setSheetName(newSheetName) {
    this.spreadsheetManager.setSheetName(newSheetName)
  }

  async read() {
    return await this.spreadsheetManager.read()
  }

  async append(data) {
    return await this.spreadsheetManager.append(data)
  }

  async overwrite(data) {
    return await this.spreadsheetManager.overwrite(data)
  }

  async update(data) {
    return await this.spreadsheetManager.update(data)
  }
}

module.exports = PlanilhaAtiva;