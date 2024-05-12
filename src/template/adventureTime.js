async function main() {
  const usuarios = new Usuarios('1gqnuawzNfc3LsoVsGOHpLxQSiw4XFRA6aEdC2QucZYY', 'USUARIOS')
  const data = usuarios.read(as='json')
  console.log(data)
}