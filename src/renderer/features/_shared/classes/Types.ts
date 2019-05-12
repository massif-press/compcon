import { Background, PilotTalent, Pilot, PilotSkill, CoreBonus, Frame, MechWeapon, WeaponMod, MechSystem, PilotEquipment, Tag, License } from '.'

type Brew = {
  info: any
  dir: string
}

type PrintOptions = {
  config_id: string,
  loadout_index: number,
  combo: boolean
}

type Manufacturer = {
  id: string,
  name: string,
  description: string
}

type Status = {
  name: string,
  effects: string[]
}

type AppState = {
  presearch: string
  UserDataPath: string
  Backgrounds: Background[]
  Talents: PilotTalent[]
  Skills: PilotSkill[]
  CoreBonuses: CoreBonus[]
  Frames: Frame[]
  Manufacturers: Manufacturer[]
  MechWeapons: MechWeapon[]
  WeaponMods: WeaponMod[]
  MechSystems: MechSystem[]
  PilotGear: PilotEquipment[]
  Tags: Tag[]
  Statuses: Status[]
  Brews: Brew[]
  Licenses: License[]
  activeConfigID: string
  Pilots: Pilot[]
  Quirks: string[]
  activePilotID: string
  printOptions: object
}

type AppContext = {
  commit: (a: string, b?: any) => void
  dispatch: (a: string, b?: any, c?: any) => void
  state: AppState
  getters: any
}

type LicenseRequirement = {
  name: string;
  rank: number;
  items: string[];
  missing?: boolean;
}

export {
  AppContext,
  AppState,
  Brew,
  PrintOptions,
  Manufacturer,
  Status,
  LicenseRequirement
}
