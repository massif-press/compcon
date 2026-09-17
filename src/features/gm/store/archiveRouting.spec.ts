import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/io/Storage', () => ({
  SetItem: vi.fn(),
  RemoveItem: vi.fn(),
  GetItem: vi.fn(async () => null),
  GetAll: vi.fn(async () => []),
  SetAll: vi.fn(),
  ClearAll: vi.fn(),
  GetLength: vi.fn(async () => 0),
  GetKeys: vi.fn(async () => []),
  SetValue: vi.fn(),
  GetValue: vi.fn(async () => null),
  saveAll: vi.fn(),
  storeRegistry: {},
}))

import { EncounterStore } from './encounter_store'
import { PilotStore } from '@/features/pilot_management/store'
import { LOG_SCHEMA_VERSION } from '@/classes/components/combat/log/events'
import type { ILogStream } from '@/classes/components/combat/log/events'

function streamFor(actorId: string): ILogStream {
  return {
    v: LOG_SCHEMA_VERSION,
    encounterId: 'enc-1',
    encounterName: 'Test Encounter',
    start: 1000,
    end: 2000,
    rounds: 3,
    result: 'victory',
    source: 'gm',
    participants: [{ id: actorId, name: 'RAT', type: 'pilot' }],
    events: [
      {
        id: 'e1',
        ts: 1000,
        seq: 1,
        encounterId: 'enc-1',
        round: 1,
        turn: 0,
        actorId,
        kind: 'round.end',
        payload: { round: 1 },
        source: 'gm',
        v: LOG_SCHEMA_VERSION,
      },
    ],
  }
}

function archive(participants: any[]) {
  return {
    ID: 'enc-1',
    History: { participants, events: [] },
    StreamFor: (actorId: string) => streamFor(actorId),
  } as any
}

describe('EncounterStore.RouteArchiveToLogbooks', () => {
  beforeEach(() => {
    PilotStore().Pilots = [{ ID: 'pilot-a' }] as any
    PilotStore().PilotLogbooks = []
  })

  it('creates a logbook and records the encounter for a local pilot', async () => {
    await EncounterStore().RouteArchiveToLogbooks(
      archive([{ id: 'pilot-a', name: 'RAT', type: 'pilot' }])
    )

    const logbook = PilotStore().getLogbookByPilotID('pilot-a')
    expect(logbook).toBeDefined()
    expect(logbook!.Records).toHaveLength(1)
    expect(logbook!.Records[0].encounterId).toBe('enc-1')
    expect(logbook!.Lifetime.rounds).toBe(1)
  })

  it('resolves an instance participant through its originId', async () => {
    await EncounterStore().RouteArchiveToLogbooks(
      archive([{ id: 'instance-1', originId: 'pilot-a', name: 'RAT', type: 'pilot' }])
    )

    expect(PilotStore().getLogbookByPilotID('pilot-a')).toBeDefined()
  })

  it('ignores non-pilot participants and pilots not in the local roster', async () => {
    await EncounterStore().RouteArchiveToLogbooks(
      archive([
        { id: 'npc-1', name: 'ASSAULT', type: 'npc' },
        { id: 'pilot-b', name: 'GHOST', type: 'pilot' },
      ])
    )

    expect(PilotStore().PilotLogbooks).toHaveLength(0)
  })

  it('replaces rather than duplicates when the same encounter is archived twice', async () => {
    const a = archive([{ id: 'pilot-a', name: 'RAT', type: 'pilot' }])
    await EncounterStore().RouteArchiveToLogbooks(a)
    await EncounterStore().RouteArchiveToLogbooks(a)

    const logbook = PilotStore().getLogbookByPilotID('pilot-a')
    expect(logbook!.Records).toHaveLength(1)
    expect(logbook!.Streams).toHaveLength(1)
  })
})
