import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  rollCheck,
  getCheckTable,
  markedPoints,
  effectsFor,
  resolveEffects,
  applyCheckEffects,
  equipmentOptions,
  systemTraumaFallback,
  prerollEffects,
} from '@/classes/components/combat/StructureCheck'
import { CompendiumStore } from '@/features/compendium/store'
import { mech, cur, set, setMax, rolls, rollSeq, StatKey } from './_helpers'

import type { Mech } from '@/classes/mech/Mech'

let m: Mech
const cc = () => m.CombatController
const table = (id: string) => {
  const t = CompendiumStore().Tables.find((x: any) => x.ID === id)
  if (!t) throw new Error(`table ${id} is not in the compendium`)
  return t
}

beforeEach(() => {
  m = mech()
})
afterEach(() => {
  vi.restoreAllMocks()
})

describe('structure and stress checks', () => {
  it('T-STRUCT-roll-01: rolls one die per marked point and takes the lowest', () => {
    rollSeq(5, 2, 6)
    const r = rollCheck(table('core-structure-damage'), 3)

    expect(r.dice).toHaveLength(3)
    expect(r.lowest).toBe(2)
  })

  it('T-STRUCT-roll-01: rolls at least one die when nothing is marked', () => {
    rolls(4)
    expect(rollCheck(table('core-structure-damage'), 0).dice).toHaveLength(1)
  })

  it('T-STRUCT-roll-01: counts marked points as maximum minus current', () => {
    setMax(cc(), StatKey.STRUCTURE, 4)
    set(cc(), StatKey.STRUCTURE, 2)
    expect(markedPoints(cc(), 'structure')).toBe(2)
  })

  it('T-STRUCT-crushing-01: two or more ones select the catastrophic row', () => {
    rollSeq(1, 1, 5)
    const r = rollCheck(table('core-structure-damage'), 3)

    expect(r.multipleOnes).toBe(true)
    expect(r.row?.title).toBe('Crushing Hit')
  })

  it('T-STRUCT-crushing-01: destroys the mech', () => {
    expect(effectsFor('core-structure-damage', { title: 'Crushing Hit' } as any)).toEqual([
      { type: 'destroy' },
    ])
  })

  it('T-STRESS-roll-01: stress checks use the overheating table', () => {
    expect(getCheckTable('stress', cc())?.ID).toBe('core-overheating')
  })

  it('T-STRESS-roll-01: structure checks use the standard table for a non-monstrosity', () => {
    expect(getCheckTable('structure', cc())?.ID).toBe('core-structure-damage')
  })

  it('T-STRESS-roll-01: takes the lowest die and honors multiple ones', () => {
    rollSeq(1, 1, 4)
    const r = rollCheck(table('core-overheating'), 3)

    expect(r.multipleOnes).toBe(true)
    expect(r.row?.title).toBe('Irreversible Meltdown')
  })

  it('T-STRESS-destab-01: applies exposed with no timed duration', () => {
    expect(effectsFor('core-overheating', { title: 'Destabilized Power Plant' } as any)).toEqual([
      { type: 'status', id: 'exposed' },
    ])
  })
})

