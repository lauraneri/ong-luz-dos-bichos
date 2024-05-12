const DataManager = require("./dataManager");

class SpreadsheetManager {
  constructor(spreadsheetId) {
    this.spreadsheetId = spreadsheetId
  }

  setSpreadsheetId(newId) {
    this.spreadsheetId = newId
  }

  setSheetName(sheetName) {
    this.sheetName = sheetName
  }

  getId() {
    return this.spreadsheetId;
  }

  read(as = 'json') {
    const ss = SpreadsheetApp.openById(this.spreadsheetId)
    const sheet = ss.getSheetByName(this.sheetName);
    const response = sheet.getDataRange().getValues()

    if (as === 'json') return DataManager.createJson(response);

    return response;
  }

  append(data) {
    const updatedDataMatrix = DataManager.createMatrix(data);
    const dataContent = updatedDataMatrix.slice(1);

    const ss = SpreadsheetApp.openById(this.spreadsheetId)
    const sheet = ss.getSheetByName(this.sheetName);
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow + 1, 1, dataContent.length, dataContent[0].length).setValues(dataContent);
  }
}

module.exports = SpreadsheetManager;