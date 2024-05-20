const {google} = require('googleapis');

class SheetsApi {
  constructor(auth, spreadsheetId, sheetName) {
    this.sheets = google.sheets({version: 'v4', auth});
    this.spreadsheetId = spreadsheetId
    this.sheetName = sheetName
  }

  setSpreadsheetId(newId) {
    this.spreadsheetId = newId
  }

  setSheetName(sheetName) {
    this.sheetName = sheetName
  }

  /**
   * 
   * @returns {Promise<Array<Array<*>>}
   */
  async read() {
    const res = await this.sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: this.sheetName,
    });
    return res.data.values;
  }

  async create(spreadsheetName) {
    const response = await this.sheets.spreadsheets.create({
      requestBody: {
        properties: {
          title: spreadsheetName,
        }
      }
    });
    return response.data.spreadsheetId;
  }

  async addSheets(sheetNames) {
    if (Array.isArray(sheetNames)) {
      const addSheetsReq = sheetNames.map(item => { 
        return {addSheet: { properties: { title: item } }}; 
      });

      await this.sheets.spreadsheets.batchUpdate({ 
        spreadsheetId: this.spreadsheetId(), 
        resource: { requests: addSheetsReq } 
      });
      return;
    }

    if (typeof sheetNames === 'string') {
      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: this.spreadsheetId(), 
        resource: { requests: {addSheet: { properties: { title: sheetNames } }} }
      });
      return;
    }
  }
}

module.exports = SheetsApi;