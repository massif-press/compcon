import { describe, it, expect, vi } from 'vitest'
import { DiceRoller } from '@/classes/dice/DiceRoller'
import {
  WeaponAttackFlow,
  isFriendly,
  attackModifiers,
  missesFromInvisibility,
  targetDefenseFor,
  hitResultFor,
  canCrit,
  critTriggers,
  reliableIncoming,
  incomingDamage,
  overkillHeatFor,
  routesTo,
  attackCountFor,
  heatExempt,
  accuracyFor,
  consumeWeaponUses,
  selfHeatFor,
  applySelfHeat,
} from './WeaponAttackFlow'

const state = (over = {}) =>
  ({
    attacker: { CanFireWeapon: () => true, DropAttackRevealedStatuses: () => undefined },
    targets: [],
    ...over,
  }) as any

describe('WeaponAttackFlow', () => {
  it('runs its steps in order', () => {
    expect(WeaponAttackFlow.Steps).toEqual([
      'weapon-eligibility',
      'attack-type',
      'target-eligibility',
      'invisibility',
      'accuracy',
      'damage-roll',
      'damage-type-resolution',
      'damage-calculation',
      'application-guard',
      'damage-application',
      'additional-attacks',
      'consume-uses',
      'heat-application',
      'effect-routing',
      'post-attack',
    ])
  })

  it('names the rolls it is waiting on, and takes them in on resume', () => {
    const attacker = {
      CanFireWeapon: () => true,
      ApplyHeat: () => undefined,
      DropAttackRevealedStatuses: () => undefined,
    }
    const targets = [{ AttackRolledValue: undefined }, { AttackRolledValue: undefined }]

    const first = WeaponAttackFlow.Begin(state({ attacker, targets, weapon: { Attack: 'ranged' } }))
    expect(first.outcome).toBe('awaiting')
    expect(first.pending).toBe('damage-roll')
    expect(first.request).toEqual({ kind: 'roll', label: 'attackRoll', targets: [0, 1] })

    const second = WeaponAttackFlow.Resume(first, { 0: 18 })
    expect(second.outcome).toBe('awaiting')
    expect(second.request).toEqual({ kind: 'roll', label: 'attackRoll', targets: [1] })
    expect(second.state.targets[0].AttackRolledValue).toBe(18)

    const third = WeaponAttackFlow.Resume(second, { 1: 7 })
    expect(third.outcome).toBe('complete')
    expect(third.state.targets[1].AttackRolledValue).toBe(7)
  })

  it('applies its mutation exactly once, however many times it is resumed', () => {
    let heat = 0
    const weapon = { HeatCost: 2, Attack: 'ranged' }
    const attacker = {
      CanFireWeapon: () => true,
      ApplyHeat: (n: number) => (heat += n),
      DropAttackRevealedStatuses: () => undefined,
    }

    const first = WeaponAttackFlow.Begin(
      state({ attacker, weapon, targets: [{ AttackRolledValue: undefined }] })
    )
    expect(first.outcome).toBe('awaiting')

    first.state.targets[0].AttackRolledValue = 15
    const second = WeaponAttackFlow.Resume(first)
    expect(second.outcome).toBe('complete')
    expect(heat).toBe(2)

    const third = WeaponAttackFlow.Resume(first)
    expect(third.outcome).toBe('halted')
    expect(third.state.blockedBy).toBe('already_applied')
    expect(heat).toBe(2)
  })

  it('refuses a direct attack on an untargetable character, but not an area attack', () => {
    const hidden = { Combatant: { actor: { CombatController: { CanBeTargeted: false } } } }

    const direct = WeaponAttackFlow.Begin(state({ weapon: {}, targets: [hidden] }))
    expect(direct.outcome).toBe('halted')
    expect(direct.state.blockedBy).toBe('untargetable')

    const open = { AttackRolledValue: 12, Combatant: { actor: { CombatController: {} } } }
    const mixed = WeaponAttackFlow.Begin(state({ weapon: {}, targets: [hidden, open] }))
    expect(mixed.outcome).toBe('complete')
    expect(mixed.state.targets).toEqual([open])

    const area = WeaponAttackFlow.Begin(
      state({ weapon: {}, event: { AoE: true }, targets: [hidden] })
    )
    expect(area.state.blockedBy).not.toBe('untargetable')
  })

  it('nets the attacker and target status modifiers into one accuracy figure', () => {
    const impaired = {
      DifficultyFor: () => 1,
      AccuracyAgainst: () => 0,
      DifficultyAgainst: () => 0,
    }
    const proneInCover = {
      DifficultyFor: () => 0,
      AccuracyAgainst: () => 1,
      DifficultyAgainst: () => 2,
    }

    expect(attackModifiers(impaired, proneInCover, 'ranged')).toBe(-2)
    expect(attackModifiers(undefined, undefined, 'ranged')).toBe(0)
  })

  it('misses outright on the invisibility roll, before any attack roll is made', () => {
    const invisible = {
      Combatant: { actor: { CombatController: { InvisibilityMissChance: 0.5 } } },
    }

    vi.spyOn(DiceRoller, 'rollDie').mockReturnValue(30)
    expect(missesFromInvisibility({ InvisibilityMissChance: 0.5 })).toBe(true)

    const r = WeaponAttackFlow.Begin(state({ weapon: {}, targets: [invisible] }))
    expect(r.state.targets[0].MissedFromInvisibility).toBe(true)
    expect(r.outcome).toBe('complete')

    vi.spyOn(DiceRoller, 'rollDie').mockReturnValue(80)
    expect(missesFromInvisibility({ InvisibilityMissChance: 0.5 })).toBe(false)
    vi.restoreAllMocks()
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
    const r = WeaponAttackFlow.Begin(
      state({ weapon: { Attack: 'ranged' }, targets: [{ AttackRolledValue: undefined }] })
    )

    expect(r.outcome).toBe('awaiting')
    expect(r.pending).toBe('damage-roll')
  })

  it('fills its steps rather than passing through: type, accuracy and uses all land', () => {
    const weapon = { Accuracy: 1, IsLoading: true, Used: false }
    const r = WeaponAttackFlow.Begin(
      state({
        weapon,
        event: { Attack: 'ranged', Accuracy: 2, Initiator: { type: 'pilot' } },
        targets: [{ AttackRolledValue: 14, Combatant: null, DamageEvents: [] }],
      })
    )

    expect(r.outcome).toBe('complete')
    expect(r.state.attackType).toBe('ranged')
    expect(r.state.accuracy).toBe(3)
    expect(r.state.attackCount).toBe(1)
    expect(weapon.Used).toBe(true)
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
  it('targets e-defense for a tech attack, and whatever the effect declares over that', () => {
    expect(targetDefenseFor('tech')).toBe('edef')
    expect(targetDefenseFor('ranged')).toBe('evasion')
    expect(targetDefenseFor('ranged', 'edef')).toBe('edef')
  })

  it('resolves a hit against the target defense, with 20 always a crit', () => {
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
    const base = {
      hitResult: 'hit',
      rolled: 6,
      bonus: 4,
      reliable: 0,
      isAoE: false,
      savedHalf: false,
    }

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

  it('exempts a same-side tech attack from heat, and nothing else', () => {
    const ally = { type: 'npc', side: 'ally' }
    const alliedPilot = { type: 'pilot', side: 'ally' }
    const hostilePilot = { type: 'pilot', side: 'enemy' }
    const enemy = { type: 'npc', side: 'enemy' }

    expect(heatExempt('tech', alliedPilot, ally)).toBe(true)
    expect(heatExempt('tech', enemy, hostilePilot)).toBe(true)
    expect(heatExempt('tech', alliedPilot, enemy)).toBe(false)
    expect(heatExempt('ranged', alliedPilot, ally)).toBe(false)
    expect(heatExempt('tech', enemy, ally)).toBe(false)
  })

  it('does not treat a hostile pilot as friendly merely for being a pilot', () => {
    const alliedMech = { type: 'mech', side: 'ally' }
    const hostilePilot = { type: 'pilot', side: 'enemy' }

    expect(isFriendly(alliedMech, hostilePilot)).toBe(false)
    expect(heatExempt('tech', alliedMech, hostilePilot)).toBe(false)
  })

  it('adds the weapon accuracy to whatever the effect declares', () => {
    expect(accuracyFor({ Accuracy: 1 }, 2)).toBe(3)
    expect(accuracyFor({ Accuracy: -1 }, 0)).toBe(-1)
    expect(accuracyFor(undefined, 2)).toBe(2)
    expect(accuracyFor({}, 0)).toBe(0)
  })

  it('marks a loading weapon used, and leaves any other weapon alone', () => {
    const loading = { IsLoading: true, Used: false }
    const rifle = { IsLoading: false, Used: false }

    consumeWeaponUses(loading)
    consumeWeaponUses(rifle)
    consumeWeaponUses(undefined)

    expect(loading.Used).toBe(true)
    expect(rifle.Used).toBe(false)
  })

  it('charges the attacker the weapon self-heat, which was displayed and never applied', () => {
    let heat = 0
    const attacker = { ApplyHeat: (n: number) => (heat += n) }

    expect(selfHeatFor({ HeatCost: 2 })).toBe(2)
    expect(selfHeatFor({})).toBe(0)

    expect(applySelfHeat(attacker, { HeatCost: 2 })).toBe(2)
    expect(heat).toBe(2)

    applySelfHeat(attacker, { HeatCost: 0 })
    expect(heat).toBe(2)
  })

  it('routes a result to the events it triggers', () => {
    expect(routesTo('crit')).toEqual({ onAttack: true, onHit: true, onCrit: true, onMiss: false })
    expect(routesTo('hit')).toEqual({ onAttack: true, onHit: true, onCrit: false, onMiss: false })
    expect(routesTo('miss')).toEqual({ onAttack: false, onHit: false, onCrit: false, onMiss: true })
    expect(routesTo('')).toEqual({ onAttack: false, onHit: false, onCrit: false, onMiss: false })
  })
})

describe('self is never an ally', () => {
  it('does not exempt a tech attack a character makes on itself', () => {
    const self = { id: 'a', type: 'mech', side: 'ally' }
    const ally = { id: 'b', type: 'mech', side: 'ally' }

    expect(isFriendly(self, self)).toBe(false)
    expect(isFriendly(self, { id: 'a', type: 'mech', side: 'ally' })).toBe(false)
    expect(isFriendly(self, ally)).toBe(true)

    expect(heatExempt('tech', self, self)).toBe(false)
    expect(heatExempt('tech', self, ally)).toBe(true)
  })
})
