const Spreadsheet = require('./scopes/spreadsheet/spreadsheet')
const GoogleOauth = require('./authenticate/googleOauth');

async function main() {
  const googleOauth = new GoogleOauth();
  const auth = await googleOauth.authorize()
  const spreadsheet = new Spreadsheet(auth) 
  
  spreadsheet.setSpreadsheetId('1is_2cQpBrszt8on-2tqEX7L_XO7A5OkMvAEBamlHCLM')
  
  spreadsheet.setSheetName('DATABASE')
  const databases = await spreadsheet.read('json')

  const newDatabases = databases.filter(item => item.CRIAR === 'TRUE')

  spreadsheet.setSheetName('TABLE')
  const tables = await spreadsheet.read('json')

  for (const db of newDatabases) {
    const spreadId = await spreadsheet.create(db.DATABASE)
    spreadsheet.setSpreadsheetId(spreadId);

    const dbTables = tables
      .filter(item => item.ID_DATABASE === db.ID_DATABASE)

    for (const dbTable of dbTables) {
      await spreadsheet.addSheets(dbTable.TABLE)
      spreadsheet.setSheetName(dbTable.TABLE)

      const toAdd = Object.entries(dbTable)
        .filter(item => item[1] === 'TRUE')
        .map(item => item[0])
      
      await spreadsheet.overwrite([toAdd])
    }
  }
}

(async () => {
  await main();
})();