import { describe, it, expect } from 'vitest'
import { reduceEvents, mergeRollups } from './telemetry'
import { makeEvent } from './events'
import type { ILogEvent, LogEventKind } from './events'

let seq = 0
const ev = <K extends LogEventKind>(kind: K, payload: any, actorId = 'me'): ILogEvent =>
  makeEvent(kind, payload, {
    seq: seq++,
    source: 'gm',
    encounterId: 'enc-1',
    round: 1,
    turn: 1,
    actorId,
  }) as ILogEvent

describe('telemetry as a fold', () => {
  it('attributes damage to the dealer and the taker from one event', () => {
    const events = [
      ev('damage', { targetId: 'them', damageType: 'Kinetic', final: 8, armorReduced: 2 }, 'me'),
      ev('damage', { targetId: 'me', damageType: 'Energy', final: 5, armorReduced: 0 }, 'them'),
    ]

    const mine = reduceEvents(events, 'me')
    expect(mine.totalDealt).toBe(8)
    expect(mine.totalTaken).toBe(5)
    expect(mine.damageDealt).toEqual({ kinetic: 8 })
    expect(mine.damageTaken).toEqual({ energy: 5 })
    expect(mine.damageArmorReduced).toBe(2)

    const theirs = reduceEvents(events, 'them')
    expect(theirs.totalDealt).toBe(5)
    expect(theirs.totalTaken).toBe(8)
  })

  it('rolls up the whole encounter when given no perspective', () => {
    const events = [
      ev('damage', { targetId: 'them', damageType: 'Kinetic', final: 8 }, 'me'),
      ev('damage', { targetId: 'me', damageType: 'Kinetic', final: 4 }, 'them'),
    ]

    const all = reduceEvents(events)
    expect(all.totalDealt).toBe(12)
    expect(all.totalTaken).toBe(12)
  })

  it('counts movement spent, which the old telemetry could never do', () => {
    const r = reduceEvents(
      [
        ev('move', { spent: 4, mode: 'move' }),
        ev('move', { spent: 2, mode: 'boost' }),
        ev('move', { spent: 3, mode: 'move' }, 'them'),
      ],
      'me'
    )

    expect(r.movementSpent).toBe(6)
  })

  it('counts rounds, which the old telemetry never incremented', () => {
    const r = reduceEvents([ev('round.end', { round: 1 }), ev('round.end', { round: 2 })], 'me')
    expect(r.rounds).toBe(2)
  })

  it('separates a confirmed kill from a self-reported one', () => {
    const r = reduceEvents(
      [ev('actor.destroy', { targetId: 'them' }), ev('actor.destroy', { selfReported: true })],
      'me'
    )

    expect(r.killsConfirmed).toBe(1)
    expect(r.killsSelfReported).toBe(1)
  })

  it('marks an actor destroyed when it is the target of a destruction', () => {
    const events = [ev('actor.destroy', { targetId: 'them' }, 'me')]

    expect(reduceEvents(events, 'them').destroyed).toBe(true)
    expect(reduceEvents(events, 'me').destroyed).toBe(false)
  })

  it('counts overcharge and its heat, both of which were dead fields', () => {
    const r = reduceEvents(
      [
        ev('overcharge', { level: 1, cost: '1d6', heat: 4 }),
        ev('overcharge', { level: 2, cost: '1d6+2', heat: 6 }),
      ],
      'me'
    )

    expect(r.overcharges).toBe(2)
    expect(r.overchargeHeat).toBe(10)
  })

  it('counts deployables launched, another dead field', () => {
    const r = reduceEvents(
      [
        ev('deployable.launch', { deployable: { id: 'd', name: 'Drone' } }),
        ev('deployable.destroy', { deployable: { id: 'd', name: 'Drone' } }),
      ],
      'me'
    )

    expect(r.deployablesLaunched).toBe(1)
    expect(r.deployablesDestroyed).toBe(1)
  })

  it('tallies attacks by result, counting a crit as a hit as well', () => {
    const r = reduceEvents(
      [
        ev('attack', { result: 'hit' }),
        ev('attack', { result: 'crit' }),
        ev('attack', { result: 'miss' }),
      ],
      'me'
    )

    expect(r.attacks).toEqual({ made: 3, hit: 2, crit: 1, missed: 1 })
  })

  it('ignores an event kind it has no rule for', () => {
    expect(() => reduceEvents([ev('note', { text: 'hi' })], 'me')).not.toThrow()
    expect(reduceEvents([ev('note', { text: 'hi' })], 'me').turns).toBe(0)
  })

  it('sums encounter rollups into a lifetime rollup', () => {
    const one = reduceEvents(
      [
        ev('damage', { targetId: 'them', damageType: 'Kinetic', final: 8 }),
        ev('actor.destroy', { targetId: 'them' }),
      ],
      'me'
    )
    const two = reduceEvents(
      [
        ev('damage', { targetId: 'them', damageType: 'Kinetic', final: 2 }),
        ev('damage', { targetId: 'them', damageType: 'Energy', final: 3 }),
      ],
      'me'
    )

    const life = mergeRollups([one, two])
    expect(life.totalDealt).toBe(13)
    expect(life.damageDealt).toEqual({ kinetic: 10, energy: 3 })
    expect(life.killsConfirmed).toBe(1)
  })
})
