import { describe, it, expect, beforeEach } from 'vitest'
import { makeMech, makeNpc, makePilot } from '@/__tests__/factories'
import { Encounter } from '@/classes/encounter/Encounter'
import { EncounterInstance } from '@/classes/encounter/EncounterInstance'
import { ActiveEffect } from '@/classes/components/feature/active_effects/ActiveEffect'
import { ActiveEffectEvent } from '@/classes/components/feature/active_effects/ActiveEffectEvent'
import type { CombatantData } from '@/classes/encounter/Encounter'

let instance: EncounterInstance
let initiator: CombatantData
let victim: CombatantData

beforeEach(() => {
  const pilot = makePilot({ level: 3 })
  makeMech(pilot)
  const encounter = new Encounter()
  encounter.Name = 'T'
  encounter.AddCombatant(makeNpc('Test NPC 1'))
  instance = new EncounterInstance(undefined, encounter, [pilot])
  initiator = instance.Combatants.find(c => c.type === 'pilot')!
  victim = instance.Combatants.find(c => c.type !== 'pilot')!
})

const eventFor = (data: Record<string, unknown>) =>
  new ActiveEffectEvent(initiator, new ActiveEffect(data as any, initiator.actor), instance)

const held = () => victim.actor.CombatController.Statuses.map((s: any) => s.status.ID)

describe('an effect whose damage has no value to roll', () => {
  it('is ready to apply, rather than waiting forever for a roll', () => {
    const event = eventFor({
      name: 'Zero',
      damage: [{ type: 'Kinetic', val: 0 }],
      add_status: ['impaired'],
    })
    event.SetTarget(victim, 0)

    expect(event.DamageEvents[0].DamageRolledValue).toBe(0)
    expect(event.Ready).toBe(true)
  })

  it('still waits for a value the player has to roll', () => {
    const event = eventFor({ name: 'Dice', damage: [{ type: 'Kinetic', val: '1d6' }] })
    event.SetTarget(victim, 0)

    expect(event.DamageEvents[0].DamageRolledValue).toBeUndefined()
    expect(event.Ready).toBe(false)
  })
})

describe('an effect that adds several statuses to one target', () => {
  it('applies every one of them', () => {
    const event = eventFor({
      name: 'Multi',
      add_status: [
        { id: 'impaired', duration: 'End of Next Turn' },
        { id: 'slow', duration: 'End of Encounter' },
        { id: 'jammed', duration: 'End of Next Turn' },
      ],
    })
    event.SetTarget(victim, 0)
    event.ApplyAll()

    expect(held()).toEqual(expect.arrayContaining(['impaired', 'slow', 'jammed']))
  })

  it('applies them alongside a damage entry that has no value', () => {
    const event = eventFor({
      name: 'Multi',
      damage: [{ type: 'Kinetic', val: 0 }],
      add_status: ['impaired', 'slow', 'jammed'],
    })
    event.SetTarget(victim, 0)

    expect(event.Ready).toBe(true)
    event.ApplyAll()
    expect(held()).toEqual(expect.arrayContaining(['impaired', 'slow', 'jammed']))
  })
})
