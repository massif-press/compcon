/* eslint-disable @typescript-eslint/class-name-casing */
/* eslint-disable @typescript-eslint/camelcase */
import { IReserveData } from './classes/pilot/reserves/Reserve'
import { ISkillData } from './classes/pilot/Skill'
import {
  IManufacturerData,
  IFactionData,
  ICoreBonusData,
  IFrameData,
  IMechWeaponData,
  IMechSystemData,
  IWeaponModData,
  ITalentData,
  IContentPackManifest,
  IPilotWeaponData,
  IPilotArmorData,
  INpcClassData,
  INpcFeatureData,
  INpcWeaponData,
  INpcReactionData,
  INpcSystemData,
  INpcTechData,
  INpcTemplateData,
  ITagCompendiumData,
  IPilotEquipmentData,
} from './interface'

type IFrameData_Fixed = Omit<IFrameData, 'license' | 'license_level'>

type NoBrew<T> = Omit<T, 'brew' | 'id'>

export type SCHEMA__manifest = IContentPackManifest
export type SCHEMA__manufacturers = Omit<IManufacturerData, 'logo'>[]
export type SCHEMA__factions = Omit<IFactionData, 'logo'>[]
export type SCHEMA__environments = NoBrew<Environment>[]
export type SCHEMA__core_bonus = NoBrew<ICoreBonusData>[]
export type SCHEMA__frames = NoBrew<IFrameData_Fixed>[]
export type SCHEMA__weapons = NoBrew<IMechWeaponData>[]
export type SCHEMA__systems = NoBrew<IMechSystemData>[]
export type SCHEMA__mods = NoBrew<IWeaponModData>[]
export type SCHEMA__pilot_gear = (
  | NoBrew<IPilotWeaponData>
  | NoBrew<IPilotArmorData>
  | NoBrew<IPilotEquipmentData>
)[]
export type SCHEMA__reserves = NoBrew<IReserveData>[]
export type SCHEMA__talents = NoBrew<ITalentData>[]
export type SCHEMA__sitreps = NoBrew<Sitrep>[]
export type SCHEMA__skills = NoBrew<ISkillData>[]
export type SCHEMA__statuses = NoBrew<Status>[]
export type SCHEMA__tags = Omit<NoBrew<ITagCompendiumData>, 'filter_ignore' | 'hidden'>[]

export type SCHEMA__npc_classes = NoBrew<INpcClassData>[]
export type SCHEMA__npc_features = (
  | NoBrew<INpcFeatureData>
  | NoBrew<INpcWeaponData>
  | NoBrew<INpcReactionData>
  | NoBrew<INpcSystemData>
  | NoBrew<INpcTechData>
)[]
export type SCHEMA__npc_templates = NoBrew<INpcTemplateData>[]
