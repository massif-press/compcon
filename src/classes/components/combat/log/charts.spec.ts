import { describe, it, expect } from 'vitest'
import { blankRollup } from './telemetry'
import {
  damageByType,
  dealtVsTaken,
  cumulativeDamage,
  accuracyOverTime,
  checkOutcomes,
  heatSources,
  rankedBag,
  damagePerRound,
  heatCurve,
  eventTimeline,
  threatScatter,
  lethalityPerAppearance,
  roundHistogram,
  damageShare,
  attackMix,
  damageBySide,
} from './charts'
import { DAMAGE_ORDER } from '@/features/active_mode/_components/charts/chartBase'
import type { ILogStream, ILogEvent } from './events'
import type { IEncounterRollup } from './telemetry'
import type { IChartRecord } from './charts'

function rollup(over: Partial<IEncounterRollup> = {}): IEncounterRollup {
  return { ...blankRollup(), ...over }
}

function record(over: Partial<IChartRecord> = {}): IChartRecord {
  return {
    encounterId: crypto.randomUUID(),
    encounterName: 'Test Encounter',
    start: 0,
    rounds: 1,
    rollup: rollup(),
    ...over,
  }
}

function event(kind: string, round: number, actorId: string, payload: any): ILogEvent {
  return {
    id: crypto.randomUUID(),
    ts: round,
    seq: round,
    encounterId: 'e1',
    round,
    turn: 0,
    actorId,
    kind,
    payload,
    source: 'gm',
    v: 1,
  } as unknown as ILogEvent
}

function stream(participants: any[], events: ILogEvent[]): ILogStream {
  return {
    v: 1,
    encounterId: 'e1',
    encounterName: 'Test Encounter',
    start: 0,
    rounds: 3,
    source: 'gm',
    participants,
    events,
  } as ILogStream
}

const dmg = (round: number, actorId: string, targetId: string, final: number) =>
  event('damage', round, actorId, { targetId, damageType: 'kinetic', final })

describe('damageByType (P1)', () => {
  it('orders slices by the fixed hue order, not by size', () => {
    const slices = damageByType(
      rollup({ damageDealt: { heat: 30, burn: 5, energy: 10 } }),
      'dealt',
      DAMAGE_ORDER
    )
    expect(slices.map(s => s.key)).toEqual(['burn', 'energy', 'heat'])
    expect(slices.map(s => s.label)).toEqual(['Burn', 'Energy', 'Heat'])
  })

  it('drops zero and reads the taken bag when asked', () => {
    const r = rollup({ damageDealt: { heat: 0 }, damageTaken: { kinetic: 4 } })
    expect(damageByType(r, 'dealt')).toEqual([])
    expect(damageByType(r, 'taken')).toHaveLength(1)
  })
})

describe('cross-encounter series (P2, P3, P6)', () => {
  const records = [
    record({
      encounterName: 'B',
      start: 200,
      rollup: rollup({ totalDealt: 5, totalTaken: 1, heatGained: 4, overchargeHeat: 3 }),
    }),
    record({
      encounterName: 'A',
      start: 100,
      rollup: rollup({ totalDealt: 10, totalTaken: 2, heatGained: 6, overchargeHeat: 1 }),
    }),
  ]

  it('sorts by date rather than by insertion order', () => {
    expect(dealtVsTaken(records).labels).toEqual(['A', 'B'])
    expect(dealtVsTaken(records).series[0].data).toEqual([10, 5])
  })

  it('accumulates damage across a career', () => {
    expect(cumulativeDamage(records).series[0].data).toEqual([10, 15])
  })

  it('splits heat into overcharge and everything else, never negative', () => {
    const [oc, other] = heatSources(records).series
    expect(oc.data).toEqual([1, 3])
    expect(other.data).toEqual([5, 1])

    const bad = [record({ rollup: rollup({ heatGained: 1, overchargeHeat: 5 }) })]
    expect(heatSources(bad).series[1].data).toEqual([0])
  })

  it('falls back to a supplied label when an encounter was never named', () => {
    expect(dealtVsTaken([record({ encounterName: '' })], 'Unnamed').labels).toEqual(['Unnamed'])
  })
})

