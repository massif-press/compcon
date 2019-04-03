# Creating Homebrew COMP/CON Content
First off, a disclaimer: the structure of COMP/CON data is, as of the time of this writing, not yet locked in. It's possible (although unlikely) for it to change. Also, adding content will require manual editing of JSON files. There **is** a content editor UI coming to COMP/CON in the future, but if you can't wait, this guide is for you.

A good working example of custom data can be found [here](https://github.com/jarena3/compcon-extra/tree/master/Kickstarter%20Bonus%20Content)

An empty set of datafiles has been created for your convienience [here](https://github.com/jarena3/compcon-extra/tree/master/Blank)

If there are any questions, please find me in the `#resource-hub` channel on the official LANCER Discord

## Adding Content to COMP/CON
LANCER organizes everything by licenses that correspond to Frames. COMP/CON's upcoming content editor UI will do this too, but the actual guts of the app group everything by type (weapon, system, tag, etc) and collect and organize everything as the need arises, most often by a unique `id` attribute for any given thing. The types of things COMP/CON stores as data (and, because of this, the stuff you can add) includes:
- [Manufacturers](#manufacturers-manufacturersjson)
- [CORE Bonuses](#core-bonuses-core_bonusjson)
- [Frames](#frames-framesjson)
- [Mech Weapons](#mech-weapons-weaponsjson)
- [Mech Weapon Mods](#mech-weapon-mods-modsjson)
- [Mech Systems](#mech-systems-systemsjson)
- [Pilot Gear](#pilot-gear-pilot_gearjson)
- [Tags](#tags-tagsjson)
- [Backgrounds](#backgrounds-backgroundsjson)
- [Talents](#talents-talentsjson)
- [Skill Triggers](#skill-triggers-skillsjson)
- [Statuses](#statuses-statusesjson)

The structure and usage of each of these will be covered in detail, but first there's some top-level organizational stuff:

### Content Package Structure
Your content package (hereafter: "brew") is contained in a single-level folder that, at minimum, contains an `info.json` file which contains the following:
```js
{
  "name": "My homebrew package name",
  "author": "My name",
  "version": "Version name or number",
  "description": "A description that shows up on the Options page content toggle",
  "website": "www.my-website.com",
  "active": false
}
```
the `active` property is what COMP/CON uses to determine what installed packages are loaded. It's best to keep this as `false`.

A working, but contentless, folder structure would look like this:

```
my homebrew folder
│   info.json
```

additional data will be included in the folder on the same level as the `info.json` file. _Content folders should not have any depth_.

For the most part, CC will identify missing IDs and display a `// MISSING DATA //` message in the UI. This can be caused by bad ID references, malformed JSON, or an unloaded content package.

### License Structure

Despite being stored by item type, COMP/CON organizes most items (with the exception of Pilot equipment) into Licenses, which are defined by Manufacturer and Frame. Including a new Frame will automatically create a license If it's a Frame under a homebrew Manufacturer, a valid Manufacturer **must** be included. No additional definitions need to be made.
It's strongly recommended that any new Frames contain at least one Weapon, Mod, or System per each license level.

### Item IDs

All data in COMP/CON is referenced by ID string defined in the item data. There are no restrictions on this string, other than it must be unique -- if there are ID collisions, CC will return the first item it can find with the given ID, which could cause deep weirdness.

## Manufacturers (`manufacturers.json`)
Homebrew Frames can be added to any Core manufacturer (GMS, IPS-N, HA, SSC, and HORUS), but if a Frame has a custom manufacturer it must be added in a `manufacturers.json` file, or licenses will fail to correctly load. The structure of the `manufacturers.json` is as follows:
```js
[
  {
    "id": "MHM",    // this will be the 'source' field for other items
    "name": "My Homebrew Manufacturer",
    "description": "The description can contain HTML tags"
  },
  ...
]
```
The `id` field should be a few characters, and is the manufacturer's abbreviated name (eg. GMS -> General Massive Systems, SSC -> Smith-Shimano Corpro) and must be correctly referenced in CORE Bonus, Frame, System, Mod, and Weapon data as the item's `source` property. The  `name` field is the display name, and can be any string (eg. HORUS is just HORUS). The `description` field can be of any length and contain HTML elements.

## CORE Bonuses (`core_bonus.json`)
Custom CORE Bonuses are not required for new Licenses, but it is possible to add them. You can also add additional CORE Bonuses for the core rules manufacturers. Please note, though, that as of the time of this writing COMP/CON is unable to reason about custom core bonuses (unlike, eg. how Neurolinked will add range to all mounted ranged weapons within CC). This sort of thing will be coming in a future update.

`core_bonus.json` is structured in the following way:
```js
  {
    "id": "unique corebonus id",    // this must be globally unique -- the longer, the better
    "name": "CORE Bonus Display Name",
    "source": "MHM",    // the ID of the associated manufacturer, eg. "IPS-N"
    "effect": "The mechanical effect of this bonus",
    "description": "Fluff text"
  },
```
A pilot will have to take three license ranks in a manufacturer to unlock their CORE Bonuses, six for two, etc. Please keep this in mind when writing CORE Bonuses for license sets.

## Frames (`frames.json`)
Frames are the basis for all LANCER, and thus COMP/CON, licenses. With the exception of GMS, all mech equipment is tied to a Frame, and `frames.json` is structured in the following way:
```js
[
  {
    "id": "my_unique_id",    // this must be globally unique -- the longer, the better
    "source": "MHM",    // the ID of the associated manufacturer, eg. "IPS-N"
    "name": "TANGUN",    // the name of the Frame, and the name of the License. Should be all caps.
    "mechtype": "Long-Range Beam",    // Very short description of the mech
    "description": "A longer description that can contain HTML tags",
    "mounts": [
      "Main", "Main", "Heavy"   // see below for Mount details
    ],
    "stats": {    //  all of these fields must be Numbers, not Strings
      "size": 1,
      "armor": 2,
      "hp": 10,
      "evasion": 9,
      "edef": 6,    // E-Defense
      "heatcap": 6,    // Heat Capacity
      "repcap": 6,    // Repair Capacity
      "sensor_range": 10,
      "tech_attack": -2,
      "save": 10,
      "speed": 3,
      "sp": 5
    },
    "traits": [{
        "name": "Trait 1 Name",
        "description": "Trait 1 effect"
      },
      {
        "name": "Trait 2 Name",
        "description": "Trait 2 effect. Any number of Traits can be added"
      },
      ...
    ],
    "core_system": {
      "name": "CORE System Name",
      "description": "CORE System fluff",    // mechanical effects go in 'effect'
      "passive": "if a system has a passive effect, it goes here. NOT required.",
      "integrated": {    // if a CORE System has an Integrated weapon, this will be copied to all loadouts. NOT required.
        "name": "Integrated System Name",
        "mount": "Main",    // See Mech Weapon section below
        "type": "Launcher",    // See Mech Weapon Section Below
        "range": [    // See Mech Weapon Section Below
          {"type": "range", "val": 8}
        ],
        "damage": [    // See Mech Weapon Section Below
          {"type": "energy", "val": "1d6+3"
        ]
        "effect": "Integrated weapon effect or notes"
      },
      "active_name": "CORE System Active Name",
      "effect": "CORE System Active (core power spent) mechanical effect",
      "tags": [    // if a CORE System has no tags, leave this empty ([])
        {
         "id":"heatself"    // tag id -- see Tag section below
         "val":1            // tag value -- see Tag section below
        }
      ]
    },
    "data_type": "frame",    // a data hint used elsewhere in the app. Keep this as "frame"
    "aptitude": {}    // ignore this, for now. A soon-to-be-added feature
  },
  ...
]
```

### Mounts
Mounts are stored as an array of strings. COMP/CON will determine mount type and slots based on the string -- the valid mount types are:
- Heavy
- Main
- Main/Aux
- Aux
- Aux/Aux
- Flex
They must preserve the capitalization above. Custom mixed mounts (eg. 'Heavy/Aux') are not yet supported.

## Mech Weapons (`weapons.json`)
Mech Weapons can be added to existing licenses, custom licenses, or the GMS base set. If adding to a custom license, that license must be loaded and unlocked for a user to select that equipment. If a mech weapon is not appearing when it should be, please ensure that the license name, level, and source fields are correct (and the content package is installed and activated)

`weapons.json` is structured in the following way:
```js
  {
    "id": "my_unique_id",    // this must be globally unique -- the longer, the better    
    "name": "The Display Name",
    "mount": "Main",    //  the type of mount this weapon is sized for, see above
    "type": "Cannon",    //  see the "weapon types" note below
    "sp": 1,    // the SP cost required to mount this weapon. NOT required, and can be omitted for 0 SP items
    "damage": [{    // see "damage" note below
      "type": "kinetic",
      "val": 3
    }],
    "range": [{    //  see "range" note below
      "type": "range",
      "val": 15
    }],
    "tags": [    // see "Tags" section at the bottom of this document. Cam be left blank ([])
      {"id": "unique}
    ],
    "source": "MHM",    // the ID of the manufacturer. Must match exactly.
    "license": "TANGUN",   // the NAME of the frame this weapon is associated with. Must match exactly.
    "license_level": 3,    // a number between 1-3. COMP/CON does not yet support 3+ licenses
    "effect": "The non-range, non-damage mechanical effects associated with this item. Can be blank. Can take HTML tags.",
    "description": "The fluff description of this item",
    "data_type": "weapon",    // a data hint used elsewhere in the app. Keep this as "frame"
    "aptitude": {}    // ignore this, for now. A soon-to-be-added feature
  },
  ...
]
```

### Weapon Types
The valid weapon types are:
- Rifle
- Cannon
- Launcher
- CQB
- Nexus
- Melee
This string must match exactly, as COMP/CON references it in some situations (eg. applying core bonus effects)

### Damage
Damage is stored as an array of objects. Each object has two components:
```
{
  "type": "kinetic", "explosive", "energy", "heat", "burn", or "variable"
  "val": Number (eg: 3), or a dice string (eg: "2d6", "1d3+2")
}
```
Multiple types of damages can be added. For example, a weapon that does 1d3 Energy Damage + 1 Burn Damage would have a damage property of:
```js
"damage": [
  {
    "type": "energy",
    "val": "1d3"
  },
  { 
    "type": "burn"
    "val": 1
  }
]
```
Damage can also be overridden by adding `"override": true` instead of the "type" property. In this case, CC will render the value as a string. Eg:
```js
"damage": [
  {
    "override": true,
    "val": "Applies Lock-On Status"
  }
]
```

### Range
Damage is stored as an array of objects. Each object has two components:
```
{
  "type": "range", "line", "cone", "blast", "burst", "thrown", or "threat"
  "val": Number
}
```
The "range" damage type refers to a standard ranged weapon - it can attack 1 space in its range.


Multiple types of ranges can be added. For example, thrown weapons have range properties like:
```js
"range": [
  {
    "type": "thrown",
    "val": 5
  },
  { 
    "type": "threat"
    "val": 1
  }
]
```
Range can also be overridden by adding `"override": true` instead of the "type" property. In this case, CC will render the value as a string. Eg:
```js
"range": [
  {
    "override": true,
    "val": "1d6+2"
  }
]
```
CC cannot yet do dice math on ranges. This will come in a future update.

## Mech Weapon Mods (`mods.json`)
Mech Weapon Mods are essentially systems with a few additional properties so COMP/CON can determine how to attach them to weapons. `mods.json` is structured in the following way:
```js
  {
    "id": "my_unique_id",    // this must be globally unique -- the longer, the better    
    "name": "The Display Name",
    "sp": 2,    // SP cost. Required.
    "applied_to": [    // see "Applied To" section below
      "rifle", "cannon", "launcher", "cqb", "nexus", "melee"
    ],
    "applied_string": "Any",    // see "Applied To" section below
    "source": "MHM",    // the ID of the manufacturer. Must match exactly.
    "license": "TANGUN",   // the NAME of the frame this weapon is associated with. Must match exactly.
    "license_level": 2,    // a number between 1-3. COMP/CON does not yet support 3+ licenses
    "effect": "Mechanical effect of the mod",
    "description": "Fluff description"
    "data_type": "mod",    // a data hint used elsewhere in the app. Keep this as "mod"
  },
```

### Applied To
COMP/CON requires this field to reason about what types of weapon this mod can be applied to. It takes an array of lowercase strings. Valid types are:
- rifle
- cannon
- launcher
- cqb
- nexus
- melee
The `applied_string` field is UI sugar for how the `applied_to` field is rendered. Like the above example, including all possible types should be "Any". Taking only `melee` should be "Melee". `rifle` and `cannon` should be "Rifle or Cannon" to stay consistent with the core data -- but -- you can add anything you want in this field.

## Mech Systems (`systems.json`)
`systems.json` is structured in the following way:

```js
[
  {
    "id": "my_unique_id",    // this must be globally unique -- the longer, the better    
    "name": "The Display Name",
    "type": "Tech",    // displayed on the loadout section - "System", "Deployable", "Charge", "Tech", etc.
    "sp": 2,
    "tags": [    // see "Tags" section below
      {
        "id": "quicktech"
      }
    ],
    "source": "MHM",    // the ID of the manufacturer. Must match exactly.
    "license": "TANGUN",   // the NAME of the frame this weapon is associated with. Must match exactly.
    "license_level": 2,    // a number between 1-3. COMP/CON does not yet support 3+ licenses
    "effect": "Mechanical effect of the system. Required. Can take HTML tags.",
    "description": "Fluff description. NOT required. Can take HTML tags."
  },
  ...
]
```
For systems, it's recommended to (when appropriate) include the special tags `quicktech, fulltech, quickaction, fullaction` where appropriate.

## Pilot Gear (`pilot_gear.json`)
Pilot Gear includes Pilot weapons, armor, and equipment. In `pilot_gear.json`, all items are stored in the same array, but the object types are different:

Pilot Weapon:
```js
  {
    "id": "my_unique_id",    // this must be globally unique -- the longer, the better    
    "type": "weapon",    // denotes it is a pilot weapon
    "name": "The Display Name",
    "tags": [],    // see "Tags" section below
    "range": [],    // same as Mech Weapons, see the "Range" section of "Mech Weapons" above
    "damage": [],    // same as Mech Weapons, see the "Damage" section of "Mech Weapons" above
    "effect": "Mechanical effect of this Pilot Weapon. NOT required. Can take HTML tags.",
    "description": "Fluff description. NOT required. Can take HTML tags."
  },
```

Pilot Armor:
```js
  {
    "id": "my_unique_id",    // this must be globally unique -- the longer, the better    
    "type": "armor",    // denotes it is pilot armor
    "name": "The Display Name",
    "hp_bonus": 3,    // a Number to add to the Pilot's current HP. NOT required.
    "speed": 3,     // Number. Sets the Pilot's total speed. NOT required.
    "speed_bonus": 0,     // Number. Adds to the Pilot's current speed. NOT required.
    "armor": 2,     // Number. Sets the Pilot's total armor. NOT required.
    "edef": 8,     // Number. Sets the Pilot's total e-defense. NOT required.
    "evasion": 6,     // Number. Sets the Pilot's total evasion. NOT required.
    "evasion_bonus": 0,     // Number. Adds to the pilot's current HP. NOT required.
    "description": "Fluff description AND/OR mechanical effects. NOT required. Can take HTML tags."
  },
```

Pilot Equipment:
```js
  {
    "id": "my_unique_id",    // this must be globally unique -- the longer, the better    
    "type": "gear",    // denotes it is pilot gear
    "name": "The Display Name",
    "description": "Fluff description AND/OR mechanical effects. NOT required. Can take HTML tags."
  },
```
Please note that as of the removal of 'Rarity', Pilot Gear can no longer be restricted by license.

## Tags (`tags.json`)
In COMP/CON, tags are referenced by ID and rendered with applicable bonuses, if possible. There are two types of Tag: with value and without value. The structure of `tags.json` is like this:
```js
[
  {
    "id": "line",
    "name": "Line ({VAL})",
    "description": "This weapon or system affects a straight line {VAL} squares long. Attacks all targets in the area, and ignores cover. Make separate attack rolls for each target caught in the area."
  },
  {
    "id": "ap",
    "name": "Armor Piercing (AP)",
    "description": "The damage from this weapon ignores armor."
  },
  ...
]
```
The `id` field is the referenced id used in CORE Systems, Mech Weapons, Mech Weapon Mods, Mech Systems, and Pilot Gear. CC will look up the appropriate tag at Render time and infill the full name and description. 

Certain tags have strings that include `{VAL}`. This is replaced at render time with the `"val"` field in the tag reference. For example, a weapon might have the following tag array:
```js
"tags": [
  {
    "id": "knockback",
    "val": 2
  },
  {
    "id": "heatself",
    "val": 1
  } 
]
```

the corresponding `tags.json` data is:
```js
[
  ...
  {
    "id": "knockback",
    "name": "Knockback {VAL}",
    "description": "On hit, you may knock back a target {VAL} spaces in a straight line directly away from the point of origin (unless specified, this is your mech). Knockback is additive, so an attack that gains Knockback 1 from a weapon and Knockback 1 from a talent would knock a target back 2 spaces."
  },
  ...
  {
    "id": "heatself",
    "name": "Heat {VAL} (Self)",
    "description": "This weapon or system inflicts {VAL} Heat on its wielder immediately after firing or activation"
  },
  ...
]
```

and when rendered will look like:
```
Knockback 2
  On hit, you may knock back a target 2 spaces in a straight line directly away from the point of origin (unless specified, this is your mech). Knockback is additive, so an attack that gains Knockback 1 from a weapon and Knockback 1 from a talent would knock a target back 2 spaces."

Heat 1 (Self)
  This weapon or system inflicts 1 Heat on its wielder immediately after firing or activation
```

If a `"val"` is passed to a tag without a `{VAL}`, nothing will happen. If no `"val"` is passed to a tag WITH a `{VAL}`, it will fail to render.

## Backgrounds (`backgrounds.json`)
Backgrounds do not connote mechanical effects (at the time of this writing) and are purely for flavor. `backgrounds.json` is structured as follows:
```js
[
  {
    "id": "unique_id",    // not global, but must be unique within all loaded backgrounds
    "name": "Background Display Name",
    "description": "Fluff description",
    "triggers": "List of suggested skill triggers. This string will be rendered (it isn't a list of skill ids)"
  },
  ...
]
```

## Talents (`talents.json`)
The structure of `talents.json` is as follows:
```js
[
  {
    "id": "unique_id",    // not global, but must be unique within all loaded talents
    "name": "Talent Display Name",
    "description": "The fluff description of the talent overall",
    "r1_name": "Talent Rank I Name",
    "r1_desc": "The fluff AND mechanical effect of Rank I of this talent. Required. Can take HTML Tags.",
    "r2_name": "Talent Rank II Name",
    "r2_desc": "The fluff AND mechanical effect of Rank II of this talent. Required. Can take HTML Tags.",
    "r3_name": "Talent Rank III Name",
    "r3_desc": "The fluff AND mechanical effect of Rank III of this talent. Required. Can take HTML Tags.",
  },
  ...
]
```
As of the time of this writing, custom talents cannot contribute mechanical effects or integrated equipment (unlike eg. Armament or Technophile). This will be available in an upcoming update.

## Skill Triggers (`skills.json`)
Triggers/Skill Triggers (called 'Skills' here) are purely Pilot/Narrative based and confer no mechanical effects at the time of this writing. The structure of `skills.json` is as follows:
```js
[
  {
    "id": "unique_id",    // not global, but must be unique within all loaded skills
    "trigger": "Skill Trigger Name",
    "description": "Short descripton of when this bonus applies",
    "detail": "Greater detail on when and how this trigger is activated and when this bonus applies. Shown when a user expands the trigger in the UI.",
    "family": "str"    // See "Family" section below
  }
  ...
]
```

### Family
Skills are sorted into four general groupings "families". The groupings given in COMP/CON aren't official and ideomatic only to the app, but might give you some idea on how to organize your custom skill based on how they fit into a traditional RPG archetype. They are:
family field string | Offical LANCER grouping
:------------------:|:----------------------:
str                 |Your pilot’s ability to use, resist, and apply direct force, physical or otherwise
dex                 |Your pilot’s ability to perform skillfully and accurately under pressure
int                 |Your pilot’s ability to notice details, think creatively, and prepare
cha                 |Your pilot’s ability to talk, lead, change minds, make connections, and requisition resources

At the time of this writing, new skill families cannot be added. This will be available in a future update.

## Statuses (`statuses.json`)
As of the time of this writing, Statuses are only found in the Compendium > Statuses page. The structure of `statuses.json` is as follows:
```js
[  
  {
    "name": "Status Name",
    "effects": [
      "Effect A",
      "Effect B"
    ]
  },
]
```
The effects are rendered as a list.