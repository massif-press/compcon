import {
  CampaignStore,
  CompendiumStore,
  EncounterStore,
  NarrativeStore,
  NpcStore,
  PilotStore,
} from '@/stores'
import { ImportData } from './Data'
import { BrewInfo } from '@/classes/components/brew/BrewController'
import { Pilot } from '@/class'
import { Encounter } from '@/classes/encounter/Encounter'
import { Campaign } from '@/classes/campaign/Campaign'
import { Character } from '@/classes/narrative/Character'
import { Faction } from '@/classes/narrative/Faction'
import { Location } from '@/classes/narrative/Location'
import { Doodad } from '@/classes/npc/doodad/Doodad'
import { Eidolon } from '@/classes/npc/eidolon/Eidolon'
import { Unit } from '@/classes/npc/unit/Unit'
import logger from '@/user/logger'
import {
  isV2Pilot,
  isV2Npc,
  isV2Encounter,
  preprocessPilotImport,
  preprocessNpcImport,
  preprocessEncounterImport,
} from './V2Importer'
import { isFullBackup, processFullBackup } from './FullImporter'

class StagedObject {
  collection: string
  type: string
  missingPacks: BrewInfo[]
  data: any

  constructor(collection: string, type: string, data: any) {
    this.collection = collection
    this.type = type
    this.missingPacks = this.getMissingPacks(data)
    this.data = data
  }

  public get status(): boolean {
    return this.missingPacks.length === 0
  }

  private getMissingPacks(data: any): BrewInfo[] {
    const missingPacks = [] as BrewInfo[]
    if (!data.brews) return missingPacks
    ;(data.brews as BrewInfo[]).forEach(pack => {
      if (!CompendiumStore().ContentPacks.find(x => x.ID === pack.LcpId)) missingPacks.push(pack)
    })
    return missingPacks
  }
}

export const StageFileImport = async (file: any): Promise<StagedObject[]> => {
  if (!file) throw new Error('No file provided tp importer')
  const fileObj: File = file.target.files[0]
  const data = await ImportData<any>(fileObj)

  // Route .compcon full backup files to FullImporter
  if (fileObj.name.endsWith('.compcon') || isFullBackup(data)) {
    await processFullBackup(data)
    return []
  }

  return await StageImport(data)
}

// takes file data and returns an array of staged objects with statuses and content pack info
export const StageImport = async (data: any): Promise<StagedObject[]> => {
  if (!data) throw new Error('No data provided tp importer')
  const stagedObjects: StagedObject[] = []
  let content = [] as any[]

  if (Array.isArray(data) && isV2Encounter(data)) {
    content = data
  } else if (data.type && data.type.includes('collection')) {
    content = data.data
  } else {
    content.push(data)
  }

  for (const item of content) {
    if (isV2Pilot(item)) {
      const result = await preprocessPilotImport(item)
      if (result.action === 'import' && result.transformed) {
        stagedObjects.push(new StagedObject('Pilot', 'pilot', result.transformed))
      } else if (result.action === 'backup') {
        stagedObjects.push(new StagedObject('V2Backup', 'pilot', item))
      }
    } else if (isV2Npc(item)) {
      const result = await preprocessNpcImport(item)
      if (result.action === 'import' && result.transformed) {
        stagedObjects.push(
          new StagedObject('NPC', result.transformed.npcType || 'unit', result.transformed)
        )
      } else if (result.action === 'backup') {
        stagedObjects.push(new StagedObject('V2Backup', 'npc', item))
      }
    } else if (isV2Encounter(item)) {
      const result = await preprocessEncounterImport(item)
      if (result.action === 'import' && result.transformed) {
        const transformed = Array.isArray(result.transformed)
          ? result.transformed
          : [result.transformed]
        for (const enc of transformed) {
          stagedObjects.push(new StagedObject('Encounter', 'Encounter', enc))
        }
      } else if (result.action === 'backup') {
        stagedObjects.push(new StagedObject('V2Backup', 'encounter', item))
      }
    } else if (item.npcType) {
      stagedObjects.push(new StagedObject('NPC', item.npcType, item))
    } else if (item.collectionItemType) {
      stagedObjects.push(new StagedObject('Narrative Item', item.collectionItemType, item))
    } else if (item.itemType === 'Encounter') {
      stagedObjects.push(new StagedObject('Encounter', item.itemType, item))
    } else if (item.itemType === 'pilot') {
      stagedObjects.push(new StagedObject('Pilot', item.itemType, item))
    } else if (item.itemType === 'campaign') {
      stagedObjects.push(new StagedObject('Campaign', item.itemType, item))
    }
  }

  return stagedObjects
}

