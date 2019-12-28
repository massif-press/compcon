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
  IContentPackManifest,
  IContentPack,
} from '@/interface'


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
    id,
    active: false,
    manifest,
    data: {
      manufacturers,
      coreBonuses,
      frames,
      weapons,
      systems,
      mods,
      pilotGear,
      talents,
      tags,
    }
  }
}

export { parseContentPack }
