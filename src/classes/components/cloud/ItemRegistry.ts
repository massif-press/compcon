import { Pilot } from '../../pilot/Pilot'
import { Doodad } from '@/classes/npc/doodad/Doodad'
import { Eidolon } from '@/classes/npc/eidolon/Eidolon'
import { Unit } from '@/classes/npc/unit/Unit'
import { Encounter } from '@/classes/encounter/Encounter'
import { Campaign } from '@/classes/campaign/Campaign'
import { Character } from '@/classes/narrative/Character'
import { Faction } from '@/classes/narrative/Faction'
import { Location } from '@/classes/narrative/Location'
import { EncounterInstance } from '@/classes/encounter/EncounterInstance'
import { EncounterArchive } from '@/classes/encounter/EncounterArchive'
import PilotSheet from '@/features/pilot_management/store/PilotSheet'
import { PilotGroup } from '@/features/pilot_management/store/PilotGroup'
import { PilotStore, PilotGroupStore, PilotSheetStore } from '@/features/pilot_management/store'
import { NpcStore } from '@/features/gm/store/npc_store'
import { NarrativeStore } from '@/features/gm/store/narrative_store'
import { EncounterStore } from '@/features/gm/store/encounter_store'
import { CampaignStore } from '@/features/gm/store/campaign_store'
import type { ICloudSyncable } from './ICloudSyncable'
import { normalizeItemType } from './ItemTypeMap'

export interface ItemRegistration {
  construct: (data: any) => ICloudSyncable
  add: (item: ICloudSyncable) => Promise<void>
  deleteLocal: (item: ICloudSyncable) => Promise<void>
  getAll: () => ICloudSyncable[]
}

const _registry = new Map<string, ItemRegistration>([
  [
    'pilot',
    {
      construct: data => new Pilot(data),
      add: item => Promise.resolve(PilotStore().AddPilot(item as Pilot)),
      deleteLocal: item => PilotStore().DeletePilotPermanent(item as Pilot),
      getAll: () => PilotStore().Pilots,
    },
  ],
  [
    'pilotgroup',
    {
      construct: data => PilotGroup.Deserialize(data),
      add: item => PilotGroupStore().AddGroup(item as PilotGroup),
      deleteLocal: item => PilotGroupStore().DeleteGroupPermanent(item as PilotGroup),
      getAll: () => PilotGroupStore().PilotGroups,
    },
  ],
  [
    'unit',
    {
      construct: data => Unit.Deserialize(data),
      add: item => NpcStore().AddNpc(item as Unit),
      deleteLocal: item => NpcStore().DeleteNpcPermanent(item as Unit),
      getAll: () => NpcStore().Npcs.filter(n => normalizeItemType(n.ItemType) === 'unit'),
    },
  ],
  [
    'doodad',
    {
      construct: data => Doodad.Deserialize(data),
      add: item => NpcStore().AddNpc(item as Doodad),
      deleteLocal: item => NpcStore().DeleteNpcPermanent(item as Doodad),
      getAll: () => NpcStore().Npcs.filter(n => normalizeItemType(n.ItemType) === 'doodad'),
    },
  ],
  [
    'eidolon',
    {
      construct: data => Eidolon.Deserialize(data),
      add: item => NpcStore().AddNpc(item as Eidolon),
      deleteLocal: item => NpcStore().DeleteNpcPermanent(item as Eidolon),
      getAll: () => NpcStore().Npcs.filter(n => normalizeItemType(n.ItemType) === 'eidolon'),
    },
  ],
  [
    'character',
    {
      construct: data => Character.Deserialize(data),
      add: item => NarrativeStore().AddItem(item as Character),
      deleteLocal: item => NarrativeStore().DeleteItemPermanent(item as Character),
      getAll: () =>
        NarrativeStore().CollectionItems.filter(n => normalizeItemType(n.ItemType) === 'character'),
    },
  ],
  [
    'faction',
    {
      construct: data => Faction.Deserialize(data),
      add: item => NarrativeStore().AddItem(item as Faction),
      deleteLocal: item => NarrativeStore().DeleteItemPermanent(item as Faction),
      getAll: () =>
        NarrativeStore().CollectionItems.filter(n => normalizeItemType(n.ItemType) === 'faction'),
    },
  ],
  [
    'location',
    {
      construct: data => Location.Deserialize(data),
      add: item => NarrativeStore().AddItem(item as Location),
      deleteLocal: item => NarrativeStore().DeleteItemPermanent(item as Location),
      getAll: () =>
        NarrativeStore().CollectionItems.filter(n => normalizeItemType(n.ItemType) === 'location'),
    },
  ],
  [
    'encounter',
    {
      construct: data => Encounter.Deserialize(data),
      add: item => EncounterStore().AddEncounter(item as Encounter),
      deleteLocal: item => EncounterStore().DeleteEncounterPermanent(item as Encounter),
      getAll: () => EncounterStore().Encounters,
    },
  ],
  [
    'encounterinstance',
    {
      construct: data => EncounterInstance.Deserialize(data),
      add: item => EncounterStore().AddEncounterInstance(item as EncounterInstance),
      deleteLocal: item => EncounterStore().RemoveEncounterInstance(item as EncounterInstance),
      getAll: () => EncounterStore().ActiveEncounters,
    },
  ],
  [
    'encounterarchive',
    {
      construct: data => EncounterArchive.Deserialize(data),
      add: item => EncounterStore().AddEncounterArchive(item as EncounterArchive),
      deleteLocal: item => EncounterStore().RemoveEncounterArchive(item as EncounterArchive),
      getAll: () => EncounterStore().ArchivedEncounters,
    },
  ],
  [
    'pilotsheet',
    {
      construct: data => PilotSheet.Deserialize(data),
      add: item => PilotSheetStore().ImportPilotSheet(item as PilotSheet),
      deleteLocal: item => PilotSheetStore().RemovePilotSheet(item as PilotSheet),
      getAll: () => PilotSheetStore().PilotSheets,
    },
  ],
  [
    'campaign',
    {
      construct: data => Campaign.Deserialize(data),
      add: item => CampaignStore().AddCampaign(item as Campaign),
      deleteLocal: item => CampaignStore().DeleteCampaign(item as Campaign),
      getAll: () => CampaignStore().Campaigns,
    },
  ],
] as Array<[string, ItemRegistration]>)

export function getItemRegistration(itemType: string): ItemRegistration | undefined {
  return _registry.get(normalizeItemType(itemType))
}

export function allRegistrations(): Map<string, ItemRegistration> {
  return _registry
}
