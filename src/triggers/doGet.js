function doGet(e){
  const usuarios = new Usuarios('1gqnuawzNfc3LsoVsGOHpLxQSiw4XFRA6aEdC2QucZYY', 'USUARIOS')
  const data = usuarios.read(as='json')

  var JSONString = JSON.stringify(data);
  var JSONOutput = ContentService.createTextOutput(JSONString);
  JSONOutput.setMimeType(ContentService.MimeType.JSON);
  return JSONOutput
}

module.exports = doGet;
