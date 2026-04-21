import { CompendiumStore, NpcStore } from '@/stores'
import { GetAll, SetItem, RemoveItem } from './Storage'
import { ImportEncounter, ImportNpcData, ImportPilot } from './Importer'

const V2_STAT_RENAME: Record<string, string> = {
  evade: 'evasion',
  sensor: 'sensorRange',
  save: 'saveTarget',
  agility: 'agi',
  systems: 'sys',
  engineering: 'eng',
}

const V2_STAT_KEYS = [
  'activations',
  'armor',
  'structure',
  'stress',
  'hp',
  'evade',
  'edef',
  'heatcap',
  'speed',
  'sensor',
  'save',
  'hull',
  'agility',
  'systems',
  'engineering',
  'size',
]

function buildCustomTierCombatData(v2Stats: Record<string, any>): any {
  const stats: Record<string, any> = {}
  for (const k of V2_STAT_KEYS) {
    const val = v2Stats[k]
    if (val === undefined || val === null) continue
    const v3Key = V2_STAT_RENAME[k] ?? k
    stats[v3Key] = Number(Array.isArray(val) ? val[0] : val)
  }
  if (v2Stats.sizes !== undefined) stats.sizes = v2Stats.sizes
  stats.attackBonus = 1
  stats.grapple = 1
  stats.ram = 1
  return {
    stats: { stat_version: 1, max: { ...stats }, current: { ...stats } },
  }
}

interface V2BackupRecord {
  id: string
  type: 'pilot' | 'npc' | 'encounter'
  originalData: any
  missingLcps: string[]
  missingLcpNames: string[]
  timestamp: number
}

// ---------------------------------------------------------------------------
// Detection
// ---------------------------------------------------------------------------

export function isV2Pilot(data: any): boolean {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return false
  if (data.itemType === 'pilot') return false
  return data.callsign !== undefined
}

export function isV2Npc(data: any): boolean {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return false
  if (data.npcType) return false
  return data.cc_ver !== undefined || (typeof data.class === 'string' && data.items !== undefined)
}

export function isV2Encounter(data: any): boolean {
  if (!data) return false
  if (Array.isArray(data)) {
    return data.length > 0 && data[0]?.npcs !== undefined && !data[0]?.itemType
  }
  if (data.itemType === 'Encounter') return false
  return (
    !data.itemType &&
    data.npcs !== undefined &&
    Array.isArray(data.npcs) &&
    (data.npcs.length === 0 || (typeof data.npcs[0] === 'object' && !data.npcs[0]?.npcType))
  )
}

// ---------------------------------------------------------------------------
// LCP requirement analysis
// ---------------------------------------------------------------------------

export function getV2PilotMissingLcps(data: any): { missingIds: string[]; missingNames: string[] } {
  const missingIds: string[] = []
  const missingNames: string[] = []
  const brews: any[] = data.brews || []
  for (const brew of brews) {
    if (!CompendiumStore().ContentPacks.find(p => p.ID === brew.LcpId && p.Active)) {
      missingIds.push(brew.LcpId)
      missingNames.push(brew.LcpName || brew.LcpId)
    }
  }
  return { missingIds, missingNames }
}

export function getV2NpcMissingLcps(data: any): {
  missingIds: string[]
  missingNames: string[]
  unresolvableFeatures: string[]
} {
  const missingIds: string[] = []
  const missingNames: string[] = []
  const unresolvableFeatures: string[] = []
  const brews: any[] = data.brews || []
  for (const brew of brews) {
    if (!CompendiumStore().ContentPacks.find(p => p.ID === brew.LcpId && p.Active)) {
      missingIds.push(brew.LcpId)
      missingNames.push(brew.LcpName || brew.LcpId)
    }
  }
  const items: any[] = data.items || []
  for (const item of items) {
    if (
      !CompendiumStore().NpcFeatures.find((f: any) => f.ID === item.itemID || f.id === item.itemID)
    ) {
      if (!unresolvableFeatures.includes(item.itemID)) {
        unresolvableFeatures.push(item.itemID)
      }
    }
  }
  return { missingIds, missingNames, unresolvableFeatures }
}

export function getV2EncounterMissingNpcs(data: any): string[] {
  const missing: string[] = []
  const entries = [...(data.npcs || []), ...(data.reinforcements || [])]
  for (const entry of entries) {
    if (!NpcStore().Npcs.find((n: any) => n.ID === entry.id)) {
      if (!missing.includes(entry.id)) missing.push(entry.id)
    }
  }
  return missing
}

// ---------------------------------------------------------------------------
// Transformation
// ---------------------------------------------------------------------------

