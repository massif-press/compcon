# Release: [v0.3.0-alpha](https://github.com/jarena3/compcon/releases/tag/v0.2-alpha)

## Source: v0.3.0-alpha

Requires [node.js](https://nodejs.org/en/download/)

```cli
> npm i && npm start
```

---
# COMP/CON
  
  A pilot and mech builder, organizer, and item database (other stuff, too) for Miguel Lopez and Tom Parkinson Morgan's LANCER Tabletop RPG.


  As of this writing, LANCER is at version 1.7.5β and COMP/CON is only a preview alpha.
  More information about LANCER can be found at [The official LANCER Twitter](https://twitter.com/lancer_rpg"), as well as [the LANCER subreddit](https://www.reddit.com/r/LancerRPG/)</a>


  This is a piece of open source software under the GNU Public License — feel free to contribute via the [GitHub repository](https://github.com/jarena3/compcon) or yell at me directly on Twitter at [@jarena2](https://www.twitter.com/jarena2)</a>.
  If you want to support development of this software, please consider [buying me a beer](https://buymeacoff.ee/a7xoLjHfG)</a>.


  ### Attributions
  Icons courtesy [game-icons.net](https://game-icons.net/)</a>


  I took all the KSBD sample pilot text from the [KSBD Wikia](http://killsixbilliondemons.wikia.com/wiki/Main_Page). Pilot art was taken directly from [Kill Six Billion Demons](https://killsixbilliondemons.com)</a>.

  ---

# Roadmap
### β
- Create and save LANCER pilots ✅
- Create and save LANCER mech configurations, per pilot ✅
- Provide an equipment catalog mode so players can browse data without building a character or mech ✅
- Edit, retrofit, level up, and upgrade pilots and mecha 🚧
  
### 1.0
- Generate and print character sheets for tabletop play
- Track the status of pilots (active, retired, deceased) and mecha (active, blueprint, unavailable, destroyed) 🚧
- Provide an easy way for users to export some or all of their characters and mech configurations
- Import option for mech configs so that they can be easily copied to/from characters
  
### 1.5
- Provide support for Exotic items and custom backgrounds
- Provide a way for players to track missions and combat operations
- Include player journal, travel log, kill stats, etc.
- Version-track configurations. Start at v1.0, increment whenever a player edits a configuration
  
### 2.0
- Implement a data editor so that users can add their own LANCER data without having to screw with JSON
- Mark homebrew data so players can filter homebrew/core items
- Package homebrew data so users can easily share; allow sorting and filtering by author/set
    
### Long-Term
- Hook into chat services (Discord, Skype, etc) for online play
- Make the Character Sheet interactive: track damage, heat, weapon status, etc.
- Auto-roll dice and do ancillary stuff (eg. increment heat) if a user activates a weapon
- Chat based player commands that reference app data
- Initiative tracker
- NPC creators: procedural and handmade
- Chat based GM commands
- Tiered/Tree-based campaign storage
- Save, export, and share campaigns
- Campaign wiki (or wiki-like)
- Power Card printing

  ---

# Changelog
###  v0.1/α - 10/24/2018 
- Alpha preview release
###  v0.2/α - 11/01/2018 
- Catalogue Viewer
  - View pilot gear, shell, core bonus, system, and weapon data in sortable and filterable tables
  - Pops out for easy reference
  - Data has a lot of errors/missing formatting. This'll be fixed after LANCER 1.8
### v.0.3/α - 12/13/2018
- Pilot Creation Wizard
  - Create new pilots
- Pilot Level Tool
  - Level existing pilots, with automatic bonuses per game rules
- Config Creation Wizard
  - Create new configs based on pilot license unlocks
  - Configs automatically gain bonuses, systems, and weapons from pilot core bonuses and talents
- Config Mount and System Editors
  - Add, remove, and swap weapon mountings and mech systems, as well as weapon mods and ammo. Everything respects (and is filtered by) total mech SP and the pilot's license unlocks.

  ---

# Contributing
  Working on it -- expect a full contributor's guide to be out with the beta release. Right now a lot of the code isn't much better than a rough sketch. Consider most of it to undergo serious changes before this project is in a state amenable to public contributions.

  ---

# License
[GPL](https://www.gnu.org/licenses/gpl-3.0.en.html)

A copy of this license can be fround in the LICENSE.MD file packaged with this software.


COMP/CON LANCER TTRPG Assistant

Copyright 2018 J. Arena


This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.


This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.


You should have received a copy of the GNU General Public License
along with this program. If not, see http://www.gnu.org/licenses/.