declare interface PilotLicense {
  name: string, source: string, level: number
}

declare interface PilotLoadout {
  id: string,
  items: {
    armor: (ItemID | null)[],
    gear: (ItemID | null)[],
    weapon: (ItemID | null)[]
  },
  name: string
}

declare interface PilotSkill {
  id: string, bonus: number
}

declare interface PilotInvocation {
  trigger: string,
  accuracy?: boolean,
  difficulty?: boolean,
}

declare interface PilotTalent {
  id: string, rank: number
}

declare interface MechSkills {
  hull: number,
  agi: number,
  sys: number,
  eng: number
}

declare interface Pilot {
  id: string,
  callsign: string,
  name: string,
  level: number,
  background: string,
  text_appearance?: string,
  notes: string,
  history?: string | null,
  contacts: object[],
  licenses: PilotLicense[],
  loadouts: PilotLoadout[],
  skills: PilotSkill[],
  invocations?: PilotInvocation[],
  talents: PilotTalent[],
  mechSkills: MechSkills,
  core_bonuses: String[],
  configs: MechConfig[],
  portrait?: string,
  avatar?: string,
  quirk?: any
}

declare interface PilotStats {
  hp: number,
  armor: number,
  evasion: number,
  edef: number,
  speed: number,
  grit: number
  mech: MechSkills,
}

declare interface PilotContact {
  name: string,
  relationship: string,
  description: string,
}