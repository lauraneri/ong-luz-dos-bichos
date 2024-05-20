/**
 * =====================================
 * SCRIPTS DE DEPLOY AUTOMÁTICO - WEBAPP
 * =====================================
 *
 * Execução completa via:
 * -- npm run deploy:webapp
 */

const util = require('util');
const childProcess = require('child_process');

const run = util.promisify(childProcess.exec);

const HELP_INFO = process.env.npm_config_help_info || false;
const FIRST = process.env.npm_config_first || false;
const VER = process.env.npm_config_deployVersion || 1;
const DESC = process.env.npm_config_deployDesc || 'default';
const UNDEPLOY = process.env.npm_config_undeploy || false;

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
  SCRIPTS DE DEPLOY - WEBAPP
  ==========================

  *** DEPLOY ***
  Execução completa via:
  -- npm run deploy:webapp [options]

  [options]:
  --first
  --deployVersion=numero_da_versao
  --deployDesc=descricao_da_versao

  *** UNDEPLOY ***
  Execução completa via:
  -- npm run deploy:webapp --undeploy
  `;
  console.log(desc);
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

  if (!UNDEPLOY) {
    /** Deploy  */

    if (FIRST) {
      const setVersion = `npx clasp version ${DESC}`;
      await execBash(setVersion);
    }

    const deployWebapp = `npx clasp deploy -V ${VER} -d ${DESC}`;
    await execBash(deployWebapp);

    return;
  }

  const undeploy = `npx clasp undeploy -a`;
  await execBash(undeploy);
}

main();
