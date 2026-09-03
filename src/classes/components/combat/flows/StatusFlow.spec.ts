import { describe, it, expect, beforeEach } from 'vitest'
import { AddStatusFlow } from './StatusFlow'
import { makeMech, makePilot } from '@/__tests__/factories'
import { EffectSpecial } from '../../feature/active_effects/effect_subtype/EffectSpecial'
import type { Mech } from '@/classes/mech/Mech'

let m: Mech
const cc = () => m.CombatController
const sc = () => m.CombatController.StatusController

const state = (statusID: string, over = {}) =>
  ({ sc: sc(), statusID, selfInflicted: false, applied: false, ...over }) as any

beforeEach(() => {
  m = makeMech(makePilot({ level: 3 }))
  m.SetStats()
  m.CombatController.StatController.resetCurrentStats()
})

describe('AddStatusFlow', () => {
  it('runs its steps in the documented order', () => {
    expect(AddStatusFlow.Steps).toEqual([
      'status-lookup',
      'immunity',
      'resolve-expiration',
      'apply-status',
      'implications',
    ])
  })

  it('halts on a status the compendium does not carry', () => {
    const r = AddStatusFlow.Begin(state('not-a-status'))

    expect(r.outcome).toBe('halted')
    expect(r.pending).toBe('status-lookup')
    expect(r.state.blockedBy).toBe('unknown')
  })

  it('halts before applying a status the actor is immune to', () => {
    cc().SetCustomStatus(new EffectSpecial({ attribute: 'Flying', detail: 'airborne' }))

    const r = AddStatusFlow.Begin(state('prone'))

    expect(r.outcome).toBe('halted')
    expect(r.pending).toBe('immunity')
    expect(r.state.blockedBy).toBe('immune')
    expect(cc().HasStatus('prone')).toBe(false)
  })

  it('applies the statuses but only on the first application', () => {
    const first = AddStatusFlow.Begin(state('prone'))

    expect(first.outcome).toBe('complete')
    expect(first.state.applied).toBe(true)
    expect(cc().HasStatus('prone')).toBe(true)
    expect(cc().HasStatus('slow')).toBe(true)

    cc().RemoveStatus('slow')
    const second = AddStatusFlow.Begin(state('prone'))

    expect(second.state.applied).toBe(false)
    expect(cc().HasStatus('slow')).toBe(false)
  })

  it('refreshes an existing status rather than stacking it, and clears a self-inflicted mark', () => {
    cc().AddStatus('impaired', undefined, { selfInflicted: true })
    expect(cc().Statuses.filter(s => s.status.ID === 'impaired')).toHaveLength(1)
    expect(cc().Statuses.find(s => s.status.ID === 'impaired')!.selfInflicted).toBe(true)

    cc().AddStatus('impaired')

    expect(cc().Statuses.filter(s => s.status.ID === 'impaired')).toHaveLength(1)
    expect(cc().Statuses.find(s => s.status.ID === 'impaired')!.selfInflicted).toBe(false)
  })
})
