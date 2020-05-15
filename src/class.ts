// Maintain this file as the single point of import for all class definitions
// (to the extent possible) in order to avoid any circular reference errors. Basic types and
// abstract classes should be imported before their children. AFAIK the definitions can be
// stored anywhere and collected imports are fine as long as their constituents are impored
// first in this file.

import { Rules } from './classes/utility/Rules'
import {
  MountType,
  FittingSize,
  WeaponSize,
  WeaponType,
  ItemType,
  SystemType,
  SkillFamily,
  RangeType,
  DamageType,
  HASE,
  MechType,
  ReserveType,
  OrgType,
  EncounterSide,
} from './classes/enums'
import Tag from './classes/Tag'
import {
  AIEffect,
  BasicEffect,
  ChargeType,
  Charge,
  ChargeEffect,
  DeployableEffect,
  DroneEffect,
  GenericEffect,
  EffectType,
  ActivationType,
  ItemEffect,
  BonusEffect,
  ProtocolEffect,
  ReactionEffect,
  TechEffect,
  ProfileEffect,
  OffensiveEffect,
} from './classes/effects'
import { CompendiumItem } from './classes/CompendiumItem'
import { LicensedItem } from './classes/LicensedItem'
import { CoreBonus } from './classes/pilot/CoreBonus'
import { Damage } from './classes/Damage'
import Loadout from './classes/Loadout'
import { Range } from './classes/Range'
import { Skill } from './classes/pilot/Skill'
import CustomSkill from './classes/pilot/CustomSkill'
import { Talent } from './classes/pilot/Talent'
import License from './classes/License'
import MechSkills from './classes/pilot/MechSkills'
import { PilotEquipment } from './classes/pilot/PilotEquipment'
import { PilotArmor } from './classes/pilot/PilotArmor'
import { PilotWeapon } from './classes/pilot/PilotWeapon'
import { PilotGear } from './classes/pilot/PilotGear'
import PilotLicense from './classes/pilot/PilotLicense'
import PilotLoadout from './classes/pilot/PilotLoadout'
import PilotSkill from './classes/pilot/PilotSkill'
import PilotTalent from './classes/pilot/PilotTalent'
import Pilot from './classes/pilot/Pilot'
import { CoreSystem } from './classes/mech/CoreSystem'
import { Frame } from './classes/mech/Frame'
import MechLoadout from './classes/mech/MechLoadout'
import { MechEquipment } from './classes/mech/MechEquipment'
import { MechSystem } from './classes/mech/MechSystem'
import { MechWeapon } from './classes/mech/MechWeapon'
import Mount from './classes/mech/Mount'
import IntegratedMount from './classes/mech/IntegratedMount'
import EquippableMount from './classes/mech/EquippableMount'
import { WeaponMod } from './classes/mech/WeaponMod'
import WeaponSlot from './classes/mech/WeaponSlot'
import Mech from './classes/mech/Mech'
import Reserve from './classes/pilot/reserves/Reserve'
import Project from './classes/pilot/reserves/Project'
import Organization from './classes/pilot/reserves/Organization'
import { Manufacturer } from './classes/Manufacturer'
import Statblock from './classes/Statblock'
import {
  DiceRoller,
  D20RollResult,
  DamageRollResult,
  ParsedDieString,
  DieSet,
} from './classes/dice/DiceRoller'
import { DiceStats, DiceStatsResult } from './classes/dice/DiceStats'
import {
  NpcFeatureType,
  NpcFeature,
  NpcTrait,
  NpcReaction,
  NpcSystem,
  NpcTech,
  NpcWeapon,
  NpcStats,
  NpcClass,
  NpcTemplate,
  NpcItem,
  Npc,
} from './classes/npc'
import { Encounter, Rest, Mission, ActiveMission, MissionStepType } from './classes/encounter'
import { ContentPack } from './classes/ContentPack'
import { Counter } from './classes/Counter'

export {
  Rules,
  AIEffect,
  BasicEffect,
  ChargeType,
  Charge,
  ChargeEffect,
  DeployableEffect,
  DroneEffect,
  GenericEffect,
  EffectType,
  ActivationType,
  ItemEffect,
  BonusEffect,
  ProtocolEffect,
  ReactionEffect,
  TechEffect,
  ProfileEffect,
  OffensiveEffect,
  MountType,
  FittingSize,
  WeaponSize,
  WeaponType,
  ItemType,
  SystemType,
  SkillFamily,
  RangeType,
  DamageType,
  HASE,
  MechType,
  ReserveType,
  OrgType,
  License,
  CoreBonus,
  Damage,
  CompendiumItem,
  LicensedItem,
  Loadout,
  Range,
  Skill,
  CustomSkill,
  Tag,
  Talent,
  MechSkills,
  Pilot,
  PilotEquipment,
  PilotArmor,
  PilotWeapon,
  PilotGear,
  PilotLicense,
  PilotLoadout,
  PilotSkill,
  PilotTalent,
  Reserve,
  Project,
  Organization,
  CoreSystem,
  Frame,
  Mech,
  MechLoadout,
  MechEquipment,
  MechSystem,
  MechWeapon,
  Mount,
  IntegratedMount,
  EquippableMount,
  WeaponMod,
  WeaponSlot,
  Manufacturer,
  Statblock,
  DiceRoller,
  D20RollResult,
  DamageRollResult,
  ParsedDieString,
  DieSet,
  DiceStats,
  DiceStatsResult,
  NpcFeatureType,
  NpcFeature,
  NpcReaction,
  NpcSystem,
  NpcTrait,
  NpcWeapon,
  NpcStats,
  NpcClass,
  NpcTemplate,
  NpcItem,
  NpcTech,
  Npc,
  Encounter,
  EncounterSide,
  Rest,
  Mission,
  MissionStepType,
  ActiveMission,
  ContentPack,
  Counter,
}
