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
import { PilotStore } from '@/features/pilot_management/store'
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

const _registry = new Map<string, ItemRegistration>(([
  [
    'pilot',
    {
      construct: data => new Pilot(data),
      add: item => Promise.resolve(PilotStore().AddPilot(item as any)),
      deleteLocal: item => PilotStore().DeletePilotPermanent(item as any),
      getAll: () => PilotStore().Pilots as any[],
    },
  ],
  [
    'pilotgroup',
    {
      construct: data => PilotGroup.Deserialize(data),
      add: item => PilotStore().AddGroup(item as any),
      deleteLocal: item => PilotStore().DeleteGroupPermanent(item as any),
      getAll: () => PilotStore().PilotGroups as any[],
    },
  ],
  [
    'unit',
    {
      construct: data => Unit.Deserialize(data),
      add: item => NpcStore().AddNpc(item as any),
      deleteLocal: item => NpcStore().DeleteNpcPermanent(item as any),
      getAll: () => NpcStore().Npcs.filter((n: any) => normalizeItemType(n.ItemType) === 'unit'),
    },
  ],
  [
    'doodad',
    {
      construct: data => Doodad.Deserialize(data),
      add: item => NpcStore().AddNpc(item as any),
      deleteLocal: item => NpcStore().DeleteNpcPermanent(item as any),
      getAll: () => NpcStore().Npcs.filter((n: any) => normalizeItemType(n.ItemType) === 'doodad'),
    },
  ],
  [
    'eidolon',
    {
      construct: data => Eidolon.Deserialize(data),
      add: item => NpcStore().AddNpc(item as any),
      deleteLocal: item => NpcStore().DeleteNpcPermanent(item as any),
      getAll: () => NpcStore().Npcs.filter((n: any) => normalizeItemType(n.ItemType) === 'eidolon'),
    },
  ],
  [
    'character',
    {
      construct: data => Character.Deserialize(data),
      add: item => NarrativeStore().AddItem(item as any),
      deleteLocal: item => NarrativeStore().DeleteItemPermanent(item as any),
      getAll: () =>
        NarrativeStore().CollectionItems.filter(
          (n: any) => normalizeItemType(n.ItemType) === 'character'
        ),
    },
  ],
  [
    'faction',
    {
      construct: data => Faction.Deserialize(data),
      add: item => NarrativeStore().AddItem(item as any),
      deleteLocal: item => NarrativeStore().DeleteItemPermanent(item as any),
      getAll: () =>
        NarrativeStore().CollectionItems.filter(
          (n: any) => normalizeItemType(n.ItemType) === 'faction'
        ),
    },
  ],
  [
    'location',
    {
      construct: data => Location.Deserialize(data),
      add: item => NarrativeStore().AddItem(item as any),
      deleteLocal: item => NarrativeStore().DeleteItemPermanent(item as any),
      getAll: () =>
        NarrativeStore().CollectionItems.filter(
          (n: any) => normalizeItemType(n.ItemType) === 'location'
        ),
    },
  ],
  [
    'encounter',
    {
      construct: data => Encounter.Deserialize(data),
      add: item => EncounterStore().AddEncounter(item as any),
      deleteLocal: item => EncounterStore().DeleteEncounterPermanent(item as any),
      getAll: () => EncounterStore().Encounters as any[],
    },
  ],
  [
    'encounterinstance',
    {
      construct: data => EncounterInstance.Deserialize(data),
      add: item => EncounterStore().AddEncounterInstance(item as any),
      deleteLocal: item => EncounterStore().RemoveEncounterInstance(item as any),
      getAll: () => EncounterStore().ActiveEncounters as any[],
    },
  ],
  [
    'encounterarchive',
    {
      construct: data => EncounterArchive.Deserialize(data),
      add: item => EncounterStore().AddEncounterArchive(item as any),
      deleteLocal: item => EncounterStore().RemoveEncounterArchive(item as any),
      getAll: () => EncounterStore().ArchivedEncounters as any[],
    },
  ],
  [
    'pilotsheet',
    {
      construct: data => PilotSheet.Deserialize(data),
      add: item => PilotStore().ImportPilotSheet(item as any),
      deleteLocal: item => PilotStore().RemovePilotSheet(item as any),
      getAll: () => PilotStore().PilotSheets as any[],
    },
  ],
  [
    'campaign',
    {
      construct: data => Campaign.Deserialize(data),
      add: item => CampaignStore().AddCampaign(item as any),
      deleteLocal: item => CampaignStore().DeleteCampaign(item as any),
      getAll: () => CampaignStore().Campaigns as any[],
    },
  ],
]) as Array<[string, ItemRegistration]>)

export function getItemRegistration(itemType: string): ItemRegistration | undefined {
  return _registry.get(normalizeItemType(itemType))
}

export function allRegistrations(): Map<string, ItemRegistration> {
  return _registry
}
