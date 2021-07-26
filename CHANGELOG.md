# COMP/CON Changelog

## [2.2.27](https://github.com/massif-press/compcon/compare/2.2.25...v2.2.26) (2021-07-16)

### Features

* **Mobile View** The remainder of the pilot-side app has been adapted to mobile view v1, closes [#300](https://github.com/massif-press/compcon/issues/300)
* **Mech Sheet** Add weapon size tooltips to mech mounts (thank you to tmncx0! First PR! 🎉)

### Bug Fixes

* **Pilot Roster:** Fixes a bug where cloned or duplicated pilots were incorrectly preserving their Vault links to other users, closes [#1546](https://github.com/massif-press/compcon/issues/1546)
* **Pilot Roster:** fix editing NPC Feature Names & Descriptions (thank you to Valkyrion! First PR! 🎉)
* **Pilot Roster:** fix missing pilot weapon equip button in list mode (also Valkyrion!)

## [2.2.26](https://github.com/massif-press/compcon/compare/2.2.25...v2.2.26) (2021-07-16)

### Hotfix (7/19/21)

* **Cloud Storage** Corrected vault storage issue that was preventing remotely-linked vault data from being correctly assigned to an account. This should fix missing remote data when moving to new devices, closes [#1537](https://github.com/massif-press/compcon/issues/1537)

### Bug Fixes

* **Changelog:** Rebuilt COMP/CON Changelog. Old log can be found at CHANGELOG_old.md, closes [#1511](https://github.com/massif-press/compcon/issues/1511)
* **Cloud Storage:** Fix syncing issues with COMP/CON Account Vault contents, closes [#1488](https://github.com/massif-press/compcon/issues/1488) [#1503](https://github.com/massif-press/compcon/issues/1503)
* **Active Mode:** Corrects an issue with duplicate deployment systems [#1520](https://github.com/massif-press/compcon/issues/1520) 
* **Active Mode:** Fixes an issue preventing the "skirmish" weapon profile property from working, allowing for eg. Leviathan skimish attacks in spin-down mode [#1481](https://github.com/massif-press/compcon/issues/1481)

### Features

* **Pilot Roster:** Rework Vault interface UI, closes [#1456](https://github.com/massif-press/compcon/issues/1456)
* **Pilot Sheet:** Decouples extra Core Bonus points from License-based Core Bonus requirements [#1523](https://github.com/massif-press/compcon/issues/1523)
