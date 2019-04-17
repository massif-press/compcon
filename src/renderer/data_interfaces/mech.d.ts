declare interface MechMount {
  mount_type: string,
  weapons: { id: string, mod?: string }[],
  bonuses: string[],
  imparm?: boolean
}

declare interface MechLoadout {
  id: string,
  name: string,
  systems: ItemID[],
  mounts: MechMount[]
}

declare interface MechConfig {
  id: string,
  pilot_id: string,
  name: string,
  frame_id: string,
  loadouts: MechLoadout[]
}

declare interface MechStats {
  size: number,
  structure: number,
  hull: number,
  agi: number,
  sys: number,
  eng: number,
  hp: number,
  sp: number,
  used_sp: number,
  armor: number,
  save_target: number,
  repcap: number,
  evasion: number,
  speed: number,
  sensor_range: number,
  edef: number,
  heatcap: number,
  heatstress: number,
  limited_bonus: number,
  attack_bonus: number,
  tech_attack: number,
  grapple: number,
  ram: number,
  save_bonus: number,
  integrated_mounts: string[],
  integrated_systems: string[],
  required_licenses: LicenseReq[],
}