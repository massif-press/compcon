import {
  Background,
  PilotTalent,
  Pilot,
  PilotSkill,
  CoreBonus,
  Frame,
  MechWeapon,
  WeaponMod,
  MechSystem,
  PilotEquipment,
  Tag,
  License,
  Reserve,
} from '@/class'

interface Brew {
  info: any
  dir: string
}

interface PrintOptions {
  config_id: string
  loadout_index: number
  combo: boolean
}

interface Manufacturer {
  id: string
  name: string
  description: string
  logo: string
  color: string
}

interface Faction {
  id: string
  name: string
  description: string
  logo: string
  color: string
}


interface Status {
  name: string
  type: string
  effects: string[]
}

interface AppState {
  UserDataPath: string
  // ActiveMech: Mech
  ActivePilot: Pilot
  printOptions: object
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
  Pilots: Pilot[]
  Quirks: string[]
  Reserves: Reserve[]
}

interface AppContext {
  commit: (a: string, b?: any) => void
  dispatch: (a: string, b?: any, c?: any) => void
  state: AppState
  getters: any
}

export { AppContext, AppState, Brew, PrintOptions, Manufacturer, Faction, Status }
