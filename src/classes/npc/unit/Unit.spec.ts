import { describe, it, expect, afterEach } from 'vitest'
import { Unit } from './Unit'
import { assertFixtureRoundTrip } from '@/__tests__/roundtrip'
import { makeNpc } from '@/__tests__/factories'
import { StatController } from '@/classes/components/combat/stats/StatController'

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

describe('Unit tier', () => {
  afterEach(() => StatController.ClearCustomStats())

  const tieredStat = () =>
    StatController.RegisterCustomStat({
      key: 'teststat',
      title: 'Test Stat',
      trackable: false,
      default: '1/2/3',
    })

  it('reads the tier set on its class controller everywhere', () => {
    const u = makeNpc()

    u.NpcClassController.Tier = 3

    expect(u.Tier).toBe(3)
    expect(u.CombatController.Tier).toBe(3)
  })

  it('resolves a tiered custom stat at its tier', () => {
    tieredStat()
    const u = makeNpc()
    u.NpcClassController.Tier = 2

    expect(u.StatController.getMax('teststat')).toBe(2)
  })

  it('moves a tiered custom stat when the tier changes', () => {
    tieredStat()
    const u = makeNpc()
    u.SetStats()
    expect(u.StatController.getMax('teststat')).toBe(1)

    u.NpcClassController.Tier = 3

    expect(u.StatController.getMax('teststat')).toBe(3)
  })
})
