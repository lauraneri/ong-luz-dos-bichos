/**
 * ====================================
 * SCRIPTS DE EXECUÇÃO PARA DEBUG LOCAL
 * ====================================
 *
 * Execução completa via:
 * -- npm run setup
 */

const util = require('util');
const childProcess = require('child_process');
const prompt = require('prompt-sync')({ sigint: true });

const run = util.promisify(childProcess.exec);

/**
 * @summary Execução via terminal de um dado comando
 * @async
 * @param {string} cmd comando a ser executado
 */
async function execBash(cmd) {
  const { stdout, stderr } = await run(cmd);
  if (stdout) console.log(stdout);
  if (stderr) console.error(stderr);
}

/**
 * @summary Execução de função para debug
 * @async
 * @example
 * ```bash
 * node ./dev/runDev.cjs dev/googleOauth.cjs test
 * ```
 *
 * @example
 * 1. abrir arquivo para execução
 * 2. apertar F5
 * 3. digitar nome da função
 */
async function runDev() {
  if (process.argv.length < 3) {
    console.error('Argumentos obrigatórios: [<arquivo>, <função>]');
    return;
  }

  /** Obter caminho do arquivo aberto no momento */
  const pathFromCmd = process.argv[2];
  console.info(`\nArquivo de execução: ${pathFromCmd}`);

  /** Receber o nome da função a ser executada */
  let func = null;
  if (process.argv.length === 4) {
    func = process.argv[3];
    console.info(`Função para execução: ${func}`);
  } else func = prompt('Função: ');

  if (!func) {
    console.error('O nome da função para execução deve ser informado e válido');
    return;
  }

  /** Comando para executar funções específicas */
  const cmdExecFunct = `npx run-func ${pathFromCmd} ${func}`;
  try {
    await execBash(cmdExecFunct);
  } catch (err) {
    console.error(`Não foi possível executar a função ${func}\n\n`);
    console.error(err);
    console.error(err.stack);
  }
}

runDev();
