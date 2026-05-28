import { markRaw } from 'vue'
import _lancerData from '@massif/lancer-data'
import type { ContentPack } from '@/classes/ContentPack'

export const lancerData = markRaw(_lancerData)
const _lancerDataCache = new Map<string, any[]>()

export const hydratedKeys: Record<string, string> = {
  npc_classes: 'NpcClasses',
  npc_templates: 'NpcTemplates',
  npc_features: 'NpcFeatures',
  bonds: 'Bonds',
  backgrounds: 'Backgrounds',
  talents: 'Talents',
  core_bonuses: 'CoreBonuses',
  frames: 'Frames',
  manufacturers: 'Manufacturers',
  weapons: 'MechWeapons',
  mods: 'WeaponMods',
  systems: 'MechSystems',
  skills: 'Skills',
  actions: 'Actions',
  tags: 'Tags',
  reserves: 'Reserves',
  statuses: 'Statuses',
  environments: 'Environments',
  sitreps: 'Sitreps',
  pilot_gear: 'PilotGear',
  eidolon_layers: 'EidolonLayers',
  downtime_actions: 'DowntimeActions',
}

export const itemTypeMap: Record<string, string> = {
  actions: 'Actions',
  npcclass: 'NpcClasses',
  npctemplate: 'NpcTemplates',
  npcfeature: 'NpcFeatures',
  npctrait: 'NpcFeatures',
  npcreaction: 'NpcFeatures',
  npcweapon: 'NpcFeatures',
  npcsystem: 'NpcFeatures',
  npctech: 'NpcFeatures',
  bond: 'Bonds',
  bondpowers: 'ExtraBondPowers',
  background: 'Backgrounds',
  talent: 'Talents',
  corebonus: 'CoreBonuses',
  frame: 'Frames',
  manufacturer: 'Manufacturers',
  weapon: 'MechWeapons',
  mechweapon: 'MechWeapons',
  mod: 'WeaponMods',
  weaponmod: 'WeaponMods',
  system: 'MechSystems',
  mechsystem: 'MechSystems',
  skill: 'Skills',
  action: 'Actions',
  tag: 'Tags',
  reserve: 'Reserves',
  statuses: 'Statuses',
  status: 'Statuses',
  environment: 'Environments',
  sitrep: 'Sitreps',
  pilotarmor: 'PilotGear',
  pilotweapon: 'PilotGear',
  pilotgear: 'PilotGear',
  eidolonlayer: 'EidolonLayers',
  downtimeActions: 'DowntimeActions',
}

export function getLancerData<T>(itemType: string, constructor?: { new (Y: any): T }): T[] {
  const cacheKey = constructor ? `${itemType}:hydrated` : itemType
  if (_lancerDataCache.has(cacheKey)) return _lancerDataCache.get(cacheKey) as T[]
  const result: T[] = lancerData[itemType]
    ? constructor
      ? lancerData[itemType].map((x: any) => new constructor(x))
      : lancerData[itemType]
    : []
  _lancerDataCache.set(cacheKey, result)
  return result
}

export function collect<T>(
  packs: ContentPack[],
  itemType: string,
  constructor?: { new (Y: any): T }
): T[] {
  const lData = getLancerData<T>(itemType, constructor)
  const packData = packs
    .filter((pack: ContentPack) => pack.Active)
    .flatMap((pack: ContentPack) => (pack as any)[hydratedKeys[itemType]] || [])
  if (packData.length === 0) return lData
  return [...lData, ...packData]
}
