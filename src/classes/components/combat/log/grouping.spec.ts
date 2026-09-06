import { describe, it, expect, beforeEach } from 'vitest'
import { makePilot, makeMech, makeNpc } from '@/__tests__/factories'
import { Encounter } from '@/classes/encounter/Encounter'
import { EncounterInstance } from '@/classes/encounter/EncounterInstance'
import { EncounterArchive } from '@/classes/encounter/EncounterArchive'
import { groupStreams, identitiesOf } from './grouping'
import type { ILogStream, IActorRef } from './events'

function stream(participants: IActorRef[], events: any[], over: Partial<ILogStream> = {}) {
  return {
    v: 1,
    encounterId: 'e1',
    encounterName: 'Test',
    start: 0,
    rounds: 1,
    source: 'gm',
    participants,
    events,
    ...over,
  } as ILogStream
}

function damage(actorId: string, targetId: string, final: number) {
  return {
    id: crypto.randomUUID(),
    ts: 1,
    seq: 1,
    encounterId: 'e1',
    round: 1,
    turn: 0,
    actorId,
    kind: 'damage',
    payload: {
      targetId,
      damageType: 'kinetic',
      incoming: final,
      armorReduced: 0,
      resisted: [],
      conditions: [],
      final,
      taken: true,
    },
    source: 'gm',
    v: 1,
  }
}

describe('identitiesOf', () => {
  it('emits one key per identity the ref carries', () => {
    const keys = identitiesOf({
      id: 'a',
      name: 'ASSAULT',
      type: 'npc',
      originId: 'roster-1',
      npcClassId: 'assault',
      npcClassName: 'Assault',
      templateIds: ['ultra', 'veteran'],
      templateNames: ['Ultra', 'Veteran'],
    }).map(i => i.key)

    expect(keys).toEqual([
      'actor:a',
      'type:npc',
      'origin:roster-1',
      'class:assault',
      'template:ultra',
      'template:veteran',
    ])
  })

  it('falls back to the id when a name was never recorded', () => {
    const [, , cls] = identitiesOf({
      id: 'a',
      name: 'X',
      type: 'npc',
      npcClassId: 'assault',
    })
    expect(cls.label).toBe('assault')
  })
})

describe('groupStreams', () => {
  it('sums a class across encounters and counts each appearance', () => {
    const a: IActorRef = {
      id: 'a1',
      name: 'A',
      type: 'npc',
      npcClassId: 'assault',
      npcClassName: 'Assault',
    }
    const b: IActorRef = {
      id: 'b1',
      name: 'B',
      type: 'npc',
      npcClassId: 'assault',
      npcClassName: 'Assault',
    }

    const groups = groupStreams([
      stream([a], [damage('a1', 'x', 10)]),
      stream([b], [damage('b1', 'x', 5)], { encounterId: 'e2' }),
    ])

    const cls = groups.find(g => g.key === 'class:assault')!
    expect(cls.label).toBe('Assault')
    expect(cls.encounters).toBe(2)
    expect(cls.actorIds.sort()).toEqual(['a1', 'b1'])
    expect(cls.rollup.totalDealt).toBe(15)
  })

  it('attributes damage taken to the target, not the dealer', () => {
    const attacker: IActorRef = { id: 'a1', name: 'A', type: 'npc' }
    const victim: IActorRef = { id: 'v1', name: 'V', type: 'pilot' }

    const groups = groupStreams([stream([attacker, victim], [damage('a1', 'v1', 7)])])

    expect(groups.find(g => g.key === 'actor:a1')!.rollup.totalDealt).toBe(7)
    expect(groups.find(g => g.key === 'actor:a1')!.rollup.totalTaken).toBe(0)
    expect(groups.find(g => g.key === 'actor:v1')!.rollup.totalTaken).toBe(7)
  })

  it('scopes by campaign and by actor type', () => {
    const npc: IActorRef = { id: 'a1', name: 'A', type: 'npc' }
    const pilot: IActorRef = { id: 'p1', name: 'P', type: 'pilot' }
    const streams = [
      stream([npc, pilot], [damage('a1', 'p1', 3)], { campaignId: 'c1' }),
      stream([npc], [damage('a1', 'p1', 9)], { encounterId: 'e2', campaignId: 'c2' }),
    ]

    expect(
      groupStreams(streams, { campaignId: 'c1' }).find(g => g.key === 'actor:a1')!.rollup.totalDealt
    ).toBe(3)
    expect(groupStreams(streams, { types: ['pilot'] }).some(g => g.key === 'actor:a1')).toBe(false)
  })

  it('returns nothing for an empty set', () => {
    expect(groupStreams([])).toEqual([])
  })
})

describe('participant ids match the ids on recorded events', () => {
  let instance: EncounterInstance

  beforeEach(() => {
    const pilot = makePilot()
    makeMech(pilot)
    const encounter = new Encounter()
    encounter.Name = 'Ambush'
    encounter.AddCombatant(makeNpc('ASSAULT'))
    instance = new EncounterInstance(undefined, encounter, [pilot])
  })

  it('carries the campaign tag from the events onto the archive stream', () => {
    ;(instance as any).Campaign = 'Test Encounter'
    instance.StampLogContext()
    instance.Combatants[0].actor.CombatController.Record('note', { text: 'a' })

    const stream = EncounterArchive.FromInstance(instance, '', 'victory').Stream

    expect(stream.campaignId).toBe('Test Encounter')
    expect(groupStreams([stream], { campaignId: 'Test Encounter' }).length).toBeGreaterThan(0)
    expect(groupStreams([stream], { campaignId: 'other' })).toEqual([])
  })

  it('rolls up a real archive by participant id rather than returning zeroes', () => {
    for (const c of instance.Combatants) {
      c.actor.CombatController.Record('damage', {
        targetId: 'someone',
        damageType: 'kinetic',
        incoming: 4,
        armorReduced: 0,
        resisted: [],
        conditions: [],
        final: 4,
        taken: true,
      })
    }

    const archive = EncounterArchive.FromInstance(instance, '', 'victory')
    const groups = groupStreams([archive.Stream])

    for (const p of archive.History.participants) {
      const group = groups.find(g => g.key === `actor:${p.id}`)
      expect(group, `no group for participant ${p.name}`).toBeTruthy()
      expect(group!.rollup.totalDealt, `zero rollup for ${p.name}`).toBe(4)
    }
  })
})
