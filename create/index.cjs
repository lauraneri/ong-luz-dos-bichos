/**
 * =====================================
 * SCRIPTS DE DEPLOY AUTOMÁTICO - SCRIPT
 * =====================================
 *
 * Execução completa via:
 * -- npm run deploy
 */

/** Parâmetros informados */
const create_folders = process.env.npm_config_create_folders || null;
const move_files = process.env.npm_config_move_files || null;

const util = require('util');
const childProcess = require('child_process');

const run = util.promisify(childProcess.exec);

/** Mapa de comandos - Win / Linux */
const COMMAND_MAP = {
  cmdCreateFiles: {
    win32: 'md dist',
    linux: 'mkdir dist',
  },
  cmdMoveFiles: {
    win32: 'move .\\dist\\.clasp.json . && move .\\dist\\appsscript.json .',
    linux: 'mv ./dist/.clasp.json . && mv ./dist/appsscript.json .',
  },
  cmdRemoveFolder: {
    win32: 'rmdir curFolder /s /q',
    linux: 'rm -rf curFolder',
  },
  cmdRemoveFile: {
    win32: 'del curFile',
    linux: 'rm -f curFile',
  },
  cmdSplitPathChar: {
    win32: '\\',
    linux: '/',
  },
};

/**
 * @summary Execução via terminal de um dado comando
 * @async
 * @param {string} cmd comando a ser executado
 */
async function execBash(cmd) {
  const { stdout, stderr } = await run(cmd);
  console.log(stdout);
  console.error(stderr);
  return stdout;
}


/**
 * @summary Função principal para execução de setup
 * @async
 */
async function main() {
  if (create_folders) {
    await execBash(COMMAND_MAP.cmdCreateFiles[process.platform]);
    return;
  }

  if (move_files) {
    await execBash(COMMAND_MAP.cmdMoveFiles[process.platform]);
    return;
  }
}

main();
