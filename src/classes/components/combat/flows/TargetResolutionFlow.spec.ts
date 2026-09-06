import { describe, it, expect } from 'vitest'
import { resolveTargetRoll, resolveTargetDefense } from './TargetResolutionFlow'

const combatant = (stats: Record<string, number>) => ({
  actor: {
    CombatController: {
      ActiveActor: { StatController: { getMax: (k: string) => stats[k] } },
    },
  },
})

describe('the target resolution flows', () => {
  it('reads evasion for a weapon attack and e-defense for a tech attack', () => {
    const stats = { evasion: 8, edef: 12 }

    const melee: any = { AttackType: 'melee', Combatant: combatant(stats) }
    resolveTargetDefense(melee, {})
    expect(melee.TargetDefense).toBe('Evasion')
    expect(melee.TargetDefenseValue).toBe(8)

    const tech: any = { AttackType: 'tech', Combatant: combatant(stats) }
    resolveTargetDefense(tech, {})
    expect(tech.TargetDefense).toBe('E-Defense')
    expect(tech.TargetDefenseValue).toBe(12)
  })

  it('falls back to 10 with no combatant to read', () => {
    const target: any = { AttackType: 'ranged', Combatant: null }
    resolveTargetDefense(target, {})
    expect(target.TargetDefenseValue).toBe(10)
  })

  it('marks a half damage save from the hit result on an attack and from the save on a save', () => {
    const attack: any = { AttackType: 'ranged', HitResult: 'hit', SavedHalf: false }
    resolveTargetRoll({ target: attack, event: { SaveHalf: true }, kind: 'attack' })
    expect(attack.SavedHalf).toBe(true)

    const missed: any = { AttackType: 'ranged', HitResult: 'miss', SavedHalf: false }
    resolveTargetRoll({ target: missed, event: { SaveHalf: true }, kind: 'attack' })
    expect(missed.SavedHalf).toBe(false)

    const save: any = { SaveResult: 'success', SavedHalf: false }
    resolveTargetRoll({ target: save, event: { SaveHalf: true }, kind: 'save' })
    expect(save.SavedHalf).toBe(true)
  })

  it('leaves the half damage mark alone when the effect does not offer one', () => {
    const target: any = { AttackType: 'ranged', HitResult: 'hit', SavedHalf: false }
    resolveTargetRoll({ target, event: { SaveHalf: false }, kind: 'attack' })
    expect(target.SavedHalf).toBe(false)
  })

  it('crits a natural 20 on a weapon attack, and never on a tech attack or a save', () => {
    let crits = 0
    const event = (canCrit: boolean) => ({
      SaveHalf: false,
      Effect: { CanCrit: canCrit },
      Initiator: {
        actor: { CombatController: { ActiveActor: { CombatController: { CanCrit: true } } } },
      },
      SetCrit: () => crits++,
    })

    const weapon: any = { AttackType: 'ranged', AttackRolledValue: 20 }
    resolveTargetRoll({ target: weapon, event: event(true), kind: 'attack' })
    expect(crits).toBe(1)

    const tech: any = { AttackType: 'tech', AttackRolledValue: 20 }
    resolveTargetRoll({ target: tech, event: event(true), kind: 'attack' })
    expect(crits).toBe(1)

    const save: any = { AttackType: 'ranged', AttackRolledValue: 20 }
    resolveTargetRoll({ target: save, event: event(true), kind: 'save' })
    expect(crits).toBe(1)

    const noCrit: any = { AttackType: 'ranged', AttackRolledValue: 20 }
    resolveTargetRoll({ target: noCrit, event: event(false), kind: 'attack' })
    expect(crits).toBe(1)
  })

  it('does not crit for an attacker that cannot crit', () => {
    let crits = 0
    const target: any = { AttackType: 'melee', AttackRolledValue: 20 }
    resolveTargetRoll({
      target,
      event: {
        SaveHalf: false,
        Effect: { CanCrit: true },
        Initiator: {
          actor: { CombatController: { ActiveActor: { CombatController: { CanCrit: false } } } },
        },
        SetCrit: () => crits++,
      },
      kind: 'attack',
    })
    expect(crits).toBe(0)
  })
})
