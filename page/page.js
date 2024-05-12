function myFunction() {
  Logger.log(HtmlService
      .createTemplateFromFile('Index')
      .getCode());
}