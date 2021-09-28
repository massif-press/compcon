# COMP/CON Changelog
## [2.2.31] (2021-08-27)

### Features
* **Global** Add additional LCP indicators (thanks, TranslucentSabre!) [#1649](https://github.com/massif-press/compcon/issues/1649)
* **Pilot Sheet** Add more Mech names (thanks ArcanErasmus ! First PR! 🎉) [#1649](https://github.com/massif-press/compcon/issues/1649)

### Bug Fixes

* **Pilot Roster** Upgrade pilot importing when pilots are in groups (thanks, msprijatelj!) [#1651](https://github.com/massif-press/compcon/issues/1651)
* **Pilot Sheet** Correct serialization of WeaponUses (thanks, msprijatelj!) [#1649](https://github.com/massif-press/compcon/issues/1649)
* **Pilot Sheet** cast Tag vals as numbers, use profile tags (thanks, msprijatelj!) [#1655](https://github.com/massif-press/compcon/issues/1655)


## [2.2.30] (2021-08-27)

### Bug Fixes

* **Pilot Roster** Clarify version mismatch import errors, closes [#1646](https://github.com/massif-press/compcon/issues/1646)
* **Compendium** Corrected display of LCP SVG graphics (thanks msprijatelj!), closes [#1618](https://github.com/massif-press/compcon/issues/1618)
* **Active Mode** Sync data at the end of each turn (thanks TranslucentSabre!), closes [#1621](https://github.com/massif-press/compcon/issues/1621) [#1622](https://github.com/massif-press/compcon/issues/1622)
* **Mech Sheet** Fixes a typo which prevented the weapon types from being displayed when printing a character's mech. (thanks TranslucentSabre!), closes [#1617](https://github.com/massif-press/compcon/issues/1617) 
* **Pilot Sheet** Adds Damage and Range to the Bombardment Reserve (thanks msprijatelj!), closes [#1629](https://github.com/massif-press/compcon/issues/1629) 
* **Mech Sheet** Enable icons on the Integrated Weapon mount for Remove/Change Item, since Integrated Weapon allows for weapon selection unlike other integrated mounts. (thanks msprijatelj!), closes [#1638](https://github.com/massif-press/compcon/issues/1638) 
* **Mech Sheet** Adds a Pilot Sheet option from the mech sheet in the nav options on mobile, bringing it in line with the desktop version. (thanks msprijatelj!), closes [#1645](https://github.com/massif-press/compcon/issues/1645) 
* **Pilot Sheet** Enable Pilot Roster reordering within groups (thanks msprijatelj!), closes [#1625](https://github.com/massif-press/compcon/issues/1625) 

## [2.2.29] (2021-08-02)

Huge thanks to TranslucentSabre and msprijatelj!

### Features

* **Active Mode** Auto-roll some dice in Active Mode (thanks TranslucentSabre!), closes [#1551](https://github.com/massif-press/compcon/issues/1551)

### Bug Fixes

* **Active Mode** Fix Pilot HP setting UI, closes [#1616](https://github.com/massif-press/compcon/issues/1616)
* **Content Manager** Fix name and version sorting in the Content Manager, closes [#1596](https://github.com/massif-press/compcon/issues/1596)
* **Mech Sheet** Add tooltips to the Mech Sheet Nav bar buttons (thanks Macrophaje! First PR! 🎉), closes [#1615](https://github.com/massif-press/compcon/issues/1615)
* **Mission Runner** Allow for overwriting active mech on a synced pilot (thanks TranslucentSabre!), closes [#1612](https://github.com/massif-press/compcon/issues/1612)
* **Vault** Correctly handle case in vault codes (thanks TranslucentSabre!), closes [#1606](https://github.com/massif-press/compcon/issues/1606)
* **Compendium** Load static images for homebrew manufacturers (thanks msprijatelj!), closes [#1598](https://github.com/massif-press/compcon/issues/1598)
* **Pilot Sheet** Allow LL0 Pilots to select bonus skill triggers (thanks msprijatelj!), closes [#1602](https://github.com/massif-press/compcon/issues/1602)
* **Pilot Sheet** Allow scroll-on-click behavior for LL0 Pilot selectors (thanks msprijatelj!), closes [#1608](https://github.com/massif-press/compcon/issues/1608)
* **Pilot Sheet** Fix Skill Focus (thanks msprijatelj!), closes [#1589](https://github.com/massif-press/compcon/issues/1589)
* **Mech Sheet** Correct stat scaling when max stat increases via Bonuses (thanks msprijatelj!), closes [#1586](https://github.com/massif-press/compcon/issues/1586)


## [2.2.28](2021-08-02)

A massive thanks to Valkyrion for the massively helpful bug squashing this week! All features and fixes this update are theirs unless otherwise noted.

### Features

* **Compendium** Changes the default sort of compendium entries for Mech-related items (frames, systems, and weapons) to book order of the manufacturers, for consistency with the Manufacturers, Licenses, and Core Bonuses pages, closes [#1496](https://github.com/massif-press/compcon/issues/1496)
* **Pilot Sheet** Ensure sync on Pilot level-up, closes [#1574](https://github.com/massif-press/compcon/issues/1574)
* **Pilot Sheet** Ensure sync on theme change, closes [#1450](https://github.com/massif-press/compcon/issues/1450)
* **Global** Display LCP info where possible (thanks TranslucentSabre!) , closes [#1571](https://github.com/massif-press/compcon/issues/1571)

### Bug Fixes

* **Pilot Sheet** Disables the add-custom-skill button when the pilot cannot select more skills, closes [#1580](https://github.com/massif-press/compcon/issues/1580)
* **Misc** Fixes the image-selector component incorrectly referencing a webhosted image as a local resource, closes [#1439](https://github.com/massif-press/compcon/issues/1439)
* **Pilot Sheet** Fixes an issue that prevented the Prototype Weapon from dynamically updating, closes [#1533](https://github.com/massif-press/compcon/issues/1533)
* **Pilot Sheet/Mech Sheet** Initalizes some tracked values to ensure they update dynamically, closes [#1569](https://github.com/massif-press/compcon/issues/1569)
* **Compendium** Fix an issue that was preventing homebrew tags from functioning correctly on profiled weapons, closes [#1482](https://github.com/massif-press/compcon/issues/1482)
* **Pilot Sheet** Fixes view scrolling on Talent selections, closes [#1566](https://github.com/massif-press/compcon/issues/1566)
* **Pilot Sheet** Fixes view scrolling on Background selections, closes [#1561](https://github.com/massif-press/compcon/issues/1561)
* **Pilot Sheet** Fixes 'Focus' Reserve to correctly grant skill trigger, closes [#1549](https://github.com/massif-press/compcon/issues/1549)
* **Pilot Sheet** Correctly display Overpower Caliber in the export text block, closes [#1483](https://github.com/massif-press/compcon/issues/1483)
* **Pilot Sheet** Re-orients Talent tooltips, closes [#1560](https://github.com/massif-press/compcon/issues/1560)
* **Compendium** Remove 'Loading' from Barbarossa's Direct Fire, closes [#1565](https://github.com/massif-press/compcon/issues/1565)
* **Active Mode** Correctly reset Orochi drones on Rest or Full Repair (beef), closes [#1577](https://github.com/massif-press/compcon/issues/1577)

## [2.2.27] (2021-07-16)

### Features

* **Mobile View** The remainder of the pilot-side app has been adapted to mobile view v1, closes [#300](https://github.com/massif-press/compcon/issues/300)
* **Mech Sheet** Add weapon size tooltips to mech mounts (thank you to tmncx0! First PR! 🎉)

### Bug Fixes

* **Pilot Roster:** Fixes a bug where cloned or duplicated pilots were incorrectly preserving their Vault links to other users, closes [#1546](https://github.com/massif-press/compcon/issues/1546)
* **Pilot Roster:** fix editing NPC Feature Names & Descriptions (thank you to Valkyrion! First PR! 🎉)
* **Pilot Roster:** fix missing pilot weapon equip button in list mode (also Valkyrion!)

## [2.2.26] (2021-07-16)

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
