import { describe, it, expect, beforeEach } from 'vitest'
import { makePilot, makeMech } from '@/__tests__/factories'
import { Encounter } from './Encounter'
import { EncounterInstance } from './EncounterInstance'
import { EncounterArchive } from './EncounterArchive'

let instance: EncounterInstance

beforeEach(() => {
  const pilot = makePilot()
  makeMech(pilot)
  const encounter = new Encounter()
  encounter.Name = 'Ambush'
  instance = new EncounterInstance(undefined, encounter, [pilot])
  instance.Round = 3
})

describe('EncounterArchive.FromInstance', () => {
  it('captures the encounter as it was', () => {
    const archive = EncounterArchive.FromInstance(instance, 'msg', 'victory')

    expect(archive.Round).toBe(3)
    expect(archive.Result).toBe('victory')
    expect(archive.EncounterData).toBeTruthy()
    expect(archive.End).toBeGreaterThan(0)
  })
})

describe('EncounterArchive.Serialize/Deserialize', () => {
  it('round-trips an archive', () => {
    const archive = EncounterArchive.FromInstance(instance, 'report', 'defeat')

    const once = EncounterArchive.Serialize(archive)
    const back = EncounterArchive.Deserialize(JSON.parse(JSON.stringify(once)))

    expect(back.ID).toBe(archive.ID)
    expect(back.Result).toBe('defeat')
    expect(back.Round).toBe(3)
    expect(EncounterArchive.Serialize(back)).toEqual(once)
  })

  it('keeps the after action report', () => {
    const archive = EncounterArchive.FromInstance(instance, 'msg', 'victory')
    const back = EncounterArchive.Deserialize(EncounterArchive.Serialize(archive))

    expect(back.AfterActionReport).toBe('msg')
  })
})
