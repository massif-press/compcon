import { describe, it, expect } from 'vitest'
import { Pilot } from './Pilot'
import { Mech } from '@/classes/mech/Mech'
import { makePilot, makeMech, frame } from '@/__tests__/factories'

describe('Pilot.Grit', () => {
  it.each([
    [0, 0],
    [1, 1],
    [2, 1],
    [5, 3],
    [12, 6],
  ])('is half of level %i rounded up', (level, grit) => {
    expect(makePilot({ level }).Grit).toBe(grit)
  })
})

describe('Pilot mech roster', () => {
  it('adds a mech', () => {
    const p = makePilot()
    const m = makeMech(p)
    expect(p.Mechs).toEqual([m])
  })

  it('removes a mech by ID', () => {
    const p = makePilot()
    const a = makeMech(p)
    makeMech(p)
    p.RemoveMech(a)
    expect(p.Mechs.map(x => x.ID)).not.toContain(a.ID)
    expect(p.Mechs).toHaveLength(1)
  })

  it('leaves the roster alone when removing a mech it does not own', () => {
    const p = makePilot()
    makeMech(p)
    p.RemoveMech(new Mech(frame(), makePilot()))
    expect(p.Mechs).toHaveLength(1)
  })

  it('clones a mech with a new ID and a marked name', () => {
    const p = makePilot()
    const m = makeMech(p)
    p.CloneMech(m)

    const clone = p.Mechs[1]
    expect(p.Mechs).toHaveLength(2)
    expect(clone.ID).not.toBe(m.ID)
    expect(clone.Name).toBe(`${m.Name}*`)
    expect(clone.Frame.ID).toBe(m.Frame.ID)
  })
})

describe('Pilot.RenewID', () => {
  it('replaces the id', () => {
    const p = makePilot()
    const before = p.ID
    p.RenewID()
    expect(p.ID).not.toBe(before)
  })
})

describe('Pilot.Clone', () => {
  it('marks the copy and renews every id', () => {
    const p = makePilot()
    const m = makeMech(p)
    const clone = p.Clone()

    expect(clone.ID).not.toBe(p.ID)
    expect(clone.Name).toBe('Test Pilot (CLONE)')
    expect(clone.Callsign).toBe('TESTER*')
    expect(clone.Mechs[0].ID).not.toBe(m.ID)
  })

  it('can copy without renaming', () => {
    expect(makePilot().Clone(false).Name).toBe('Test Pilot')
  })
})

describe('Pilot.Serialize/Pilot.Deserialize', () => {
  it('round-trips a pilot with a mech', () => {
    const p = makePilot()
    makeMech(p)

    const once = Pilot.Serialize(Pilot.Deserialize(Pilot.Serialize(p)))
    const twice = Pilot.Serialize(Pilot.Deserialize(once))
    expect(twice).toEqual(once)
  })

  it('keeps identity fields across the round-trip', () => {
    const p = makePilot({ name: 'Nelson', callsign: 'HAMMER', level: 6 })
    const back = Pilot.Deserialize(Pilot.Serialize(p))

    expect(back.ID).toBe(p.ID)
    expect(back.Name).toBe('Nelson')
    expect(back.Callsign).toBe('HAMMER')
    expect(back.Level).toBe(6)
    expect(back.Grit).toBe(3)
  })

  it('defaults an empty pilot to ACTIVE with no mechs', () => {
    const data = Pilot.Serialize(new Pilot())
    expect(data.status).toBe('ACTIVE')
    expect(data.mechs).toEqual([])
  })
})

describe('Pilot.CreateInstance', () => {
  it('mints a new identity that points back at the origin', () => {
    const p = makePilot()
    const instance = p.CreateInstance() as any

    expect(instance.is_instance).toBe(true)
    expect(instance.originId).toBe(p.ID)
    expect(instance.id).toBe(instance.instanceId)
    expect(instance.id).not.toBe(p.ID)
  })
})
