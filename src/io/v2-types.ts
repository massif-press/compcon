export interface V2Brew {
  LcpId?: string
  LcpName?: string
  Status?: string
  [key: string]: unknown
}

export interface V2NpcItem {
  itemID: string
  destroyed?: boolean
  [key: string]: unknown
}

export interface V2EncounterNpc {
  id: string
  side?: string
  [key: string]: unknown
}

export interface V2MechSlotWeapon {
  id?: string
  [key: string]: unknown
}

export interface V2MechSlot {
  weapon?: V2MechSlotWeapon | null
  [key: string]: unknown
}

export interface V2MechMount {
  slots?: V2MechSlot[]
  [key: string]: unknown
}

export interface V2MechLoadout {
  systems?: Array<{ id?: string; [key: string]: unknown }>
  mounts?: V2MechMount[]
  [key: string]: unknown
}

export interface V2Mech {
  id?: string
  loadouts?: V2MechLoadout[]
  portrait?: string
  cloud_portrait?: string
  img?: { portrait?: string; cloud_portrait?: string }
  [key: string]: unknown
}

export interface V2Pilot {
  id?: string
  callsign?: string
  itemType?: string
  sort_index?: number
  portrait?: string
  cloud_portrait?: string
  brews?: V2Brew[]
  mechs?: V2Mech[]
  core_bonuses?: Array<string | { id: string }>
  skills?: Array<{ id?: string; rank?: number; custom?: boolean; [key: string]: unknown }>
  [key: string]: unknown
}

export interface V2Npc {
  id?: string
  cc_ver?: string
  class?: string
  npcType?: string
  items?: V2NpcItem[]
  brews?: V2Brew[]
  tier?: number | 'custom'
  stats?: Record<string, unknown>
  group?: string
  labels?: string[]
  portrait?: string
  cloud_portrait?: string
  cloudImage?: string
  localImage?: string
  [key: string]: unknown
}

export interface V2Encounter {
  id?: string
  name?: string
  npcs?: V2EncounterNpc[]
  reinforcements?: V2EncounterNpc[]
  itemType?: string
  gmNotes?: string
  narrativeNotes?: string
  sitrep?: unknown
  environment?: string
  environmentDetails?: string
  campaign?: string
  labels?: string[]
  [key: string]: unknown
}