export function transformV2Pilot(data: any): any {
  const now = Date.now()
  const brews = (data.brews || []).map((b: any) => ({ ...b, Status: 'OK' }))

  return {
    ...data,
    core_bonuses: (data.core_bonuses || []).map((cb: any) =>
      typeof cb === 'string' ? { id: cb } : cb
    ),
    itemType: 'pilot',
    is_instance: false,
    instanceId: '',
    originId: data.id,
    sortIndex: data.sort_index !== undefined ? data.sort_index : -1,
    img: {
      portrait: data.portrait || '',
      cloud_portrait: data.cloud_portrait || '',
    },
    save: {
      lastModified: now,
      deleteTime: 0,
      created: now,
      remote_code: '',
      remote_author: '',
      remote_collection: '',
    },
    cloud: {},
    brews,
    bond: {
      bondId: data.bondId || '',
      xp: data.xp || 0,
      stress: data.stress || 0,
      maxStress: data.maxStress || 8,
      powerSelections: data.powerSelections || 0,
      isBroken: data.isBroken || false,
      burdens: data.burdens || [],
      bondPowers: data.bondPowers || [],
      clocks: data.clocks || [],
      minorIdeal: data.minorIdeal || '',
      bondAnswers: data.bondAnswers || ['', ''],
      force: false,
    },
    mechs: (data.mechs || []).map((mech: any) => {
      const cleanedLoadouts = (mech.loadouts || []).map((loadout: any) => {
        const cleanedSystems = (loadout.systems || []).filter((sys: any) =>
          !!CompendiumStore().MechSystems.find((s: any) => s.ID === sys.id || s.id === sys.id)
        )
        const cleanedMounts = (loadout.mounts || []).map((mount: any) => ({
          ...mount,
          slots: (mount.slots || []).map((slot: any) => {
            if (!slot.weapon) return slot
            const found = CompendiumStore().MechWeapons.find(
              (w: any) => w.ID === slot.weapon.id || w.id === slot.weapon.id
            )
            return { ...slot, weapon: found ? slot.weapon : null }
          }),
        }))
        return { ...loadout, systems: cleanedSystems, mounts: cleanedMounts }
      })
      return {
        ...mech,
        img: mech.img || { portrait: mech.portrait || '', cloud_portrait: mech.cloud_portrait || '' },
        loadouts: cleanedLoadouts,
      }
    }),
  }
}

export function transformV2Npc(data: any): any {
  const now = Date.now()

  const features = (data.items || []).map((item: any) => ({
    id: item.itemID,
    data: { isUsed: item.destroyed || false },
  }))

  const brews = (data.brews || []).map((b: any) => {
    const pack = CompendiumStore().ContentPacks.find(p => p.ID === b.LcpId && p.Active)
    return { ...b, Status: pack ? 'OK' : 'MISSING' }
  })

  const result: any = { ...data }

  result.npcType = 'unit'
  result.instance = false
  result.instanceId = ''
  result.originId = ''
  result.features = features
  result.brews = brews
  result.save = {
    lastModified: now,
    deleteTime: 0,
    created: now,
    remote_code: '',
    remote_author: '',
    remote_collection: '',
  }
  result.cloud = {}
  result.img = {
    portrait: data.portrait || data.localImage || '',
    cloud_portrait: data.cloud_portrait || data.cloudImage || '',
  }
  result.narrative = {
    textItems: [],
    labels: data.labels || [],
    relationships: [],
    clocks: [],
    tables: [],
  }
  result.folder = { folder: data.group || '' }
  if (data.tier === 'custom') {
    result.combat_data = data.stats ? buildCustomTierCombatData(data.stats) : {}
    result.tier = 1
  } else {
    result.combat_data = {}
  }

  delete result.cc_ver
  delete result.active
  delete result.lastModified
  delete result.isDeleted
  delete result.expireTime
  delete result.deleteTime
  delete result.lastUpdate_cloud
  delete result.lastSync
  delete result.portrait
  delete result.cloud_portrait
  delete result.cloudImage
  delete result.localImage
  delete result.items
  delete result.group
  delete result.labels

  return result
}

