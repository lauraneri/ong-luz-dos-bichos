const {Spreadsheet} = require("../scopes/spreadsheet/spreadsheet");

class Usuarios {
  /**
   * Construtor
   * @param {Spreadsheet} spreadsheet 
   */
  constructor(spreadsheet) {
    if (spreadsheet) this.spreadsheet = spreadsheet;
    else this.spreadsheet = new Spreadsheet();
  }

  async get(as, pk = null) {
    return await this.spreadsheet.read(as, pk);
  }
}

function newUsuarios(args) {
  return new Usuarios(args);
}

module.exports = {
  Usuarios,
  newUsuarios
};
