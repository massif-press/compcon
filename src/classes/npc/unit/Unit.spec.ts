import { describe, it, expect } from 'vitest'
import { Unit } from './Unit'
import { assertFixtureRoundTrip } from '@/__tests__/roundtrip'
import { makeNpc } from '@/__tests__/factories'

const serialize = (u: Unit) => Unit.Serialize(u, false)

describe('Unit.Serialize/Unit.Deserialize', () => {
  it('round-trips a bare unit', () => {
    assertFixtureRoundTrip(serialize(makeNpc()), serialize, Unit.Deserialize)
  })

  it('keeps name, tag, and id', () => {
    const u = makeNpc('Test Unit')
    const back = Unit.Deserialize(serialize(u))

    expect(back.ID).toBe(u.ID)
    expect(back.Name).toBe('Test Unit')
    expect(back.Tag).toBe('Mech')
  })

  it('marks itself as an npc unit for the importer', () => {
    expect(serialize(makeNpc()).npcType).toBe('unit')
  })

  it('omits ui_state when there is none', () => {
    expect(serialize(makeNpc()).ui_state).toBeUndefined()
  })
})

describe('Unit.CreateInstance', () => {
  it('creates a new identity that points back at the origin', () => {
    const u = makeNpc()
    const instance = u.CreateInstance() as any

    expect(instance.is_instance).toBe(true)
    expect(instance.originId).toBe(u.ID)
    expect(instance.id).toBe(instance.instanceId)
    expect(instance.id).not.toBe(u.ID)
  })
})
