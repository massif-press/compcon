import _ from 'lodash'
import JSZip, { JSZipObject } from 'jszip'
import {
  IMechWeaponData,
  IManufacturerData,
  ICoreBonusData,
  IFrameData,
  IMechSystemData,
  IWeaponModData,
  ITalentData,
  IPilotEquipmentData,
} from '@/interface'
import { saveData, loadData } from './Data'

export interface IContentPackManifest {
  name: string
  author: string
  version: string
  description?: string
  website?: string
}
const isValidManifest = function(obj: any): obj is IContentPackManifest {
  return (
    'name' in obj &&
    typeof obj.name === 'string' &&
    'author' in obj &&
    typeof obj.author === 'string' &&
    'version' in obj &&
    typeof obj.version === 'string'
  )
}

interface IContentPackContentData {
  manufacturers: IManufacturerData[]
  coreBonuses: ICoreBonusData[]
  frames: IFrameData[]
  weapons: IMechWeaponData[]
  systems: IMechSystemData[]
  mods: IWeaponModData[]
  pilotGear: IPilotEquipmentData[]
  talents: ITalentData[]
  tags: ITagData[]
}

export interface IContentPackData {
  manifest: IContentPackManifest
  data: IContentPackContentData
}

export interface IContentPackInfo {
  manifest: IContentPackManifest
  active: boolean
  id: string
}

export interface IContentPack {
  info: IContentPackInfo
  data: IContentPackContentData
}

const readZipJSON = async function<T>(zip: JSZip, filename: string): Promise<T | null> {
  const file: JSZipObject | null = zip.file(filename)
  if (!file) return null
  const text = await file.async('text')
  return JSON.parse(text)
}

const getPackID = async function(manifest: IContentPackManifest): Promise<string> {
  const enc = new TextEncoder()
  const signature = `${manifest.author}/${manifest.name}`
  const hash = await crypto.subtle.digest('SHA-1', enc.encode(signature))
  return btoa(String.fromCharCode.apply(null, new Uint8Array(hash)))
}

const parseContentPack = async function(binString: string): Promise<IContentPack> {
  const zip = await JSZip.loadAsync(binString)

  const manifest = await readZipJSON<IContentPackManifest>(zip, 'lcp_manifest.json')
  if (!manifest) throw new Error('Content pack has no manifest')
  if (!isValidManifest(manifest)) throw new Error('Content manifest is invalid')

  const manufacturers = (await readZipJSON<IManufacturerData[]>(zip, 'manufacturers.json')) || []
  const coreBonuses = (await readZipJSON<ICoreBonusData[]>(zip, 'core_bonus.json')) || []
  const frames = (await readZipJSON<IFrameData[]>(zip, 'frames.json')) || []
  const weapons = (await readZipJSON<IMechWeaponData[]>(zip, 'weapons.json')) || []
  const systems = (await readZipJSON<IMechSystemData[]>(zip, 'systems.json')) || []
  const mods = (await readZipJSON<IWeaponModData[]>(zip, 'mods.json')) || []
  const pilotGear = (await readZipJSON<IPilotEquipmentData[]>(zip, 'pilot_gear.json')) || []
  const talents = (await readZipJSON<ITalentData[]>(zip, 'talents.json')) || []
  const tags = (await readZipJSON<ITagData[]>(zip, 'tags.json')) || []


  const id = await getPackID(manifest)

  return {
    info: {
      manifest,
      active: true,
      id,
    },
    data: _.mapValues(
      {
        manufacturers,
        coreBonuses,
        frames,
        weapons,
        systems,
        mods,
        pilotGear,
        talents,
        tags,
      },
      (collection: any) => collection.map(item => ({ ...item, brew: id }))
    ),
  }
}

const loadSavedContent = async function(): Promise<IContentPack[]> {
  return await loadData<IContentPack>('extra_content.json')
}

const saveContentPack = async function(contentPack: IContentPack): Promise<void> {
  const currentExtraContent = await loadSavedContent()
  saveData('extra_content.json', [...currentExtraContent, contentPack])
}

const removeContentPack = async function(packID: string): Promise<void> {
  const currentExtraContent = await loadSavedContent()
  saveData('extra_content.json', currentExtraContent.filter(pack => pack.info.id !== packID))
}

export { parseContentPack, loadSavedContent, saveContentPack, removeContentPack }
