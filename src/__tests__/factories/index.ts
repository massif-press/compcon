import { cloneDeep } from 'lodash-es'
import { Range, type IRangeData } from '@/classes/Range'
import { RangeType } from '@/classes/enums'
import { Pilot } from '@/classes/pilot/Pilot'
import { Mech } from '@/classes/mech/Mech'
import { Unit } from '@/classes/npc/unit/Unit'
import { CompendiumStore } from '@/features/compendium/store'
import type { Frame } from '@/classes/mech/components/frame/Frame'

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
