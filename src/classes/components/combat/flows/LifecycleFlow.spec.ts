import { describe, it, expect, beforeEach, vi } from 'vitest'
import { EndTurnFlow, EndRoundFlow } from './LifecycleFlow'
import { makeMech, makePilot } from '@/__tests__/factories'
import { StatKey } from '../stats/Stats'
import type { Mech } from '@/classes/mech/Mech'

let m: Mech
const cc = () => m.CombatController
const cur = (key: string) => cc().StatController.getCurrent(key)
const set = (key: string, val: number) => cc().StatController.setCurrentStat(key, val)

beforeEach(() => {
  m = makeMech(makePilot({ level: 3 }))
  m.SetStats()
  m.CombatController.StatController.resetCurrentStats()
})

describe('EndTurnFlow', () => {
  it('runs its steps in the documented order', () => {
    expect(EndTurnFlow.Steps).toEqual([
      'burn-check',
      'pending-checks',
      'clear-overcharge',
      'spend-activation',
      'clear-turn-uses',
      'next-activation',
      'refresh-table-reactions',
    ])
  })

  it('ends the turn when nothing is outstanding', () => {
    const before = cur(StatKey.ACTIVATIONS)
    const r = cc().EndTurn()

    expect(r.outcome).toBe('complete')
    expect(cur(StatKey.ACTIVATIONS)).toBe(before - 1)
  })

  it('holds the turn open for a burn check, and spends nothing until it is answered', () => {
    set(StatKey.BURN, 4)
    const before = cur(StatKey.ACTIVATIONS)

    const first = cc().EndTurn()
    expect(first.outcome).toBe('awaiting')
    expect(first.pending).toBe('burn-check')
    expect(first.request).toEqual({ kind: 'check', label: 'burn' })
    expect(cur(StatKey.ACTIVATIONS)).toBe(before)

    const second = cc().ResumeEndTurn(first, { success: true })
    expect(second.outcome).toBe('complete')
    expect(cur(StatKey.BURN)).toBe(0)
    expect(cur(StatKey.ACTIVATIONS)).toBe(before - 1)
  })

  it('takes the burn as damage on a failed check and still ends the turn', () => {
    set(StatKey.BURN, 3)
    const hp = cur(StatKey.HP)

    const first = cc().EndTurn()
    const second = cc().ResumeEndTurn(first, { success: false })

    expect(second.outcome).toBe('complete')
    expect(cur(StatKey.HP)).toBe(hp - 3)
    expect(cur(StatKey.BURN)).toBe(3)
  })

  it('holds the turn open while a structure or stress check is unresolved', () => {
    cc().AddPendingCheck('structure')
    const before = cur(StatKey.ACTIVATIONS)

    const first = cc().EndTurn()
    expect(first.outcome).toBe('awaiting')
    expect(first.pending).toBe('pending-checks')
    expect(first.request).toEqual({
      kind: 'check',
      label: 'structureOrStressCheck',
      pending: ['structure'],
    })
    expect(cur(StatKey.ACTIVATIONS)).toBe(before)

    cc().RemovePendingCheck(cc().PendingChecks[0].id)
    expect(cc().ResumeEndTurn(first).outcome).toBe('complete')
    expect(cur(StatKey.ACTIVATIONS)).toBe(before - 1)
  })
})

describe('simple play mode', () => {
  beforeEach(() => {
    m.Parent.CombatController.ManualPlay = true
  })

  it('follows the pilot', () => {
    expect(cc().Automated).toBe(false)
  })

  it('skips the burn check', () => {
    set(StatKey.BURN, 4)
    expect(cc().EndTurn().outcome).toBe('complete')
    expect(cur(StatKey.BURN)).toBe(4)
  })

  it('queues no check on a structure loss', () => {
    set(StatKey.STRUCTURE, cur(StatKey.STRUCTURE) - 1)
    expect(cc().PendingChecks).toEqual([])
    expect(cc().EndTurn().outcome).toBe('complete')
  })

  it('ignores leftover pending checks', () => {
    m.Parent.CombatController.ManualPlay = false
    cc().AddPendingCheck('structure')
    m.Parent.CombatController.ManualPlay = true
    expect(cc().EndTurn().outcome).toBe('complete')
  })

  it('does not roll recharge at turn start', () => {
    const feature = { Recharge: 2, Used: true }
    vi.spyOn(cc(), 'AllEquipment', 'get').mockReturnValue([feature] as any)
    cc().StartTurn()
    expect(feature.Used).toBe(true)
    expect(cc().CanRollRecharge).toBe(true)
  })

  it('does not down a pilot at zero HP', () => {
    const p = m.Parent.CombatController
    p.StatController.setCurrentStat(StatKey.HP, 0)
    expect(p.HasStatus('downandout')).toBe(false)
  })
})

describe('EndRoundFlow', () => {
  it('runs its steps in the documented order', () => {
    expect(EndRoundFlow.Steps).toEqual([
      'spend-remaining-activation',
      'brace-teardown',
      'refill-activations',
      'expire-statuses',
      'advance-round',
    ])
  })

  it('refills the pool and advances the round', () => {
    cc().SetCombatAction('full', false)
    const round = cc().Round

    cc().EndRound()

    expect(cc().Round).toBe(round + 1)
    expect(cc().CanActivate('full')).toBe(true)
    expect(cur(StatKey.ACTIVATIONS)).toBe(cc().StatController.getMax(StatKey.ACTIVATIONS))
  })

  it('trades brace for the brace cooldown instead of a full pool', () => {
    cc().Brace()
    expect(cc().Braced).toBe(true)

    cc().EndRound()

    expect(cc().Braced).toBe(false)
    expect(cc().HasCustomStatus('Brace Cooldown')).toBe(true)
    expect(cc().CanActivate('full')).toBe(false)
    expect(cc().CanActivate('quick')).toBe(true)
  })
})
