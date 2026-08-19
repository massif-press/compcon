import { describe, it, expect } from 'vitest'
import { Pilot } from '@/classes/pilot/Pilot'
import { Unit } from '@/classes/npc/unit/Unit'
import { Encounter } from '@/classes/encounter/Encounter'
import { fixtures, missingFixtures, type FixtureKind } from '@/__tests__/fixtures'
import { assertFixtureRoundTrip } from '@/__tests__/roundtrip'
import {
  isV2Pilot,
  isV2Npc,
  isV2Encounter,
  transformV2Pilot,
  transformV2Npc,
  transformV2Encounter,
} from './V2Importer'

type Root = {
  kind: FixtureKind
  serialize: (x: any) => Record<string, unknown>
  deserialize: (data: any) => any
}

const roots: Root[] = [
  {
    kind: 'pilot',
    serialize: x => Pilot.Serialize(x) as unknown as Record<string, unknown>,
    deserialize: Pilot.Deserialize,
  },
  {
    kind: 'npc',
    serialize: x => Unit.Serialize(x, false) as unknown as Record<string, unknown>,
    deserialize: Unit.Deserialize,
  },
  {
    kind: 'encounter',
    serialize: x => Encounter.Serialize(x) as unknown as Record<string, unknown>,
    deserialize: Encounter.Deserialize,
  },
]

describe('the fixture corpus', () => {
  it('is loaded and classified', () => {
    const counts = {
      pilotV3: fixtures('pilot', 'v3').length,
      pilotV2: fixtures('pilot', 'v2').length,
      npcV3: fixtures('npc', 'v3').length,
      npcV2: fixtures('npc', 'v2').length,
      encounterV3: fixtures('encounter', 'v3').length,
    }

    for (const [kind, count] of Object.entries(counts)) {
      expect(count, `${kind} fixtures`).toBeGreaterThan(0)
    }
  })

  it('carries real content, not empty objects', () => {
    for (const kind of ['pilot', 'npc', 'encounter'] as FixtureKind[]) {
      for (const f of fixtures(kind)) {
        expect(f.data.id, `${f.name} id`).toBeTruthy()
        expect(Object.keys(f.data).length, `${f.name} keys`).toBeGreaterThan(5)
      }
    }
  })
})

describe('v3 golden fixtures', () => {
  for (const { kind, serialize, deserialize } of roots) {
    const corpus = fixtures(kind, 'v3')

    describe(kind, () => {
      if (!corpus.length) {
        it.skip(missingFixtures(`v3 ${kind}`), () => {})
        return
      }

      it.each(corpus)('$name loads', ({ data }) => {
        expect(() => deserialize(structuredClone(data))).not.toThrow()
      })

      it.each(corpus)('$name re-serializes to a stable shape', ({ data }) => {
        assertFixtureRoundTrip(structuredClone(data), serialize, deserialize)
      })

      it.each(corpus)('$name keeps every key the export carried', ({ data }) => {
        const once = serialize(deserialize(structuredClone(data)))
        const lost = Object.keys(data).filter(k => !(k in once))
        expect(lost).toEqual([])
      })

      it.each(corpus)('$name keeps its id and name', ({ data }) => {
        const back = deserialize(structuredClone(data))
        expect(back.ID).toBe((data as any).id)
        if ((data as any).name) expect(back.Name).toBe((data as any).name)
      })
    })
  }
})

describe('v2 golden fixtures', () => {
  const v2Pilots = fixtures('pilot', 'v2')

  describe('pilot', () => {
    if (!v2Pilots.length) {
      it.skip(missingFixtures('v2 pilot'), () => {})
    } else {
      it.each(v2Pilots)('$name is detected as a v2 pilot', ({ data }) => {
        expect(isV2Pilot(data)).toBe(true)
      })

      it.each(v2Pilots)('$name migrates into a loadable v3 pilot', ({ data }) => {
        const migrated = transformV2Pilot(structuredClone(data) as never) as any
        const pilot = Pilot.Deserialize(migrated)

        expect(pilot.ID).toBe(data.id)
        expect(pilot.Callsign).toBe(data.callsign)
        expect(pilot.Level).toBe(data.level ?? 0)
        expect(pilot.Mechs).toHaveLength(data.mechs?.length ?? 0)
      })

      it.each(v2Pilots)('$name is stable once migrated', ({ data }) => {
        const migrated = transformV2Pilot(structuredClone(data) as never) as any
        assertFixtureRoundTrip(
          Pilot.Serialize(Pilot.Deserialize(migrated)) as never,
          x => Pilot.Serialize(x as Pilot) as never,
          Pilot.Deserialize
        )
      })

      it.each(v2Pilots)('$name keeps its mech loadouts through the migration', ({ data }) => {
        const pilot = Pilot.Deserialize(transformV2Pilot(structuredClone(data) as never) as any)

        pilot.Mechs.forEach((mech, i) => {
          expect(mech.Frame.ID).toBe(data.mechs[i].frame)
          expect(mech.MechLoadoutController.ActiveLoadout).toBeTruthy()
        })
      })
    }
  })

  const v2Npcs = fixtures('npc', 'v2')

  describe('npc', () => {
    if (!v2Npcs.length) {
      it.skip(missingFixtures('v2 npc'), () => {})
    } else {
      it.each(v2Npcs)('$name is detected as a v2 npc', ({ data }) => {
        expect(isV2Npc(data)).toBe(true)
      })

      it.each(v2Npcs)('$name migrates into a loadable v3 unit', ({ data }) => {
        const migrated = transformV2Npc(structuredClone(data) as never) as any
        const unit = Unit.Deserialize(migrated)

        expect(unit.ID).toBe(data.id)
        expect(unit.Name).toBe(data.name)
      })

      it.each(v2Npcs)('$name is stable once migrated', ({ data }) => {
        const migrated = transformV2Npc(structuredClone(data) as never) as any
        assertFixtureRoundTrip(
          Unit.Serialize(Unit.Deserialize(migrated), false) as never,
          x => Unit.Serialize(x as Unit, false) as never,
          Unit.Deserialize
        )
      })
    }
  })

  const v2Encounters = fixtures('encounter', 'v2')

  describe('encounter', () => {
    if (!v2Encounters.length) {
      it.skip(missingFixtures('v2 encounter'), () => {})
    } else {
      it.each(v2Encounters)('$name is detected as a v2 encounter', ({ data }) => {
        expect(isV2Encounter(data)).toBe(true)
      })

      it.each(v2Encounters)('$name migrates into a loadable v3 encounter', ({ data }) => {
        const [migrated] = transformV2Encounter(structuredClone(data) as never) as any[]
        expect(() => Encounter.Deserialize(migrated)).not.toThrow()
      })
    }
  })
})
