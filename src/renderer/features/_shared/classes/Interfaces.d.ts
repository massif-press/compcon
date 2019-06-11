declare interface IRankedData {
  id: string
  rank: number
}

declare interface IEquipmentData {
  id: string
  notes: string[]
}

declare interface IMechWeaponData extends IEquipmentData {
  mod: string | null
}

declare interface IPilotData {
  id: string
  gistID: string
  level: number
  callsign: string
  name: string
  text_appearance: string
  notes: string
  history: string
  portrait: string
  cloud_portrait: string
  quirk: string
  current_hp: number
  active: boolean
  //TODO:
  // contacts: object[];
  background: IBackgroundData | string
  mechSkills: number[]
  licenses: IRankedData[]
  skills: IRankedData[]
  talents: IRankedData[]
  core_bonuses: string[]
  loadouts: IPilotLoadoutData[]
  active_loadout: string | null
  mechs: IMechData[]
  active_mech: string | null
  cc_ver: string
}

declare interface IPilotLoadoutData {
  id: string
  name: string
  armor: (IEquipmentData | null)[]
  weapons: (IEquipmentData | null)[]
  gear: (IEquipmentData | null)[]
}

declare interface IMechData {
  id: string
  name: string
  notes: string
  portrait: string
  cloud_portrait: string
  frame: string
  active: boolean
  current_structure: number
  current_hp: number
  current_stress: number
  current_heat: number
  current_repairs: number
  loadouts: IMechLoadoutData[]
  active_loadout: string | null
  cc_ver: string
}

declare interface IMechLoadoutData {
  id: string
  name: string
  systems: IEquipmentData[]
  mounts: IMountData[]
  improved_armament: IMountData
  integratedWeapon: IMountData
  retrofitIndex: number | null
  retrofitOriginalType: string | null
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
  weapon: IMechWeaponData | null
}

declare interface ITagData {
  id: string
  val: string | number
}

declare interface IBackgroundData {
  id: string
  name: string
  description: string
  triggers: string
}
