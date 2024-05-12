const SheetsApi = require('./externals/sheetsApi')
const GoogleOauth = require('./authenticate/googleOauth');
const DataManager = require('./managers/dataManager');

async function main() {
  const googleOauth = new GoogleOauth();
  const auth = await googleOauth.authorize();
  
  const sheetsApi = new SheetsApi(auth)
  sheetsApi.setSpreadsheetId('1gqnuawzNfc3LsoVsGOHpLxQSiw4XFRA6aEdC2QucZYY')
  sheetsApi.setSheetName('USUARIOS')

  const usuarios = await sheetsApi.read()
  const usuariosAsMap = DataManager.createMap(usuarios, 'NOME')
  console.log(usuarios)
  console.log(usuariosAsMap)
}

(async () => {
  await main();
})();