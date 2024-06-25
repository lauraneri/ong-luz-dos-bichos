const SheetsApi = require("../externals/sheetsApi");
const DataManager = require("./dataManager");

class SpreadsheetManager {
  constructor(localDevSwitch = true) {
    this.local = localDevSwitch;
  }

  /**
   * Apontar para planilha a ser trabalhada 
   * @param {String} spreadsheetId Id da planilha
   */
  setSpreadsheetId(spreadsheetId) {
    if (!spreadsheetId) throw new Error('Parametro "spreadsheetId" obrigatorio');
    if (typeof spreadsheetId !== 'string') 
      throw new TypeError('Parametro "spreadsheetId" deve ser do tipo String');

    this.spreadsheetId = spreadsheetId;
  }

  /**
   * Apontar para a aba da planilha a ser trabalhada 
   * @param {String} sheetName Nome da aba
   */
  setSheetName(sheetName) {
    if (!sheetName) throw new Error('Parametro "sheetName" obrigatorio');
    if (typeof sheetName !== 'string') 
      throw new TypeError('Parametro "sheetName" deve ser do tipo String');

    this.sheetName = sheetName;
  }

  
  /** 
   * Ler conteúdo da aba corrente
   * @param {string} [as='json'] Tipo de leitura. Opt ['array', 'json', 'map']
   * @param {string} primaryKey primaria (caso as='map')
   * @returns {Promise<Map<Array<Object>>> | Promise<Array<Object>>} Conteúdo da planilha
  */
  async read(as = 'json', primaryKey) {

    const allowedAs = ['json', 'array', 'map'];

    if (!as) throw new Error('Parametro "as" obrigatorio');
    if (typeof as !== 'string') throw new TypeError(`Parametro "as" deve ser do tipo String`);
    if (!allowedAs.includes(as)) 
      throw new RangeError(`Parametro ${as} deve ser um dentre ${allowedAs}`);

    if (as === 'map' && !primaryKey) throw new Error('Parametro "primaryKey" obrigatorio');
    if (as === 'map' && typeof primaryKey !== 'string') 
      throw new TypeError(`Parametro "primaryKey" deve ser do tipo String`);

    let response;
    if (this.local) {
      const sheetsApi = new SheetsApi(this)
      response = await sheetsApi.read();
    } else {
      const ss = SpreadsheetApp.openById(this.spreadsheetId)
      const sheet = ss.getSheetByName(this.sheetName);
      response = sheet.getDataRange().getDisplayValues()
    }

    if (!response || response.length === 0) {
      if (as === 'map') return new Map();
      return [];
    }
    
    if (as === 'array') return response;
    if (as === 'json') return DataManager.createJson(response);

    const header = response[0];
    if (!header.includes(primaryKey)) 
      throw new Error(`Parametro ${primaryKey} nao inclusa no cabecalho`);

    return DataManager.createMap(rows, primaryKey);
  }