describe('accuracyOverTime (P4)', () => {
  it('reports a percentage per encounter and the career average', () => {
    const out = accuracyOverTime([
      record({ start: 1, rollup: rollup({ attacks: { made: 4, hit: 2, crit: 0, missed: 2 } }) }),
      record({ start: 2, rollup: rollup({ attacks: { made: 4, hit: 4, crit: 1, missed: 0 } }) }),
    ])
    expect(out.series[0].data).toEqual([50, 100])
    expect(out.average).toBe(75)
  })

  it('clamps a malformed record rather than drawing off the fixed axis', () => {
    const out = accuracyOverTime([
      record({ rollup: rollup({ attacks: { made: 2, hit: 5, crit: 0, missed: 0 } }) }),
    ])
    expect(out.series[0].data).toEqual([100])
    expect(out.average).toBe(100)
  })

  it('leaves a gap rather than a zero when no attack was made', () => {
    const out = accuracyOverTime([record()])
    expect(Number.isNaN(out.series[0].data[0])).toBe(true)
    expect(out.average).toBe(0)
  })
})

describe('checkOutcomes (P5)', () => {
  it('pairs passes and failures for saves and checks', () => {
    const out = checkOutcomes(
      rollup({ savesPassed: 3, savesFailed: 1, checksPassed: 2, checksFailed: 4 })
    )
    expect(out.labels).toEqual(['saves', 'checks'])
    expect(out.series[0].data).toEqual([3, 2])
    expect(out.series[1].data).toEqual([1, 4])
  })
})

describe('rankedBag (P7, P8)', () => {
  it('prefers the recorded name over the id and ranks by count', () => {
    const r = rollup({
      actionsTaken: { skirmish: 1, barrage: 5, '': 9 },
      labels: { barrage: 'BARRAGE' },
    })
    expect(rankedBag(r, 'actions')).toEqual([
      { key: 'barrage', label: 'BARRAGE', value: 5 },
      { key: 'skirmish', label: 'Skirmish', value: 1 },
    ])
  })

  it('caps the list', () => {
    const actionsTaken = Object.fromEntries(Array.from({ length: 20 }, (_, i) => [`a${i}`, i + 1]))
    expect(rankedBag(rollup({ actionsTaken }), 'actions', 3)).toHaveLength(3)
  })
})

describe('within-encounter series (P9, P10, P11)', () => {
  const me = 'me'
  const them = 'them'

  it('buckets damage taken and dealt by round', () => {
    const s = stream(
      [{ id: me, name: 'Test Pilot 1', type: 'pilot' }],
      [dmg(1, them, me, 5), dmg(3, me, them, 7)]
    )
    const out = damagePerRound(s, me)
    expect(out.labels).toEqual(['1', '2', '3'])
    expect(out.series[0].data).toEqual([5, 0, 0])
    expect(out.series[1].data).toEqual([0, 0, 7])
  })

  it('holds the last heat value through rounds with no heat event', () => {
    const s = stream(
      [{ id: me, name: 'Test Pilot 1', type: 'pilot' }],
      [
        event('heat', 1, me, { amount: 3, current: 3, cap: 6, dangerZone: false }),
        event('heat', 3, me, { amount: 2, current: 5, cap: 6, dangerZone: true }),
      ]
    )
    const out = heatCurve(s, me)
    expect(out.series[0].data).toEqual([3, 3, 5])
    expect(out.cap).toBe(6)
  })

  it('comes back down when heat is cleared, not just up when it is gained', () => {
    const s = stream(
      [{ id: me, name: 'Test Pilot 1', type: 'pilot' }],
      [
        event('heat', 1, me, { amount: 5, current: 5, cap: 6, dangerZone: true }),
        event('heat', 3, me, {
          amount: 5,
          current: 0,
          cap: 6,
          cleared: true,
          reason: 'stabilize',
          dangerZone: false,
        }),
      ]
    )
    expect(heatCurve(s, me).series[0].data).toEqual([5, 5, 0])
  })

  it('reports a zero cap when nothing recorded one', () => {
    const s = stream([], [event('heat', 1, me, { amount: 3, dangerZone: false })])
    expect(heatCurve(s, me).cap).toBe(0)
  })

  it('assigns kinds a stable order so a re-rank cannot repaint them', () => {
    const busyAttack = stream(
      [],
      [event('attack', 1, me, {}), event('attack', 1, me, {}), event('move', 1, me, {})]
    )
    const busyMove = stream(
      [],
      [event('move', 1, me, {}), event('move', 1, me, {}), event('attack', 1, me, {})]
    )
    expect(eventTimeline(busyAttack, me).series.map(s => s.key)).toEqual(
      eventTimeline(busyMove, me).series.map(s => s.key)
    )
  })

  it('counts the busiest event kinds per round', () => {
    const s = stream(
      [],
      [
        event('attack', 1, me, {}),
        event('attack', 1, me, {}),
        event('move', 2, me, {}),
        event('attack', 2, them, {}),
      ]
    )
    const out = eventTimeline(s, me)
    expect(out.series[0].key).toBe('attack')
    expect(out.series[0].data).toEqual([2, 0])
  })
})

