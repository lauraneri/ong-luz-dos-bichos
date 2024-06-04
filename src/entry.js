const DataManager = require('./managers/dataManager');
const SpreadsheetManager = require('./managers/spreadsheetManager');

const doPost = require('./triggers/doPost');
const doGet = require('./triggers/doGet');
const include = require('./triggers/loadPage');

const {pessoalRegistrarOuAtualizarCadastro, pessoalObterCadastro} = require('./macros/pessoal/cadastro')

const {pessoalExibirDisponibilidades, pessoalObterEventosSemanais, pessoalAtribuirResponsaveisPorAtividade} = require('./macros/pessoal/disponibilidade')

global.SpreadsheetManager = SpreadsheetManager;
global.DataManager = DataManager;

global.doGet = doGet;
global.doPost = doPost;

global.include = include;

global.pessoalRegistrarOuAtualizarCadastro = pessoalRegistrarOuAtualizarCadastro;
global.pessoalObterCadastro = pessoalObterCadastro;

global.pessoalExibirDisponibilidades = pessoalExibirDisponibilidades;
global.pessoalObterEventosSemanais = pessoalObterEventosSemanais;
global.pessoalAtribuirAtividades = pessoalAtribuirResponsaveisPorAtividade;


