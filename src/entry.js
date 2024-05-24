const DataManager = require('./managers/dataManager');
const SpreadsheetManager = require('./managers/spreadsheetManager');

const doPost = require('./triggers/doPost');
const doGet = require('./triggers/doGet');

const {pessoalRegistrarOuAtualizarCadastro} = require('./macros/cadastro')

global.SpreadsheetManager = SpreadsheetManager;
global.DataManager = DataManager;

global.doGet = doGet;
global.doPost = doPost;

global.pessoalRegistrarOuAtualizarCadastro = pessoalRegistrarOuAtualizarCadastro;