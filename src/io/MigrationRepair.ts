import { toRaw } from 'vue'
import { GetAll, SetItem } from './Storage'
import { PilotStore, CompendiumStore, NpcStore } from '@/stores'
import { Pilot } from '@/classes/pilot/Pilot'
import { Unit } from '@/classes/npc/unit/Unit'

export interface MigrationFinding {
  category: 'flavor_description' | 'lcp_origin' | 'npc_stats'
  itemType: string
  itemId: string
  itemName: string
  description: string
  canFix: boolean
  mutate: (() => void) | null
  saveKey: string | null
}

const V2_STALE_KEYS = ['stats', 'currentStats', 'side', 'actions']

function resolveFeatureOrigin(feature: any, npcClasses: any[], npcTemplates: any[]): string | null {
  const origin = feature.origin

  if (origin && typeof origin === 'object') {
    const type = origin.type?.toLowerCase()
    const name = origin.name?.toLowerCase()
    if (type === 'class') {
      const cls = npcClasses.find(c => c.name?.toLowerCase() === name)
      if (cls) return cls.id
    } else if (type === 'template') {
      const tpl = npcTemplates.find(t => t.name?.toLowerCase() === name)
      if (tpl) return tpl.id
    }
  }

  const cls = npcClasses.find(
    c =>
      (c.base_features || []).includes(feature.id) ||
      (c.optional_features || []).includes(feature.id)
  )
  if (cls) return cls.id

  const tpl = npcTemplates.find(
    t =>
      ((t as any).base_features || []).includes(feature.id) ||
      ((t as any).optional_features || []).includes(feature.id)
  )
  if (tpl) return tpl.id

  return null
}

async function scanFlavorDescriptions(): Promise<MigrationFinding[]> {
  const findings: MigrationFinding[] = []

  for (const pilot of PilotStore().Pilots as Pilot[]) {
    for (const mech of pilot.Mechs) {
      const loadout = mech.MechLoadoutController.ActiveLoadout

      for (const weapon of loadout.Weapons) {
        if (!weapon?.FlavorDescription) continue
        if (weapon.FlavorDescription === weapon.Description) {
          const w = toRaw(weapon)
          findings.push({
            category: 'flavor_description',
            itemType: 'MechWeapon',
            itemId: w.ID,
            itemName: `${mech.Name} / ${w.Name}`,
            description: 'Flavor description matches item description text',
            canFix: true,
            mutate: () => { w.FlavorDescription = '' },
            saveKey: pilot.ID,
          })
        }
      }

      for (const system of loadout.Systems) {
        if (!system?.FlavorDescription) continue
        if (system.FlavorDescription === system.Description) {
          const s = toRaw(system)
          findings.push({
            category: 'flavor_description',
            itemType: 'MechSystem',
            itemId: s.ID,
            itemName: `${mech.Name} / ${s.Name}`,
            description: 'Flavor description matches item description text',
            canFix: true,
            mutate: () => { s.FlavorDescription = '' },
            saveKey: pilot.ID,
          })
        }
      }
    }
  }

  return findings
}

async function scanLcpOrigins(): Promise<MigrationFinding[]> {
  const findings: MigrationFinding[] = []

  for (const pack of CompendiumStore().ContentPacks.filter(p => p.Active)) {
    const data = pack.Data
    const npcClasses: any[] = data.npcClasses || []
    const npcTemplates: any[] = data.npcTemplates || []
    const npcFeatureIds = new Set<string>((data.npcFeatures || []).map((f: any) => f.id))

    for (const feature of data.npcFeatures || []) {
      if (!feature.origin || typeof feature.origin === 'string') continue

      const resolved = resolveFeatureOrigin(feature, npcClasses, npcTemplates)
      const f = toRaw(feature)

      if (resolved) {
        const r = resolved
        findings.push({
          category: 'lcp_origin',
          itemType: 'NpcFeature',
          itemId: feature.id,
          itemName: `${pack.Name} / ${feature.name || feature.id}`,
          description: 'Feature has unresolved object-form origin; can be resolved now',
          canFix: true,
          mutate: () => { f.origin = r },
          saveKey: pack.ID,
        })
      } else {
        findings.push({
          category: 'lcp_origin',
          itemType: 'NpcFeature',
          itemId: feature.id,
          itemName: `${pack.Name} / ${feature.name || feature.id}`,
          description: 'Feature has unresolvable origin. Delete and reinstall LCP to recover',
          canFix: false,
          mutate: null,
          saveKey: null,
        })
      }
    }

    const reported = new Set<string>()
    const checkDropped = (ownerName: string, featureIds: string[]) => {
      for (const id of featureIds) {
        if (!npcFeatureIds.has(id) && !reported.has(id)) {
          reported.add(id)
          findings.push({
            category: 'lcp_origin',
            itemType: 'NpcFeature',
            itemId: id,
            itemName: `${pack.Name} / ${ownerName} / ${id}`,
            description: `Feature referenced by "${ownerName}" is missing. Reinstall LCP "${pack.Name}" to recover`,
            canFix: false,
            mutate: null,
            saveKey: null,
          })
        }
      }
    }

    for (const cls of npcClasses) {
      checkDropped(cls.name || cls.id, [
        ...((cls.base_features as string[]) || []),
        ...((cls.optional_features as string[]) || []),
      ])
    }
    for (const tpl of npcTemplates) {
      checkDropped((tpl as any).name || (tpl as any).id, [
        ...(((tpl as any).base_features as string[]) || []),
        ...(((tpl as any).optional_features as string[]) || []),
      ])
    }
  }

  return findings
}

