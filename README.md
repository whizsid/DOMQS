<p align="center"><img src="https://i.imgur.com/PhU8Xkr.png"></p>

---

<p align="center">
<a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-brightgreen.svg" alt="License: MIT"></a>
<a href="https://dev.azure.com/whizsid/DOMQS/_build/latest?definitionId=1&branchName=master"><img src="https://dev.azure.com/whizsid/DOMQS/_apis/build/status/whizsid.DOMQS?branchName=master" alt="Build: parsing"></a>
<a href="https://marketplace.visualstudio.com/items?itemName=whizsid.domqs"><img src="https://img.shields.io/visual-studio-marketplace/i/whizsid.domqs.svg" alt="VS Code: Installs"></a>
</p>

DOMQS is a VS Code extension enable users to search by DOM query selectors in their HTML/XML documents.

![DOMQS on VSCode](https://i.imgur.com/2pZw63l.gif)

## Installation

Search for 'DOMQS' in your extensions tab in left bar and install the first extension.

## Configuration

Currently DOMQS is supporting only for `html` and `xml` file types. You can add other languages by editing `domqs.availableLanguages` in your `settings.json` file.

## Available Commands

- Find by a query selector (Ctrl+Alt+F)
- Go to the next selection (Ctrl+Alt+M)
- Go to the previous selection (Ctrl+Alt+P)

## TODO

Currently VS Code is not supporting to adding custom find terms. I have send them a [issue](https://github.com/microsoft/vscode/issues/75152) to implement this feature. I can bind this library with new features after implemented.

## Contributions

All pull requests and issues are welcome.