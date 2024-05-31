function doGet(e){
  return HtmlService.createTemplateFromFile('index').evaluate();
}

module.exports = doGet;
