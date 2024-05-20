/**
 * ================================
 * SCRIPTS DE PRE-DEPLOY AUTOMÁTICO
 * ================================
 *
 * Execução única não recomendada
 * Necessário para troca de parâmetros local/cloud
 * no momento de predeploy (set) e postdeploy (reset)
 *
 * Execução completa via:
 * -- npm run predeploy
 */

/** Parâmetros informados */
const resetIgnores = process.env.npm_config_reset || null;

const fs = require('fs');

function externalLibs(path, reset) {
  const externalsFile = 'deploy/externals.json';
  const ignoreExternalsContent = fs.readFileSync(externalsFile, { encoding: 'utf8', flag: 'r' });
  const ignoreExternalsJson = JSON.parse(ignoreExternalsContent);

  let srcContent = fs.readFileSync(path, { encoding: 'utf8', flag: 'r' });

  ignoreExternalsJson.map((external) => {
    if (reset) {
      srcContent = srcContent.replaceAll(external.cloud, external.local);
      return;
    }
    srcContent = srcContent.replaceAll(external.local, external.cloud);
  });

  fs.writeFileSync(path, srcContent, (err) => {
    if (err) throw err;
  });
}

function walkThroughFiles(path, reset) {
  const srcDirs = fs.readdirSync(path);
  srcDirs.map((srcDir) => {
    const pathName = `${path}/${srcDir}`;
    const isDir = fs.statSync(pathName).isDirectory();
    if (isDir) {
      walkThroughFiles(pathName, reset);
      return;
    }
    externalLibs(pathName, reset);
  });
}

/**
 * @summary Função principal para execução de preDeploy
 * @async
 */
function main() {
  /** Comentar funções e chamadas que utilizem modulos locais */
  if (!resetIgnores) walkThroughFiles('src', false);
  else walkThroughFiles('src', true);
}

main();
