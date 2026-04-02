import { CompendiumStore } from '@/stores'
import { SetItem, SetValue, GetValue } from './Storage'
import { ImportPilot, ImportNpcData, ImportEncounter } from './Importer'
import { preprocessPilotImport, preprocessNpcImport, preprocessEncounterImport } from './V2Importer'
import logger from '@/user/logger'

interface FullImportResult {
  pilotsImported: number
  pilotsBackedUp: number
  npcsImported: number
  npcsBackedUp: number
  encountersImported: number
  encountersBackedUp: number
  lcpsImported: number
  errors: string[]
}

export function isFullBackup(data: any): boolean {
  return Array.isArray(data) && data.length > 0 && typeof data[0]?.filename === 'string'
}

export function extractFullBackupEntries(
  backup: Array<{ filename: string; data: string | null }>
): {
  pilots: any[]
  npcs: any[]
  encounters: any[]
  extraContent: any[]
} {
  const result = { pilots: [], npcs: [], encounters: [], extraContent: [] } as {
    pilots: any[]
    npcs: any[]
    encounters: any[]
    extraContent: any[]
  }

  const SKIP_ALWAYS = new Set(['active_missions_v2.json', 'missions_v2.json'])

  for (const entry of backup) {
    if (SKIP_ALWAYS.has(entry.filename)) continue
    if (!entry.data) continue

    let parsed: any
    try {
      parsed = JSON.parse(entry.data)
    } catch (e) {
      logger.error(`FullImporter: failed to parse entry ${entry.filename}`, {}, e)
      continue
    }

    switch (entry.filename) {
      case 'pilots_v2.json':
        if (Array.isArray(parsed)) result.pilots = parsed
        break
      case 'npcs_v2.json':
        if (Array.isArray(parsed)) result.npcs = parsed
        break
      case 'encounters_v2.json':
        if (Array.isArray(parsed)) result.encounters = parsed
        break
      case 'extra_content.json':
        if (Array.isArray(parsed)) result.extraContent = parsed
        break
      // pilot_groups_v2.json, user.config, and any future keys: ignored
    }
  }

  return result
}

export async function importExtraContent(lcpList: any[]): Promise<void> {
  for (const lcp of lcpList) {
    try {
      await SetItem('content', lcp)
    } catch (e) {
      logger.error(`FullImporter: failed to save LCP ${lcp?.id}`, {}, e)
    }
  }
  await CompendiumStore().refreshExtraContent()
}

export async function processFullBackup(
  backup: Array<{ filename: string; data: string | null }>
): Promise<FullImportResult> {
  await SetValue('v2_backup_download', backup)

  const result: FullImportResult = {
    pilotsImported: 0,
    pilotsBackedUp: 0,
    npcsImported: 0,
    npcsBackedUp: 0,
    encountersImported: 0,
    encountersBackedUp: 0,
    lcpsImported: 0,
    errors: [],
  }

  const { pilots, npcs, encounters, extraContent } = extractFullBackupEntries(backup)

  // load LCPs first
  if (extraContent.length > 0) {
    await importExtraContent(extraContent)
    result.lcpsImported = extraContent.length
  }

  // import pilots
  for (const pilot of pilots) {
    try {
      const r = await preprocessPilotImport(pilot)
      if (r.action === 'import' && r.transformed) {
        await ImportPilot(r.transformed)
        result.pilotsImported++
      } else if (r.action === 'backup') {
        result.pilotsBackedUp++
      }
    } catch (e) {
      result.errors.push(`Pilot ${pilot?.callsign || pilot?.id}: ${e}`)
    }
  }

  // import NPCs
  for (const npc of npcs) {
    try {
      const r = await preprocessNpcImport(npc)
      if (r.action === 'import' && r.transformed) {
        await ImportNpcData(r.transformed)
        result.npcsImported++
      } else if (r.action === 'backup') {
        result.npcsBackedUp++
      }
    } catch (e) {
      result.errors.push(`NPC ${npc?.name || npc?.id}: ${e}`)
    }
  }

  // import encounters (each is a single v2 encounter object)
  for (const enc of encounters) {
    try {
      const r = await preprocessEncounterImport(enc)
      if (r.action === 'import' && r.transformed) {
        const transformed = Array.isArray(r.transformed) ? r.transformed : [r.transformed]
        for (const t of transformed) {
          await ImportEncounter(t)
          result.encountersImported++
        }
      } else if (r.action === 'backup') {
        result.encountersBackedUp++
      }
    } catch (e) {
      result.errors.push(`Encounter ${enc?.name || enc?.id}: ${e}`)
    }
  }

  return result
}

