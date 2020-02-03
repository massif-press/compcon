# Contributing to COMP/CON

Thank you for your interest!

The following is a set of guidelines for contributing to COMP/CON, the LANCER TTRPG digital toolkit. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [compcon@massifpress.com](mailto:compcon@massifpress.com).

## What should I know before I get started?

First, dev discussion is mostly handled in the #comp-con channel of the [Official LANCER Discord](https://discord.gg/rwcpzsU), and participation in that channel is a requirement for pull request acceptance. After your first accepted pull request, you'll get the Comp-Con Dev role.

To pull and build COMP/CON locally:

```bash
git clone git@github.com:massif-press/compcon.git
yarn
yarn dev
```

Which will open a browser window pointed to `localhost:8080`. Hot Module Reload is enabled, which means that the app should refresh as you save code. Occasionally (especially after certain syntax errors) this can start to fall off, in part or completely. If this is the case, a refresh will either get HMR working again or find your error.

Unless you're working on something specifically for an Electron build, prefer developing to browser.

## App Conventions

WIP

## Design Decisions

WIP

## How Can I Contribute?

### Your First Code Contribution

Unsure where to begin contributing? You can start by looking through these `beginner` and `help-wanted` issues:

- [Beginner issues][good-first-issue] - issues which should only require a few lines of code.
- [Help wanted issues][help-wanted] - issues which should be a bit more involved than `beginner` issues.

### Commits

COMP/CON uses [commitizen](https://github.com/commitizen/cz-cli) to produce a [standard-version](https://github.com/conventional-changelog/standard-version) changelog. Pull requests that include commits that are not [conventional commit](https://www.conventionalcommits.org/) formatted will not be accepted.

COMP/CON comes with a commitizen dev dependency, so when making commits use `yarn commit` instead of `git commit`, or use the [VSCode Commitizen Support](https://marketplace.visualstudio.com/items?itemName=KnisterPeter.vscode-commitizen) package.

### Pull Requests

WIP

## Styleguides

WIP

### Typescript

WIP

### Vue

WIP

## Additional Notes

WIP

### Issue Labels

[good-first-issue]: https://github.com/massif-press/compcon/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22
[help-wanted]: https://github.com/massif-press/compcon/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22+label%3A%22help+wanted%22
