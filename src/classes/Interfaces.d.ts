// global declaration file for common interfaces that are used too often to warrant placing in @/interfaces
declare interface IImageContainer {
  SetLocalImage(): any
  SetCloudImage(): any
  Image: string
}

declare interface IDiceStats {
  min: number
  max: number
  mean: number
  error: boolean
  diceString: string
}

declare interface Id20RollResult {
  total: number
  rawDieRoll: number
  staticBonus: number
  accuracyDiceCount: number // net accuracy dice total - negative if at disadvantage
  rawAccuracyRolls: number[] // results of each accuracy/disadvantage die
  accuracyResult: number
}

declare interface IDamageRollResult {
  diceString: string
  total: number
  rawDieRolls: number[]
  staticBonus: number
  parseError: boolean
}

declare interface IRankedData {
  id: string
  rank: number
  custom?: boolean
}

declare interface IEquipmentData {
  id: string
  destroyed: boolean
  unshackled: boolean
  note: string
  uses?: number
}

declare interface IMechWeaponSaveData extends IEquipmentData {
  loaded: boolean
  mod?: IEquipmentData
}

declare interface ICounterSaveData {
  id: string
  val: number
}

declare interface IPilotData {
  id: string
  cloudID: string
  cloudOwnerID: string
  lastCloudUpdate: string
  level: number
  callsign: string
  name: string
  player_name: string
  status: string
  factionID: string
  text_appearance: string
  notes: string
  history: string
  portrait: string
  cloud_portrait: string
  quirk: string
  current_hp: number
  background: string
  mechSkills: number[]
  licenses: IRankedData[]
  skills: IRankedData[]
  talents: IRankedData[]
  core_bonuses: string[]
  reserves: IReserveData[]
  orgs: IOrganizationData[]
  loadouts: IPilotLoadoutData[]
  active_loadout_index: number
  mechs: IMechData[]
  active_mech: string | null
  cc_ver: string
  counter_data: ICounterSaveData[]
  custom_counters: object[]
}

declare interface IReserveData {
  id: string
  type?: string
  name?: string
  label?: string
  description?: string
  resource_name: string
  resource_note: string
  resource_cost: string
  used: boolean
}

declare interface IProjectData extends IReserveData {
  complicated: boolean
  can_finish: boolean
  finished: boolean
  progress: number
  requirements: string[]
}

declare interface IOrganizationData {
  name: string
  purpose: string
  description: string
  efficiency: number
  influence: number
  actions: string
}

declare interface IPilotLoadoutData {
  id: string
  name: string
  armor: (IEquipmentData | null)[]
  weapons: (IEquipmentData | null)[]
  gear: (IEquipmentData | null)[]
  extendedWeapons: (IEquipmentData | null)[]
  extendedGear: (IEquipmentData | null)[]
}

declare interface IMechData {
  id: string
  name: string
  notes: string
  gm_note: string
  portrait: string
  cloud_portrait: string
  frame: string
  active: boolean
  current_structure: number
  current_hp: number
  current_stress: number
  current_heat: number
  current_repairs: number
  current_overcharge: number
  loadouts: IMechLoadoutData[]
  active_loadout_index: number
  statuses: string[]
  conditions: string[]
  resistances: string[]
  burn: number
  ejected: boolean
  destroyed: boolean
  activations: number
  meltdown_imminent: boolean
  reactor_destroyed: boolean
  cc_ver: string
}

declare interface IMechLoadoutData {
  id: string
  name: string
  systems: IEquipmentData[]
  integratedSystems: IEquipmentData[]
  mounts: IMountData[]
  integratedMounts: { weapon: IMechWeaponSaveData; source: string }[]
  improved_armament: IMountData
  integratedWeapon: IMountData
}

declare interface IMountData {
  mount_type: string
  lock: boolean
  slots: IWeaponSlotData[]
  extra: IWeaponSlotData[]
  bonus_effects: string[]
}

declare interface IWeaponSlotData {
  size: string
  weapon: IMechWeaponSaveData | null
}

declare interface ITagData {
  id: string
  val?: string | number
}

declare interface ILicenseRequirement {
  source: string
  name: string
  rank: number
  items: string[]
  missing?: boolean
}

declare interface ISnackbarSettings {
  text: string
  multiline?: boolean
  timeout?: number
  color?: string
  visible?: boolean
}

declare interface Brew {
  info: string
  dir: string
}

declare interface PrintOptions {
  mech_id: string
  loadout_index: number
  combo: boolean
}

declare interface Faction {
  id: string
  name: string
  description: string
  logo: string
  color: string
}

declare interface Status {
  name: string
  type: string
  effects: string[]
}

declare interface Environment {
  id: string
  name: string
  description: string
}

declare interface Sitrep {
  id: string
  name: string
  description: string
  pcVictory: string
  enemyVictory: string
  noVictory?: string
  deployment?: string
  objective?: string
  controlZone?: string
  extraction?: string
}

declare interface FrameTrait {
  name: string
  description: string
}
