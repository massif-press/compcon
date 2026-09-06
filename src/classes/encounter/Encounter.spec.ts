import { describe, it, expect, beforeEach } from 'vitest'
import { Encounter, makeCombatant } from './Encounter'
import { makeNpc } from '@/__tests__/factories'

let encounter: Encounter

beforeEach(() => {
  encounter = new Encounter()
  encounter.Name = 'Ambush'
})

describe('Encounter defaults', () => {
  it('mints an id and starts empty', () => {
    expect(encounter.ID).toBeTruthy()
    expect(encounter.Combatants).toEqual([])
  })

  it('renews its id on demand', () => {
    const before = encounter.ID
    encounter.RenewID()
    expect(encounter.ID).not.toBe(before)
  })
})

describe('Encounter.AddCombatant', () => {
  it('adds an npc as a combatant instance', () => {
    encounter.AddCombatant(makeNpc('Pursuer') as never)

    expect(encounter.Combatants).toHaveLength(1)
    expect(encounter.Combatants[0].type).toBe('unit')
    expect(encounter.Combatants[0].actor.Name).toBe('Pursuer')
  })

  it('copies the npc rather than holding the roster object', () => {
    const npc = makeNpc('Pursuer')
    encounter.AddCombatant(npc as never)

    expect(encounter.Combatants[0].actor).not.toBe(npc)
  })

  it('does not share max stats with the roster npc, even through a round trip', () => {
    const npc = makeNpc('Pursuer')
    npc.CombatController.StatController.setMax('hp', 10)
    encounter.AddCombatant(npc as never)

    const combatant = encounter.Combatants[0]
    const roundTripped = Encounter.DeserializeCombatant(Encounter.SerializeCombatant(combatant))

    expect(roundTripped.actor.CombatController.StatController.getMax('hp')).toBe(10)

    roundTripped.actor.CombatController.StatController.setMax('hp', 99)
    combatant.actor.CombatController.StatController.setMax('hp', 50)

    expect(npc.CombatController.StatController.getMax('hp')).toBe(10)
  })

  it('does not share mutable per-actor state with the roster npc', () => {
    const npc = makeNpc('Pursuer')
    npc.UIState['expanded'] = true
    npc.CombatController.CounterController.createCustomCounter('ammo')
    encounter.AddCombatant(npc as never)
    const actor = encounter.Combatants[0].actor as any
    const counters = actor.CombatController.CounterController
    const fullBefore = npc.CombatController.CombatActions.Full

    actor.CombatController.AddResist('kinetic', 'resistance')
    actor.CombatController.MarkActionUsed('act_x')
    actor.CombatController.AddPendingCheck('structure')
    actor.CombatController.SetCombatAction('Full', !fullBefore)
    actor.CombatController.Record('note', { text: 'x' })
    actor.UIState['expanded'] = false
    counters.deleteCustomCounter(counters.CustomCounterData[0].id)

    expect(npc.CombatController.Resistances).toHaveLength(0)
    expect(npc.CombatController.IsActionUsed('act_x')).toBe(false)
    expect(npc.CombatController.PendingChecks).toHaveLength(0)
    expect(npc.CombatController.CombatActions.Full).toBe(fullBefore)
    expect(npc.CombatController.CombatLog.Events).toHaveLength(0)
    expect(npc.UIState['expanded']).toBe(true)
    expect(npc.CombatController.CounterController.CustomCounterData).toHaveLength(1)
  })

  it('numbers duplicates of the same name', () => {
    encounter.AddCombatant(makeNpc('Pursuer') as never)
    encounter.AddCombatant(makeNpc('Pursuer') as never)
    encounter.AddCombatant(makeNpc('Witch') as never)

    expect(encounter.Combatants.map(c => c.number)).toEqual([1, 2, 1])
  })

  it('rejects an actor that is not a combatant type', () => {
    expect(() => encounter.AddCombatant({ ItemType: 'pilot' } as never)).toThrow(
      'Invalid combatant type'
    )
  })
})