describe('chart defects', () => {
  it('T-STRESS-meltdown-01: the 1d6-turn countdown is scheduled', () => {
    rolls(3)
    setMax(cc(), StatKey.STRESS, 4)
    set(cc(), StatKey.STRESS, 2)

    const fx = effectsFor('core-overheating', { title: 'Meltdown' } as any)
    const r = resolveEffects(
      fx,
      {
        currentStructure: 4,
        currentStress: 2,
        rolls: prerollEffects(fx),
        saveChoices: { '0.c1.0': 'fail' },
        equipChoices: {},
      },
      cc()
    )
    applyCheckEffects(cc(), r.actions)

    expect(r.actions.some(a => a.kind === 'reactor_meltdown')).toBe(true)
    expect(cc().TimedEffects.some(t => t.Round === cc().Round + 3)).toBe(true)
    expect(cc().ReactorDestroyed).toBe(false)
  })

  it('T-STRESS-meltdown-01: the meltdown can be prevented by retrying the engineering check', () => {
    cc().ScheduleReactorMeltdown(3)

    expect(cc().RetryMeltdownCheck(true)).toBe(true)
    expect(cc().TimedEffects.some(t => t.Apply?.other === 'reactor_meltdown')).toBe(false)
  })

  it('T-STRESS-meltdown-01: the retry costs a full action whether or not it succeeds', () => {
    cc().ScheduleReactorMeltdown(3)

    expect(cc().RetryMeltdownCheck(false)).toBe(false)
    expect(cc().CombatActions.Full).toBe(false)
    expect(cc().TimedEffects.some(t => t.Apply?.other === 'reactor_meltdown')).toBe(true)
  })

  it('T-STRESS-irreversible-01: the meltdown lands at the end of the next turn, not immediately', () => {
    const r = resolveEffects(
      effectsFor('core-overheating', { title: 'Irreversible Meltdown' } as any),
      { currentStructure: 4, currentStress: 0, rolls: {}, saveChoices: {}, equipChoices: {} },
      cc()
    )
    expect(r.actions.some(a => a.kind === 'reactor_meltdown')).toBe(true)

    applyCheckEffects(cc(), r.actions)

    expect(cc().ReactorDestroyed).toBe(false)
    expect(cc().TimedEffects.some(t => t.Round === cc().Round + 1)).toBe(true)
  })

  it('T-STRUCT-glancing-01: applies impaired until the end of the next turn', () => {
    expect(effectsFor('core-structure-damage', { title: 'Glancing Blow' } as any)).toEqual([
      { type: 'status', id: 'impaired', duration: 'end_turn_self' },
    ])
  })

  it('T-STRESS-shunt-01: applies impaired until the end of the next turn', () => {
    expect(effectsFor('core-overheating', { title: 'Emergency Shunt' } as any)).toEqual([
      { type: 'status', id: 'impaired', duration: 'end_turn_self' },
    ])
  })

  it('T-STRUCT-directhit-01: at three or more structure, stunned until the end of the next turn', () => {
    const fx = effectsFor('core-structure-damage', { title: 'Direct Hit' } as any) as any
    const branch = fx[0].cases.find((c: any) => c.at_least === 3)
    expect(branch.effects).toEqual([{ type: 'status', id: 'stunned', duration: 'end_turn_self' }])
  })

  it('T-STRUCT-directhit-01: at two structure the roll is a HULL check, not a save', () => {
    const fx = effectsFor('core-structure-damage', { title: 'Direct Hit' } as any) as any
    const branch = fx[0].cases.find((c: any) => c.equals === 2)
    expect(branch.effects[0].type).toBe('check')
  })

  it('T-STRUCT-trauma-01: excludes limited items that are out of charges', () => {
    const opts = equipmentOptions(cc(), 'system')
    expect(opts.every((o: any) => o.items.every((i: any) => !i.IsLimited || i.Uses > 0))).toBe(true)
  })

  it('T-STRUCT-trauma-01: falls through to the other branch when one has no valid target', () => {
    expect(systemTraumaFallback({ mounts: [], systems: ['a'] })).toBe('system')
    expect(systemTraumaFallback({ mounts: ['a'], systems: [] })).toBe('mount')
  })

  it('T-STRUCT-trauma-01: becomes a direct hit when nothing is destroyable', () => {
    expect(systemTraumaFallback({ mounts: [], systems: [] })).toBe('direct_hit')
  })

  it('T-STRUCT-monstrosity-01: dismemberment applies its 1d6 kinetic damage', () => {
    rolls(4)
    const hp = cur(cc(), StatKey.HP)

    const r = resolveEffects(
      effectsFor('core-monstrosity-structure-damage', { title: 'Dismemberment' } as any),
      {
        currentStructure: 3,
        currentStress: 4,
        rolls: { '1': 4 },
        saveChoices: {},
        equipChoices: {},
      },
      cc()
    )
    applyCheckEffects(cc(), r.actions)

    expect(cur(cc(), StatKey.HP)).toBe(hp - 4)
  })

  it('T-STRUCT-monstrosity-01: chart damage that costs a structure point queues its own check', () => {
    rolls(6)
    setMax(cc(), StatKey.HP, 10)
    set(cc(), StatKey.HP, 2)
    set(cc(), StatKey.STRUCTURE, 3)
    cc().PendingChecks = []

    const r = resolveEffects(
      effectsFor('core-monstrosity-structure-damage', { title: 'Dismemberment' } as any),
      {
        currentStructure: 3,
        currentStress: 4,
        rolls: { '1': 6 },
        saveChoices: {},
        equipChoices: {},
      },
      cc()
    )
    applyCheckEffects(cc(), r.actions)

    expect(cur(cc(), StatKey.STRUCTURE)).toBe(2)
    expect(cc().PendingChecks.filter(p => p.kind === 'structure')).toHaveLength(1)
  })

  it('T-STRUCT-monstrosity-01: dismemberment slows for the rest of the scene', () => {
    const fx = effectsFor('core-monstrosity-structure-damage', {
      title: 'Dismemberment',
    } as any) as any
    expect(fx[0]).toEqual({ type: 'status', id: 'slow', duration: 'scene' })
  })

  it('T-STRUCT-monstrosity-01: a monstrosity rolls a HULL save where a mech rolls a HULL check', () => {
    const mono = effectsFor('core-monstrosity-structure-damage', {
      title: 'Direct Hit',
    } as any) as any
    const std = effectsFor('core-structure-damage', { title: 'Direct Hit' } as any) as any

    expect(mono[0].cases.find((c: any) => c.equals === 2).effects[0].type).toBe('save')
    expect(std[0].cases.find((c: any) => c.equals === 2).effects[0].type).toBe('check')
  })
})
