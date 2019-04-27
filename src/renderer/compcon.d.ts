declare interface Brew {
  info: any
  dir: string
}

declare interface PrintOptions {
  config_id: string,
  loadout_index: number,
  combo: boolean
}

declare interface Manufacturer {
  id: string,
  name: string,
  description: string
}

declare interface Background {
  id: string,
  name: string,
  description: string,
  triggers: string
}

declare interface CCLicense {
  source: string
  license: string
  unlocks: (CCItem | Frame)[][]
  brew: any | null
}

declare interface AppState {
  presearch: string
  UserDataPath: string
  Backgrounds: Background[]
  Talents: PilotTalent[]
  Skills: PilotSkill[]
  CoreBonuses: CoreBonus[]
  Frames: Frame[]
  Manufacturers: Manufacturer[]
  MechWeapons: Weapon[]
  WeaponMods: WeaponMod[]
  MechSystems: System[]
  PilotGear: PilotGear[]
  Tags: Tag[]
  Statuses: Status[]
  Brews: Brew[]
  Licenses: CCLicense[]
  activeConfigID: string
  Pilots: Pilot[]
  Quirks: string[]
  activePilotID: string
  printOptions: object
}

declare interface AppContext {
  commit: (a: string, b?: any) => void
  dispatch: (a: string, b?: any, c?: any) => void
  state: AppState
  getters: any
}
