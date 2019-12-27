/* eslint-disable @typescript-eslint/class-name-casing */
/* eslint-disable @typescript-eslint/camelcase */
import { IContentPackManifest } from './io/ExtraContent'
import { IManufacturerData, ICoreBonusData, IFrameData, IMechWeaponData, IMechSystemData, IWeaponModData, ITalentData } from './interface'


type IFrameData_Fixed = Omit<IFrameData, 'license' | 'license_level' | 'source'>

interface compendiumTagData {
  id: string
  name: string
  description: string
}

export type SCHEMA__manifest = IContentPackManifest
export type SCHEMA__manufacturers = IManufacturerData[]
export type SCHEMA__core_bonus = ICoreBonusData[]
export type SCHEMA__frames = IFrameData_Fixed[]
export type SCHEMA__weapons = IMechWeaponData[]
export type SCHEMA__systems = IMechSystemData[]
export type SCHEMA__mods = IWeaponModData[]
export type SCHEMA__talents = ITalentData[]
// temporary until we have a proper interface for compendium tag data
export type SCHEMA__tags = compendiumTagData[]