const SheetsApi = require('./externals/sheetsApi')
const GoogleOauth = require('./authenticate/googleOauth');
const DataManager = require('./managers/dataManager');
const SpreadsheetManager = require('./managers/spreadsheetManager');

async function main() {
  const googleOauth = new GoogleOauth();
  await googleOauth.authorize();
  
  const spreadsheetManager = new SpreadsheetManager()
  
  spreadsheetManager.setSpreadsheetId('1gqnuawzNfc3LsoVsGOHpLxQSiw4XFRA6aEdC2QucZYY')
  spreadsheetManager.setSheetName('USUARIOS')

  const sheetsApi = new SheetsApi(spreadsheetManager)

  const usuarios = await sheetsApi.read()
  const usuariosAsMap = DataManager.createMap(usuarios, 'NOME')
  console.log(usuarios)
  console.log(usuariosAsMap)
}

// (async () => await main())()

module.exports = { main }