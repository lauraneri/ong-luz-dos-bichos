class Configs {
  constructor(localDevSwitch = true) {
    this.local = localDevSwitch;
    this.env = 'dev'
    
    this.envs = {
      dev: {
        people: '1r1KWffk6nb5i2gWHCCFKs_KUqOyHDCjDweoqDZ-eh4o',
        schedule: 'sch-xxxx'
      },
      prod: {
        members: 'memb-yyyy',
        schedule: 'sch-yyyy'
      }
    }

  }

  static getActiveSpreadsheetId() {
    if (!this || this.local) 
      throw new Error('Método indisponível para execução local')

    return SpreadsheetApp.getActive().getId();
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

  getUserEmail() {
    if (this.local) return ''
    return Session.getActiveUser().getEmail();
  }
}

module.exports = Configs