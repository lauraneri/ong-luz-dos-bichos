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
      throw new TypeError('Elementos de "data" devem ser do tipo Object');
    
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

    if (arrayData.length === 0) {
      const mapHeaderValue = header.map((_, index) => [header[index], '']);
      return [Object.fromEntries(mapHeaderValue)];
    }

    const arrayJson = arrayData.splice(1).map((line) => {
      const filledLine = Array(header.length)
        .fill()
        .map((_, index) => (line[index] ? line[index] : ''));
      const mapHeaderValue = filledLine.map((value, index) => [header[index], value]);
      return Object.fromEntries(mapHeaderValue);
    });
    return arrayJson;
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