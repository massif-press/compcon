import { describe, it, expect } from 'vitest'
import { renderEvent, renderStream } from './render'
import { LOG_EVENT_KINDS, makeEvent } from './events'
import type { ILogEvent, LogEventKind, IActorRef } from './events'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const en = JSON.parse(readFileSync(resolve(process.cwd(), 'src/i18n/locales/en.json'), 'utf8'))

const participants: IActorRef[] = [
  { id: 'a', name: 'Ghost', type: 'pilot', side: 'ally' },
  { id: 'b', name: 'BOB', type: 'npc', side: 'enemy', tier: 1 },
]
const stream = { participants }

const t = (key: string, params: Record<string, unknown> = {}) => {
  const raw = key.split('.').reduce<any>((o, k) => (o ? o[k] : undefined), en)
  if (typeof raw !== 'string') return key
  return raw.replace(/\{(\w+)\}/g, (_, name) => String(params[name] ?? ''))
}

const event = <K extends LogEventKind>(kind: K, payload: any, actorId = 'a'): ILogEvent =>
  makeEvent(kind, payload, {
    seq: 0,
    source: 'gm',
    encounterId: 'enc-1',
    round: 1,
    turn: 1,
    actorId,
  }) as ILogEvent

describe('rendering a log event', () => {
  const FIXTURES: Record<string, any> = {
    'encounter.start': { name: 'Op' },
    'encounter.end': { result: 'victory', rounds: 3 },
    'round.start': { round: 1 },
    'round.end': { round: 1 },
    'turn.start': { activationsRemaining: 1 },
    'turn.end': { activationsRemaining: 0 },
    action: { action: { id: 'a', name: 'Barrage' }, activation: 'Full' },
    attack: {
      attackType: 'ranged',
      targetId: 'b',
      rolled: 12,
      defense: 'Evasion',
      defenseValue: 8,
      result: 'hit',
    },
    damage: {
      targetId: 'b',
      damageType: 'Kinetic',
      incoming: 5,
      armorReduced: 0,
      resisted: [],
      conditions: [],
      final: 5,
      taken: true,
    },
    heat: { amount: 2, dangerZone: false },
    save: { stat: 'hull', target: 10, rolled: 12, result: 'success' },
    check: { stat: 'systems', target: 10, rolled: 14, result: 'success' },
    'structure.check': {
      marked: 1,
      dice: [3],
      lowest: 3,
      multipleOnes: false,
      table: 't',
      row: 'Glancing Blow',
      resolved: [],
    },
    'stress.check': {
      marked: 1,
      dice: [4],
      lowest: 4,
      multipleOnes: false,
      table: 't',
      row: 'Emergency Shunt',
      resolved: [],
    },
    'status.gain': { status: { id: 'impaired', name: 'IMPAIRED' } },
    'status.lose': { status: { id: 'impaired', name: 'IMPAIRED' }, reason: 'expired' },
    'resist.change': { damageType: 'kinetic', condition: 'resistance' },
    equipment: { item: { id: 'sys', name: 'Pattern-A Smoke Charges' }, state: 'used' },
    counter: { counter: { id: 'c', name: 'Charges' }, from: 2, to: 3 },
    move: { spent: 3, mode: 'move' },
    overcharge: { level: 1, cost: '1d6', heat: 4 },
    'deployable.launch': { deployable: { id: 'd', name: 'Drone' } },
    'deployable.destroy': { deployable: { id: 'd', name: 'Drone' } },
    'actor.destroy': { targetId: 'b' },
    'pilot.status': { to: 'KIA' },
    'mech.status': { to: 'destroyed' },
    repair: { kind: 'full' },
    stabilize: { choices: ['cool'] },
    reload: { items: [{ id: 'w', name: 'Rifle' }] },
    recharge: { item: { id: 's', name: 'System' }, roll: 5, recharged: true },
    meltdown: { state: 'scheduled', turns: 1 },
    'core.power': { active: true },
    mount: { mounted: true },
    'ai.control': { active: true },
    cover: { cover: 'soft' },
    carry: { mode: 'drag' },
    prepare: { prepared: true },
    blocked: { action: { id: 'a', name: 'Stand Up' }, reason: 'immobilized' },
    prompt: { label: 'burn', requestKind: 'check', skipped: true },
    note: { text: 'x' },
  }

  it('renders every kind it can record to prose, never to a raw key', () => {
    const unrendered = LOG_EVENT_KINDS.filter(k => {
      const out = renderEvent(event(k, FIXTURES[k]), stream, t)
      return !out || out.includes('active.log.')
    })
    expect(unrendered).toEqual([])
  })

  it('renders an activation with a real activation type, not a double space', () => {
    const e = event('action', { action: { id: 'act_x', name: 'Initiative' }, activation: 'Quick' })
    expect(renderEvent(e, stream, t)).toBe('[ALLY PILOT] Ghost used Initiative as a Quick action')
  })

  it('folds a confirmed kill into the attack entry rather than adding a line', () => {
    const attack = { ...event('attack', FIXTURES.attack), group: 'g1' }
    const kill = { ...event('actor.destroy', { targetId: 'b' }), group: 'g1' }
    const [entry] = renderStream([attack, kill], stream, t)
    expect(entry.text).toContain('TARGET DESTROYED')
    expect(entry.text.split('; ')).toHaveLength(1)
  })

  it('renders both sides of every branching kind', () => {
    const branches: [string, any][] = [
      ['save', { ...FIXTURES.save, result: 'failure' }],
      ['check', { ...FIXTURES.check, contested: true, opposedId: 'b', result: 'win' }],
      ['heat', { amount: 4, dangerZone: true }],
      ['damage', { ...FIXTURES.damage, taken: false }],
      ['damage', { ...FIXTURES.damage, targetId: 'a' }],
      ['damage', { ...FIXTURES.damage, targetId: 'a', taken: false }],
      ['damage', { ...FIXTURES.damage, targetId: undefined }],
      ['damage', { ...FIXTURES.damage, targetId: undefined, taken: false }],
      ['status.gain', { ...FIXTURES['status.gain'], duration: 'end of turn' }],
      ['resist.change', { ...FIXTURES['resist.change'], removed: true }],
      ['equipment', { ...FIXTURES.equipment, state: 'destroyed' }],
      ['equipment', { ...FIXTURES.equipment, state: 'repaired' }],
      ['equipment', { ...FIXTURES.equipment, state: 'unused' }],
      ['counter', { ...FIXTURES.counter, from: 3, to: 1 }],
      ['action', { ...FIXTURES.action, free: true }],
      ['attack', { ...FIXTURES.attack, targetId: undefined }],
      ['actor.destroy', { selfReported: true }],
      ['recharge', { item: { id: 's', name: 'System' }, roll: 2, recharged: false }],
      ['meltdown', { state: 'averted' }],
      ['meltdown', { state: 'committed' }],
      ['meltdown', { state: 'self_destruct' }],
      ['core.power', { active: false }],
      ['mount', { mounted: false }],
      ['mount', { mounted: false, ejected: true }],
      ['ai.control', { active: false }],
      ['carry', { mode: 'none' }],
      ['prepare', { prepared: false }],
      ['prompt', { label: 'burn', requestKind: 'check', skipped: true }],
      ['blocked', { reason: 'no_target' }],
      ['attack', { ...FIXTURES.attack, overridden: true, missedFromInvisibility: true }],
    ]
    const unrendered = branches.filter(([k, payload]) =>
      renderEvent(event(k as any, payload), stream, t).includes('active.log.')
    )
    expect(unrendered.map(b => b[0])).toEqual([])
  })

  it('names the actor from the stream, not from a compendium lookup', () => {
    expect(renderEvent(event('move', { spent: 3, mode: 'move' }), stream, t)).toBe(
      '[ALLY PILOT] Ghost spent 3 movement'
    )
  })

  it('tags the acting side and type, and carries an NPC tier into the name', () => {
    expect(renderEvent(event('move', { spent: 2, mode: 'move' }, 'b'), stream, t)).toBe(
      '[ENEMY NPC] T1 BOB spent 2 movement'
    )
  })

  it('leaves the tag off events that have no acting subject', () => {
    expect(renderEvent(event('round.start', { round: 2 }), stream, t)).toBe('Round 2 started')
  })

  it('omits the tag rather than printing an empty one for an unknown actor', () => {
    const orphan = renderEvent(event('move', { spent: 1, mode: 'move' }, 'gone'), stream, t)
    expect(orphan).toBe('Unknown spent 1 movement')
  })

  it('resolves a target id through the participant table', () => {
    const e = event('attack', {
      attackType: 'ranged',
      targetId: 'b',
      rolled: 18,
      defense: 'Evasion',
      defenseValue: 10,
      result: 'hit',
      weapon: { id: 'w', name: 'Assault Rifle' },
    })
    expect(renderEvent(e, stream, t)).toBe(
      '[ALLY PILOT] Ghost attacked T1 BOB with Assault Rifle: 18 vs 10 Evasion - HIT'
    )
  })

  it('falls back to a placeholder for an actor the stream never knew', () => {
    const e = event('attack', {
      attackType: 'ranged',
      targetId: 'gone',
      rolled: 5,
      defense: 'Evasion',
      defenseValue: 10,
      result: 'miss',
      weapon: { id: 'w', name: 'Rifle' },
    })
    expect(renderEvent(e, stream, t)).toContain('Unknown')
  })

  it('appends the damage modifiers that produced the final number', () => {
    const e = event('damage', {
      targetId: 'b',
      damageType: 'Kinetic',
      incoming: 12,
      armorReduced: 2,
      resisted: ['resistance'],
      conditions: ['exposed'],
      final: 5,
      taken: true,
      overkillHeat: 1,
    })
    expect(renderEvent(e, stream, t)).toBe(
      '[ALLY PILOT] Ghost dealt 5 Kinetic damage to T1 BOB (-2 armor, resistant, exposed, +1 overkill heat)'
    )
  })

  it('credits an unresolved target to the actor rather than calling it damage taken', () => {
    const e = event('damage', {
      damageType: 'Kinetic',
      incoming: 4,
      armorReduced: 0,
      resisted: [],
      conditions: [],
      final: 4,
      taken: true,
    })
    expect(renderEvent(e, stream, t)).toBe('[ALLY PILOT] Ghost dealt 4 Kinetic damage')
  })

  it('tags an entry the actor targeted at itself as SELF rather than by side', () => {
    const e = event('damage', {
      targetId: 'a',
      damageType: 'Heat',
      incoming: 3,
      armorReduced: 0,
      resisted: [],
      conditions: [],
      final: 3,
      taken: true,
    })
    expect(renderEvent(e, stream, t)).toBe('[SELF] Ghost took 3 Heat damage')
    expect(renderEvent(event('heat', { amount: 2, dangerZone: false }), stream, t)).toBe(
      '[ALLY PILOT] Ghost gained 2 heat'
    )
  })

  it('says "took" when the actor is its own damage target, and "dealt" otherwise', () => {
    const payload = {
      damageType: 'Kinetic',
      incoming: 4,
      armorReduced: 0,
      resisted: [],
      conditions: [],
      final: 4,
      taken: true,
    }

    expect(renderEvent(event('damage', { ...payload, targetId: 'a' }), stream, t)).toBe(
      '[SELF] Ghost took 4 Kinetic damage'
    )
    expect(renderEvent(event('damage', { ...payload, targetId: 'b' }), stream, t)).toBe(
      '[ALLY PILOT] Ghost dealt 4 Kinetic damage to T1 BOB'
    )
  })

  it('picks a different sentence for a self-reported kill with no known target', () => {
    const known = event('actor.destroy', { targetId: 'b' })
    const unknown = event('actor.destroy', { selfReported: true })

    expect(renderEvent(known, stream, t)).toBe('[ALLY PILOT] Ghost destroyed T1 BOB')
    expect(renderEvent(unknown, stream, t)).toBe('[ALLY PILOT] Ghost destroyed an opponent')
  })

  it('renders a free action differently from a costed one', () => {
    const costed = event('action', { action: { id: 'x', name: 'Barrage' }, activation: 'Full' })
    const free = event('action', {
      action: { id: 'x', name: 'Barrage' },
      activation: 'Free',
      free: true,
    })

    expect(renderEvent(costed, stream, t)).toBe('[ALLY PILOT] Ghost used Barrage as a Full action')
    expect(renderEvent(free, stream, t)).toBe('[ALLY PILOT] Ghost used Barrage as a free action')
  })

  it('folds one resolution into a single line, with damage read onto its attack', () => {
    const group = 'g1'
    const events = [
      event('damage', {
        targetId: 'b',
        damageType: 'Heat',
        incoming: 4,
        armorReduced: 0,
        resisted: [],
        conditions: [],
        final: 4,
        taken: true,
      }),
      event('action', { action: { id: 'i', name: 'Invade' }, activation: 'Quick' }),
      event('attack', {
        attackType: 'tech',
        targetId: 'b',
        rolled: 15,
        defense: 'E-Defense',
        defenseValue: 8,
        result: 'hit',
        weapon: { id: 'w', name: 'Mega-gun' },
      }),
    ].map(e => ({ ...e, group }))
    const slowed = {
      ...event('status.gain', { status: { id: 'slowed', name: 'SLOWED' } }, 'b'),
      group,
    }

    const entries = renderStream([...events, slowed], stream, t)

    expect(entries).toHaveLength(1)
    expect(entries[0].text).toBe(
      '[ALLY PILOT] Ghost used Invade as a Quick action; Ghost attacked T1 BOB with Mega-gun: 15 vs 8 E-Defense - HIT for 4 Heat damage; T1 BOB gained SLOWED'
    )
    expect(entries[0].kinds).toEqual(['damage', 'action', 'attack', 'status.gain'])
  })

  it('leaves an event with no group as its own entry', () => {
    const entries = renderStream(
      [event('move', { spent: 3, mode: 'move' }), event('heat', { amount: 2, dangerZone: false })],
      stream,
      t
    )
    expect(entries.map(e => e.text)).toEqual([
      '[ALLY PILOT] Ghost spent 3 movement',
      '[ALLY PILOT] Ghost gained 2 heat',
    ])
  })

  it('passes a GM note through as written', () => {
    expect(renderEvent(event('note', { text: 'reinforcements arrive' }), stream, t)).toBe(
      'reinforcements arrive'
    )
  })
})
