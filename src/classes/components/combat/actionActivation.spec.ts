import { describe, it, expect, beforeEach } from 'vitest'
import { makeMech, makePilot } from '@/__tests__/factories'
import type { Mech } from '@/classes/mech/Mech'

let m: Mech
const cc = () => m.CombatController

beforeEach(() => {
  m = makeMech(makePilot({ level: 3 }))
  m.SetStats()
  m.CombatController.StatController.resetCurrentStats()
  m.CombatController.CombatLog.Clear()
})

describe('an action button that already spent its activation', () => {
  it('still runs the rule, instead of being refused as insufficient', () => {
    const action = cc().FindAction('act_overcharge')!
    // what the Apply control does before the button's own handler fires
    expect(cc().Activate(action.Activation, { actionId: 'act_overcharge' })).toBe(true)

    expect(cc().RunAction('act_overcharge', { value: 1 })).toBe(true)
    expect(cc().InOvercharge).toBe(true)
    expect(cc().CombatLog.Events.some(e => e.kind === 'overcharge')).toBe(true)
    expect(cc().CombatLog.Events.some(e => e.kind === 'blocked')).toBe(false)
  })

  it('PerformAction would have been refused, which is the bug it replaces', () => {
    const action = cc().FindAction('act_overcharge')!
    cc().Activate(action.Activation, { actionId: 'act_overcharge' })

    expect(cc().PerformAction('act_overcharge', { value: 1 })).toBe(false)
    expect(cc().InOvercharge).toBe(false)
  })

  it('RunAction still honors the rule preconditions', () => {
    cc().SetCombatAction('overcharge', false)
    expect(cc().RunAction('act_overcharge', { value: 1 })).toBe(false)
    expect(
      cc()
        .CombatLog.Events.filter(e => e.kind === 'blocked')
        .map(e => (e.payload as any).reason)
    ).toContain('unavailable')
  })

  it('PerformAction on its own is unchanged', () => {
    expect(cc().PerformAction('act_overcharge', { value: 1 })).toBe(true)
    expect(cc().InOvercharge).toBe(true)
  })
})