async function scanNpcStats(): Promise<MigrationFinding[]> {
  const findings: MigrationFinding[] = []
  const rawNpcs = await GetAll('npcs')

  for (const raw of rawNpcs) {
    if (raw.npcType !== 'unit') continue
    if (!V2_STALE_KEYS.some(k => k in raw)) continue

    const unit = NpcStore().Npcs.find(n => n.ID === raw.id) as Unit | undefined
    if (!unit) continue

    findings.push({
      category: 'npc_stats',
      itemType: 'Unit',
      itemId: raw.id,
      itemName: unit.Name,
      description: 'NPC has malformed v2 data fields that will be cleaned up on save',
      canFix: true,
      mutate: () => {},
      saveKey: raw.id,
    })
  }

  return findings
}

export async function runMigrationScan(): Promise<MigrationFinding[]> {
  const [flavorFindings, originFindings, statsFindings] = await Promise.all([
    scanFlavorDescriptions(),
    scanLcpOrigins(),
    scanNpcStats(),
  ])

  return [...flavorFindings, ...originFindings, ...statsFindings]
}

const MUTATION_CHUNK = 50

function tick(): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, 0))
}

export async function applyAllFixes(
  findings: MigrationFinding[],
  onProgress?: (done: number, total: number) => void
): Promise<void> {
  const fixable = findings.filter(f => f.canFix && f.mutate !== null)

  const pilotIds = [
    ...new Set(
      fixable
        .filter(f => f.category === 'flavor_description' && f.saveKey)
        .map(f => f.saveKey as string)
    ),
  ]

  const npcById = new Map(NpcStore().Npcs.map(n => [n.ID, n as Unit]))
  const npcIds = [
    ...new Set(
      fixable.filter(f => f.category === 'npc_stats' && f.saveKey).map(f => f.saveKey as string)
    ),
  ]
  const npcUnits = npcIds.map(id => npcById.get(id)).filter((u): u is Unit => !!u)

  const packById = new Map(CompendiumStore().ContentPacks.map(p => [p.ID, p]))
  const packIds = [
    ...new Set(
      fixable.filter(f => f.category === 'lcp_origin' && f.saveKey).map(f => f.saveKey as string)
    ),
  ]
  const packs = packIds.map(id => packById.get(id)).filter(Boolean)

  const saveTasks: (() => Promise<void>)[] = [
    ...pilotIds.map(id => () => PilotStore().SavePilotData([id])),
    ...npcUnits.map(u => () => NpcStore().SaveNpc(u)),
    ...packs.map(p => () => SetItem('content', (p as any).Serialize())),
  ]

  onProgress?.(0, saveTasks.length)

  for (let i = 0; i < fixable.length; i += MUTATION_CHUNK) {
    fixable.slice(i, i + MUTATION_CHUNK).forEach(f => f.mutate!())
    await tick()
  }

  for (let i = 0; i < saveTasks.length; i++) {
    await saveTasks[i]()
    onProgress?.(i + 1, saveTasks.length)
    await tick()
  }

  if (packs.length) await CompendiumStore().refreshExtraContent()
}
