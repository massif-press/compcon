# Contributing to COMP/CON

Thank you for your interest!

The following is a set of guidelines for contributing to COMP/CON, the LANCER TTRPG digital toolkit. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [compcon@massifpress.com](mailto:compcon@massifpress.com.

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

Unsure where to begin contributing to Atom? You can start by looking through these `beginner` and `help-wanted` issues:

- [Beginner issues][beginner] - issues which should only require a few lines of code, and a test or two.
- [Help wanted issues][help-wanted] - issues which should be a bit more involved than `beginner` issues.

Both issue lists are sorted by total number of comments. While not perfect, number of comments is a reasonable proxy for impact a given change will have.

If you want to read about using Atom or developing packages in Atom, the [Atom Flight Manual](https://flight-manual.atom.io) is free and available online. You can find the source to the manual in [atom/flight-manual.atom.io](https://github.com/atom/flight-manual.atom.io).

### Commits

COMP/CON uses [commitizen](https://github.com/commitizen/cz-cli) to produce a [standard-version](https://github.com/conventional-changelog/standard-version) changelog. Pull requests that include commits that are not [conventional commit](https://www.conventionalcommits.org/) formatted will not be accepted.

COMP/CON comes with a commitizen dev dependency, so when making commits use `yarn commit` instead of `git commit`, or use the [VSCode Commitizen Support](https://marketplace.visualstudio.com/items?itemName=KnisterPeter.vscode-commitizen) package.

### Pull Requests

The process described here has several goals:

- Maintain Atom's quality
- Fix problems that are important to users
- Engage the community in working toward the best possible Atom
- Enable a sustainable system for Atom's maintainers to review contributions

Please follow these steps to have your contribution considered by the maintainers:

1. Follow all instructions in [the template](PULL_REQUEST_TEMPLATE.md)
2. Follow the [styleguides](#styleguides)
3. After you submit your pull request, verify that all [status checks](https://help.github.com/articles/about-status-checks/) are passing <details><summary>What if the status checks are failing?</summary>If a status check is failing, and you believe that the failure is unrelated to your change, please leave a comment on the pull request explaining why you believe the failure is unrelated. A maintainer will re-run the status check for you. If we conclude that the failure was a false positive, then we will open an issue to track that problem with our status check suite.</details>

While the prerequisites above must be satisfied prior to having your pull request reviewed, the reviewer(s) may ask you to complete additional design work, tests, or other changes before your pull request can be ultimately accepted.

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