  /**
   * Adição de dados ao final da planilha de destino
   * @param {Array<Object>} data Dados para apensamento
   * @returns {Promise<void>}
   */
  async append(data) {

    const targetData = await this.read('array')
    const targetHeader = targetData[0]
    if (!targetHeader) 
      throw new Error(`Aba alvo ${this.sheetName} não inclui cabeçalho`)

    const matrixToAppend = data.map(dataLine => targetHeader.map(headerField => dataLine[headerField]))

    if (this.local) {
      const sheetsApi = new SheetsApi(this)
      await sheetsApi.append(matrixToAppend)
      return
    } 

    const ss = SpreadsheetApp.openById(this.spreadsheetId)
    const sheet = ss.getSheetByName(this.sheetName);
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow + 1, 1, matrixToAppend.length, matrixToAppend[0].length).setValues(matrixToAppend);
    SpreadsheetApp.flush()
  }

  /**
   * Sobrescrita de dados sobre a planilha destinho
   * @param {Array<Object>} data Dados para sobrescrita
   */
  async overwrite(data) {

    const targetData = await this.read('array')
    const targetHeader = targetData[0]
    if (!targetHeader) 
      throw new Error(`Aba alvo ${this.sheetName} não inclui cabeçalho`)

    const matrixToOverwrite = data.map(dataLine => targetHeader.map(headerField => dataLine[headerField]))

    if (this.local) {
      const sheetsApi = new SheetsApi(this)
      await sheetsApi.clearContent();
      await sheetsApi.overwrite([targetHeader, ...matrixToOverwrite])
      return
    } 

    const ss = SpreadsheetApp.openById(this.spreadsheetId)
    const sheet = ss.getSheetByName(this.sheetName);
    
    const lastRow = sheet.getLastRow();
    const lastColumn = sheet.getLastColumn();
    const dataRange = sheet.getRange(2, 1, lastRow, lastColumn);
    dataRange.clear({ commentsOnly: true, contentsOnly: true, formatOnly: true, validationsOnly: true });

    sheet.getRange(2, 1, matrixToOverwrite.length, matrixToOverwrite[0].length).setValues(matrixToOverwrite);
    SpreadsheetApp.flush()
  }

  
  /**
   * Atualizar campos que foram filtrados conforme critério especificado
   * 
   * @param {Object} data Dados da aba sobre os quais o update será operado
   * @param {Object} filters Relação campo-valor para reconhecimento da linha a ser atualizada
   * @param {Object} newValue Relação campo-valor-tipo com dados a ser atualizados
   * @param {String} newValue.field Campo a ser atualizado
   * @param {String} newValue.value Valor atualizado
   * @param {String} newValue.type Tipo do valor. Um dentre: [numberValue, stringValue, boolValue, formulaValue, note]
   * @param {Boolean} fromLocking Verificar se requisição origina-se no método tryLock/unlock
   * @returns {Promise<Boolean>} True: Se algum registro foi encontrado e atualizado. False: caso contrario
   */
  async update(data, filters, newValue) {

    if (!filters) throw new TypeError('Parametro "filters" obrigatorio');
    if (!newValue) throw new TypeError('Parametro "newValue" obrigatorio');

    if (!filters.constructor === Object) throw new TypeError('Parametro "filters" deve ser do tipo Object');
    if (!newValue.constructor === Object) throw new TypeError('Parametro "newValue" deve ser do tipo Object');

    if ([null, undefined].includes(newValue.value)) newValue.value = '';

    if (!newValue.type) throw new TypeError('Parametro "newValue.type" obrigatorio');

    const allowedTypes = ['numberValue', 'stringValue', 'boolValue', 'formulaValue'];
    if (!allowedTypes.some((elem) => elem === newValue.type))
      throw new TypeError(
        `Parametro "newValue.type" deve ser um dentre: ${allowedTypes}`
      );

    if (!data || !data[0]) return false;

    if (data.length > 0 && data.some((element) => !DataManager.isObject(element)))
      throw new TypeError('Elementos de "data" devem ser do tipo Object');

    // Obter indice da coluna a ser atualizada
    const columnIndex = Object.keys(data[0]).indexOf(newValue.field);

    if (columnIndex === -1)
      throw new RangeError(`Campo ${newValue.field} não encontrado como nome de coluna para atualização`);

    // Filtrar apenas as linhas cujos campos de filtro correspondem à linha
    const rowsToUpdate = [];
    let rowIndex = 0;
    for (const line of data) {
      rowIndex++;
      if (Object.keys(filters).every((key) => filters[key] === line[key] || filters[key] === !!line[key])) {
        const rowData = {
          rowIndex,
          columnIndex,
          newValue,
        };
        rowsToUpdate.push(rowData);
      }
    }

    // Retornar caso não haja colunas a atualizar
    if (rowsToUpdate.length === 0) return false;

    if (this.local) {
      const sheetsApi = new SheetsApi(this)
      await sheetsApi.updateRow(rowsToUpdate);
      return true;
    }

    const ss = SpreadsheetApp.openById(this.spreadsheetId)
    const sheet = ss.getSheetByName(this.sheetName);

    // Atualizar cada uma das linhas no campo indicado
    for (const rowData of rowsToUpdate) {
      const cell = sheet.getRange(rowData.rowIndex + 1, rowData.columnIndex + 1, 1, 1);
      cell.setValue(rowData.newValue.value);
    }

    return true;
  }

  /**
   * Criar nova planilha
   * @param {String} spreadsheetName Nome da planilha
   * @returns {Promise<String>} ID da planilha criada
   */
  async create(spreadsheetName) {
    if (!spreadsheetName) throw new Error('Parametro "spreadsheetName" obrigatorio');
    if (typeof spreadsheetName !== 'string') 
      throw new TypeError('Parametro "spreadsheetName" deve ser do tipo String');

    let newSpreadsheetId;
    if (this.local) {
      const sheetsApi = new SheetsApi(this)
      newSpreadsheetId = await sheetsApi.create(spreadsheetName);
    } else {
      let sheet = SpreadsheetApp.newSpreadsheet();
      sheet.properties = Sheets.newSpreadsheetProperties();
      sheet.properties.title = spreadsheetName;
      const spreadsheet = Sheets.Spreadsheets.create(sheet);
  
      newSpreadsheetId = spreadsheet.spreadsheetId;
    }

    return newSpreadsheetId;
  }

  /**
   * Adiciona novas abas na planilha corrente
   * @param {Array<String>|String} sheetNames nome das abas a serem adicionadas 
   * @returns {Promise<void>}
   */
  async addSheets(sheetNames) {
    if (!sheetNames) throw new Error('Parametro "sheetNames" obrigatorio');

    if (this.local) {
      const sheetsApi = new SheetsApi(this)
      await sheetsApi.addSheets(sheetNames);
    } else {
      var ss = SpreadsheetApp.openById(this.spreadsheetId);
      if (typeof sheetNames === 'string') ss.insertSheet(sheetNames);
      if (Array.isArray(sheetNames)) for (const sheetName of sheetNames) ss.insertSheet(sheetName);
    }

    throw new TypeError('Parametro "sheetNames" deve ser do tipo Array<String> ou String');
  }

  flush() {
    if (this.local) return;
    SpreadsheetApp.flush()
  }

  getId() {
    return this.spreadsheetId;
  }
}

module.exports = SpreadsheetManager;