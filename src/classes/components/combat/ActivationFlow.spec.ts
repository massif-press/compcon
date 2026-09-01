import { describe, it, expect, beforeEach } from 'vitest'
import { ActivationFlow, BraceFlow, OverwatchFlow } from './ActivationFlow'
import { makeMech, makePilot } from '@/__tests__/factories'
import { StatKey } from './stats/Stats'
import type { Mech } from '@/classes/mech/Mech'

let m: Mech
const cc = () => m.CombatController
const state = (activation: string, over = {}) =>
  ({ cc: cc(), activation, legal: false, ...over }) as any

beforeEach(() => {
  m = makeMech(makePilot({ level: 3 }))
  m.SetStats()
  m.CombatController.StatController.resetCurrentStats()
})

describe('ActivationFlow', () => {
  it('names its steps in the order the audit assigns them', () => {
    expect(ActivationFlow.Steps).toEqual([
      'activation-normalization',
      'legality',
      'consume-uses',
      'heat-application',
      'consume',
    ])
  })

  it('normalizes the activation before anything reads it', () => {
    const s = state('Full Tech')
    ActivationFlow.Begin(s)
    expect(s.activation).toBe('fulltech')
  })

  it('halts at legality when the pool refuses, consuming nothing', () => {
    cc().SetCombatAction('full', false)
    const r = ActivationFlow.Begin(state('full'))

    expect(r.outcome).toBe('halted')
    expect(r.pending).toBe('legality')
    expect(r.state.blockedBy).toBe('activation')
    expect(r.completed).toEqual(['activation-normalization'])
  })

  it('halts at legality when the action has no uses left', () => {
    cc().MarkActionUsed('act_x')
    const r = ActivationFlow.Begin(state('quick', { actionId: 'act_x' }))

    expect(r.outcome).toBe('halted')
    expect(r.state.blockedBy).toBe('uses')
  })

  it('consumes the action and its uses when legal', () => {
    const r = ActivationFlow.Begin(state('quick', { actionId: 'act_x' }))

    expect(r.outcome).toBe('complete')
    expect(cc().IsActionUsed('act_x')).toBe(true)
    expect(cc().CombatActions.Quick1).toBe(false)
    expect(cc().CombatActions.Quick2).toBe(true)
  })

  it('applies self-heat as its own step', () => {
    const before = cc().StatController.getCurrent(StatKey.HEATCAP)
    ActivationFlow.Begin(state('quick', { heat: 2 }))

    expect(cc().StatController.getCurrent(StatKey.HEATCAP)).toBe(before + 2)
  })

  it('leaves the pool alone for a free action', () => {
    ActivationFlow.Begin(state('free'))
    expect(cc().CombatActions.Quick1).toBe(true)
    expect(cc().CombatActions.Full).toBe(true)
  })

  it('spends a reaction rather than a pool slot when the activation is one', () => {
    const r = ActivationFlow.Begin(state('brace', { reaction: 'brace' }))

    expect(r.outcome).toBe('complete')
    expect(cc().CanActivate('reaction')).toBe(false)
    expect(cc().CanUseReaction('brace')).toBe(false)
    expect(cc().CombatActions.Quick1).toBe(true)
  })
})

describe('actor kind and counterpart', () => {
  it('answers what kind of actor it is from one place', () => {
    expect(cc().Kind).toBe('mech')
    expect(cc().IsMech).toBe(true)
    expect(cc().IsPilot).toBe(false)
    expect(cc().IsNpc).toBe(false)

    const pc = (m.Pilot as any).CombatController
    expect(pc.Kind).toBe('pilot')
    expect(pc.IsPilot).toBe(true)
  })

  it('navigates to its counterpart across the pilot and mech boundary, both ways', () => {
    const pc = (m.Pilot as any).CombatController

    expect(pc.Counterpart).toBe(cc())
    expect(cc().Counterpart).toBe(pc)
  })

  it('propagates turn-use clearing through the counterpart rather than an actor branch', () => {
    const pc = (m.Pilot as any).CombatController
    pc.MarkActionUsed('act_pilot')

    cc().EndTurn()

    expect(pc.IsActionUsed('act_pilot')).toBe(false)
  })
})

describe('flows composed from ActivationFlow', () => {
  it('BraceFlow runs the activation and then the brace effects', () => {
    expect(BraceFlow.Steps).toEqual(['activation', 'brace-effects'])

    const r = BraceFlow.Begin(state('brace', { reaction: 'brace' }))

    expect(r.outcome).toBe('complete')
    expect(cc().Braced).toBe(true)
    expect(cc().GetResistance('kinetic')).toBe('resistance')
    expect(cc().CanUseReaction('brace')).toBe(false)
  })

  it('BraceFlow applies no effects when the reaction is already spent', () => {
    cc().UseReaction('brace')
    const r = BraceFlow.Begin(state('brace', { reaction: 'brace' }))

    expect(r.outcome).toBe('halted')
    expect(cc().Braced).toBe(false)
    expect(cc().GetResistance('kinetic')).toBe('none')
  })

  it('OverwatchFlow checks weapon eligibility before it spends anything', () => {
    expect(OverwatchFlow.Steps).toEqual([
      'weapon-eligibility',
      'activation',
      'overwatch-effects',
    ])

    const ordnance = { Tags: [{ ID: 'tg_ordnance' }] }
    cc().StatController.setCurrentStat(StatKey.SPEED, 0)
    const r = OverwatchFlow.Begin(state('overwatch', { reaction: 'overwatch', weapon: ordnance }))

    expect(r.outcome).toBe('halted')
    expect(r.pending).toBe('weapon-eligibility')
    expect(cc().Overwatch).toBe(false)
    expect(cc().CanActivate('reaction')).toBe(true)
  })
})
