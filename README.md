# quick-commitizen

This tool is for quick config on [commitizen](https://github.com/commitizen/cz-cli). Setting your repo to use [AngularJS's commit message convention](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines) also known as [conventional-changelog](https://github.com/conventional-changelog/conventional-changelog).

```
// commit msg format:
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

[![current version](https://img.shields.io/npm/v/quick-commitizen.svg?style=flat-square)](https://www.npmjs.com/package/quick-commitizen)

## Install

```
npm install -g quick-commitizen
```

## Usage

```
// All you need to do is
quickcm
// or
quickcm -p yarn
```

The above command does:

1. Installs `commitizen cz-conventional-changelog @commitlint/cli husky conventional-changelog-cli` module
2. Saves it to devDependencies
3. adds belowe keys to the root of your package.json

```
{
  ...

  "config": {
      "commitizen": {
        "path": "./node_modules/cz-conventional-changelog"
      }
    },
    "husky": {
      "hooks": {
        "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
      }
    },
    "scripts": {
      "std-cm": 'git-cz',
      "changelog": "conventional-changelog -p angular -i CHANGELOG.md -s && git add CHANGELOG.md"
    }
}
```

4. adds the `commitlint.config.js` to root directory.

> Now, you can use `npm run std-cm` instead `git commit`. you'll be you'll be prompted to fill in any required fields and your commit messages will be formatted according to the standards defined by project maintainers. [details](https://github.com/commitizen/cz-cli). like:

![image](https://raw.githubusercontent.com/commitizen/cz-cli/master/meta/screenshots/add-commit.png)

when you release a version, you can run `npm run changelog` to generate CHANGELOG.md that contains your commit messages.

## Related projects

- [conventional-changelog](https://github.com/conventional-changelog/conventional-changelog) – Generate a changelog from conventional commit history
- [commitlint](https://github.com/marionebl/commitlint) - Lint commit messages
