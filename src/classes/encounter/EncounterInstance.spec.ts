import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Encounter } from './Encounter'
import { EncounterInstance } from './EncounterInstance'
import { Placeholder } from './Placeholder'
import { makePilot, makeMech } from '@/__tests__/factories'
import type { Pilot } from '@/classes/pilot/Pilot'

const makeEncounter = (name = 'Test Encounter') => {
  const e = new Encounter()
  e.Name = name
  return e
}

const withPilot = (name: string) => {
  const p = makePilot({ name, callsign: name.toUpperCase() })
  makeMech(p)
  return p
}

const placeholder = (side: 'ally' | 'enemy', name: string) =>
  new Placeholder({ id: `ph-${name}`, name, side, type: 'npc' })

let pilot: Pilot

beforeEach(() => {
  pilot = withPilot('test')
})

describe('EncounterInstance construction', () => {
  it('requires an encounter when there is no saved data', () => {
    expect(() => new EncounterInstance()).toThrow('requires encounter data')
  })

  it('starts on round 1', () => {
    const instance = new EncounterInstance(undefined, makeEncounter('Ambush'), [pilot])
    expect(instance.Round).toBe(1)
  })

  it('only picks up the encounter name once it has been saved and reloaded', () => {
    const instance = new EncounterInstance(undefined, makeEncounter('Ambush'), [pilot])
    expect(instance.Name).toBe('New Encounter')

    const reloaded = EncounterInstance.Deserialize(
      JSON.parse(JSON.stringify(EncounterInstance.Serialize(instance)))
    )
    expect(reloaded.Name).toBe('Ambush')
  })

  it('adds each pilot as an ally combatant', () => {
    const instance = new EncounterInstance(undefined, makeEncounter(), [pilot])
    const [combatant] = instance.Combatants

    expect(instance.Combatants).toHaveLength(1)
    expect(combatant.type).toBe('pilot')
    expect(combatant.side).toBe('ally')
    expect(combatant.id).toBe(pilot.ID)
  })

  it('copies the pilot rather than instancing the roster object', () => {
    const instance = new EncounterInstance(undefined, makeEncounter(), [pilot])
    const actor = instance.Combatants[0].actor

    expect(actor).not.toBe(pilot)
    expect(actor.IsEncounterInstance).toBe(true)
    expect(pilot.IsEncounterInstance).toBe(false)
  })

  it('carries only the active mech into the instance', () => {
    makeMech(pilot)
    makeMech(pilot)
    expect(pilot.Mechs).toHaveLength(3)

    const instance = new EncounterInstance(undefined, makeEncounter(), [pilot])
    expect(instance.Combatants[0].actor.Mechs).toHaveLength(1)
  })

  it('adds placeholders on their own side', () => {
    const instance = new EncounterInstance(
      undefined,
      makeEncounter(),
      [pilot],
      [placeholder('enemy', 'Unknown Contact')]
    )

    const ph = instance.Combatants.find(c => c.type === 'placeholder')
    expect(ph?.side).toBe('enemy')
  })

  it('indexes combatants in order', () => {
    const instance = new EncounterInstance(
      undefined,
      makeEncounter(),
      [pilot, withPilot('Bravo')],
      [placeholder('ally', 'Drone')]
    )

    expect(instance.Combatants.map(c => c.index)).toEqual([0, 1, 2])
  })

  it('does not carry combatant data over from the source encounter', () => {
    const encounter = makeEncounter()
    const instance = new EncounterInstance(undefined, encounter, [pilot])

    expect(instance.Encounter.Combatants).toHaveLength(0)
  })
})

