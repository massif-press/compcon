import { cloneDeep } from 'lodash-es'
import { Range, type IRangeData } from '@/classes/Range'
import { RangeType } from '@/classes/enums'
import { Pilot } from '@/classes/pilot/Pilot'
import { Mech } from '@/classes/mech/Mech'
import { Unit } from '@/classes/npc/unit/Unit'
import { Eidolon } from '@/classes/npc/eidolon/Eidolon'
import { EidolonLayer, type IEidolonLayerData } from '@/classes/npc/eidolon/EidolonLayer'
import { CompendiumStore } from '@/features/compendium/store'
import type { Frame } from '@/classes/mech/components/frame/Frame'
import { toRaw } from 'vue'
import { CloudController } from '@/classes/components/cloud/CloudController'

export function makeRange(overrides: Partial<IRangeData> = {}): Range {
  return Range.Deserialize({
    type: RangeType.Range,
    val: 5,
    ...overrides,
  })
}

export function frame(id = 'mf_standard_pattern_i_everest'): Frame {
  const f = CompendiumStore().Frames.find(x => x.ID === id)
  if (!f) throw new Error(`Frame ${id} is not in the compendium`)
  return cloneDeep(f)
}

export function makePilot(
  overrides: Partial<{ name: string; callsign: string; level: number }> = {}
): Pilot {
  const p = new Pilot()
  p.Name = overrides.name ?? 'Test Pilot'
  p.Callsign = overrides.callsign ?? 'TESTER'
  if (overrides.level !== undefined) p.Level = overrides.level
  return p
}

export function makeMech(
  pilot: Pilot = makePilot(),
  frameId = 'mf_standard_pattern_i_everest'
): Mech {
  const m = new Mech(frame(frameId), pilot)
  m.Name = 'Test Mech'
  pilot.AddMech(m)
  pilot.PilotStatController.SetStats()
  return m
}

export function makeNpc(name = 'Test NPC'): Unit {
  const u = new Unit()
  u.Name = name
  return u
}

export function makeEidolonLayer(n = 1, overrides: Partial<IEidolonLayerData> = {}): EidolonLayer {
  return new EidolonLayer({
    id: `test_elayer_${n}`,
    name: `Test Layer ${n}`,
    appearance: '',
    hints: `Test Hint ${n}`,
    rules: '',
    features: [],
    shards: { count: 2, detail: '' },
    ...overrides,
  })
}

export function makeEidolon(
  layers: EidolonLayer[] = [makeEidolonLayer(1), makeEidolonLayer(2), makeEidolonLayer(3)]
): Eidolon {
  const e = new Eidolon()
  e.Name = 'Test Eidolon'
  layers.forEach(l => e.AddLayer(l))
  return e
}

export function markSynced<T extends { CloudController: CloudController }>(
  item: T,
  lastModified = 100,
  updated = 500
): T {
  const raw = toRaw(item) as any
  raw.SaveController.LastModified = lastModified
  const savedata = raw.Serialize(false)
  CloudController.commitUpload(
    item.CloudController,
    savedata,
    {},
    CloudController.computeContentHash(savedata),
    { ...item.CloudController.Metadata.raw, updated, item_modified: lastModified }
  )
  return item
}
