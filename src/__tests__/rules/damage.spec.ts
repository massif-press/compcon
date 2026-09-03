import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { DamageType } from '@/classes/enums'
import {
  reliableIncoming,
  DamageEvent,
} from '@/classes/components/feature/active_effects/effect_events/damageEvent'
import { Damage } from '@/classes/Damage'
import { canCrit } from '@/classes/components/feature/active_effects/effect_events/eventTarget'
import { DiceRoller } from '@/classes/dice/DiceRoller'
import { mech, cur, max, set, setMax, rollSeq, StatKey, rolls } from './_helpers'
import {
  WeaponAttackFlow,
  selfHeatFor,
  applySelfHeat,
} from '@/classes/components/combat/flows/WeaponAttackFlow'

import type { Mech } from '@/classes/mech/Mech'

let m: Mech
const cc = () => m.CombatController

beforeEach(() => {
  m = mech()
})
afterEach(() => {
  vi.restoreAllMocks()
})

describe('damage calculation', () => {
  it('T-DMG-order-01: applies exposed doubling, then armor, then resistance, in that order', () => {
    set(cc(), StatKey.ARMOR, 2)
    cc().AddStatus('exposed')
    cc().AddResist('kinetic', 'resistance')

    expect(cc().CalculateDamage(DamageType.Kinetic, 5).total).toBe(4)
  })

  it('T-DMG-armor-01: subtracts armor from a single source and floors at zero', () => {
    set(cc(), StatKey.ARMOR, 2)
    expect(cc().CalculateDamage(DamageType.Kinetic, 5).total).toBe(3)
    expect(cc().CalculateDamage(DamageType.Kinetic, 1).total).toBe(0)
  })

  it('T-DMG-armor-01: is ignored by AP, burn, and heat', () => {
    set(cc(), StatKey.ARMOR, 2)
    expect(cc().CalculateDamage(DamageType.Kinetic, 5, true).total).toBe(5)
    expect(cc().CalculateDamage(DamageType.Burn, 5).total).toBe(5)
    expect(cc().CalculateDamage(DamageType.Heat, 5).total).toBe(5)
  })

  it('T-DMG-resist-01: halves rounding up, and cannot stack', () => {
    cc().AddResist('kinetic', 'resistance')
    expect(cc().CalculateDamage(DamageType.Kinetic, 5).total).toBe(3)

    cc().AddResist('kinetic', 'resistance')
    expect(cc().CalculateDamage(DamageType.Kinetic, 5).total).toBe(3)
    expect(cc().Resistances.filter(r => r.type === 'kinetic')).toHaveLength(1)
  })

  it('T-DMG-irreducible-01: bypasses armor and resistance entirely', () => {
    set(cc(), StatKey.ARMOR, 2)
    cc().AddResist('kinetic', 'resistance')
    expect(cc().CalculateDamage(DamageType.Kinetic, 5, false, true).total).toBe(5)
  })

  it('T-STATUS-shredded-01: denies armor and resistance', () => {
    set(cc(), StatKey.ARMOR, 2)
    cc().AddStatus('shredded')

    cc().AddResist('kinetic', 'resistance')
    expect(cc().CalculateDamage(DamageType.Kinetic, 6).total).toBe(6)
  })

  it('T-STATUS-shredded-01: leaves immunity intact, immunity not being a reduction', () => {
    set(cc(), StatKey.ARMOR, 2)
    cc().AddStatus('shredded')
    cc().SetResistance('kinetic', 'immunity')

    const out = cc().CalculateDamage(DamageType.Kinetic, 6)
    expect(out.total).toBe(0)
    expect(out.tookDamage).toBe(false)
  })

  it('T-DMG-immunity-01: irreducible damage does not override immunity', () => {
    cc().SetResistance('kinetic', 'immunity')

    const out = cc().CalculateDamage(DamageType.Kinetic, 6, false, true)
    expect(out.total).toBe(0)
    expect(out.tookDamage).toBe(false)
  })

  it('T-STATUS-shredded-01: still applies vulnerability, which is not a benefit', () => {
    cc().AddStatus('shredded')
    cc().SetResistance('kinetic', 'vulnerable')
    expect(cc().CalculateDamage(DamageType.Kinetic, 5).total).toBe(10)
  })
})

