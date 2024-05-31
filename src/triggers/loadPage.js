function include(fileName) {
  return HtmlService.createHtmlOutputFromFile(fileName).getContent();
}

module.exports = include;