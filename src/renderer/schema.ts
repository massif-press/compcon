/* eslint-disable @typescript-eslint/camelcase */
import { IContentPackManifest } from './io/ExtraContent'
import { IManufacturerData, ICoreBonusData, IFrameData, IMechWeaponData, IMechSystemData, IWeaponModData, ITalentData } from './interface'


type IFrameData_Fixed = Omit<IFrameData, 'license' | 'license_level' | 'source'>

export type SCHEMA__manifest = IContentPackManifest
export type SCHEMA__manufacturers = IManufacturerData[]
export type SCHEMA__core_bonus = ICoreBonusData[]
export type SCHEMA__frames = IFrameData_Fixed[]
export type SCHEMA__weapons = IMechWeaponData[]
export type SCHEMA__systems = IMechSystemData[]
export type SCHEMA__mods = IWeaponModData[]
export type SCHEMA__talents = ITalentData[]