function SpreadsheetManager() {
}
function DataManager() {
}
function Usuarios() {
}
function doGet() {
}
function doPost() {
}/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const SpreadsheetManager = __webpack_require__(2);

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

/***/ }),
/* 2 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const DataManager = __webpack_require__(3);

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

/***/ }),
/* 3 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

class DataManager {

  static isObject(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }

  /**
   * Converter Array<Object> em Array 2D
   * @param {Array<Object>} data Dado a ser convertido
   * @returns {Array<Array<*>>}
   */
  static createMatrix(data) {
    if (!Array.isArray(data)) return [[]];
    if (data.length === 0) return [[]];

    if (!data.every(item => DataManager.isObject(item))) 
      throw new TypeError('Elementos de "data" devem ser do tipo Array');
    
    const header = Object.keys(data[0]);
    const array2D = data.map((elemJson) => {
      const newLine = new Array(header.length).fill('');
      const keys = Object.keys(elemJson);
      keys.map((key) => {
        const idKey = header.indexOf(key);
        if (idKey !== -1) newLine[idKey] = elemJson[key];
        return key;
      });
      return newLine;
    });

    return [header, ...array2D];
  }

  /**
   * Criar um array de objetos com base nas colunas de um array 2D
   * @param {Array<Array<String>>} arrayData Array 2D de valores
   * @returns {Array<Object>}
   */
  static createJson(arrayData) {
    if (!Array.isArray(arrayData)) return [];

    const header = arrayData[0];
    return arrayData.slice(1)
      .map((row) => Object.fromEntries(row.map((item, id) => [header[id], item])));
  }

  /**
   * Criar um map apontando para array de objetos com base nas colunas de um array 2D
   * @param {Array<Array<String>>} arrayData array 2D de valores
   * @param {String} key Chave para mapeamento
   * @returns {Map<Array<Object>>}
   */
  static createMap(arrayData, primaryKey) {
    if (!arrayData) new Map();
    const jsonData = DataManager.createJson(arrayData);

    return new Map(jsonData.map(item => {
      const pk = item[primaryKey]; delete item[primaryKey]; return [pk, item];
    }));
  }
}

module.exports = DataManager

/***/ }),
/* 4 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

function doPost(e) {
  const usuarios = new Usuarios('1gqnuawzNfc3LsoVsGOHpLxQSiw4XFRA6aEdC2QucZYY', 'USUARIOS')

  const newUser = [{
    'NOME': 'Mary',
    'IDADE': 30,
    'CURSO': 'Letras'
  }]
  const data = usuarios.append(newUser)

  var JSONString = JSON.stringify(data);
  var JSONOutput = ContentService.createTextOutput(JSONString);
  JSONOutput.setMimeType(ContentService.MimeType.JSON);
  
  return JSONOutput
}

module.exports = doPost;

/***/ }),
/* 5 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

function doGet(e){
  const usuarios = new Usuarios('1gqnuawzNfc3LsoVsGOHpLxQSiw4XFRA6aEdC2QucZYY', 'USUARIOS')
  const data = usuarios.read(as='json')

  var JSONString = JSON.stringify(data);
  var JSONOutput = ContentService.createTextOutput(JSONString);
  JSONOutput.setMimeType(ContentService.MimeType.JSON);
  return JSONOutput
}

module.exports = doGet;


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const Usuarios = __webpack_require__(1);
const DataManager = __webpack_require__(3);
const SpreadsheetManager = __webpack_require__(2);
const doPost = __webpack_require__(4);
const doGet = __webpack_require__(5);

__webpack_require__.g.SpreadsheetManager = SpreadsheetManager;
__webpack_require__.g.DataManager = DataManager;
__webpack_require__.g.Usuarios = Usuarios;

__webpack_require__.g.doGet = doGet;
__webpack_require__.g.doPost = doPost;
})();

/******/ })()
;