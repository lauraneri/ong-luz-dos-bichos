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