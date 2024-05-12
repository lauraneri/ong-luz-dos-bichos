const {google} = require('googleapis');
const DataManager = require('../../managers/dataManager')

class Spreadsheet {
  /**
   * Construtor
   * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
   */
  constructor(auth) {
    this.sheets = google.sheets({version: 'v4', auth});
  }

  /**
   * Apontar para planilha a ser trabalhada 
   * @param {String} spreadsheetId Id da planilha
   */
  setSpreadsheetId(spreadsheetId) {
    if (!spreadsheetId) throw new Error('Parametro "spreadsheetId" obrigatorio')
    if (typeof spreadsheetId !== 'string') throw new TypeError('Parametro "spreadsheetId" deve ser do tipo String')

    this.spreadsheetId = spreadsheetId
  }

  /**
   * Apontar para a aba da planilha a ser trabalhada 
   * @param {String} sheetName Nome da aba
   */
  setSheetName(sheetName) {
    if (!sheetName) throw new Error('Parametro "sheetName" obrigatorio')
    if (typeof sheetName !== 'string') throw new TypeError('Parametro "sheetName" deve ser do tipo String')

    this.sheetName = sheetName
  }

  
  /** 
   * Ler conteúdo da aba corrente
   * @param {string} [as='json'] Tipo de leitura. Opt ['array', 'json', 'map']
   * @param {string} primaryKey primaria (caso as='map')
   * @returns {Promise<Map<Object>>} Conteúdo da planilha
  */
  async read(as = 'json', primaryKey) {

    const allowedAs = ['json', 'array', 'map']

    if (!as) throw new Error('Parametro "as" obrigatorio')
    if (typeof as !== 'string') throw new TypeError(`Parametro "as" deve ser do tipo String`)
    if (!allowedAs.includes(as)) throw new RangeError(`Parametro ${as} deve ser um dentre ${allowedAs}`)

    if (as === 'map' && !primaryKey) throw new Error('Parametro "primaryKey" obrigatorio')
    if (as === 'map' && typeof primaryKey !== 'string') throw new TypeError(`Parametro "primaryKey" deve ser do tipo String`)

    const res = await this.sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: this.sheetName,
    });
    const rows = res.data.values;

    if (!rows || rows.length === 0) {
      if (as === 'map') return new Map();
      return []
    }
    
    if (as === 'array') return rows
    if (as === 'json') return DataManager.createJson(rows)

    const header = rows[0]
    if (!header.includes(primaryKey)) throw new Error(`Parametro ${primaryKey} nao inclusa no cabecalho`)

    return DataManager.createMap(rows, primaryKey)
  }

  /**
   * Criar nova planilha
   * @param {String} spreadsheetName Nome da planilha
   * @returns {Promise<String>} ID da planilha criada
   */
  async create(spreadsheetName) {
    if (!spreadsheetName) throw new Error('Parametro "spreadsheetName" obrigatorio')
    if (typeof spreadsheetName !== 'string') throw new TypeError('Parametro "spreadsheetName" deve ser do tipo String')

    const response = await this.sheets.spreadsheets.create({
      requestBody: {
        properties: {
          title: spreadsheetName,
        }
      }
    })
    return response.data.spreadsheetId;
  }

  /**
   * Adiciona novas abas na planilha corrente
   * @param {Array<String>|String} sheetNames nome das abas a serem adicionadas 
   * @returns {Promise<void>}
   */
  async addSheets(sheetNames) {
    if (!sheetNames) throw new Error('Parametro "sheetNames" obrigatorio')

    if (Array.isArray(sheetNames)) {
      const addSheetsReq = sheetNames.map(item => { return {addSheet: { properties: { title: item } }} })
      console.log(addSheetsReq)
      await this.sheets.spreadsheets.batchUpdate({ spreadsheetId: this.spreadsheetId, resource: { requests: addSheetsReq } });
      return
    }

    if (typeof sheetNames === 'string') {
      await this.sheets.spreadsheets.batchUpdate({ spreadsheetId: this.spreadsheetId, resource: { requests: {addSheet: { properties: { title: sheetNames } }} } });
      return
    }

    throw new TypeError('Parametro "sheetNames" deve ser do tipo Array<String> ou String')
  }

  /**
   * Sobrescrever dados na aba atual
   * @param {Array<Array<*>>} dataMatrix Matriz 2D de dados
   * @returns {Promise<void>}
   */
  async overwrite(dataMatrix) {
    const overwriteRequest = {
      spreadsheetId: this.spreadsheetId,
      range: this.sheetName,
      valueInputOption: 'USER_ENTERED',
      resource: { values: dataMatrix },
      includeValuesInResponse: true,
    };
    await this.sheets.spreadsheets.values.update(overwriteRequest);
  }
}

module.exports = Spreadsheet