export const SyncableItemType = {
  Pilot: 'pilot',
  Unit: 'unit',
  Doodad: 'doodad',
  Eidolon: 'eidolon',
  Character: 'character',
  Faction: 'faction',
  Location: 'location',
  Encounter: 'encounter',
  EncounterInstance: 'encounterinstance',
  EncounterArchive: 'encounterarchive',
  PilotSheet: 'pilotsheet',
  Campaign: 'campaign',
  Npc: 'npc',
  CollectionItem: 'collectionitem',
  Narrative: 'narrative',
} as const

export type SyncableItemTypeValue = (typeof SyncableItemType)[keyof typeof SyncableItemType]

export const allSyncableTypes: readonly string[] = [
  SyncableItemType.Pilot,
  SyncableItemType.Unit,
  SyncableItemType.Doodad,
  SyncableItemType.Eidolon,
  SyncableItemType.Character,
  SyncableItemType.Faction,
  SyncableItemType.Location,
  SyncableItemType.Encounter,
  SyncableItemType.EncounterInstance,
  SyncableItemType.EncounterArchive,
  SyncableItemType.PilotSheet,
  SyncableItemType.Campaign,
] as const

export const FilterGroupExpansion: Record<string, readonly string[]> = {
  npc: [SyncableItemType.Unit, SyncableItemType.Doodad, SyncableItemType.Eidolon],
  collectionitem: [SyncableItemType.Character, SyncableItemType.Faction, SyncableItemType.Location],
  encounter: [SyncableItemType.EncounterInstance, SyncableItemType.EncounterArchive],
  pilot: [SyncableItemType.PilotSheet],
} as const

export function expandFilterTypes(filters: string[]): string[] {
  const types = [...filters]
  for (const filter of filters) {
    const expansion = FilterGroupExpansion[filter]
    if (expansion) types.push(...expansion)
  }
  return types
}

export function normalizeItemType(raw: string): string {
  return raw.replace(/[-_]/g, '').toLowerCase()
}