describe('group charts (G2, G3, G5, G6, G7)', () => {
  const groups = [
    {
      key: 'class:a',
      label: 'Assault',
      encounters: 4,
      rollup: rollup({
        totalDealt: 40,
        totalTaken: 10,
        killsConfirmed: 2,
        attacks: { made: 10, hit: 6, crit: 2, missed: 4 },
      }),
    },
    {
      key: 'class:b',
      label: 'Bombard',
      encounters: 2,
      rollup: rollup({
        totalDealt: 10,
        totalTaken: 30,
        killsConfirmed: 2,
        attacks: { made: 4, hit: 1, crit: 0, missed: 3 },
      }),
    },
  ]

  it('places threat against durability, sized by appearances', () => {
    expect(threatScatter(groups)).toEqual([
      { key: 'class:a', label: 'Assault', x: 40, y: 10, size: 4 },
      { key: 'class:b', label: 'Bombard', x: 10, y: 30, size: 2 },
    ])
  })

  it('divides kills by appearances so a frequent class is not flattered', () => {
    expect(lethalityPerAppearance(groups).map(g => [g.label, g.value])).toEqual([
      ['Bombard', 1],
      ['Assault', 0.5],
    ])
  })

  it('separates crits from ordinary hits so the stack does not double-count', () => {
    const out = attackMix(groups)
    expect(out.series.map(s => s.data)).toEqual([
      [2, 0],
      [4, 1],
      [4, 3],
    ])
  })

  it('buckets encounters by round count', () => {
    expect(roundHistogram([{ rounds: 3 }, { rounds: 3 }, { rounds: 5 }])).toEqual([
      { key: '3', label: '3', value: 2 },
      { key: '5', label: '5', value: 1 },
    ])
  })

  it('shares damage between pilots and drops anyone who dealt none', () => {
    const s = stream(
      [
        { id: 'p1', name: 'Test Pilot 1', type: 'pilot' },
        { id: 'p2', name: 'Test Pilot 2', type: 'pilot' },
        { id: 'n1', name: 'Test NPC 1', type: 'npc' },
      ],
      [dmg(1, 'p1', 'n1', 12), dmg(1, 'n1', 'p1', 30)]
    )
    expect(damageShare(s)).toEqual([{ key: 'p1', label: 'Test Pilot 1', value: 12 }])
  })

  it('keeps participant order so a rank change cannot repaint a pilot', () => {
    const s = stream(
      [
        { id: 'p1', name: 'Test Pilot 1', type: 'pilot' },
        { id: 'p2', name: 'Test Pilot 2', type: 'pilot' },
      ],
      [dmg(1, 'p1', 'n1', 3), dmg(1, 'p2', 'n1', 99)]
    )
    expect(damageShare(s).map(x => x.label)).toEqual(['Test Pilot 1', 'Test Pilot 2'])
  })
})

describe('damageBySide (G8)', () => {
  it('resolves side through the participants and accumulates per round', () => {
    const s = stream(
      [
        { id: 'p1', name: 'Test Pilot 1', type: 'pilot', side: 'ally' },
        { id: 'n1', name: 'Test NPC 1', type: 'npc', side: 'enemy' },
      ],
      [dmg(1, 'p1', 'n1', 5), dmg(2, 'n1', 'p1', 3), dmg(2, 'p1', 'n1', 5)]
    )
    const out = damageBySide(s)
    expect(out.series.map(x => x.label)).toEqual(['ally', 'enemy'])
    expect(out.series[0].data).toEqual([5, 10])
    expect(out.series[1].data).toEqual([0, 3])
  })

  it('files an actor the header never mentioned under unknown rather than dropping it', () => {
    const s = stream(
      [{ id: 'p1', name: 'Test Pilot 1', type: 'pilot', side: 'ally' }],
      [dmg(1, 'Test Pilot 2', 'p1', 4)]
    )
    expect(damageBySide(s).series.map(x => x.label)).toEqual(['ally'])
    expect(damageBySide(s).series[0].data).toEqual([0])
  })
})
