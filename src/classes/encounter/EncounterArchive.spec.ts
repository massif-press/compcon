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
  encounter.Name = 'Test Encounter'
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

describe('the archived event stream', () => {
  it('stamps the encounter id on every recorder before anything is recorded', () => {
    const cc = instance.Combatants[0].actor.CombatController
    expect(cc.CombatLog.EncounterId).toBe(instance.ID)
    expect(cc.CombatLog.Source).toBe('gm')
  })

  it('collects every combatant into one stream, keyed by actor id rather than by name', () => {
    const cc = instance.Combatants[0].actor.CombatController
    cc.Record('note', { text: 'a' })
    cc.Record('move', { spent: 2, mode: 'move' })

    const archive = EncounterArchive.FromInstance(instance, 'msg', 'victory')

    expect(archive.History.events).toHaveLength(2)
    expect(archive.History.participants.length).toBeGreaterThan(0)
    expect(archive.History.participants[0].id).toBeTruthy()
    expect(archive.History.participants[0].name).toBeTruthy()
  })

  it('hands one actor a package of only what concerns them', () => {
    const cc = instance.Combatants[0].actor.CombatController
    const me = cc.RootActor.ID
    cc.Record('note', { text: 'mine' })
    cc.CombatLog.Events.push({
      ...cc.CombatLog.Events[0],
      id: 'other-1',
      actorId: 'someone-else',
      payload: { text: 'theirs' },
    } as never)

    const archive = EncounterArchive.FromInstance(instance, 'msg', 'victory')

    expect(archive.Stream.events).toHaveLength(2)
    expect(archive.StreamFor(me).events).toHaveLength(1)
    expect((archive.StreamFor(me).events[0].payload as any).text).toBe('mine')
  })

  it('keeps one encounter id across the events, the archive, and the package', () => {
    const cc = instance.Combatants[0].actor.CombatController
    cc.Record('note', { text: 'x' })
    const archive = EncounterArchive.FromInstance(instance, 'msg', 'victory')

    expect(archive.ID).toBe(instance.ID)
    expect(archive.Stream.encounterId).toBe(instance.ID)
    expect(archive.History.events.every(e => e.encounterId === instance.ID)).toBe(true)
  })

  it('carries the encounter identity into the package a player receives', () => {
    const cc = instance.Combatants[0].actor.CombatController
    cc.Record('note', { text: 'x' })
    const archive = EncounterArchive.FromInstance(instance, 'msg', 'victory')

    const forMe = archive.StreamFor(cc.RootActor.ID)
    expect(forMe.encounterId).toBe(archive.ID)
    expect(forMe.encounterName).toBe('Test Encounter')
    expect(forMe.result).toBe('victory')
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

describe('ending with an after action report', () => {
  it('archives statuses before encounter end', () => {
    const c = instance.Combatants[0]
    instance.EndEncounter('PC VICTORY', { [c.id]: { pilotStatus: 'KIA' } })

    const archive = EncounterArchive.FromInstance(instance, '', 'PC VICTORY')
    const kinds = archive.History.events.map(e => e.kind)

    expect(kinds.indexOf('pilot.status')).toBeGreaterThanOrEqual(0)
    expect(kinds.indexOf('pilot.status')).toBeLessThan(kinds.indexOf('encounter.end'))
    expect(c.pilotStatus).toBe('KIA')
  })

  it('previews the same stream it archives', () => {
    instance.Combatants[0].actor.CombatController.Record('note', { text: 'a' })
    const preview = instance.Stream
    const archive = EncounterArchive.FromInstance(instance, '', '')
    expect(archive.History.events).toEqual(preview.events)
    expect(archive.History.participants).toEqual(preview.participants)
  })
})