describe('damage application', () => {
  it('T-DMG-overshield-01: absorbs entirely when damage is at or below the overshield', () => {
    set(cc(), StatKey.OVERSHIELD, 5)
    const hp = cur(cc(), StatKey.HP)

    cc().ApplyDamage(DamageType.Kinetic, 5)

    expect(cur(cc(), StatKey.OVERSHIELD)).toBe(0)
    expect(cur(cc(), StatKey.HP)).toBe(hp)
  })

  it('T-DMG-overshield-01: breaks and carries the remainder through to HP', () => {
    set(cc(), StatKey.OVERSHIELD, 3)
    const hp = cur(cc(), StatKey.HP)

    cc().ApplyDamage(DamageType.Kinetic, 8)

    expect(cur(cc(), StatKey.OVERSHIELD)).toBe(0)
    expect(cur(cc(), StatKey.HP)).toBe(hp - 5)
  })

  it('T-DMG-structure-01: costs one structure at 0 HP, resets HP, then takes the excess', () => {
    setMax(cc(), StatKey.HP, 15)
    setMax(cc(), StatKey.STRUCTURE, 3)
    set(cc(), StatKey.HP, 15)
    set(cc(), StatKey.STRUCTURE, 3)

    cc().ApplyDamage(DamageType.Kinetic, 20)

    expect(cur(cc(), StatKey.STRUCTURE)).toBe(2)
    expect(cur(cc(), StatKey.HP)).toBe(10)
  })

  it('T-DMG-destroyed-01: a mech at 0 structure is destroyed, and starts with 4', () => {
    expect(max(cc(), StatKey.STRUCTURE)).toBe(4)
    expect(cc().IsDestroyed).toBe(false)

    set(cc(), StatKey.STRUCTURE, 0)
    expect(cc().IsDestroyed).toBe(true)
  })
})

describe('heat', () => {
  it('T-HEAT-overheat-01: heat equal to the cap is safe', () => {
    const cap = max(cc(), StatKey.HEATCAP)
    const stress = cur(cc(), StatKey.STRESS)

    cc().ApplyHeat(cap)

    expect(cur(cc(), StatKey.HEATCAP)).toBe(cap)
    expect(cur(cc(), StatKey.STRESS)).toBe(stress)
  })

  it('T-HEAT-overheat-01: heat exceeding the cap costs one stress and carries the excess', () => {
    setMax(cc(), StatKey.HEATCAP, 6)
    set(cc(), StatKey.HEATCAP, 5)
    const stress = cur(cc(), StatKey.STRESS)

    cc().ApplyHeat(2)

    expect(cur(cc(), StatKey.STRESS)).toBe(stress - 1)
    expect(cur(cc(), StatKey.HEATCAP)).toBe(1)
  })

  it('T-HEAT-cooling-01: stabilizing clears all heat', () => {
    set(cc(), StatKey.HEATCAP, 4)
    cc().Stabilize('cool')
    expect(cur(cc(), StatKey.HEATCAP)).toBe(0)
  })

  it('T-STATUS-dangerzone-01: begins at half the heat cap or more', () => {
    setMax(cc(), StatKey.HEATCAP, 6)

    set(cc(), StatKey.HEATCAP, 2)
    expect(cc().IsInDangerZone).toBe(false)

    set(cc(), StatKey.HEATCAP, 3)
    expect(cc().IsInDangerZone).toBe(true)
  })
})

