import { describe, it, expect } from 'vitest'
import { convertTov2Pilot, convertTov2Npc } from './V2Exporter'
import { isV2Pilot, isV2Npc, transformV2Pilot } from './V2Importer'
import { Pilot } from '@/classes/pilot/Pilot'
import { Unit } from '@/classes/npc/unit/Unit'
import { makePilot, makeMech, makeNpc } from '@/__tests__/factories'

const v3Pilot = () => {
  const p = makePilot({ name: 'Nelson', callsign: 'HAMMER', level: 6 })
  makeMech(p)
  return Pilot.Serialize(p) as any
}

describe('convertTov2Pilot', () => {
  it('produces something the v2 importer recognizes', () => {
    const v2 = convertTov2Pilot(v3Pilot())

    expect(isV2Pilot(v2)).toBe(true)
    expect(v2.callsign).toBe('HAMMER')
    expect(v2.name).toBe('Nelson')
    expect(v2.level).toBe(6)
  })

  it('unwraps an export envelope', () => {
    const data = v3Pilot()
    expect(convertTov2Pilot({ EXPORT_TYPE: 'pilot', data }).id).toBe(data.id)
  })

  it('renames the v3 fields v2 spelled differently', () => {
    const data = { ...v3Pilot(), le: true, sortIndex: 4 }
    const v2 = convertTov2Pilot(data)

    expect(v2.dead).toBe(true)
    expect(v2.sort_index).toBe(4)
    expect(v2.group).toBe('')
  })

  it('flattens core bonuses back to ids', () => {
    const v2 = convertTov2Pilot({ ...v3Pilot(), core_bonuses: [{ id: 'cb_a' }, 'cb_b'] })
    expect(v2.core_bonuses).toEqual(['cb_a', 'cb_b'])
  })

  it('moves img back to the flat portrait fields', () => {
    const v2 = convertTov2Pilot({
      ...v3Pilot(),
      img: { portrait: 'p.png', cloud_portrait: 'c.png' },
    })

    expect(v2.portrait).toBe('p.png')
    expect(v2.cloud_portrait).toBe('c.png')
  })

  it('writes v2 date strings, and an empty deleteTime when the pilot is not deleted', () => {
    const v2 = convertTov2Pilot({
      ...v3Pilot(),
      save: { lastModified: 1700000000000, deleteTime: 0 },
    })

    expect(new Date(v2.lastModified as string).getTime()).toBe(1700000000000)
    expect(v2.deleteTime).toBe('')
  })

  it('fills in defaults for a pilot with almost nothing on it', () => {
    const v2 = convertTov2Pilot({ id: 'bare' })

    expect(v2.level).toBe(0)
    expect(v2.mechSkills).toEqual([0, 0, 0, 0])
    expect(v2.quirks).toEqual([])
    expect(v2.mechs).toEqual([])
    expect(v2.bondAnswers).toEqual(['', ''])
  })

  it('keeps identity through a v3 to v2 to v3 trip', () => {
    const original = v3Pilot()
    const back = transformV2Pilot(convertTov2Pilot(original) as never) as any

    expect(back.id).toBe(original.id)
    expect(back.callsign).toBe(original.callsign)
    expect(back.name).toBe(original.name)
    expect(back.level).toBe(original.level)
    expect(back.itemType).toBe('pilot')

    const reloaded = Pilot.Deserialize(back)
    expect(reloaded.Callsign).toBe('HAMMER')
    expect(reloaded.Level).toBe(6)
  })
})

describe('convertTov2Npc', () => {
  const v3Npc = () => {
    const u = makeNpc('Pursuer Alpha')
    return Unit.Serialize(u, false) as any
  }

  it('produces something the v2 importer recognizes', () => {
    const v2 = convertTov2Npc(v3Npc())

    expect(isV2Npc(v2)).toBe(true)
    expect(v2.name).toBe('Pursuer Alpha')
    expect(v2.side).toBe('Enemy')
  })

  it('flattens a class object down to its id', () => {
    expect(convertTov2Npc({ ...v3Npc(), class: { id: 'npcc_pursuer' } }).class).toBe('npcc_pursuer')
    expect(convertTov2Npc({ ...v3Npc(), class: 'npcc_witch' }).class).toBe('npcc_witch')
  })

  it('reduces narrative labels to plain strings', () => {
    const v2 = convertTov2Npc({
      ...v3Npc(),
      narrative: { labels: [{ title: 'Elite' }, { value: 'Veteran' }] },
    })

    expect(v2.labels).toEqual(['Elite', 'Veteran'])
  })

  it('carries combat state out of combat_data', () => {
    const v2 = convertTov2Npc({
      ...v3Npc(),
      combat_data: {
        isDead: true,
        statuses: ['exposed'],
        resistances: ['kinetic'],
        stats: { current: { burn: 3, overshield: 2 }, max: {} },
      },
    })

    expect(v2.destroyed).toBe(true)
    expect(v2.statuses).toEqual(['exposed'])
    expect(v2.resistances).toEqual(['kinetic'])
    expect(v2.burn).toBe(3)
    expect(v2.overshield).toBe(2)
  })
})
