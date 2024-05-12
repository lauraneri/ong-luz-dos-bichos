const Usuarios = require('./models/usuarios');
const DataManager = require('./managers/dataManager');
const SpreadsheetManager = require('./managers/spreadsheetManager');
const doPost = require('./triggers/doPost');
const doGet = require('./triggers/doGet');

global.SpreadsheetManager = SpreadsheetManager;
global.DataManager = DataManager;
global.Usuarios = Usuarios;

global.doGet = doGet;
global.doPost = doPost;