import { describe, it, expect } from 'vitest'
import {
  WeaponAttackFlow,
  targetDefenseFor,
  hitResultFor,
  canCrit,
  critTriggers,
  reliableIncoming,
  incomingDamage,
  overkillHeatFor,
  routesTo,
  attackCountFor,
} from './WeaponAttackFlow'

const state = (over = {}) =>
  ({ attacker: { CanFireWeapon: () => true, DropAttackRevealedStatuses: () => undefined }, targets: [], eligible: false, ...over }) as any

describe('WeaponAttackFlow', () => {
  it('names its eleven steps in the order the audit assigns them', () => {
    expect(WeaponAttackFlow.Steps).toEqual([
      'weapon-eligibility',
      'attack-type',
      'accuracy',
      'damage-roll',
      'damage-type-resolution',
      'damage-calculation',
      'damage-application',
      'additional-attacks',
      'consume-uses',
      'heat-application',
      'post-attack',
    ])
  })

  it('halts at eligibility before anything is rolled or spent', () => {
    const r = WeaponAttackFlow.Begin(
      state({ attacker: { CanFireWeapon: () => false }, weapon: {} })
    )

    expect(r.outcome).toBe('halted')
    expect(r.pending).toBe('weapon-eligibility')
    expect(r.state.blockedBy).toBe('ordnance')
    expect(r.completed).toEqual([])
  })

  it('awaits at the damage roll while any target has no attack result yet', () => {
    const r = WeaponAttackFlow.Begin(state({ targets: [{ AttackRolledValue: undefined }] }))

    expect(r.outcome).toBe('awaiting')
    expect(r.pending).toBe('damage-roll')
  })

  it('runs to the end once every target has rolled', () => {
    let dropped = false
    const r = WeaponAttackFlow.Begin(
      state({
        attacker: { CanFireWeapon: () => true, DropAttackRevealedStatuses: () => (dropped = true) },
        targets: [{ AttackRolledValue: 14 }],
      })
    )

    expect(r.outcome).toBe('complete')
    expect(dropped).toBe(true)
  })
})

describe('rules moved out of the attack event classes', () => {
  it('targets e-defence for a tech attack, and whatever the effect declares over that', () => {
    expect(targetDefenseFor('tech')).toBe('edef')
    expect(targetDefenseFor('ranged')).toBe('evasion')
    expect(targetDefenseFor('ranged', 'edef')).toBe('edef')
  })

  it('resolves a hit against the target defence, with 20 always a crit', () => {
    expect(hitResultFor(undefined, 10)).toBe('')
    expect(hitResultFor(14, 0)).toBe('')
    expect(hitResultFor(9, 10)).toBe('miss')
    expect(hitResultFor(10, 10)).toBe('hit')
    expect(hitResultFor(20, 99)).toBe('crit')
  })

  it('restricts crits to melee and ranged, and to attackers that can crit', () => {
    expect(canCrit('tech', true)).toBe(false)
    expect(canCrit('ranged', true)).toBe(true)

    expect(critTriggers(20, 'ranged', true)).toBe(true)
    expect(critTriggers(20, 'tech', true)).toBe(false)
    expect(critTriggers(19, 'ranged', true)).toBe(false)
    expect(critTriggers(20, 'ranged', true, false)).toBe(false)
  })

  it('deals reliable on a miss and the roll on a hit', () => {
    expect(reliableIncoming('miss', 0, 3)).toBe(3)
    expect(reliableIncoming('hit', 1, 3)).toBe(1)
  })

  it('composes incoming damage from the roll, the bonus, area halving and a save', () => {
    const base = { hitResult: 'hit', rolled: 6, bonus: 4, reliable: 0, isAoE: false, savedHalf: false }

    expect(incomingDamage(base)).toBe(10)
    expect(incomingDamage({ ...base, isAoE: true })).toBe(8)
    expect(incomingDamage({ ...base, savedHalf: true })).toBe(5)
    expect(incomingDamage({ ...base, hitResult: 'miss', reliable: 3 })).toBe(3)
  })

  it('charges overkill heat only when the weapon is overkill', () => {
    expect(overkillHeatFor(true, 2)).toBe(2)
    expect(overkillHeatFor(false, 2)).toBe(0)
  })

  it('reads an attack count off the weapon, defaulting to one when it has none', () => {
    expect(attackCountFor({ getAttacks: (t: number) => t + 1 }, 2)).toBe(3)
    expect(attackCountFor({}, 2)).toBe(1)
    expect(attackCountFor(undefined, 2)).toBe(1)
  })

  it('routes a result to the events it triggers', () => {
    expect(routesTo('crit')).toEqual({ onAttack: true, onHit: true, onCrit: true, onMiss: false })
    expect(routesTo('hit')).toEqual({ onAttack: true, onHit: true, onCrit: false, onMiss: false })
    expect(routesTo('miss')).toEqual({ onAttack: false, onHit: false, onCrit: false, onMiss: true })
    expect(routesTo('')).toEqual({ onAttack: false, onHit: false, onCrit: false, onMiss: false })
  })
})
