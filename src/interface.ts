// Maintain this file as the single point of import for all interface definitions
// (to the extent possible) in order to avoid any circular reference errors. Basic types and
// abstract classes should be imported before their children. AFAIK the definitions can be
// stored anywhere and collected imports are fine as long as their constituents are impored
// first in this file.

import { ICompendiumItemData } from './classes/CompendiumItem'
import { ILicensedItemData } from './classes/LicensedItem'
import { ICoreData } from './classes/mech/CoreSystem'
import { IFrameData, IFrameStats } from './classes/mech/Frame'
import { IMechEquipmentData } from './classes/mech/MechEquipment'
import { IDamageData } from './classes/Damage'
import { IRangeData } from './classes/Range'
import { IMechSystemData } from './classes/mech/MechSystem'
import { IWeaponModData } from './classes/mech/WeaponMod'
import { ICoreBonusData } from './classes/pilot/CoreBonus'
import { IPilotEquipmentData } from './classes/pilot/PilotEquipment'
import { IPilotArmorData } from './classes/pilot/PilotArmor'
import { IPilotWeaponData } from './classes/pilot/PilotWeapon'
import { IPilotGearData } from './classes/pilot/PilotGear'
import { IManufacturerData } from './classes/Manufacturer'
import { ITalentData } from './classes/pilot/Talent'
import { ISkillData } from './classes/pilot/Skill'
import { IMechWeaponData } from './classes/mech/MechWeapon'
import { INpcFeatureData } from './classes/npc/NpcFeature'
import { INpcReactionData } from './classes/npc/NpcReaction'
import { INpcSystemData } from './classes/npc/NpcSystem'
import { INpcTechData } from './classes/npc/NpcTech'
import { INpcDamageData } from './classes/npc/NpcWeapon'
import { INpcWeaponData } from './classes/npc/NpcWeapon'
import { INpcStats } from './classes/npc/NpcStats'
import { INpcClassData } from './classes/npc/NpcClass'
import { INpcTemplateData } from './classes/npc/NpcTemplate'
import { INpcData } from './classes/npc/Npc'
import { IEncounterData, IMissionData } from './classes/encounter'
import { IContentPackManifest, IContentPack } from './classes/ContentPack'

export {
  ICompendiumItemData,
  ILicensedItemData,
  ICoreData,
  IFrameData,
  IFrameStats,
  IMechEquipmentData,
  IDamageData,
  IRangeData,
  IMechSystemData,
  IWeaponModData,
  ICoreBonusData,
  IPilotEquipmentData,
  IPilotArmorData,
  IPilotWeaponData,
  IPilotGearData,
  IManufacturerData,
  ITalentData,
  ISkillData,
  IMechWeaponData,
  INpcFeatureData,
  INpcReactionData,
  INpcSystemData,
  INpcTechData,
  INpcDamageData,
  INpcWeaponData,
  INpcStats,
  INpcClassData,
  INpcTemplateData,
  INpcData,
  IEncounterData,
  IMissionData,
  IContentPackManifest,
  IContentPack,
}
