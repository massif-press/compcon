# COMP/CON Changelog

## [2.3.22] (2024-10-14)

### Features

- **GM Tools** NPC printables (thanks Suji!)
- **Pilot Creation** Suggested skills button now works (thanks again Suji!!)

## [2.3.21] (2024-03-20)

### Bug Fixes

- **Global** Minor updates and corrections to the new themes

## [2.3.20] (2024-03-11)

### Features

- **Global** Incredible new themes with tons of flavor! Huge thanks to vialra, Asger Toft, and thecrystalwoods!
- **NPC Roster** nimoooos added an excellent NPC statblock exporter
- **Equipment** vialra also cleaned up a bit of redundant code in equipment classes
- **Cloud** Subdomains are now correctly handled (thanks liam-edwards!)

## [2.3.19b] (2023-10-13)

### Bug Fixes

- **Mech Sheet** Fixed a bug preventing the installation of mods on mechs created pre-2.3.19

## [2.3.19a] (2023-10-13)

### Bug Fixes

- **Cloud Storage** Fixed a bug that would erroneously erase local data when deleting cloud data.

## [2.3.19] (2023-10-10)

### Features

- **Global** Added support for upcoming LANCER content
- **Mech Sheet** Added support for generalized mount bonuses (thanks Melted-Gallium!) [#1992](https://github.com/massif-press/compcon/pull/1992)
- **Encounter Runner** Added support for NPC activation management (thanks super-salad!) [#2156](https://github.com/massif-press/compcon/pull/2156)

### Bug Fixes

- **Print** Fix some systems not appearing in printed output (thanks ThamasMC!) [#2285](https://github.com/massif-press/compcon/pull/2285)
- **Compendium** Fix license-based filters [#2308](https://github.com/massif-press/compcon/pull/2308)
- **Pilot Sheet** Correct license unlock display [#2296](https://github.com/massif-press/compcon/pull/2296)

## [2.3.18] (2023-8-5)

### Features

- **Content Manager** Backported v3 LCP dependency functionality to allow for LCPs to depend on other LCPs

## [2.3.17a] (2023-7-26)

### Bug Fixes

- **Pilot Sheet** Corrected a lancer-data dependency

## [2.3.17] (2023-7-21)

### Bug Fixes

- **Active Mode** Fix Talent actions not correctly repopulating in Active Mode (thanks TheQuazman!) [#2246](https://github.com/massif-press/compcon/pull/2246)
- **Active Mode** Fix feature usage for NPCs (thanks TheQuazman!) [#2250](https://github.com/massif-press/compcon/issues/2250)
- **Active Mode** Fix integrated weapon getter for Barrage actions (thanks TheQuazman!) [#2254](https://github.com/massif-press/compcon/issues/2254)
- **Statblock** Fix mech statblock integrated weapons (thanks TheQuazman!) [#2256](https://github.com/massif-press/compcon/issues/2256)
- **General** Fix Mimic Gun in-table behavior (thanks Hawkzed!) [#2258](https://github.com/massif-press/compcon/issues/2258)
- **Compendium** Add license level filtering (thanks TheQuazman!) [#2169](https://github.com/massif-press/compcon/issues/2169)
- **Image Selector** Fix non-loading image preview for remote image URLs [#2280](https://github.com/massif-press/compcon/issues/2280)
- **General** Fix FABI Mod name (and other long item names) breaking mobile view [#2252](https://github.com/massif-press/compcon/issues/2252)
- **Pilot Sheet** Ensure pilot notes textbox auto-scaled [#2262](https://github.com/massif-press/compcon/issues/2262)

### Features

- **Active Mode** Adds "Return Fire" Reaction UI (thanks TheQuazman!) [#2261](https://github.com/massif-press/compcon/issues/2261)
- **Encounter Runner** Adds NPC Statblock Generator (thanks TheQuazman!) [#2179](https://github.com/massif-press/compcon/issues/2179)
- **Licenses** Allow for GMS items with License Levels in LCPs (thanks Melted-Gallium!) [#1747](https://github.com/massif-press/compcon/issues/1747)
- **Licenses** Allow for gear slot extensions in LCP bonus data (thanks Melted-Gallium!) [#1747](https://github.com/massif-press/compcon/issues/1747)

## [2.3.16] (2023-5-25)

### Bug Fixes

- **LCP Directory** Fix incorrect version comparison (thanks msprijatelj!) [#2235](https://github.com/massif-press/compcon/issues/2235)
- **Pilot Sheet** Fix exposed code in pilot gear selector [#2234](https://github.com/massif-press/compcon/issues/2234)
- **Encounter Builder** Fix a bug preventing map images from saving [#2245](https://github.com/massif-press/compcon/issues/2245) [#2182](https://github.com/massif-press/compcon/issues/2182) [#2069](https://github.com/massif-press/compcon/issues/2069)

## [2.3.15a] (2023-5-18)

### Bug Fixes

- **Content Packs** Add missing LCP trigger importer

## [2.3.15] (2023-5-18)

### Features

- **Global** Backported the v3 image management functions. Users with cloud accounts can now upload images to the cloud and use them in COMP/CON, limited to 250mb (for now) This feature is still in beta, so please report any issues you encounter! If not, or if you exceed the limit, a remote image can be used instead.

### Bug Fixes

- **Pilot Sheet** Fixed a -- hopefully final! -- bug where LCP custom and/or variant frames were not correctly loading in to the Select Frame menu
- **Content Manager** Fixed a bug preventing C/C from recognizing Massif pack version numbers [#2235](https://github.com/massif-press/compcon/issues/2235)
- **Compendium** Fixed a bug causing pilot gear to expose code in table and card views [#2234](https://github.com/massif-press/compcon/issues/2234)
- **Mech Sheet** Fixed a bug related to Dustgrave's Superheavy Core Bonus that let users stack duplicate Core Bonuses [#2231](https://github.com/massif-press/compcon/issues/2231)
- **Mech Sheet** Fixed a bug related to Dustgrave's Superheavy Core Bonus that would persist a mount lock if the Core Bonus was removed while the lock was still active [#2230](https://github.com/massif-press/compcon/issues/2230)

## [2.3.14d] (2023-5-17)

- **Pilot Sheet** Fourth time's the charm

## [2.3.14c] (2023-5-16)

- **Pilot Sheet** Hotfixed (another) issue where Licenses weren't being collected correctly for LCP content that didn't have license_ids

## [2.3.14b] (2023-5-16)

- **Pilot Sheet** Hotfixed an issue where Licenses weren't being collected correctly for LCP content

## [2.3.14a] (2023-5-16)

- **Global** Image management has been largely disabled while I work on backporting a v3 feature to improve reliability and performance as Imgur changes its policies. This will be re-enabled in a near future release.

## [2.3.14] (2023-5-10)

### Features

- **Cloud Snyc** Backported a piece of the v3 cloud sync functionality to improve reliability and performance

### Bug Fixes

- **Cloud Sync** Fixed a bug that could prevent the correct user theme from being loaded
- **Content Manager** Fixed a bug preventing deletion of uninitialized NPCs
- **Mech Hangar** Fixed a case issue causing otherwise valid Core Bonuses to be ignored [#2235](https://github.com/massif-press/compcon/issues/2235)

## [2.3.13a] (2023-5-3)

### Bug Fixes

- **NPC Roster** Fixed a bug preventing NPCs from correctly saving or loading in certain cases

## [2.3.13] (2023-5-1)

- **Pilot Roster/Mech Hangar** Added support for upcoming Dustgrave content
- **Printables** Fixed pilot gear print output

## [2.3.12a] (2023-4-25)

### Bug Fixes

- **Pilot Loadout** Hotfixed an issue related to Pilot Armor bonuses breaking Pilot loadouts [#2227](https://github.com/massif-press/compcon/issues/2227)
- **Pilot Profile** Hotfixed an issue related to imported pilot callsigns getting unnecessarily truncated [#2223](https://github.com/massif-press/compcon/issues/2223)

## [2.3.12] (2023-4-13)

### Other

Automatic cloud saving has been temporarily disabled while persistent issues are resolved

### Bug Fixes

- **NPC Roster** Fix NPC Class sorting (thanks NicholasBreazeale!) [#840](https://github.com/massif-press/compcon/issues/840)
- **Active Mode** Fix combat log HP/Heat tracking (thanks TesserWract!) [#1994](https://github.com/massif-press/compcon/issues/1994) [#1995](https://github.com/massif-press/compcon/issues/1995)
- **Compendium** Collect packnames from LCP directly (thanks msprijatelj!) [#2206](https://github.com/massif-press/compcon/issues/2206)
- **Global** Ensure Synergies collect unique elements (thanks TesserWract!) [#1968](https://github.com/massif-press/compcon/issues/1968)
- **Cloud** Improve cloud save functionality (thanks Hawkzed!) [#2124](https://github.com/massif-press/compcon/issues/2124)

### Features

- **Compendium** Significantly enhance Compendium search feature (thanks super-salad!)
- **Compendium** Allow for unrestricted weapon mods when the unrestricted toggle is on (thanks Tidomann!) [#2180](https://github.com/massif-press/compcon/issues/2180)
- **Mech Hangar** Allow weapons to specify an alternate type and size for mods [#2180](https://github.com/massif-press/compcon/issues/2180)
- **Compendium** Allow Frames to be sorted by size [#2195](https://github.com/massif-press/compcon/issues/2195)

## [2.3.11] (2022-10-3)

### Bug Fixes

- **Data** Various fixes and corrections (thanks lenaleciel, msprijatelj)
- **Mech Hangar** Corrects buggy loadout saving (thanks msprijatelj!) [#2138](https://github.com/massif-press/compcon/issues/2138)
- **Compendium** Updates Pilot Gear headers (thanks msprijatelj!) [#2141](https://github.com/massif-press/compcon/issues/2141)
- **Compendium** Enable NPC search by class (thanks super-salad!) [#2102](https://github.com/massif-press/compcon/issues/2102)
- **Compendium** Improve email validation regex (thanks super-salad!) [#2119](https://github.com/massif-press/compcon/issues/2119) [#2128](https://github.com/massif-press/compcon/issues/2128)
- **Active Mode** Fix Full Tech usage (thanks super-salad!) [#2088](https://github.com/massif-press/compcon/issues/2088) [#2093](https://github.com/massif-press/compcon/issues/2093) [#2094](https://github.com/massif-press/compcon/issues/2094)
- **Misc** Redirect help page to new Wiki troubleshooter (thanks msprijatelj!) [#2110](https://github.com/massif-press/compcon/issues/2110)
- **Misc** Prevent refresh on v-form submit(thanks msprijatelj!) [#2122](https://github.com/massif-press/compcon/issues/2122)
- **Mech Hangar** Add toggle for system reorder (thanks super-salad!) [#2095](https://github.com/massif-press/compcon/issues/2095)

### Features

- **Statblock** Improve output capitalization (thanks msprijatelj!)

## [2.3.10] (2022-8-11)

### Bug Fixes

- **Sign In** require e-mail for verification code functions (thanks super-salad!) [#2061](https://github.com/massif-press/compcon/issues/2061)
- **UI** Remove references to Roll20 (thanks msprijatelj!)
- **Active Mode** Filter actions based on LCP Active status (thanks super-salad!) [#2025](https://github.com/massif-press/compcon/issues/2025) [#2076](https://github.com/massif-press/compcon/issues/2076)
- **Pilot Mode** use Pilot as MechSkillController.Parent (thanks msprijatelj!) [#2070](https://github.com/massif-press/compcon/issues/2070)
- **Active Mode** fix indestructible tag typo (thanks msprijatelj!) [#2066](https://github.com/massif-press/compcon/issues/2066)
- **Cloud Syncing** fix permanent deletion function [#2074](https://github.com/massif-press/compcon/issues/2074) [#1977](https://github.com/massif-press/compcon/issues/1977) [#1976](https://github.com/massif-press/compcon/issues/1976)
- **Pilot Mode** improve Bond saving reliability [#2055](https://github.com/massif-press/compcon/issues/2055)

### Features

- **Mech Hangar** Add editable system order (thanks super-salad!) [#1828](https://github.com/massif-press/compcon/issues/1828)
- **Mech Hangar** Add "redeploy" action to deployables (thanks msprijatelj!)

## [2.3.9] (2022-6-27)

### Bug Fixes

- **Mech Sheet** Mechs should now correctly save changed equipment on reload/when logged out. Thanks to msprijatelj for the help! [#1989](https://github.com/massif-press/compcon/issues/1989)
- **Active Mode** Correct a bug that was preventing all actions from being populated and not respecting their correct use state [#2005](https://github.com/massif-press/compcon/issues/2005) [#2037](https://github.com/massif-press/compcon/issues/2037)
- **Help Menu** Update help menu options [#2001](https://github.com/massif-press/compcon/issues/2001)
- **Active Mode** Improve Overcharge Pip determination (thanks msprijatelj!)
- **Cloud** Improve sign-up/in reliability (thanks msprijatelj!)
- **Pilot Sheet** Fixed failing import for Pilots with Bond data being imported into environments without the KTB LCP installed [#2007](https://github.com/massif-press/compcon/issues/2007)

### Features

- **Global** Improved Keyboard accesibility ((thanks Qazzquimby! First PR! 🎉) [#1557](https://github.com/massif-press/compcon/issues/1557)
- **Pilot Sheet** Revised Statblock Generator (thanks karidyas!) [#1887](https://github.com/massif-press/compcon/issues/1887)
- **LCP Importer** Humanize Reserves/Factions (thanks msprijatelj!) [#1557](https://github.com/massif-press/compcon/issues/1557)
- **Nav** Add Help Icon, FAQ links, style fixes (thanks msprijatelj!) [#2033](https://github.com/massif-press/compcon/issues/2033)

## [2.3.8] (2022-5-9)

### Bug Fixes

- **Pilot Sheet** Changed Bonds page to better reflect the KTB update [#1985](https://github.com/massif-press/compcon/issues/1985) [#1937](https://github.com/massif-press/compcon/issues/1937) [#1920](https://github.com/massif-press/compcon/issues/1920)
- **Compendium** Fix Compendium item card spacing (thanks msprijatelj!) [#1986](https://github.com/massif-press/compcon/issues/1986)
- **Mech Sheet** Mech nav returns to Tactical Profile instead of Narrative (thanks karidyas! First PR! 🎉 ) [#1973](https://github.com/massif-press/compcon/issues/1973)

## [2.3.7] (2022-4-25)

### Bug Fixes

- **Pilot Sheet** Prevent remote pilots from regenerating share codes (thanks msprijatelj!) [#1970](https://github.com/massif-press/compcon/issues/1970)
- **Mech Sheet** Fix equipment from taking a default custom name [#1973](https://github.com/massif-press/compcon/issues/1973)
- **Active Mode** Fix GetOrganized behavior (thanks super-salad! First PR! 🎉 ) [#1973](https://github.com/massif-press/compcon/issues/1973)
- **Pilot Roster** Fix Remote pilots getting incorrectly flagged for deletion [#1961](https://github.com/massif-press/compcon/issues/1961)

## [2.3.6] (2022-4-21)

### Features

- **Mech Sheet** Better Tag display for multi-profile weapons [#1959](https://github.com/massif-press/compcon/issues/1959)
- **Mech Hangar** AND logic for frame filtering (thanks msprijatelj!) [#1966](https://github.com/massif-press/compcon/issues/1966)
-

### Bug Fixes

- **Active Mode** Fix reserve bonuses not being added correctly (thanks TranslucentSabre!) [#1819](https://github.com/massif-press/compcon/issues/1819)
- **Pilot Sheet** Serialize Pilot Gear correctly (thanks msprijatelj!) [#1948](https://github.com/massif-press/compcon/issues/1948)
- **Main Menu** Fix Main Menu log spacing (thanks msprijatelj!)
- **Pilot Sheet** Change Share icon to get around some aggressive adblockers
- **Pilot Roster** Add Share Dialog to pilot options menu [#1955](https://github.com/massif-press/compcon/issues/1955)
- **Active Mode** Fix Bonuses not being applied to Deployables [#1953](https://github.com/massif-press/compcon/issues/1953)
- **Cloud Account** Enforce lowercase e-mails, retry failed calls with enforced lowercase [#1960](https://github.com/massif-press/compcon/issues/1960) [#1951](https://github.com/massif-press/compcon/issues/1951)
- **Mech Sheet** Fix Integrated Equipment loading and serialization [#1952](https://github.com/massif-press/compcon/issues/1952) [#1915](https://github.com/massif-press/compcon/issues/1915)

## [2.3.5] (2022-4-18)

### Bug Fixes

- **Pilot/Mech Sheet** Fix reserve bonuses not being added correctly (thanks msprijatelj!) [#1938](https://github.com/massif-press/compcon/issues/1938)
- **Pilot Sheet** Initialize Pilot Gear correctly (thanks msprijatelj!) [#1840](https://github.com/massif-press/compcon/issues/1840)
- **LCP Importer** Add Bonds to human-readable map (thanks msprijatelj!)
- **NPC Sheet** Fix NPC Images [#1945](https://github.com/massif-press/compcon/issues/1945)
- **Mech Sheet** Fix Integrated equipment losing state [#1915](https://github.com/massif-press/compcon/issues/1915)

## [2.3.4] (2022-4-15)

### Features

- **Active Mode** Add option to complete mission without saving combat telemetry [#1825](https://github.com/massif-press/compcon/issues/1825)

### Bug Fixes

- **Various** A handful of hotfixes to correct bugs.
- **Mech Sheet** "Sourceless" logos should no longer display a broken image [#1842](https://github.com/massif-press/compcon/issues/1842)
- **Pilot Sheet** Pilot gear custom data changes should now correctly save in all cases [#1840](https://github.com/massif-press/compcon/issues/1840)
- **Compendium** Item filters now respect weapon profile tags [#1821](https://github.com/massif-press/compcon/issues/1821)
- **Pilot Sheet** Fix missing HASE reset method [#1924](https://github.com/massif-press/compcon/issues/1924)
- **Pilot Sheet** Initialize Bond ideal and answer fields [#1923](https://github.com/massif-press/compcon/issues/1923)
- **Pilot Sheet** Fix LL0 Bond warning from blocking classic sheet view [#1922](https://github.com/massif-press/compcon/issues/1922)
- **Pilot Sheet** Talent view setting now saves [#1921](https://github.com/massif-press/compcon/issues/1921)
- **Log-In Process** Make Verification/Lost Password more visible [#1864](https://github.com/massif-press/compcon/issues/1864)
- **Pilot Roster** Preserve Pilot Group status (thanks TranslucentSabre!)
- **Encounters** Correctly display sitrep (thanks TranslucentSabre!) [#1843](https://github.com/massif-press/compcon/issues/1843) [#1886](https://github.com/massif-press/compcon/issues/1886)
- **Global** Change "Encounter" durations to "Scene" (thanks msprijatelj!) [#1894](https://github.com/massif-press/compcon/issues/1894)
- **Global** Fix missing NPC CounterController (thanks msprijatelj!)

## [2.3.3] (2022-4-14)

### Features

- **Pilot Sheet** Added Bonds UI

### Bug Fixes

- **Various** A handful of hotfixes to correct bugs.
- **Mech Sheet** Corrected a bug that prevented most synergies from being displayed [#1919](https://github.com/massif-press/compcon/issues/1919)
- **Mech Sheet** Corrected a bug with the TalentController in Active Mode [#1916](https://github.com/massif-press/compcon/issues/1916)
- **Pilot Roster** Corrected a bug that was preventing the Pilot Roster view from being changed [#1917](https://github.com/massif-press/compcon/issues/1917)

## [2.3.2] (2022-4-13)

### Features

- **Pilot Roster** Added mass pilot delete button at the bottom of the page

### Bug Fixes

- **Various** A handful of hotfixes to correct bugs.
- **Mech Sheet** Corrected an error in the Bonus controller that was preventing some mechs from being saved [#1910](https://github.com/massif-press/compcon/issues/1910)

## [2.3.1] (2022-4-12)

### Features

- **Compendium** Added tooltips to available mounts within frames Compendium (Thanks ChrstphrHll! First PR! 🎉) [#1897](https://github.com/massif-press/compcon/issues/1897)

### Bug Fixes

- **Various** A handful of hotfixes to correct bugs in the Pilot Roster, with integrated equipment, and with LCP parsing.
- **Content Manager** Added missing Reserves importer [#1899](https://github.com/massif-press/compcon/issues/1899)

## [2.3.0] (2022-4-12)

### Features

- **Global** Rebuilt Cloud Account interface and management system [#1891](https://github.com/massif-press/compcon/issues/1891) [#1870](https://github.com/massif-press/compcon/issues/1870) [#1823](https://github.com/massif-press/compcon/issues/1823) [#1804](https://github.com/massif-press/compcon/issues/1804) [#1763](https://github.com/massif-press/compcon/issues/1763) [#1776](https://github.com/massif-press/compcon/issues/1776) [#1725](https://github.com/massif-press/compcon/issues/1725) [#1724](https://github.com/massif-press/compcon/issues/1724) [#1701](https://github.com/massif-press/compcon/issues/1701)
- **Global** Added new Cloud share/share code system [#1879](https://github.com/massif-press/compcon/issues/1879)
- **Global** Added LCP analyzer to find and isolate unloadable content [#1870](https://github.com/massif-press/compcon/issues/1870) [#1811](https://github.com/massif-press/compcon/issues/1811) [#1666](https://github.com/massif-press/compcon/issues/1666) [#1599](https://github.com/massif-press/compcon/issues/1599) [#1540](https://github.com/massif-press/compcon/issues/1540) [#700](https://github.com/massif-press/compcon/issues/700)
- **Global** Added data recovery tools
- **Global** Implemented delta save scheme
- **Global** Implemented component-controller pattern in preparation for GM changes
- **Compendium** Bonds data as part of a LCP will load to the Compendium. Bonds UI is coming soon.

### Bug Fixes

- **Main Menu** Fixed bad loading cascade when dealing with theme changes [#1861](https://github.com/massif-press/compcon/issues/1861)

## [2.2.38] (2022-3-17)

### Features

- **Global** Implemented new image hosting strategy to save on bandwidth costs
- **Global** Provide Alternative Display option for CORS-compliant SVGs (thanks, msprijatelj!)[#1852](https://github.com/massif-press/compcon/issues/1852)

### Bug Fixes

- **Compendium** Various changes and fixes, thanks to msprijatelj, perijove, and lenaleciel
- **Mech** Cover optional damage/range cases (thanks, msprijatelj!)[#1876](https://github.com/massif-press/compcon/issues/1876)
- **Mech** Fix serviceworker and UI issues (thanks, msprijatelj!)[#1865](https://github.com/massif-press/compcon/issues/1865)
- **Mobile UI** Correct mobile view padding (thanks, wilt00!)[#1869](https://github.com/massif-press/compcon/issues/1869)
- **Mobile UI** Fix PWA settings (thanks, wilt00!)[#1867](https://github.com/massif-press/compcon/issues/1867)

## [2.2.37] (2022-2-21)

### Features

- **LCP** Enable new LCP metadata hosting method
- **LCP** Enable LCP Background import humanized info text (thanks, msprijatelj!)[#1858](https://github.com/massif-press/compcon/issues/1858)
- **Compendium** Change tag search logic to AND (thanks, msprijatelj!)[#1860](https://github.com/massif-press/compcon/issues/1860)

### Bug Fixes

- **Homepage** Fix bug with HORUS homepage theme (thanks, msprijatelj!)[#1829](https://github.com/massif-press/compcon/issues/1829)

## [2.2.36a] (2022-2-10)

- **Global** Re-integrate serviceworker, which will re-enable C/C's use as a PWA [#1851](https://github.com/massif-press/compcon/issues/1851), [#1853](https://github.com/massif-press/compcon/issues/1853)

## [2.2.36] (2022-1-19)

### Features

- **Global** Performance-centric overhaul of some of COMP/CON's internals. Should be a much lighter (and faster!) app now
- **Pilot Sheet** Prevented setting negative LLs (thanks msprijatelj!) [#1826](https://github.com/massif-press/compcon/issues/1826)

## [2.2.35] (2021-12-10)

Thanks to msprijatelj for these updates!

### Features

- **Pilot Sheet** add basic pilot stats to Dossier [#1765](https://github.com/massif-press/compcon/issues/1765)

### Bug Fixes

- **Pilot Sheet** fix number spacing over icons in Print mode [#1768](https://github.com/massif-press/compcon/issues/1768)
- **Pilot Sheet** block pilot registration when quickstart is off [#1762](https://github.com/massif-press/compcon/issues/1762)
- **Pilot Sheet** Refactor Pilot groups for performance & roster improvements [#1713](https://github.com/massif-press/compcon/issues/1713)[#1709](https://github.com/massif-press/compcon/issues/1709)[#1611](https://github.com/massif-press/compcon/issues/1611)

## [2.2.34] (2021-11-04)

### Features

- **Cloud** Use CSS filters to color non-svg manufacturer icons [#1757](https://github.com/massif-press/compcon/issues/1757)
- **Mech Sheet** enable all synergies for "???" type weapons [#1754](https://github.com/massif-press/compcon/issues/1754)

### Bug Fixes

- **Cloud** corrects a set of annoying (but ultimately harmless) errors when a new cloud user logs in for the first time[#1642](https://github.com/massif-press/compcon/issues/1642)
- **Mech Sheet** temporarily hide duration chips for Core Systems (thanks, msprijatelj!)[#1756](https://github.com/massif-press/compcon/issues/1756)
- **Active Mode** fix pilot HP ticker during ActiveRest (thanks, msprijatelj!)[#1753](https://github.com/massif-press/compcon/issues/1753)
- **Active Mode** fix typos in Structure and Stress references (thanks, msprijatelj!)[#1752](https://github.com/massif-press/compcon/issues/1752)
- **Active Mode** fix Full Tech Action availability[#1755](https://github.com/massif-press/compcon/issues/1755)

## [2.2.33] (2021-11-02)

### Features

- **Cloud** Update and add manual data pull from cloud, improve cloud UI (thanks, msprijatelj!)[#1745](https://github.com/massif-press/compcon/issues/1745)
- **Global** Adds some background changes for the experimental LCP editor

### Bug Fixes

- **Compendium** correct overheating table text [#1748](https://github.com/massif-press/compcon/issues/1748)
- **Active Mode** allow integrated systems to be destroyed on system trauma [#1749](https://github.com/massif-press/compcon/issues/1749)
- **Active Mode** actually repect action refresh in active mode (thanks, msprijatelj!)[#1744](https://github.com/massif-press/compcon/issues/1744)
- **Active Mode** limited uses initialize to correct maximum (thanks, msprijatelj!)[#1729](https://github.com/massif-press/compcon/issues/1729)
- **Active Mode** reset self-destruct counter on repair, mech change (thanks, msprijatelj!)[#1730](https://github.com/massif-press/compcon/issues/1730)

## [2.2.32] (2021-10-13)

Massive thanks to **msprijatelj**, who is responsible for all of the following updates, as well as a slew of LCP data

### Features

- **Pilot Sheet** Quick pilot creation mode (enable in Options) [#1707](https://github.com/massif-press/compcon/issues/1707)
- **Pilot Sheet** Improve Vault Code UX [#1696](https://github.com/massif-press/compcon/issues/1696)

### Bug Fixes

- **Global** Better manage login status [#1694](https://github.com/massif-press/compcon/issues/1694)
- **Global** Overwrite cloud data on data wipe/bulk import [#1712](https://github.com/massif-press/compcon/issues/1712)
- **Mech Hangar** Correct missing ActiveMech errors [#1699](https://github.com/massif-press/compcon/issues/1699)
- **Mech Sheet** Fix overcropped Frame art [#1693](https://github.com/massif-press/compcon/issues/1693)
- **Mech Sheet** Handle increased Mech sizes [#1688](https://github.com/massif-press/compcon/issues/1688)

## [2.2.31] (2021-09-28)

### Features

- **Global** Add additional LCP indicators (thanks, TranslucentSabre!) [#1649](https://github.com/massif-press/compcon/issues/1649)
- **Pilot Sheet** Add more Mech names (thanks ArcanErasmus ! First PR! 🎉) [#1649](https://github.com/massif-press/compcon/issues/1649)

### Bug Fixes

- **Pilot Roster** Upgrade pilot importing when pilots are in groups (thanks, msprijatelj!) [#1651](https://github.com/massif-press/compcon/issues/1651)
- **Pilot Sheet** Correct serialization of WeaponUses (thanks, msprijatelj!) [#1649](https://github.com/massif-press/compcon/issues/1649)
- **Pilot Sheet** cast Tag vals as numbers, use profile tags (thanks, msprijatelj!) [#1655](https://github.com/massif-press/compcon/issues/1655)

## [2.2.30] (2021-08-27)

### Bug Fixes

- **Pilot Roster** Clarify version mismatch import errors, closes [#1646](https://github.com/massif-press/compcon/issues/1646)
- **Compendium** Corrected display of LCP SVG graphics (thanks msprijatelj!), closes [#1618](https://github.com/massif-press/compcon/issues/1618)
- **Active Mode** Sync data at the end of each turn (thanks TranslucentSabre!), closes [#1621](https://github.com/massif-press/compcon/issues/1621) [#1622](https://github.com/massif-press/compcon/issues/1622)
- **Mech Sheet** Fixes a typo which prevented the weapon types from being displayed when printing a character's mech. (thanks TranslucentSabre!), closes [#1617](https://github.com/massif-press/compcon/issues/1617)
- **Pilot Sheet** Adds Damage and Range to the Bombardment Reserve (thanks msprijatelj!), closes [#1629](https://github.com/massif-press/compcon/issues/1629)
- **Mech Sheet** Enable icons on the Integrated Weapon mount for Remove/Change Item, since Integrated Weapon allows for weapon selection unlike other integrated mounts. (thanks msprijatelj!), closes [#1638](https://github.com/massif-press/compcon/issues/1638)
- **Mech Sheet** Adds a Pilot Sheet option from the mech sheet in the nav options on mobile, bringing it in line with the desktop version. (thanks msprijatelj!), closes [#1645](https://github.com/massif-press/compcon/issues/1645)
- **Pilot Sheet** Enable Pilot Roster reordering within groups (thanks msprijatelj!), closes [#1625](https://github.com/massif-press/compcon/issues/1625)

## [2.2.29] (2021-08-02)

Huge thanks to TranslucentSabre and msprijatelj!

### Features

- **Active Mode** Auto-roll some dice in Active Mode (thanks TranslucentSabre!), closes [#1551](https://github.com/massif-press/compcon/issues/1551)

### Bug Fixes

- **Active Mode** Fix Pilot HP setting UI, closes [#1616](https://github.com/massif-press/compcon/issues/1616)
- **Content Manager** Fix name and version sorting in the Content Manager, closes [#1596](https://github.com/massif-press/compcon/issues/1596)
- **Mech Sheet** Add tooltips to the Mech Sheet Nav bar buttons (thanks Macrophaje! First PR! 🎉), closes [#1615](https://github.com/massif-press/compcon/issues/1615)
- **Mission Runner** Allow for overwriting active mech on a synced pilot (thanks TranslucentSabre!), closes [#1612](https://github.com/massif-press/compcon/issues/1612)
- **Vault** Correctly handle case in vault codes (thanks TranslucentSabre!), closes [#1606](https://github.com/massif-press/compcon/issues/1606)
- **Compendium** Load static images for homebrew manufacturers (thanks msprijatelj!), closes [#1598](https://github.com/massif-press/compcon/issues/1598)
- **Pilot Sheet** Allow LL0 Pilots to select bonus skill triggers (thanks msprijatelj!), closes [#1602](https://github.com/massif-press/compcon/issues/1602)
- **Pilot Sheet** Allow scroll-on-click behavior for LL0 Pilot selectors (thanks msprijatelj!), closes [#1608](https://github.com/massif-press/compcon/issues/1608)
- **Pilot Sheet** Fix Skill Focus (thanks msprijatelj!), closes [#1589](https://github.com/massif-press/compcon/issues/1589)
- **Mech Sheet** Correct stat scaling when max stat increases via Bonuses (thanks msprijatelj!), closes [#1586](https://github.com/massif-press/compcon/issues/1586)

## [2.2.28](2021-08-02)

A massive thanks to Valkyrion for the massively helpful bug squashing this week! All features and fixes this update are theirs unless otherwise noted.

### Features

- **Compendium** Changes the default sort of compendium entries for Mech-related items (frames, systems, and weapons) to book order of the manufacturers, for consistency with the Manufacturers, Licenses, and Core Bonuses pages, closes [#1496](https://github.com/massif-press/compcon/issues/1496)
- **Pilot Sheet** Ensure sync on Pilot level-up, closes [#1574](https://github.com/massif-press/compcon/issues/1574)
- **Pilot Sheet** Ensure sync on theme change, closes [#1450](https://github.com/massif-press/compcon/issues/1450)
- **Global** Display LCP info where possible (thanks TranslucentSabre!) , closes [#1571](https://github.com/massif-press/compcon/issues/1571)

### Bug Fixes

- **Pilot Sheet** Disables the add-custom-skill button when the pilot cannot select more skills, closes [#1580](https://github.com/massif-press/compcon/issues/1580)
- **Misc** Fixes the image-selector component incorrectly referencing a webhosted image as a local resource, closes [#1439](https://github.com/massif-press/compcon/issues/1439)
- **Pilot Sheet** Fixes an issue that prevented the Prototype Weapon from dynamically updating, closes [#1533](https://github.com/massif-press/compcon/issues/1533)
- **Pilot Sheet/Mech Sheet** Initalizes some tracked values to ensure they update dynamically, closes [#1569](https://github.com/massif-press/compcon/issues/1569)
- **Compendium** Fix an issue that was preventing homebrew tags from functioning correctly on profiled weapons, closes [#1482](https://github.com/massif-press/compcon/issues/1482)
- **Pilot Sheet** Fixes view scrolling on Talent selections, closes [#1566](https://github.com/massif-press/compcon/issues/1566)
- **Pilot Sheet** Fixes view scrolling on Background selections, closes [#1561](https://github.com/massif-press/compcon/issues/1561)
- **Pilot Sheet** Fixes 'Focus' Reserve to correctly grant skill trigger, closes [#1549](https://github.com/massif-press/compcon/issues/1549)
- **Pilot Sheet** Correctly display Overpower Caliber in the export text block, closes [#1483](https://github.com/massif-press/compcon/issues/1483)
- **Pilot Sheet** Re-orients Talent tooltips, closes [#1560](https://github.com/massif-press/compcon/issues/1560)
- **Compendium** Remove 'Loading' from Barbarossa's Direct Fire, closes [#1565](https://github.com/massif-press/compcon/issues/1565)
- **Active Mode** Correctly reset Orochi drones on Rest or Full Repair (beef), closes [#1577](https://github.com/massif-press/compcon/issues/1577)

## [2.2.27] (2021-07-16)

### Features

- **Mobile View** The remainder of the pilot-side app has been adapted to mobile view v1, closes [#300](https://github.com/massif-press/compcon/issues/300)
- **Mech Sheet** Add weapon size tooltips to mech mounts (thank you to tmncx0! First PR! 🎉)

### Bug Fixes

- **Pilot Roster:** Fixes a bug where cloned or duplicated pilots were incorrectly preserving their Vault links to other users, closes [#1546](https://github.com/massif-press/compcon/issues/1546)
- **Pilot Roster:** fix editing NPC Feature Names & Descriptions (thank you to Valkyrion! First PR! 🎉)
- **Pilot Roster:** fix missing pilot weapon equip button in list mode (also Valkyrion!)

## [2.2.26] (2021-07-16)

### Hotfix (7/19/21)

- **Cloud Storage** Corrected vault storage issue that was preventing remotely-linked vault data from being correctly assigned to an account. This should fix missing remote data when moving to new devices, closes [#1537](https://github.com/massif-press/compcon/issues/1537)

### Bug Fixes

- **Changelog:** Rebuilt COMP/CON Changelog. Old log can be found at CHANGELOG_old.md, closes [#1511](https://github.com/massif-press/compcon/issues/1511)
- **Cloud Storage:** Fix syncing issues with COMP/CON Account Vault contents, closes [#1488](https://github.com/massif-press/compcon/issues/1488) [#1503](https://github.com/massif-press/compcon/issues/1503)
- **Active Mode:** Corrects an issue with duplicate deployment systems [#1520](https://github.com/massif-press/compcon/issues/1520)
- **Active Mode:** Fixes an issue preventing the "skirmish" weapon profile property from working, allowing for eg. Leviathan skimish attacks in spin-down mode [#1481](https://github.com/massif-press/compcon/issues/1481)

### Features

- **Pilot Roster:** Rework Vault interface UI, closes [#1456](https://github.com/massif-press/compcon/issues/1456)
- **Pilot Sheet:** Decouples extra Core Bonus points from License-based Core Bonus requirements [#1523](https://github.com/massif-press/compcon/issues/1523)