export function transformV2Encounter(rawData: any): any[] {
  const encounters = Array.isArray(rawData) ? rawData : [rawData]
  const now = Date.now()

  return encounters.map(enc => {
    const combatants: any[] = []
    let index = 0

    for (const entry of enc.npcs || []) {
      const npc = NpcStore().Npcs.find((n: any) => n.ID === entry.id)
      if (!npc) continue
      combatants.push({
        index: index++,
        type: 'unit',
        actor: (npc as any).Serialize(true),
        side: entry.side || 'enemy',
        playerCount: 1,
        reinforcement: false,
        reinforcementTurn: 0,
        deployables: [],
      })
    }

    for (const entry of enc.reinforcements || []) {
      const npc = NpcStore().Npcs.find((n: any) => n.ID === entry.id)
      if (!npc) continue
      combatants.push({
        index: index++,
        type: 'unit',
        actor: (npc as any).Serialize(true),
        side: entry.side || 'enemy',
        playerCount: 1,
        reinforcement: true,
        reinforcementTurn: 0,
        deployables: [],
      })
    }

    const textItems = enc.narrativeNotes ? [{ header: 'Notes', body: enc.narrativeNotes }] : []

    return {
      itemType: 'Encounter',
      id: enc.id || crypto.randomUUID(),
      name: enc.name || 'New Encounter',
      note: enc.gmNotes || '',
      description: '',
      gmDescription: '',
      sitrep: enc.sitrep,
      environment: enc.environment
        ? { name: enc.environment, modified: false, description: enc.environmentDetails || '' }
        : undefined,
      combatants,
      save: {
        lastModified: now,
        deleteTime: 0,
        created: now,
        remote_code: '',
        remote_author: '',
        remote_collection: '',
      },
      img: { portrait: '', cloud_portrait: '' },
      narrative: {
        textItems,
        labels: enc.labels || [],
        relationships: [],
        clocks: [],
        tables: [],
      },
      folder: { folder: enc.campaign || '' },
    }
  })
}

// ---------------------------------------------------------------------------
// Backup store
// ---------------------------------------------------------------------------

export async function saveV2Backup(
  type: 'pilot' | 'npc' | 'encounter',
  originalData: any,
  missingIds: string[],
  missingNames: string[]
): Promise<void> {
  const id = originalData.id || crypto.randomUUID()
  const record: V2BackupRecord = {
    id,
    type,
    originalData,
    missingLcps: missingIds,
    missingLcpNames: missingNames,
    timestamp: Date.now(),
  }
  await SetItem('v2_backup', record)
}

export async function getV2Backups(): Promise<V2BackupRecord[]> {
  return (await GetAll('v2_backup')) as V2BackupRecord[]
}

export async function deleteV2Backup(id: string): Promise<void> {
  await RemoveItem('v2_backup', id)
}

// ---------------------------------------------------------------------------
// Force import (strips unresolvable items)
// ---------------------------------------------------------------------------

export async function forceImportV2Pilot(
  data: any
): Promise<{ imported: any; stripped: string[] }> {
  const stripped: string[] = []

  const cleanedData = { ...data }
  cleanedData.mechs = (data.mechs || []).map((mech: any) => {
    const cleanedLoadouts = (mech.loadouts || []).map((loadout: any) => {
      const cleanedSystems = (loadout.systems || []).filter((sys: any) => {
        const found = CompendiumStore().MechSystems.find(
          (s: any) => s.ID === sys.id || s.id === sys.id
        )
        if (!found) stripped.push(sys.id || '(unknown)')
        return !!found
      })
      const cleanedMounts = (loadout.mounts || []).map((mount: any) => ({
        ...mount,
        slots: (mount.slots || []).map((slot: any) => {
          if (!slot.weapon) return slot
          const found = CompendiumStore().MechWeapons.find(
            (w: any) => w.ID === slot.weapon.id || w.id === slot.weapon.id
          )
          if (!found) stripped.push(slot.weapon.id || '(unknown)')
          return { ...slot, weapon: found ? slot.weapon : null }
        }),
      }))
      return { ...loadout, systems: cleanedSystems, mounts: cleanedMounts }
    })
    return { ...mech, loadouts: cleanedLoadouts }
  })

  const transformed = transformV2Pilot(cleanedData)
  await ImportPilot(transformed)
  return { imported: transformed, stripped }
}

export async function forceImportV2Npc(data: any): Promise<{ imported: any; stripped: string[] }> {
  const stripped: string[] = []

  const cleanedItems = (data.items || []).filter((item: any) => {
    const found = CompendiumStore().NpcFeatures.find(
      (f: any) => f.ID === item.itemID || f.id === item.itemID
    )
    if (!found) stripped.push(item.itemID || '(unknown)')
    return !!found
  })

  const cleanedData = { ...data, items: cleanedItems }
  const transformed = transformV2Npc(cleanedData)
  await ImportNpcData(transformed)
  return { imported: transformed, stripped }
}

