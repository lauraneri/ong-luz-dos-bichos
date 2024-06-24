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
const fs = require('fs');

const run = util.promisify(childProcess.exec);

const HELP_INFO = process.env.npm_config_help_info || false;

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
 * @summary Descritivo de uso do script
 *
 * @example
 * bash: npm run info --help_info
 */
function getHelpInfo() {
  const desc = `
  ==========================
  SCRIPTS DE DEPLOY - SCRIPT
  ==========================

  *** DEPLOY ***
  Execução completa via:
  -- npm run deploy:script 
  `;
  console.log(desc);
}

function switchClaspScript() {
  const scriptId = {
    "scriptId":"1OsAxwzXLH5KllHRxILprtzXcpeiJ2HYuVPeadluuXlN8ak-GeVnbfJnE",
    "rootDir":"./dist"
  }

  fs.writeFileSync('.clasp.json', JSON.stringify(scriptId), (err) => {
    if (err) throw err;
  });
}


/**
 * @summary Função principal para execução de setup
 * @async
 */
async function main() {
  if (HELP_INFO) {
    getHelpInfo();
    return;
  }

  switchClaspScript();

  const undeploy = `npx clasp push -f`;
  await execBash(undeploy);
}

main();
