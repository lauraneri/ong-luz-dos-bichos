class SheetsApi {
  constructor(spreadsheetManager) {
    this.spreadsheetId = spreadsheetManager.spreadsheetId
    this.sheetName = spreadsheetManager.sheetName
  }

  async authenticate() {
    // Placeholder for pre-deploy (set-begin)
    const GoogleOauth = require('../authenticate/googleOauth');
    const googleOauth = new GoogleOauth()
    this.client = await googleOauth.authorize()
    const { google } = require('googleapis');
    this.sheets = google.sheets({version: 'v4', auth: this.client});
    // Placeholder for pre-deploy (set-end)
  }

  /**
   * Ler conteúdo da planilha origem
   * @returns {Promise<Array<Array<*>>}
   */
  async read() {
    await this.authenticate()
    const res = await this.sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: this.sheetName,
    });
    return res.data.values;
  }

  /**
   * Escrever dados na planilha destino (apensar)
   * @param {Array<Array<*>>} dataMatrix Dados para escrita
   */
  async append(dataMatrix) {
    await this.authenticate()
    const request = {
      spreadsheetId: this.spreadsheetId,
      range: this.sheetName,
      valueInputOption: 'USER_ENTERED',
      resource: { values: dataMatrix },
      includeValuesInResponse: true,
      insertDataOption: 'INSERT_ROWS',
      auth: this.oauth2Client,
    };
    await this.sheets.spreadsheets.values.append(request);
  }

  /**
   * Sobrescrever dados na planilha destino
   * @param {Array<Array<*>>} dataMatrix Dados para sobrescrita
   */
  async overwrite(dataMatrix) {
    await this.authenticate()
    const overwriteRequest = {
      spreadsheetId: this.spreadsheetId,
      range: this.sheetName,
      valueInputOption: 'USER_ENTERED',
      resource: { values: dataMatrix },
      includeValuesInResponse: true,
      auth: this.oauth2Client,
    };
    await this.sheets.spreadsheets.values.update(overwriteRequest);
  }

  /**
   * @summary Limpar apenas dados da aba atual
   * @async
   * @return {Promise<void>}
   */
  async clearContent() {
    await this.authenticate()
    const clearRequest = {
      spreadsheetId: this.spreadsheetId,
      range: this.sheetName,
      auth: this.oauth2Client,
    };
    await this.sheets.spreadsheets.values.clear(clearRequest);
  }

    /**
   * @summary Obtem ID da aba corrente
   * @async
   * @returns {Promise<Number>} ID da aba
   */
  async getSheetId() {
    await this.authenticate()
    const layoutSheetObj = await this.sheets.spreadsheets.get({
      spreadsheetId: this.spreadsheetId,
    });
    const sheetProps = layoutSheetObj.data.sheets.filter((sheet) => sheet.properties.title === this.sheetName)[0]
      .properties;
    return sheetProps.sheetId;
  }

  /**
   * @summary Atualizar campos que foram filtrados conforme critério especificado
   * @param {Array<Object>} rowsData Array com informações da linha a ser atualizada
   * @param {Object} rowData Informações da linha
   * @param {Number} rowData.rowIndex Índice da linha a ser atualizada
   * @param {Number} rowData.columnIndex Índice da coluna a ser atualizada
   * @param {Object} rowData.newValue Objeto newValue: Novo valor
   * @param {String} rowData.newValue.field Campo
   * @param {String} rowData.newValue.value Valor
   * @param {String} rowData.newValue.type Tipo
   * @returns {Promise<void>}
   */
  async updateRow(rowsData) {
    if (!Array.isArray(rowsData)) throw new TypeError('Parametro "rowsData" obrigatorio e deve ser do tipo Array');
    if (!rowsData.every((rowData) => rowData.constructor === Object))
      throw new TypeError('Parametro "rowsData" deve ser do tipo Array<Object>');

    await this.authenticate()
    this.sheetId = await this.getSheetId();
    const updateRequests = [];
    for (const rowData of rowsData) {
      const userEnteredValueBuild = rowsData.map((elem) => {
        switch (elem.newValue.type) {
          case 'numberValue':
            return { userEnteredValue: { numberValue: elem.newValue.value } };
          case 'stringValue':
            return { userEnteredValue: { stringValue: elem.newValue.value } };
          case 'boolValue':
            return { userEnteredValue: { boolValue: elem.newValue.value } };
          case 'formulaValue':
            return { userEnteredValue: { formulaValue: elem.newValue.value } };
          case 'note':
            return { note: elem.newValue.value };
          default:
            throw new TypeError(
              'Parametro "newValue.type" deve ser um dentre: ["numberValue", "stringValue", "boolValue", "formulaValue", "note"]'
            );
        }
      });
      updateRequests.push({
        updateCells: {
          rows: [
            {
              values: userEnteredValueBuild,
            },
          ],
          fields: '*',
          range: {
            sheetId: this.sheetId,
            startRowIndex: rowData.rowIndex,
            endRowIndex: rowData.rowIndex + 1,
            startColumnIndex: rowData.columnIndex,
            endColumnIndex: rowData.columnIndex + 1,
          },
        },
      });
    }

    await this.sheets.spreadsheets.batchUpdate({
      spreadsheetId: this.spreadsheetId,
      resource: { requests: updateRequests },
    });
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