import { describe, it, expect, beforeEach, vi } from 'vitest'
import { makeMech, makeNpc, makePilot } from '@/__tests__/factories'
import { Encounter } from '@/classes/encounter/Encounter'
import { EncounterInstance } from '@/classes/encounter/EncounterInstance'
import { ActiveEffect } from './ActiveEffect'
import { ActiveEffectEvent } from './ActiveEffectEvent'
import { NpcStatus } from '@/classes/enums'
import type { CombatantData } from '@/classes/encounter/Encounter'

let instance: EncounterInstance
let initiator: CombatantData
let npc: CombatantData

beforeEach(() => {
  const pilot = makePilot({ level: 3 })
  makeMech(pilot)
  const encounter = new Encounter()
  encounter.Name = 'T'
  encounter.AddCombatant(makeNpc('Test NPC 1'))
  instance = new EncounterInstance(undefined, encounter, [pilot])
  initiator = instance.Combatants.find(c => c.type === 'pilot')!
  npc = instance.Combatants.find(c => c.type !== 'pilot')!
})

const targets = () => {
  const event = new ActiveEffectEvent(
    initiator,
    new ActiveEffect({ name: 'X', attack: 'ranged' } as any, initiator.actor),
    instance
  )
  return event.AvailableTargets.map(t => t.id)
}

describe('who can be targeted', () => {
  it('offers a combatant that is on the field', () => {
    expect(targets()).toContain(npc.id)
  })

  it('drops a destroyed combatant', () => {
    const stats = npc.actor.CombatController.StatController
    stats.MaxStats.hp = 10
    stats.setCurrentStat('hp', 0)

    expect(npc.actor.CombatController.IsDestroyed).toBe(true)
    expect(targets()).not.toContain(npc.id)
  })

  it.each([NpcStatus.Routed, NpcStatus.Disengaged, NpcStatus.Destroyed])(
    'drops a combatant marked %s',
    status => {
      npc.status = status
      expect(targets()).not.toContain(npc.id)
    }
  )

  it('drops a reinforcement that has not deployed', () => {
    npc.reinforcement = true
    expect(targets()).not.toContain(npc.id)
  })

  it('offers a reinforcement once deployed, though its turn number remains set', () => {
    npc.reinforcement = true
    npc.reinforcementTurn = 2
    expect(targets()).not.toContain(npc.id)

    // deploying clears the flag but leaves the turn behind
    npc.reinforcement = false
    expect(targets()).toContain(npc.id)
  })
})

describe('a trait that only resists, only for its bearer', () => {
  const trait = (over: Record<string, unknown> = {}) =>
    new ActiveEffect(
      { name: 'Plating', add_resist: [{ resist: 'Kinetic', target: 'self' }], ...over } as any,
      initiator.actor
    )

  it('is recognised as needing no interface at all', () => {
    expect(trait().IsAutoSelfResist).toBe(true)
  })

  it.each([
    ['it also deals damage', { damage: [{ type: 'Kinetic', val: 2 }] }],
    ['it also applies a status', { add_status: ['impaired'] }],
    ['it is an attack', { attack: 'ranged' }],
    ['it targets someone else', { add_resist: [{ resist: 'Kinetic', target: 'ally' }] }],
  ])('is not, when %s', (_label, over) => {
    expect(trait(over).IsAutoSelfResist).toBe(false)
  })

  it('aims itself at the bearer and offers no one else to pick', () => {
    const event = new ActiveEffectEvent(initiator, trait(), instance)

    expect(event.IsSelfOnly).toBe(true)
    expect(event.Targets[0]?.Combatant?.id).toBe(initiator.id)
    expect(event.AvailableTargets).toEqual([initiator])
  })

  it('is granted at encounter start rather than waiting to be clicked', () => {
    const cc = initiator.actor.CombatController
    const applied: string[] = []
    cc.SetResistance = (type: string, condition?: string) => applied.push(`${type}:${condition}`)
    // ActiveEffects is a getter over the feature controller, so the trait is supplied there
    vi.spyOn(cc, 'ActiveEffects', 'get').mockReturnValue([trait()] as any)

    instance.ApplyPassiveResistances()

    expect(applied).toContain('Resistance:Kinetic')
  })
})

describe('a self-targeted effect on a downed actor', () => {
  it('still offers the actor, so a repair or stabilize can reach them', () => {
    const stats = initiator.actor.CombatController.StatController
    stats.MaxStats.hp = 10
    stats.setCurrentStat('hp', 0)
    expect(initiator.actor.CombatController.IsDestroyed).toBe(true)

    const event = new ActiveEffectEvent(
      initiator,
      new ActiveEffect(
        { name: 'Patch', add_status: [{ id: 'impaired', target: 'self' }] } as any,
        initiator.actor
      ),
      instance
    )

    expect(event.TargetType).toBe('self')
    expect(event.AvailableTargets.map(t => t.id)).toContain(initiator.id)
  })
})
