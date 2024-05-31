const DataManager = require('./managers/dataManager');
const SpreadsheetManager = require('./managers/spreadsheetManager');

const doPost = require('./triggers/doPost');
const doGet = require('./triggers/doGet');
const include = require('./triggers/loadPage');

const {pessoalRegistrarOuAtualizarCadastro, pessoalObterCadastro} = require('./macros/cadastro')

global.SpreadsheetManager = SpreadsheetManager;
global.DataManager = DataManager;

global.doGet = doGet;
global.doPost = doPost;

global.pessoalRegistrarOuAtualizarCadastro = pessoalRegistrarOuAtualizarCadastro;
global.pessoalObterCadastro = pessoalObterCadastro;
global.include = include;

