/**
 * =====================================
 * SCRIPTS DE DEPLOY AUTOMÁTICO - SCRIPT
 * =====================================
 *
 * Execução completa via:
 * -- npm run deploy:script
 */

const util = require('util');
const childProcess = require('child_process');

const run = util.promisify(childProcess.exec);

/** Mapa de comandos - Win / Linux */
const COMMAND_MAP = {
  cmdCreateFiles: {
    win32: 'md .configs && md dist',
    linux: 'mkdir .configs && mkdir dist',
  },
  cmdMoveFiles: {
    win32: 'move .\\dist\\.clasp.json .',
    linux: 'mv ./dist/.clasp.json .',
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

  await execBash(COMMAND_MAP.cmdMoveFiles[process.platform]);
}

main();
