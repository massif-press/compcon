# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.0.2](https://github.com/jarena3/compcon/compare/v2.0.1...v2.0.2) (2020-02-04)

### Features

- **Main menu changelog:** Changelog button now opens github changelog ([6fe02d9](https://github.com/jarena3/compcon/commit/6fe02d9b7c42fe6100bc8680545ccd908835d070))

### Bug Fixes

- **\_FrameStatblock.vue:** Remove duplicated Repair Cap statblock ([ef00730](https://github.com/jarena3/compcon/commit/ef00730476c62b7ab7990449e9e743d9675d80e1)), closes [#607](https://github.com/jarena3/compcon/issues/607)
- **CCReserveItem.vue:** Corrected bad layout spacing ([4325b5a](https://github.com/jarena3/compcon/commit/4325b5a5bc631890cc6a7936a35080370600306e)), closes [#594](https://github.com/jarena3/compcon/issues/594)
- **CloudImport.vue:** Retain CloudID on import to allow cloud update ([6de7ed8](https://github.com/jarena3/compcon/commit/6de7ed80bf89fd3ce055d0c9ce8dc9ddc0b04944))
- **CloudImport.vue:** set cloudID if pilot's is empty ([57ae9aa](https://github.com/jarena3/compcon/commit/57ae9aa2d0abb3772990be804609c47da48449a1))
- **GM Panel Lists:** Fixed items being hidden by default pagination ([64c8943](https://github.com/jarena3/compcon/commit/64c89435f2046afdb6d94a8b40fceba41125b65b)), closes [#599](https://github.com/jarena3/compcon/issues/599)
- **Mission.ts:** Corrected Step validation for Rest ([c921b16](https://github.com/jarena3/compcon/commit/c921b16d2a841d110a65ecf92c12cbecd5aa63c7)), closes [#601](https://github.com/jarena3/compcon/issues/601)
- **NPC Feature Selector:** Allowed reselectable Base Features ([6190eab](https://github.com/jarena3/compcon/commit/6190eab10fd62115d94ff636e4157fb88c51f603)), closes [#569](https://github.com/jarena3/compcon/issues/569)
- **Pilot.tx:** Corrected gist handling for cloud loading ([18e4fc1](https://github.com/jarena3/compcon/commit/18e4fc124592d50430fa5c2368e68d4ab8338d6c))
- **Template Selector:** Hide "Optional Features" title if there aren't any ([3755616](https://github.com/jarena3/compcon/commit/3755616b002b91e28e114ffdd2ac58f02e941353)), closes [#579](https://github.com/jarena3/compcon/issues/579)

### [2.0.1](https://github.com/jarena3/compcon/compare/v2.0.0...v2.0.1) (2020-02-04)

### Bug Fixes

- **Active Sheet/Counters Block:** Changed counter styling to support smaller views ([50b079d](https://github.com/jarena3/compcon/commit/50b079d39f19eaf5dffa4563648a38c6dcca4059)), closes [#590](https://github.com/jarena3/compcon/issues/590)
- **NPC/Encounter/Mission Lists:** Instantiate \_campaign properties as null ([4275c17](https://github.com/jarena3/compcon/commit/4275c1785977cd8b1a5b6a3bde638c7164c044e7)), closes [#568](https://github.com/jarena3/compcon/issues/568)
- **Pilot.ts:** Forced cloned mechs to start as inactive ([2dcfa9c](https://github.com/jarena3/compcon/commit/2dcfa9cbcfd65542a62a2fffabd927f873417d19)), closes [#570](https://github.com/jarena3/compcon/issues/570)
- **Pilot.ts, Level/Core Bonus:** Corrected core bonus eligibility check ([76493fc](https://github.com/jarena3/compcon/commit/76493fcf2f9ffb6be588b3f03774cbd8efeb699b)), closes [#582](https://github.com/jarena3/compcon/issues/582)
- **SizeAttribute.vue:** Corrects size view editable status ([c862e8e](https://github.com/jarena3/compcon/commit/c862e8e0b4e9a78ec3471579332c5ba70e6f4756)), closes [#572](https://github.com/jarena3/compcon/issues/572)
- Check weapon mods when doing AI count ([dd458d1](https://github.com/jarena3/compcon/commit/dd458d1a73851d3efc963249fe688867e8a524ff))
- NPC difficulty display and weapon type on cards ([1c5fab7](https://github.com/jarena3/compcon/commit/1c5fab7422053107f372ff6691103e25260d4058))
- Show tags on NPC Trait cards. ([66859b2](https://github.com/jarena3/compcon/commit/66859b28ddeae8ef4fd763fa2315168404916ce7))

## 2.0.0 (2020-02-03)

### ⚠ BREAKING CHANGES

- **compendium:** BREAKS COMPATIBILITY with lancer-data pre Eranziel update on 2020/01/21

### Features

- add global notifier ([21508b9](https://github.com/jarena3/compcon/commit/21508b91636a5acf058391f6b1d24ea502fd6d47))
- add util/sleep function ([fefc5e5](https://github.com/jarena3/compcon/commit/fefc5e50e776197b7f5e0347d6ee52778b2ada59))
- Editable UserID to allow cloud import ownership ([428e648](https://github.com/jarena3/compcon/commit/428e648a57819642e57a31558c343cfe211b546c))
- Generate version string based on environment ([e45709a](https://github.com/jarena3/compcon/commit/e45709abcdd6dc0c7cce1d734b4b9d18a34be1b6))
- **global-notifier:** add onClick callback to notifications ([9977ca5](https://github.com/jarena3/compcon/commit/9977ca5fdfb2400322b8e24b3fafa545751494a2))
- Show Netlify build commit hash in main menu ([d7d8606](https://github.com/jarena3/compcon/commit/d7d86062818cb06fea08d477c8e76c9b5972a291))
- **homebrew:** generate homebrew item ids ([fc7c151](https://github.com/jarena3/compcon/commit/fc7c151e1b4a3d93f9cd72156bf174e51379f570))
- **mainmenu:** add loading prop to mainbtn ([ea36702](https://github.com/jarena3/compcon/commit/ea36702362134ca265fc36282ead6e9466b4a31a))
- **pilotmanagement:** refactor and clean up pilot import dialogs ([3424421](https://github.com/jarena3/compcon/commit/342442174a8ab8db16d43a764702960be18cc4dd))

### Bug Fixes

- **GlobalNotifier.vue:** readd container ([625d261](https://github.com/jarena3/compcon/commit/625d26154ffa9a4eeb91f79ef16f2c6c0fa8b4be))
- **GlobalNotifier.vue:** remove unnecessary container ([a1d09b2](https://github.com/jarena3/compcon/commit/a1d09b278faccde4cf34f0f93e93689106b3307c))
- **GlobalNotifier.vue:** remove unnecessary container ([02ee39b](https://github.com/jarena3/compcon/commit/02ee39b7b155c9608f16829d47878ab2ca5ab8c5))
- **io/Dialog.ts:** fix csv mimetype in saveFile function ([c8d646f](https://github.com/jarena3/compcon/commit/c8d646fa244e4b12f838df17c208a04203b7d066))
- **Mech.ts:** fix going over SP limit producing underSP warning ([664dde2](https://github.com/jarena3/compcon/commit/664dde262c2849d3f5c2281367fcce109b1aed6d))
- **NotificationSnackbar:** do not bubble click event from dismiss button ([be1d02c](https://github.com/jarena3/compcon/commit/be1d02c8538706139fbb50cbdf63b0cb544cd2e2))
- **NotificationSnackbar:** fix dismiss on timeout ([675c1fe](https://github.com/jarena3/compcon/commit/675c1fedb7d432a88c6f1038a8a4d4c619723f28))
- add shim for \$notify ([02636ce](https://github.com/jarena3/compcon/commit/02636ce7ab403de092a58edc7b2b635c0631367c))
- Core passive display formatting in mech hangar ([f08445a](https://github.com/jarena3/compcon/commit/f08445af217059a8f331289a604de27b2f277a13))
- Core passive display formatting in mech hangar ([668fafa](https://github.com/jarena3/compcon/commit/668fafad3d57c9f14f2be80c58f04f02a49df3c1))
- Fix default value for counters ([1ec407a](https://github.com/jarena3/compcon/commit/1ec407ae4cab2fc0fc0fcd6a9c05a7036dc30037))
- Fix size 1/2 icon conditions ([dd9a0ed](https://github.com/jarena3/compcon/commit/dd9a0ed02e6d0793c8922253d1079a7d138a3252))
- License requirements and active mode status tooltips ([52c99a1](https://github.com/jarena3/compcon/commit/52c99a1d2e472315a7929dd62223db30fee52dca))
- make travis happy ([d3f24ab](https://github.com/jarena3/compcon/commit/d3f24ab85f4a2c2e4d84487d2a5b792c20305ec3))
- rearrange mixins to properly reference on `this` ([2961d8c](https://github.com/jarena3/compcon/commit/2961d8c2925fe04710281965a317fdc5e39d0a7c))
- revert bad type config of vue-mousetrap ([84f5d47](https://github.com/jarena3/compcon/commit/84f5d477f4b541ecca783d606489c4c78b9463cb))
- **activemode:** Fix counters ([404fea2](https://github.com/jarena3/compcon/commit/404fea29f8aed7e73429726b20627fd1070d525c))
- revert bad type config of vue-mousetrap ([930de6d](https://github.com/jarena3/compcon/commit/930de6de1e3b7851bfff453d9959e2f1d839a0f5))
- revert manufacturer id fix ([03c84c6](https://github.com/jarena3/compcon/commit/03c84c6cdea8a9758444a6f5e308732277671346))
- use short hash in main menu commit ref ([8af7784](https://github.com/jarena3/compcon/commit/8af778468844185a8467e3bab13683859e9a3b82))
- **homebrew:** fix pack installer having blue background ([77bb289](https://github.com/jarena3/compcon/commit/77bb28969f63fc6bbfd661171dcb02a56cd31042))
- **homebrew:** properly set IDs of homebrew items ([3c2ebc1](https://github.com/jarena3/compcon/commit/3c2ebc11419a26924e07987c195c29a116473e6a))
- **homebrew:** temporary fix for manufacturer.Short property ([bc93d37](https://github.com/jarena3/compcon/commit/bc93d37ae61588dc674a17cc4bfe3e01768f8602))
- **interface:** add a proper interface for tag data ([852dc38](https://github.com/jarena3/compcon/commit/852dc380f9d584c6b6b9f82550e30dd178dd1d32))
- **io/data:** switch to PromisifyFileReader ([1e51a0c](https://github.com/jarena3/compcon/commit/1e51a0c519aba28d4df4822086ab196c5f1972e7))
- **mainmenu:** silence scrollIntoView errors ([964488e](https://github.com/jarena3/compcon/commit/964488efc0094908730b0e669a31005dd8cd9f36))
- **pilotmanagement:** CCMechSkillsSelector - scroll to bottom when done ([d74d085](https://github.com/jarena3/compcon/commit/d74d085268e53a25f66f0ea83bbf92dcf4b2d329))
- **pilotmanagement:** fix incorrect prop in new pilot confirm page ([03f1813](https://github.com/jarena3/compcon/commit/03f1813899660d697e81251a773a08d36319af1e))
- **pilotmanagement:** fix table view pilot links not working ([1f734d4](https://github.com/jarena3/compcon/commit/1f734d4d16dee36742d40b1a8f386675a2b3ea92))
- **pilotmanagement:** fix talent selector ([5137e2c](https://github.com/jarena3/compcon/commit/5137e2c839af5815426505e31061d75541c60fec))
- **pilotsheet:** fix level up button showing during level up ([8d85ee8](https://github.com/jarena3/compcon/commit/8d85ee87bdcca12783d68c4f0d9be40972d48217))
- **vuex:** remove public modifier from store getters ([a5cea42](https://github.com/jarena3/compcon/commit/a5cea426b138a280ca021ad805162dfbf14170c3))
- remove vuetify theme typing to fix build failure ([abed7d4](https://github.com/jarena3/compcon/commit/abed7d42f9598e2f70fc42b150e34dc1aab65c86))
- **compendium:** switch back to manufacturer.ID from .Short ([d99a1bc](https://github.com/jarena3/compcon/commit/d99a1bc366cd8ca584a1be00dc15de4129cb9faf))
- **compendium:** switch back to manufacturer.ID from .Short ([8efc801](https://github.com/jarena3/compcon/commit/8efc80177361927b7b2f6a7dbc1fa4efc7de7504))
