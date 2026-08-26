import { describe, it, expect, beforeEach } from 'vitest'
import { makePilot, makeMech } from '@/__tests__/factories'
import type { Mech } from '@/classes/mech/Mech'
import { ActivePeriod, Frequency } from '@/classes/Frequency'
import { CombatController } from './CombatController'

let mech: Mech

const cc = () => mech.CombatController
const mark = (id: string, freq: string) => cc().MarkActionUsed(id, new Frequency(freq))

beforeEach(() => {
  mech = makeMech(makePilot({ level: 3 }))
})

describe('action use counting', () => {
  it('spends each use in turn and blocks once exhausted', () => {
    mark('act_x', '3/encounter')
    expect(cc().RemainingUses('act_x')).toBe(2)

    mark('act_x', '3/encounter')
    mark('act_x', '3/encounter')
    expect(cc().RemainingUses('act_x')).toBe(0)
    expect(cc().IsActionUsed('act_x')).toBe(true)

    mark('act_x', '3/encounter')
    expect(cc().UsedCount('act_x')).toBe(3)
  })

  it('treats a mark without a frequency as a single turn-scoped use', () => {
    cc().MarkActionUsed('weapon_instance_id')
    expect(cc().IsActionUsed('weapon_instance_id')).toBe(true)

    cc().ClearUses(ActivePeriod.Turn)
    expect(cc().IsActionUsed('weapon_instance_id')).toBe(false)
  })

  it('restores one use at a time', () => {
    mark('act_x', '2/round')
    mark('act_x', '2/round')
    expect(cc().IsActionUsed('act_x')).toBe(true)

    cc().RestoreUse('act_x')
    expect(cc().RemainingUses('act_x')).toBe(1)

    cc().RestoreUse('act_x')
    expect(cc().UsedCount('act_x')).toBe(0)
  })
})

describe('action use reset tiers', () => {
  beforeEach(() => {
    mark('per_turn', '1/turn')
    mark('per_round', '1/round')
    mark('per_encounter', '1/encounter')
  })

  it('clears only turn-scoped uses on a turn event', () => {
    cc().ClearUses(ActivePeriod.Turn)
    expect(cc().IsActionUsed('per_turn')).toBe(false)
    expect(cc().IsActionUsed('per_round')).toBe(true)
    expect(cc().IsActionUsed('per_encounter')).toBe(true)
  })

  it('clears turn and round uses on a round event', () => {
    cc().ClearUses(ActivePeriod.Round)
    expect(cc().IsActionUsed('per_turn')).toBe(false)
    expect(cc().IsActionUsed('per_round')).toBe(false)
    expect(cc().IsActionUsed('per_encounter')).toBe(true)
  })

  it('clears every encounter-scoped use on a scene event', () => {
    cc().ClearUses(ActivePeriod.Scene)
    expect(cc().UsedCount('per_encounter')).toBe(0)
  })

  it('refreshes turn-scoped uses when a single-activation actor ends its turn', () => {
    cc().EndTurn()
    expect(cc().IsActionUsed('per_turn')).toBe(false)
    expect(cc().IsActionUsed('per_round')).toBe(true)
  })

  it('refreshes round-scoped uses at the end of the round', () => {
    cc().EndRound(null)
    expect(cc().IsActionUsed('per_round')).toBe(false)
    expect(cc().IsActionUsed('per_encounter')).toBe(true)
  })

  it('refreshes encounter-scoped uses when the encounter ends', () => {
    cc().EndEncounter()
    expect(cc().IsActionUsed('per_encounter')).toBe(false)
  })
})

describe('action use serialization', () => {
  it('round-trips partially spent uses', () => {
    mark('act_x', '3/encounter')
    mark('act_x', '3/encounter')

    const target = {} as any
    CombatController.Serialize(cc(), target)

    const fresh = makeMech(makePilot({ level: 3 })).CombatController
    CombatController.Deserialize(fresh, target)

    expect(fresh.RemainingUses('act_x')).toBe(1)
  })

  it('reads a legacy usedActions array as exhausted round-scoped uses', () => {
    CombatController.Deserialize(cc(), { usedActions: ['act_hide'] } as any)

    expect(cc().IsActionUsed('act_hide')).toBe(true)
    cc().ClearUses(ActivePeriod.Turn)
    expect(cc().IsActionUsed('act_hide')).toBe(true)
    cc().ClearUses(ActivePeriod.Round)
    expect(cc().IsActionUsed('act_hide')).toBe(false)
  })
})