export function serializeToFullBackup(
  rawLocalStorageEntries: Record<string, string | null>
): Array<{ filename: string; data: string | null }> {
  return Object.entries(rawLocalStorageEntries).map(([filename, data]) => ({ filename, data }))
}

export function downloadFullBackup(
  backup: Array<{ filename: string; data: string | null }>,
  filename?: string
): void {
  const json = JSON.stringify(backup)
  const blob = new Blob([json], { type: 'application/json' })
  const elem = window.document.createElement('a')
  elem.href = window.URL.createObjectURL(blob)
  elem.download = filename || `compcon_v2_backup_${new Date().toISOString().slice(0, 10)}.compcon`
  document.body.appendChild(elem)
  elem.click()
  document.body.removeChild(elem)
  window.URL.revokeObjectURL(elem.href)
}

// localStorage migration
// ---------------------------------------------------------------------------

export const V2_LOCALSTORAGE_KEYS = [
  'pilots_v2.json',
  'npcs_v2.json',
  'encounters_v2.json',
  'extra_content.json',
  'pilot_groups_v2.json',
  'active_missions_v2.json',
  'missions_v2.json',
  'user.config',
]

export async function migrateV2LocalStorage(): Promise<FullImportResult | null> {
  // Check if any v2 keys are present
  const presentKeys = V2_LOCALSTORAGE_KEYS.filter(k => window.localStorage.getItem(k) !== null)
  if (presentKeys.length === 0) return null

  // Check if migration was already completed (crash-during-migration recovery)
  const alreadyMigrated = await GetValue('v2_migration_complete')
  if (alreadyMigrated) {
    // clean up any remaining keys from a prior partial run
    presentKeys.forEach(k => window.localStorage.removeItem(k))
    return null
  }

  logger.info(`FullImporter: detected ${presentKeys.length} v2 localStorage keys, migrating...`)

  // read all present keys
  const rawEntries: Record<string, string | null> = {}
  for (const key of presentKeys) {
    rawEntries[key] = window.localStorage.getItem(key)
  }

  // compile into full backup format
  const backup = serializeToFullBackup(rawEntries)

  // store backup for UI to offer as download (do not auto-download; requires user gesture)
  await SetValue('v2_backup_download', backup)

  // process the backup (import LCPs → pilots → NPCs → encounters)
  const migrationResult = await processFullBackup(backup)

  // persist result so UI can display summary after page reload
  await SetValue('v2_migration_result', migrationResult)

  // mark migration complete
  await SetValue('v2_migration_complete', true)

  // clear v2 localStorage keys
  presentKeys.forEach(k => window.localStorage.removeItem(k))

  logger.info(
    `FullImporter: migration complete — ` +
      `${migrationResult.pilotsImported} pilots imported, ` +
      `${migrationResult.pilotsBackedUp} pilots backed up, ` +
      `${migrationResult.npcsImported} npcs imported, ` +
      `${migrationResult.npcsBackedUp} npcs backed up, ` +
      `${migrationResult.encountersImported} encounters imported, ` +
      `${migrationResult.encountersBackedUp} encounters backed up, ` +
      `${migrationResult.lcpsImported} LCPs imported`
  )

  if (migrationResult.errors.length > 0) {
    logger.error('FullImporter: migration errors:', {}, migrationResult.errors)
  }

  return migrationResult
}