describe('damage defects', () => {
  it('T-DMG-crit-01: a crit rolls each source twice and keeps the highest half', () => {
    rollSeq(6, 5, 2, 1)
    expect(DiceRoller.rollDamage('2d6', true).total).toBe(11)
  })

  it('T-DMG-crit-01: the static modifier is not doubled', () => {
    rollSeq(6, 5, 2, 1)
    expect(DiceRoller.rollDamage('2d6+3', true).total).toBe(14)
  })

  it('T-ATTACK-accuracy-01: accuracy and difficulty cancel pairwise, and the remainder is one d6 taken at its best', () => {
    rolls(4)

    // three accuracy against two difficulty leaves one die, added
    expect(DiceRoller.rollSkillCheck(0, 3, 2).total).toBe(4 + 4)

    // equal numbers cancel to nothing, so no die is rolled at all
    expect(DiceRoller.rollSkillCheck(0, 2, 2).total).toBe(4)

    // more difficulty than accuracy subtracts instead
    expect(DiceRoller.rollSkillCheck(0, 1, 3).total).toBe(4 - 4)

    // and a negative accuracy is difficulty by another name
    expect(DiceRoller.rollSkillCheck(0, -2, 0).total).toBe(DiceRoller.rollSkillCheck(0, 0, 2).total)
  })

  it('T-ATTACK-accuracy-01: several dice yield the best single result, not their sum', () => {
    rollSeq(10, 2, 5, 6)
    const result = DiceRoller.rollSkillCheck(0, 3, 0)

    // d20 of 10, then three accuracy dice of 2, 5 and 6 -> the 6 alone
    expect(result.total).toBe(16)
  })

  it('T-DMG-crit-01: a tech attack cannot crit', () => {
    expect(canCrit('tech', true)).toBe(false)
    expect(canCrit('ranged', true)).toBe(true)
    expect(canCrit('melee', true)).toBe(true)
    expect(canCrit('ranged', false)).toBe(false)
  })

  it('T-DMG-reliable-01: reliable deals its value when the attack misses', () => {
    expect(reliableIncoming('miss', 0, 3)).toBe(3)
    expect(reliableIncoming('hit', 1, 3)).toBe(1)

    expect(cc().CalculateDamage(DamageType.Kinetic, 1).total).toBe(1)
  })

  it('T-DMG-burn-01: an end-of-turn engineering check clears marked burn on success', () => {
    set(cc(), StatKey.BURN, 4)
    cc().ResolveBurn(true)
    expect(cur(cc(), StatKey.BURN)).toBe(0)
  })

  it('T-DMG-burn-01: a failed end-of-turn check deals damage equal to marked burn', () => {
    set(cc(), StatKey.BURN, 4)
    const hp = cur(cc(), StatKey.HP)

    cc().ResolveBurn(false)

    expect(cur(cc(), StatKey.HP)).toBe(hp - 4)
    expect(cur(cc(), StatKey.BURN)).toBe(4)
  })

  it('T-HEAT-reactor-01: reaching 0 stress schedules a meltdown for the end of the next turn', () => {
    setMax(cc(), StatKey.STRESS, 4)
    set(cc(), StatKey.STRESS, 1)
    setMax(cc(), StatKey.HEATCAP, 4)

    cc().ApplyHeat(5)

    expect(cur(cc(), StatKey.STRESS)).toBe(0)
    expect(cc().ReactorDestroyed).toBe(false)
    expect(cc().TimedEffects.some(t => t.Round === cc().Round + 1)).toBe(true)
  })

  it('T-STATUS-exposed-01: doubles only kinetic, explosive, and energy damage', () => {
    cc().AddStatus('exposed')

    expect(cc().CalculateDamage(DamageType.Kinetic, 5).total).toBe(10)
    expect(cc().CalculateDamage(DamageType.Explosive, 5).total).toBe(10)
    expect(cc().CalculateDamage(DamageType.Energy, 5).total).toBe(10)
    expect(cc().CalculateDamage(DamageType.Variable, 5).total).toBe(5)
  })

  it('T-DMG-immunity-01: an immune character never counts as having taken damage, even at zero', () => {
    cc().SetResistance('kinetic', 'immunity')
    const out = cc().CalculateDamage(DamageType.Kinetic, 5)

    expect(out.total).toBe(0)
    expect(out.tookDamage).toBe(false)
  })

  it('T-DMG-zero-01: a zero total reaches the attack pipeline as zero, not as the raw incoming', () => {
    const finalDamageFor = (armor: number, immune: boolean) => {
      const target = mech().CombatController
      set(target, StatKey.ARMOR, armor)
      if (immune) target.SetResistance('kinetic', 'immunity')

      const event = new DamageEvent(new Damage({ type: DamageType.Kinetic, val: 5 }), 1)
      event.DamageRolledValue = 5

      return event.CalcFinalDamageValues(
        { AoE: false } as any,
        {
          HitResult: 'hit',
          SavedHalf: false,
          Combatant: { actor: { CombatController: target } },
        } as any
      ).finalDamage
    }

    expect(finalDamageFor(10, false)).toBe(0)
    expect(finalDamageFor(0, true)).toBe(0)
    expect(finalDamageFor(0, false)).toBe(5)
  })

  it('T-DMG-zero-01: damage reduced to zero by armor still counts as damage taken', () => {
    set(cc(), StatKey.ARMOR, 10)
    const out = cc().CalculateDamage(DamageType.Kinetic, 5)

    expect(out.total).toBe(0)
    expect(out.tookDamage).toBe(true)
  })

  it('T-DMG-zero-01: a hit reduced to zero still registers as damage taken on the attack path', () => {
    set(cc(), StatKey.ARMOR, 10)

    const event = new DamageEvent(new Damage({ type: DamageType.Kinetic, val: 5 }), 1)
    event.DamageRolledValue = 5
    const target = {
      HitResult: 'hit',
      SavedHalf: false,
      Combatant: { actor: { CombatController: cc() } },
    } as any

    event.CalcFinalDamage({ AoE: false } as any, target)

    expect(target.FinalDamageValue).toBe(0)
    expect(target.TookDamage).toBe(true)
  })

  it('T-DMG-immunity-01: an immune target registers no damage instance on the attack path', () => {
    cc().SetResistance('kinetic', 'immunity')

    const event = new DamageEvent(new Damage({ type: DamageType.Kinetic, val: 5 }), 1)
    event.DamageRolledValue = 5
    const target = {
      HitResult: 'hit',
      SavedHalf: false,
      Combatant: { actor: { CombatController: cc() } },
    } as any

    event.CalcFinalDamage({ AoE: false } as any, target)

    expect(target.FinalDamageValue).toBe(0)
    expect(target.TookDamage).toBe(false)
  })

  it('T-TAG-heatself-01: a heat self weapon charges the attacker whether the attack lands or misses', () => {
    const heat = () => cur(cc(), StatKey.HEATCAP)
    const before = heat()

    expect(selfHeatFor({ HeatCost: 2 })).toBe(2)
    applySelfHeat(cc(), { HeatCost: 2 })
    expect(heat()).toBe(before + 2)
  })

  it('T-TAG-heatself-01: the attack flow applies it once per use, and not at all without the tag', () => {
    const before = cur(cc(), StatKey.HEATCAP)

    const run = (weapon: any) =>
      WeaponAttackFlow.Begin({
        attacker: cc(),
        weapon,
        targets: [],
        eligible: false,
        applied: false,
      } as any)

    expect(run({ HeatCost: 2 }).state.selfHeat).toBe(2)
    expect(cur(cc(), StatKey.HEATCAP)).toBe(before + 2)

    expect(run({}).state.selfHeat).toBe(0)
    expect(cur(cc(), StatKey.HEATCAP)).toBe(before + 2)
  })

  it('T-DMG-heat-01: converts to energy for a character with no heat cap, not no stress', () => {
    setMax(cc(), StatKey.HEATCAP, 0)
    setMax(cc(), StatKey.STRESS, 4)
    const hp = cur(cc(), StatKey.HP)

    cc().TakeDamage(DamageType.Heat, 3)

    expect(cur(cc(), StatKey.HP)).toBe(hp - 3)
  })
})
