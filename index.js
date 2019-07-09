const Commander = require('commander');
const spawn = require('child_process').spawn;
const fs = require('fs-extra');
const path = require('path');
const _ = require('lodash');
const chalk = require('chalk');

const commander = new Commander.Command();
const log = console.log;
const projectRoot = process.cwd();
const pkgRoot = __dirname;

/**
 * 执行安装命令
 * @param {string} packageManager 
 * @param {string} packageName 
 */
async function InstallPkgs(packageManager = 'npm', packageName) {
  const installArgs = [];
  switch (packageManager) {
    case 'cnpm':
    case 'pnpm':
    case 'npm':
      installArgs.push('install');
      break;

    case 'yarn':
      installArgs.push('add');
      break;

    default:
      packageManager = 'npm';
      installArgs.push('install');
      break;
  }

  installArgs.push(packageName);

  await new Promise((resolve, reject) => {
    spawn(packageManager, installArgs, { stdio: 'inherit', shell: true })
      .on('close', (code) => {
        if (code === 0) {
          log(chalk.green(`Installed packages for tooling via ${packageManager}.`));
          resolve();
        } else {
          log(chalk.red('Package install failed, see above.'));
          reject('Package install failed');
        }
      },
      );
  });
}

/**
 * 修改package.json的相关配置
 */
function editPkgJson() {
  const pkgJsonPath = path.join(projectRoot, 'package.json');
  const pkgJson = fs.readJsonSync(pkgJsonPath);

  _.merge(pkgJson, {
    config: {
      commitizen: {
        path: "./node_modules/cz-conventional-changelog"
      }
    },
    husky: {
      hooks: {
        'commit-msg': "commitlint -E HUSKY_GIT_PARAMS"
      }
    },
    scripts: {
      'std-cm': 'npx git-cz',
      changelog: "npx conventional-changelog -p angular -i CHANGELOG.md -s && git add CHANGELOG.md"
    }
  })

  fs.writeJSONSync(pkgJsonPath, pkgJson, { spaces: '\t' });
}

/**
 * 将commit规则写入项目根目录
 */
function copyRulesToProject() {
  fs.copySync(path.join(pkgRoot, 'commitlint.config.js'), path.join(projectRoot, 'commitlint.config.js'));
}

// 自定义包管理器
commander.version('0.1.0')
  .option('-p, --package-manager <pkg>', 'package manager with npm in default')
  .action(async function (pkg) {
    // 需要安装的依赖包
    const pkgs = 'commitizen cz-conventional-changelog @commitlint/cli husky conventional-changelog-cli';
    await InstallPkgs(commander.packageManager, pkgs);
    editPkgJson();
    log(chalk.green(`Has changed package.json`));
    copyRulesToProject();
    log(chalk.green(`
commitlint.config.js for commit rules has putted in the project
All has done! Now you can test 'npm run changelog' or 'git commit'
  `));
  })
  .parse(process.argv);