describe('Encounter.RemoveCombatant', () => {
  it('removes by index and records a tombstone', () => {
    encounter.AddCombatant(makeNpc('A') as never)
    encounter.AddCombatant(makeNpc('B') as never)
    const removedId = encounter.Combatants[0].id

    encounter.RemoveCombatant(0)

    expect(encounter.Combatants.map(c => c.actor.Name)).toEqual(['B'])
    expect(encounter.CloudController._fieldTs[`combatants.${removedId}`]).toBeGreaterThan(0)
  })
})

describe('Encounter.ReorderCombatant', () => {
  it('moves a combatant to a new position', () => {
    encounter.AddCombatant(makeNpc('A') as never)
    encounter.AddCombatant(makeNpc('B') as never)
    encounter.AddCombatant(makeNpc('C') as never)

    encounter.ReorderCombatant(0, 2)

    expect(encounter.Combatants.map(c => c.actor.Name)).toEqual(['B', 'C', 'A'])
  })
})

describe('Encounter.Serialize/Deserialize', () => {
  it('round-trips an encounter with combatants', () => {
    encounter.Note = 'gm only'
    encounter.Description = 'briefing'
    encounter.AddCombatant(makeNpc('Pursuer') as never)

    const back = Encounter.Deserialize(JSON.parse(JSON.stringify(Encounter.Serialize(encounter))))

    expect(back.ID).toBe(encounter.ID)
    expect(back.Name).toBe('Ambush')
    expect(back.Note).toBe('gm only')
    expect(back.Description).toBe('briefing')
    expect(back.Combatants).toHaveLength(1)

    const once = Encounter.Serialize(back)
    const twice = Encounter.Serialize(Encounter.Deserialize(JSON.parse(JSON.stringify(once))))
    expect(twice).toEqual(once)
  })

  it('passes a non-encounter through rather than throwing', () => {
    expect(Encounter.Serialize(null as never)).toEqual({})
    expect(Encounter.Serialize({ id: 'raw' } as never)).toEqual({ id: 'raw' })
  })

  it('refuses a combatant of an unknown type', () => {
    expect(() => Encounter.DeserializeCombatant({ type: 'wizard' } as never)).toThrow(
      'Invalid combatant type'
    )
  })

  it('defaults combatant side to enemy and number to 1', () => {
    encounter.AddCombatant(makeNpc('Pursuer') as never)
    const saved = Encounter.SerializeCombatant(encounter.Combatants[0]) as any
    delete saved.side
    delete saved.number
    delete saved.id

    const combatant = Encounter.DeserializeCombatant(saved)

    expect(combatant.side).toBe('enemy')
    expect(combatant.number).toBe(1)
    expect(combatant.id).toBeTruthy()
  })
})

describe('Encounter.Clone', () => {
  it('copies the encounter under a new id', () => {
    encounter.AddCombatant(makeNpc('Pursuer') as never)
    const clone = encounter.Clone()

    expect(clone.ID).not.toBe(encounter.ID)
    expect(clone.Name).toBe(encounter.Name)
    expect(clone.Combatants).toHaveLength(1)
  })
})

describe('CombatantData.Label', () => {
  const combatant = (type: string, number: number, name = 'ASSAULT') =>
    makeCombatant({ ID: 'x', CombatController: { CombatName: name } } as never, type as never, {
      number,
    })

  it.each(['unit', 'doodad', 'eidolon'])('numbers a %s, so two of them can be told apart', type => {
    expect(combatant(type, 2).Label).toBe('ASSAULT #2')
  })

  it.each(['pilot', 'placeholder'])('leaves a %s unnumbered', type => {
    expect(combatant(type, 2, 'TEST').Label).toBe('TEST')
  })

  it('omits a number that was never assigned', () => {
    expect(combatant('unit', -1).Label).toBe('ASSAULT')
  })

  it('has nothing to say about an actor with no combat name', () => {
    expect(makeCombatant({ ID: 'x' } as never, 'unit').Label).toBe('')
  })

  it('follows the number it is renumbered to', () => {
    const c = combatant('unit', 1)
    c.number = 4
    expect(c.Label).toBe('ASSAULT #4')
  })

  it('survives a serialize and deserialize round trip', () => {
    encounter.AddCombatant(makeNpc('Pursuer') as never)
    const restored = Encounter.DeserializeCombatant(
      Encounter.SerializeCombatant(encounter.Combatants[0])
    )
    expect(restored.Label).toBe(encounter.Combatants[0].Label)
  })
})
