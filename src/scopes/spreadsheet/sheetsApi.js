class SheetsApi {
  constructor(sheets) {
    this.sheets = sheets;
  }

  getSpreadsheetId() {
    return this.sheets.spreadsheetId;
  }

  getSheetName() {
    return this.sheets.sheetName;
  }

  /**
   * 
   * @returns {Promise<Array<Array<*>>}
   */
  async read() {
    const res = await this.sheets.spreadsheets.values.get({
      spreadsheetId: this.getSpreadsheetId(),
      range: this.getSheetName(),
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
        spreadsheetId: this.getSpreadsheetId(), 
        resource: { requests: addSheetsReq } 
      });
      return;
    }

    if (typeof sheetNames === 'string') {
      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: this.getSpreadsheetId(), 
        resource: { requests: {addSheet: { properties: { title: sheetNames } }} }
      });
      return;
    }
  }
}

module.exports = {
  SheetsApi
};