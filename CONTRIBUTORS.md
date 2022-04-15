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
yarn serve
```

Which will open a browser window pointed to `localhost:8080`. Hot Module Reload is enabled, which means that the app should refresh as you save code. Occasionally (especially after certain syntax errors) this can start to fall off, in part or completely. If this is the case, a refresh will either get HMR working again or find your error.

If you need https support for your developer server, which is the case when you need to debug and develop on a machine other than your build machine, you can use the following command instead:
```bash
yarn serve-https
```

Please note this will cause your browser to display a warning about certificate validation, as the VUE developement certificate is self signed.
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

~~COMP/CON comes with a commitizen dev dependency, so when making commits use `yarn commit` instead of `git commit`, or use the [VSCode Commitizen Support](https://marketplace.visualstudio.com/items?itemName=KnisterPeter.vscode-commitizen) package.~~

COMP/CON currently has commitizen disabled due to issues generating changelogs, but it is intended to be re-enabled in the future. For now, please format commits and pull requests in a manner compliant with the conventional commit format for ease of reading and recording commits.

### Pull Requests

WIP

## Styleguides

Please adhere to eslint whenever possible. Prefer leaving warnings to adding ignores.
Folder structure should reflect vue-router to the extent reasonable.

### Typescript

- `src/io`: Should contain any and all logic that touches the os -- file loading, checking appdata, etc
- `public`:
  - `static`: Should just contain data, keep logic out (to the extent possible)
  - `img`: Files should be the onboard/stock images we want to copy over into appdata (see data io startup)

#### Classes
- Maintain types to the extent possible.
- Provide data interface when necessary (avoid any, in-function definitions).
- Provide static Serialize and Deserialize functions if something needs to be saved.
- Each class must be declared in its own file.
- Import all classes into @/class, get classes from there instead of traversing the directory tree. (Out of date?)

#### Class Structure
- Pilot
- Mech
- CompendiumItem
- LicensedItem
#### Interfaces
- Keep interface in class file when convenient.
- Declare interface when useful (so, available globally).
- Import nonglobal interfaces in @/interface. (Out of date?)

TODO: look into TS import() function in dec file to keep definitions with class, but make all interface available globally

### Vue

UI should contain all reusable components. Everything starting with `CC` will be made available globally as `cc-component-name`.

Global component subcomponents (that don't themselves need to be available globally) should be prefixed by a \_. Try to structure folders like:
- topic/group - component type/set - components
- \_subcomponent.vue
- CCMyComponentThatUsesSubcomponent.vue

Split views into collections of components wherever possible for easy reordering. Aim for DRY with components for stylistic consistency's sake (good refactor opportunities). Prefer two components with common subcomponents instead of bimodal components (eg. skillitem and skillselectitem).

### CSS/Vuetify
- LANCER book style before anything else. Adhere as close to the book as possible.
- Fluff/flavor is important for the pilot management tools. No flavor (for now) for gm/encounter/campaign tools.
- Compendium may get flavor later.

## Additional Notes

Chores left:
- integrate vue-class-component
- testing


[good-first-issue]: https://github.com/massif-press/compcon/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22
[help-wanted]: https://github.com/massif-press/compcon/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22