// takes an array of staged objects and imports them into storage, returning a list of errors
export const ImportStagedData = async (
  stagedObjects: StagedObject[],
  collection?: any
): Promise<string[]> => {
  if (!stagedObjects) throw new Error('No staged objects provided to importer')
  if (!Array.isArray(stagedObjects)) stagedObjects = [stagedObjects]
  const errors = [] as string[]
  for (let i = 0; i < stagedObjects.length; i++) {
    const item = stagedObjects[i]
    try {
      if (item.status) {
        if (item.collection === 'NPC') {
          await ImportNpcData(item.data, collection)
        } else if (item.collection === 'Narrative Item') {
          await ImportNarrativeData(item.data, collection)
        } else if (item.collection === 'Encounter') {
          await ImportEncounter(item.data, collection)
        } else if (item.collection === 'Pilot') {
          await ImportPilot(item.data, collection)
        } else if (item.collection === 'Campaign') {
          await ImportCampaign(item.data, collection)
        }
      } else {
        errors.push(
          `${item.collection} ${item.type} ${(item as any).name} is missing required content packs`
        )
      }
    } catch (err) {
      errors.push(`${item.collection} ${item.type} ${(item as any).name} failed to import: ${err}`)
    }
  }

  return errors
}

function claimOwnership(item: any, collection?: any): void {
  item.SaveController.RemoteCode = ''
  item.SaveController.RemoteAuthor = ''
  item.SaveController.RemoteCollection = collection || ''
  item.CloudController.GenerateMetadata()
}

export const ImportNpcData = async (data: any, collection?: any): Promise<void> => {
  switch (data.npcType.toLowerCase()) {
    case 'unit':
      const unit = Unit.Deserialize(data)
      claimOwnership(unit, collection)
      await NpcStore().AddNpc(unit)
      break
    case 'doodad':
      const doodad = Doodad.Deserialize(data)
      claimOwnership(doodad, collection)
      await NpcStore().AddNpc(doodad)
      break
    case 'eidolon':
      const eidolon = Eidolon.Deserialize(data)
      claimOwnership(eidolon, collection)
      await NpcStore().AddNpc(eidolon)
      break
    default:
      logger.error('Unknown item type:', data.npcType.toLowerCase())
      break
  }
}

export const ImportNarrativeData = async (data: any, collection?: any): Promise<void> => {
  let item
  switch (data.collectionItemType.toLowerCase()) {
    case 'character':
      item = Character.Deserialize(data)
      break
    case 'faction':
      item = Faction.Deserialize(data)
      break
    case 'location':
      item = Location.Deserialize(data)
      break
    default:
      throw new Error('Unknown item type: ' + data.collectionItemType)
  }
  if (item) {
    claimOwnership(item, collection)
    await NarrativeStore().AddItem(item)
  } else throw new Error('Failed to import narrative item')
}

export const ImportEncounter = async (data: any, collection?: any): Promise<void> => {
  const item = Encounter.Deserialize(data)
  claimOwnership(item, collection)
  await EncounterStore().AddEncounter(item)
}

export const ImportPilot = async (data: any, collection?: any): Promise<void> => {
  const item = new Pilot(data)
  claimOwnership(item, collection)
  await PilotStore().AddPilot(item)
}

export const ImportCampaign = async (data: any, collection?: any): Promise<void> => {
  const item = Campaign.Deserialize(data)
  claimOwnership(item, collection)
  await CampaignStore().AddCampaign(item)
}

export const DeleteItemPermanent = async (item: any): Promise<void> => {
  const type = item.ItemType
  if (!type) throw new Error('No item type provided to delete')

  switch (type.toLowerCase()) {
    case 'npc':
    case 'unit':
    case 'doodad':
    case 'eidolon':
      await NpcStore().DeleteNpcPermanent(item)
      break
    case 'narrative item':
    case 'collection item':
    case 'character':
    case 'faction':
    case 'location':
      await NarrativeStore().DeleteItemPermanent(item)
      break
    case 'encounter':
      await EncounterStore().DeleteEncounterPermanent(item)
      break
    case 'pilot':
      await PilotStore().DeletePilotPermanent(item)
      break
    case 'campaign':
      await CampaignStore().DeleteCampaign(item)
      break
    default:
      throw new Error('Unknown item type: ' + type)
  }
}

export const GenerateExportCollection = (items: any[], type: string) => {
  if (!items || items.length === 0) throw new Error('No items provided to export')
  let json
  if (items.length === 1) {
    const item = items[0]
    json = (item as any).Serialize()
  } else {
    const data = items.map((x: any) => x.Serialize())
    json = {
      type: `${type}_collection`,
      item_count: data.length,
      data,
    }
  }

  return json
}