describe('EncounterInstance.getTargetsSorted', () => {
  const build = () =>
    new EncounterInstance(
      undefined,
      makeEncounter(),
      [pilot, withPilot('Bravo')],
      [placeholder('enemy', 'Hostile'), placeholder('ally', 'Drone')]
    )

  it('puts the requested side first', () => {
    const targets = build().getTargetsSorted('enemy', 'ally')
    expect(targets[0].side).toBe('enemy')
  })

  it('flips sides when the origin is an enemy', () => {
    const targets = build().getTargetsSorted('enemy', 'enemy')
    expect(targets[0].side).toBe('ally')
  })

  it('puts self first when asked for self', () => {
    const instance = build()
    const targets = instance.getTargetsSorted('self', 'ally', pilot.ID)
    expect(targets[0].id).toBe(pilot.ID)
  })

  it('falls back to enemy for an unknown target type', () => {
    const targets = build().getTargetsSorted('nonsense' as 'enemy', 'ally')
    expect(targets[0].side).toBe('enemy')
  })

  it('sorts same-side targets by name', () => {
    const allies = build()
      .getTargetsSorted('ally', 'ally')
      .filter(t => t.side === 'ally')
      .map(t => t.actor.Name)

    expect(allies).toEqual([...allies].sort((a, b) => a.localeCompare(b)))
  })

  it('includes deployables under their owner side', () => {
    const instance = build()
    const owner = instance.Combatants[0]
    owner.deployables.push({ ID: 'dep-1', Name: 'Turret' } as never)

    const targets = instance.getTargetsSorted('ally', 'ally')
    expect(targets.some(t => t.id === 'dep-1')).toBe(true)
  })
})

describe('EncounterInstance.EndRound', () => {
  it('advances the round', async () => {
    vi.useFakeTimers()
    const instance = new EncounterInstance(undefined, makeEncounter(), [pilot])
    instance.Autosave = false

    const done = instance.EndRound()
    await vi.runAllTimersAsync()
    await done

    expect(instance.Round).toBe(2)
    vi.useRealTimers()
  })
})

describe('EncounterInstance.Serialize/Deserialize', () => {
  it('round-trips an instance', () => {
    const instance = new EncounterInstance(undefined, makeEncounter('Ambush'), [pilot])
    instance.Round = 4

    const back = EncounterInstance.Deserialize(
      JSON.parse(JSON.stringify(EncounterInstance.Serialize(instance)))
    )

    expect(back.ID).toBe(instance.ID)
    expect(back.Round).toBe(4)
    expect(back.Combatants).toHaveLength(1)

    const once = EncounterInstance.Serialize(back)
    const twice = EncounterInstance.Serialize(
      EncounterInstance.Deserialize(JSON.parse(JSON.stringify(once)))
    )
    expect(twice).toEqual(once)
  })

  it('keeps actor instance ids stable across saves and reloads', () => {
    const instance = new EncounterInstance(undefined, makeEncounter(), [pilot])

    const first = EncounterInstance.Serialize(instance).combatants[0].actor.instanceId
    const second = EncounterInstance.Serialize(instance).combatants[0].actor.instanceId

    expect(first).toBeTruthy()
    expect(second).toBe(first)

    const reloaded = EncounterInstance.Deserialize(
      JSON.parse(JSON.stringify(EncounterInstance.Serialize(instance)))
    )
    expect(EncounterInstance.Serialize(reloaded).combatants[0].actor.instanceId).toBe(first)
    expect(EncounterInstance.Serialize(reloaded).combatants[0].id).toBe(pilot.ID)
  })

  it('normalizes optional combatant fields on load', () => {
    const instance = new EncounterInstance(undefined, makeEncounter(), [pilot])
    const loaded = EncounterInstance.Deserialize(
      JSON.parse(JSON.stringify(EncounterInstance.Serialize(instance)))
    )

    const combatant = EncounterInstance.Serialize(loaded).combatants[0]
    expect(combatant.playerCount).toBe(1)
    expect(combatant.reinforcement).toBe(false)
    expect(combatant.reinforcementTurn).toBe(0)
  })

  it('returns an empty object rather than throwing on a null instance', () => {
    expect(EncounterInstance.Serialize(null as never)).toEqual({})
  })

  it('refuses to deserialize nothing', () => {
    expect(() => EncounterInstance.Deserialize(null as never)).toThrow('Cannot deserialize')
  })

  it('clones with a fresh id and identical contents', () => {
    const instance = new EncounterInstance(undefined, makeEncounter('Ambush'), [pilot])
    const clone = instance.Clone()

    expect(clone.ID).not.toBe(instance.ID)
    expect(clone.Combatants).toHaveLength(instance.Combatants.length)
  })
})
