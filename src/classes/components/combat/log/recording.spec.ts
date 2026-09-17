import { describe, it, expect } from 'vitest'
import { Flow } from '../flows/Flow'
import { combatLogHooks, groupOf } from '../flows/logHooks'
import { WeaponAttackFlow } from '../flows/WeaponAttackFlow'
import { CombatLogRecorder } from './CombatLogRecorder'
import { StatController } from '../stats/StatController'
import { StatKey } from '../stats/Stats'
import { ActiveEffectEvent } from '../../feature/active_effects/ActiveEffectEvent'

function recorder(id = 'x') {
  const cc: any = {
    Round: 1,
    Turn: 1,
    Kind: 'mech',
    CombatName: id,
    RootActor: { ID: id },
    Parent: { ID: id },
  }
  cc.CombatLog = new CombatLogRecorder({ ID: id, CombatController: cc })
  cc.Record = (kind: string, payload: any) => cc.CombatLog.Record(kind, payload)
  cc.FindAction = () => ({ Name: 'BOOST' })
  return cc
}

describe('what a flow records', () => {
  it('records a blocked event carrying the reason the flow halted on', () => {
    const cc = recorder()
    const flow = new Flow<any>(
      't',
      [
        {
          Name: 'gate',
          Run: s => {
            s.blockedBy = 'no_uses'
            return 'halt'
          },
          ReportHalt: true,
        },
      ],
      combatLogHooks
    )

    flow.Begin({ cc, actionId: 'act_boost' })

    expect(cc.CombatLog.Events.map((e: any) => [e.kind, e.payload])).toEqual([
      ['blocked', { action: { id: 'act_boost', name: 'BOOST' }, reason: 'no_uses' }],
    ])
  })

  it('records the answer to a request when the flow resumes, and nothing while it waits', () => {
    const cc = recorder()
    const flow = new Flow<any>(
      't',
      [
        {
          Name: 'ask',
          Run: (_s, input) => (input === undefined ? 'await' : 'continue'),
          Request: () => ({ kind: 'check', label: 'burn' }),
        },
      ],
      combatLogHooks
    )

    const held = flow.Begin({ cc })
    expect(cc.CombatLog.Events).toHaveLength(0)

    flow.Resume(held, { success: true })
    expect(cc.CombatLog.Events.map((e: any) => [e.kind, e.payload])).toEqual([
      ['prompt', { label: 'burn', requestKind: 'check', answer: 'success: true' }],
    ])
  })

  it('holds one group across a suspension, so a resolution stays one entry', () => {
    const cc = recorder()
    const flow = new Flow<any>(
      't',
      [
        {
          Name: 'before',
          Run: s => {
            s.cc.Record('note', { text: 'before' })
            return 'continue'
          },
        },
        {
          Name: 'ask',
          Run: (_s, input) => (input === undefined ? 'await' : 'continue'),
          Request: () => ({ kind: 'roll', label: 'damage' }),
        },
        {
          Name: 'after',
          Run: s => {
            s.cc.Record('note', { text: 'after' })
            return 'continue'
          },
        },
      ],
      combatLogHooks
    )

    const state = { cc }
    flow.Resume(flow.Begin(state), 5)
    const groups = new Set(cc.CombatLog.Events.map((e: any) => e.group))

    expect(groups.size).toBe(1)
    expect([...groups][0]).toBe(groupOf(state))
  })

  it('rolls the whole resolution out of the log when the flow is undone', () => {
    const cc = recorder()
    let heat = 0
    const flow = new Flow<any>(
      't',
      [
        {
          Name: 'heat',
          Run: s => {
            heat += 4
            s.cc.Record('heat', { amount: 4, dangerZone: false })
            return 'continue'
          },
          Undo: s => {
            heat -= 4
            s.cc.Record('heat', { amount: 4, cleared: true, dangerZone: false })
          },
        },
      ],
      combatLogHooks
    )

    const state = { cc }
    const result = flow.Begin(state)
    const group = groupOf(state)
    flow.UndoAll(state, result.completed)

    expect(heat).toBe(0)
    expect(cc.CombatLog.Events.map((e: any) => e.group)).toEqual([group, group])

    cc.CombatLog.Rollback(group)
    expect(cc.CombatLog.Events).toEqual([])
  })

  it('records an attack before the damage it caused, under one group across both recorders', () => {
    const attacker = recorder('att')
    const defender = recorder('def')
    Object.assign(attacker, {
      IsDestroyed: false,
      CanFireWeapon: () => true,
      ApplyHeat: () => {},
      ApplyDamage: () => {},
      DropAttackRevealedStatuses: () => {},
    })
    Object.assign(defender, { IsDestroyed: false, ApplyDamage: () => {} })

    const target: any = {
      Combatant: { actor: { CombatController: defender } },
      DamageEvents: [{ DamageType: 'Kinetic', OverkillHeat: 0, CalcFinalDamage: () => {} }],
      FinalDamageValue: 4,
      TotalArmorReduction: 0,
      TookDamage: true,
      AttackRolledValue: 12,
      HitResult: 'hit',
      ApplyDamage: () =>
        defender.Record('damage', {
          targetId: 'def',
          damageType: 'Kinetic',
          final: 4,
          taken: true,
        }),
    }

    const event: any = Object.setPrototypeOf(
      {
        Initiator: { actor: { CombatController: attacker } },
        Attack: 'ranged',
        Effect: {
          ID: 'e',
          Name: 'Shot',
          Origin: { ID: 'sys1', Name: 'Missile Rack', Activation: 'Quick' },
        },
        Weapon: { ID: 'w1', InstanceID: 'w1i', Name: 'Missile Rack' },
        DamageEvents: [{}],
        StatusEvents: [],
        OtherEvents: [],
        SpecialEvents: [],
        ResistEvents: [],
        Targets: [target],
      },
      ActiveEffectEvent.prototype
    )

    WeaponAttackFlow.Begin({
      attacker,
      weapon: { Accuracy: 0 },
      targets: [target],
      event,
      accuracy: 0,
      rolls: [],
      applied: false,
      routes: [],
      followUps: [],
    } as any)

    const all = [...attacker.CombatLog.Events, ...defender.CombatLog.Events]
    expect(all.map((e: any) => e.kind)).toEqual(['action', 'attack', 'damage'])
    expect(new Set(all.map((e: any) => e.group)).size).toBe(1)

    const action = all.find((e: any) => e.kind === 'action') as any
    expect(action.payload.action).toEqual({ id: 'sys1', name: 'Missile Rack' })
    expect(action.payload.activation).toBe('Quick')
    expect(action.payload.free).toBe(false)

    const attack = all.find((e: any) => e.kind === 'attack') as any
    expect(attack.payload.weapon).toEqual({ id: 'w1i', name: 'Missile Rack' })
  })

  it('never names the acting actor as the action when the effect origin is that actor', () => {
    const attacker = recorder('att')
    Object.assign(attacker, { IsDestroyed: false })

    const event: any = Object.setPrototypeOf(
      {
        Initiator: { actor: { CombatController: attacker } },
        Effect: {
          ID: 'e',
          Name: 'Assault Rifle (Skirmish)',
          Origin: { ID: 'mech1', Name: 'Everest', CombatController: attacker },
        },
      },
      ActiveEffectEvent.prototype
    )

    event.RecordAction([])

    const recorded = attacker.CombatLog.Events[0] as any
    expect(recorded.payload.action).toEqual({ id: 'e', name: 'Assault Rifle (Skirmish)' })
    expect(recorded.payload.activation).toBe('')
    expect(recorded.payload.free).toBe(false)
  })
  it('stays silent when a guard step halts, so a re-run does not write to the log', () => {
    const cc = recorder()
    const flow = new Flow<any>(
      't',
      [
        {
          Name: 'guard',
          Run: s => {
            if (s.selected.length) return 'continue'
            s.blockedBy = 'no_weapon'
            return 'halt'
          },
        },
      ],
      combatLogHooks
    )

    flow.Begin({ cc, selected: [] })
    flow.Begin({ cc, selected: [] })

    expect(cc.CombatLog.Events).toEqual([])
  })

  it('records one blocked event when a nested flow halts, not one per nesting level', () => {
    const cc = recorder()
    const inner = new Flow<any>(
      'inner',
      [
        {
          Name: 'gate',
          Run: s => {
            s.blockedBy = 'no_uses'
            return 'halt'
          },
          ReportHalt: true,
        },
      ],
      combatLogHooks
    )
    const outer = new Flow<any>('outer', [inner.AsStep('activation')], combatLogHooks)

    outer.Begin({ cc })

    expect(cc.CombatLog.Events.map((e: any) => e.kind)).toEqual(['blocked'])
  })

  it('records nothing while a step is still waiting for its answer', () => {
    const cc = recorder()
    let pending = 2
    const flow = new Flow<any>(
      't',
      [
        {
          Name: 'ask',
          Run: () => (pending-- > 0 ? 'await' : 'continue'),
          Request: () => ({ kind: 'check', label: 'structureOrStressCheck' }),
        },
      ],
      combatLogHooks
    )

    const held = flow.Begin({ cc })
    const again = flow.Resume(held, { done: true })

    expect(again.outcome).toBe('awaiting')
    expect(cc.CombatLog.Events).toEqual([])
  })

  it('reads past a falsy skip flag to the answer that was actually given', () => {
    const cc = recorder()
    const flow = new Flow<any>(
      't',
      [
        {
          Name: 'ask',
          Run: (_s, input) => (input === undefined ? 'await' : 'continue'),
          Request: () => ({ kind: 'check', label: 'burn' }),
        },
      ],
      combatLogHooks
    )

    flow.Resume(flow.Begin({ cc }), { skip: false, success: true })

    expect(cc.CombatLog.Events[0].payload.answer).toBe('success: true')
  })
})

describe('what a stat write records', () => {
  it('routes a direct CurrentStats write through setCurrentStat', () => {
    const seen: any[] = []
    const parent: any = {
      onStatDecrease: (k: string, prev: number, next: number, opts: any) =>
        seen.push([k, prev, next, opts]),
    }
    const stats = new StatController(parent)
    stats.CurrentStats = { speed: 5 }

    stats.CurrentStats['speed'] = 3

    expect(stats.getCurrent(StatKey.SPEED)).toBe(3)
    expect(seen).toEqual([['speed', 5, 3, {}]])
  })

  it('carries the reason on the write instead of on the controller', () => {
    const seen: any[] = []
    const parent: any = {
      onStatDecrease: (_k: string, _p: number, _n: number, opts: any) => seen.push(opts),
    }
    const stats = new StatController(parent)
    stats.CurrentStats = { heatcap: 6 }

    stats.setCurrentStat(StatKey.HEATCAP, 0, { heatReason: 'stabilize' })
    stats.setCurrentStat(StatKey.HEATCAP, -1, { silent: true })

    expect(seen).toEqual([{ heatReason: 'stabilize' }, { silent: true }])
  })
})
