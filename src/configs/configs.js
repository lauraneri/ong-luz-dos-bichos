class Configs {
  constructor() {

    this.env = 'dev'
    
    this.envs = {
      dev: {
        members: '1no0sULneiBUxhht5IHa2G-s-z6EQ33X_fqbPKlMhn1M',
        schedule: 'sch-xxxx'
      },
      prod: {
        members: 'memb-yyyy',
        schedule: 'sch-yyyy'
      }
    }

  }

  /**
   * Obter ID da planilha desejada via nome padrão
   * @param {String} stdName Nome padrão da planilha 
   */
  getSpreadsheetIdByName(stdName) {
    const spreadsheetId = this.envs[this.env][stdName]
    if (!spreadsheetId) throw new Error(`Planilha com nome padrão ${stdName} não inicializada`)
    
      return spreadsheetId
  }

}

module.exports = Configs