export async function forceImportV2Encounter(
  data: any
): Promise<{ imported: any[]; stripped: string[] }> {
  const stripped: string[] = []

  const cleanEnc = (enc: any) => ({
    ...enc,
    npcs: (enc.npcs || []).filter((entry: any) => {
      const found = NpcStore().Npcs.find((n: any) => n.ID === entry.id)
      if (!found) stripped.push(entry.id)
      return !!found
    }),
    reinforcements: (enc.reinforcements || []).filter((entry: any) => {
      const found = NpcStore().Npcs.find((n: any) => n.ID === entry.id)
      if (!found) stripped.push(entry.id)
      return !!found
    }),
  })

  const encounters = Array.isArray(data) ? data : [data]
  const transformed = transformV2Encounter(encounters.map(cleanEnc))
  for (const enc of transformed) {
    await ImportEncounter(enc)
  }
  return { imported: transformed, stripped }
}

// ---------------------------------------------------------------------------
// Re-import backups
// ---------------------------------------------------------------------------

export async function reprocessV2Backups(): Promise<{
  succeeded: string[]
  stillPending: string[]
}> {
  const backups = await getV2Backups()
  const succeeded: string[] = []
  const stillPending: string[] = []

  for (const backup of backups) {
    let missing: string[] = []

    if (backup.type === 'pilot') {
      missing = getV2PilotMissingLcps(backup.originalData).missingIds
    } else if (backup.type === 'npc') {
      const npcMissing = getV2NpcMissingLcps(backup.originalData)
      missing = [...npcMissing.missingIds, ...npcMissing.unresolvableFeatures]
    } else if (backup.type === 'encounter') {
      missing = getV2EncounterMissingNpcs(backup.originalData)
    }

    if (missing.length === 0) {
      try {
        if (backup.type === 'pilot') {
          const transformed = transformV2Pilot(backup.originalData)
          await ImportPilot(transformed)
        } else if (backup.type === 'npc') {
          const transformed = transformV2Npc(backup.originalData)
          await ImportNpcData(transformed)
        } else if (backup.type === 'encounter') {
          const transformed = transformV2Encounter(backup.originalData)
          for (const enc of transformed) {
            await ImportEncounter(enc)
          }
        }
        await deleteV2Backup(backup.id)
        succeeded.push(backup.id)
      } catch {
        stillPending.push(backup.id)
      }
    } else {
      stillPending.push(backup.id)
    }
  }

  return { succeeded, stillPending }
}

// ---------------------------------------------------------------------------
// op-Tlevel preprocessing (called by Importer.ts)
// ---------------------------------------------------------------------------

export async function preprocessPilotImport(
  data: any
): Promise<{ action: 'import' | 'backup'; transformed?: any; missingLcps?: string[] }> {
  if (!isV2Pilot(data)) return { action: 'import', transformed: data }

  const { missingIds, missingNames } = getV2PilotMissingLcps(data)
  if (missingIds.length === 0) {
    return { action: 'import', transformed: transformV2Pilot(data) }
  }

  await saveV2Backup('pilot', data, missingIds, missingNames)
  return { action: 'backup', missingLcps: missingIds }
}

export async function preprocessNpcImport(
  data: any
): Promise<{ action: 'import' | 'backup'; transformed?: any; missingLcps?: string[] }> {
  if (!isV2Npc(data)) return { action: 'import', transformed: data }

  const { missingIds, missingNames, unresolvableFeatures } = getV2NpcMissingLcps(data)
  if (missingIds.length === 0 && unresolvableFeatures.length === 0) {
    return { action: 'import', transformed: transformV2Npc(data) }
  }

  await saveV2Backup('npc', data, missingIds, missingNames)
  return { action: 'backup', missingLcps: missingIds }
}

export async function preprocessEncounterImport(
  data: any
): Promise<{ action: 'import' | 'backup'; transformed?: any; missingNpcs?: string[] }> {
  if (!isV2Encounter(data)) return { action: 'import', transformed: data }

  // Handle array: check all encounters for missing NPCs
  const encounters = Array.isArray(data) ? data : [data]
  const allMissing: string[] = []
  for (const enc of encounters) {
    const missing = getV2EncounterMissingNpcs(enc)
    for (const id of missing) {
      if (!allMissing.includes(id)) allMissing.push(id)
    }
  }

  if (allMissing.length === 0) {
    return { action: 'import', transformed: transformV2Encounter(data) }
  }

  // Back up each encounter individually
  for (const enc of encounters) {
    const missing = getV2EncounterMissingNpcs(enc)
    if (missing.length > 0) {
      await saveV2Backup('encounter', enc, missing, missing)
    } else {
      // This encounter has all its NPCs, import it now
      const transformed = transformV2Encounter(enc)
      for (const t of transformed) {
        await ImportEncounter(t)
      }
    }
  }

  return { action: 'backup', missingNpcs: allMissing }
}
