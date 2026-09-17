import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { DamageType } from '@/classes/enums'
import { Rules } from '@/classes/utility/Rules'
import { Stats } from '@/classes/components/combat/stats/Stats'
import { StatController } from '@/classes/components/combat/stats/StatController'
import { DiceRoller } from '@/classes/dice/DiceRoller'
import { CompendiumStore } from '@/features/compendium/store'
import { resolveTier } from '@/util/tierFormat'
import { CombatController } from '@/classes/components/combat/CombatController'
import {
  bonusDamage,
  resolveAreaAttack,
  objectStats,
  objectSections,
} from '@/classes/components/combat/AttackRules'
import { structureDamageTargets } from '@/classes/components/combat/StructureCheck'
import { mech, npc, cur, max, set, setMax, rolls, StatKey } from './_helpers'

import type { Mech } from '@/classes/mech/Mech'
import type { Pilot } from '@/classes/pilot/Pilot'

let m: Mech
let p: Pilot
const cc = () => m.CombatController
const pc = () => p.CombatController

beforeEach(() => {
  m = mech()
  p = m.Pilot as Pilot
})
afterEach(() => {
  vi.restoreAllMocks()
})

describe('pilots', () => {
  it('T-STAT-pilot-01: has 6 + GRIT hp, 10 evasion, 10 e-defense, speed 4, and no armor', () => {
    expect(p.MaxHP).toBe(Rules.BasePilotHP + p.Grit)
    expect(p.Evasion).toBe(Rules.BasePilotEvasion)
    expect(p.EDefense).toBe(Rules.BasePilotEdef)
    expect(p.Speed).toBe(Rules.BasePilotSpeed)
    expect(p.Armor).toBe(0)
  })

  it('T-ACTOR-cockpit-01: harm aimed at a mounted pilot lands on the mech', () => {
    expect(pc().Mounted).toBe(true)
    const mechHp = cur(cc(), StatKey.HP)

    pc().ApplyDamage(DamageType.Kinetic, 5)

    expect(cur(cc(), StatKey.HP)).toBe(mechHp - 5)
  })

  it('T-ACTOR-cockpit-01: direct harm reaches the pilot past the mech', () => {
    const pilotHp = cur(pc(), StatKey.HP)

    pc().DamageController.ApplyDamage(DamageType.Kinetic, 3, true)

    expect(cur(pc(), StatKey.HP)).toBe(pilotHp - 3)
  })
})

describe('NPCs', () => {
  it('T-NPC-actions-01: draw from the same action pool as a PC', () => {
    const u = npc()
    expect(u.CombatController.CanActivate('quick')).toBe(true)
    expect(u.CombatController.CanActivate('full')).toBe(true)

    u.CombatController.SetCombatAction('full', false)
    expect(u.CombatController.CanActivate('quick')).toBe(false)
  })

  it('T-NPC-stabilize-01: is one combined effect: reload, clear heat, end exposed', () => {
    const u = npc()
    const c = u.CombatController
    set(c, StatKey.HEATCAP, 4)
    c.AddStatus('exposed')

    c.Stabilize('npc')

    expect(cur(c, StatKey.HEATCAP)).toBe(0)
    expect(c.HasStatus('exposed')).toBe(false)
  })

  it('T-STATUS-exposed-02: NPC stabilize ends exposed', () => {
    const u = npc()
    u.CombatController.AddStatus('exposed')
    u.CombatController.Stabilize('npc')
    expect(u.CombatController.HasStatus('exposed')).toBe(false)
  })

  it('T-STATUS-exposed-02: cooling on stabilize ends exposed', () => {
    cc().AddStatus('exposed')
    cc().Stabilize('cool')
    expect(cc().HasStatus('exposed')).toBe(false)
  })

  it('T-NPC-grappleram-01: grapple and ram scale +1/2/3 by tier', () => {
    expect(Stats.TieredDefaults.grapple).toBe('1/2/3')
    expect(Stats.TieredDefaults.ram).toBe('1/2/3')
  })

  it('T-NPC-grappleram-01: a PC has no separate grapple or ram bonus', () => {
    expect(Rules.BaseGrapple).toBe(0)
    expect(Rules.BaseRam).toBe(0)
  })

  it('T-NPC-grappleram-01: the roll takes the tiered bonus from an NPC and GRIT from a PC', () => {
    const unit = npc()
    const uc = unit.CombatController
    uc.StatController.setCurrentStat(StatKey.GRAPPLE, 2)
    uc.StatController.setCurrentStat(StatKey.RAM, 3)

    expect(uc.MeleeActionBonus('act_grapple_npc')).toBe(2)
    expect(uc.MeleeActionBonus('act_ram_npc')).toBe(3)

    expect(cc().MeleeActionBonus('act_grapple')).toBe(cc().AttackBonus)
    expect(cc().MeleeActionBonus('act_ram')).toBe(cc().AttackBonus)
  })
})

describe('actor defects', () => {
  it('T-STAT-pilotattack-01: GRIT is not added to a pilot tech attack roll', () => {
    expect(p.Grit).toBeGreaterThan(0)
    expect(p.AttackBonus).toBe(p.Grit)
    expect(p.TechAttack).toBe(0)
  })

  it('T-DMG-attack-01: cover difficulty is applied once cover is declared', () => {
    cc().Cover = 'soft' as any
    expect(cc().DifficultyAgainst('ranged')).toBe(1)

    cc().Cover = 'hard' as any
    expect(cc().DifficultyAgainst('ranged')).toBe(2)
  })

  it('T-DMG-attack-01: melee and tech attacks ignore cover', () => {
    cc().Cover = 'hard' as any
    expect(cc().DifficultyAgainst('melee')).toBe(0)
    expect(cc().DifficultyAgainst('tech')).toBe(0)
  })

  it('T-TAG-smart-01: a smart weapon targets e-defense but still rolls with GRIT', () => {
    const w = CompendiumStore().MechWeapons.find(x => x.ID === 'mw_nexus_hunter_killer')!
    expect(w.IsSmart).toBe(true)
    const data = w.SelectedProfile.toActiveEffectData(m)

    expect(data.target_defense).toBe('edef')
    expect(data.attack).not.toBe('tech')
  })

  it('T-NPC-structure-01: an NPC with one structure is destroyed at 0 HP with no check', () => {
    const u = npc()
    const c = u.CombatController
    setMax(c, StatKey.STRUCTURE, 1)
    set(c, StatKey.STRUCTURE, 1)
    setMax(c, StatKey.HP, 10)
    set(c, StatKey.HP, 10)

    c.ApplyDamage(DamageType.Kinetic, 10)

    expect(c.IsDestroyed).toBe(true)
    expect(c.PendingChecks).toHaveLength(0)
  })

  it('T-NPC-structure-01: an NPC with more than one structure follows the standard rules', () => {
    const u = npc()
    const c = u.CombatController
    setMax(c, StatKey.STRUCTURE, 3)
    set(c, StatKey.STRUCTURE, 3)
    setMax(c, StatKey.HP, 10)
    set(c, StatKey.HP, 10)

    c.ApplyDamage(DamageType.Kinetic, 10)

    expect(c.PendingChecks.some(x => x.kind === 'structure')).toBe(true)
  })

  it('T-NPC-stress-01: an NPC with one stress becomes exposed and stays at one stress if heatcap is met or exceeded', () => {
    const u = npc()
    const c = u.CombatController
    setMax(c, StatKey.STRESS, 1)
    set(c, StatKey.STRESS, 1)
    setMax(c, StatKey.HEATCAP, 4)

    c.ApplyHeat(5)

    expect(cur(c, StatKey.STRESS)).toBe(1)
    expect(c.HasStatus('exposed')).toBe(true)
    expect(c.ReactorDestroyed).toBe(false)

    expect(cur(c, StatKey.HEATCAP)).toBe(max(c, StatKey.HEATCAP))
    c.ApplyHeat(5)
    expect(cur(c, StatKey.HEATCAP)).toBe(max(c, StatKey.HEATCAP))
  })

  it('T-NPC-stress-01: an NPC with more than one stress follows the standard rules', () => {
    const u = npc()
    const c = u.CombatController
    setMax(c, StatKey.STRESS, 3)
    set(c, StatKey.STRESS, 3)
    setMax(c, StatKey.HEATCAP, 4)

    c.ApplyHeat(5)

    expect(cur(c, StatKey.STRESS)).toBe(2)
    expect(c.PendingChecks.some(x => x.kind === 'stress')).toBe(true)
  })

  it('T-NPC-actions-03: NPC skirmish offers weapons only', () => {
    const u = npc()
    const fc = u.NpcFeatureController
    vi.spyOn(fc, 'Features', 'get').mockReturnValue([
      { FeatureType: 'Weapon', IsSuperheavy: false, Name: 'aux' },
      { FeatureType: 'Weapon', IsSuperheavy: true, Name: 'superheavy' },
      { FeatureType: 'System', IsSuperheavy: false, Name: 'system' },
      { FeatureType: 'Trait', IsSuperheavy: false, Name: 'trait' },
      { FeatureType: 'Reaction', IsSuperheavy: false, Name: 'reaction' },
    ] as any)

    expect(fc.SkirmishWeapons.map(f => f.Name)).toEqual(['aux'])
    expect(fc.BarrageWeapons.map(f => f.Name)).toEqual(['aux', 'superheavy'])
  })

  it('T-TAG-recharge-01: the recharge d6 is routed through DiceRoller and is seedable', () => {
    rolls(5)
    expect(DiceRoller.rollDie(6)).toBe(5)
  })

  it('T-TAG-recharge-01: one d6 at the start of the turn recharges everything at or above its target', () => {
    const u = npc()
    rolls(5)
    const four = { Recharge: 4, Used: true }
    const six = { Recharge: 6, Used: true }

    expect(u.CombatController.RollRecharge([four, six] as any)).toBe(5)

    expect(four.Used).toBe(false)
    expect(six.Used).toBe(true)
  })

  it('T-TAG-recharge-01: the start of the turn rolls once for the whole actor', () => {
    const u = npc()
    const spy = rolls(5)
    const features = [
      { Recharge: 4, Used: true },
      { Recharge: 5, Used: true },
    ]
    vi.spyOn(u.CombatController, 'AllEquipment', 'get').mockReturnValue(features as any)

    u.CombatController.StartRound()

    expect(spy).toHaveBeenCalledTimes(1)
    expect(features.every(f => !f.Used)).toBe(true)
    expect(u.CombatController.CanRollRecharge).toBe(false)
  })

  it('T-TAG-recharge-01: the round boundary does not silently recharge without a roll', () => {
    const u = npc()
    const feature = { IsReloading: true, IsUsed: true, Recharge: 5 }
    vi.spyOn(u.CombatController, 'AllEquipment', 'get').mockReturnValue([feature] as any)

    u.CombatController.EndRound(undefined)

    expect(feature.IsUsed).toBe(true)
  })
})

describe('actor and NPC gaps', () => {
  it('T-ACTOR-unmounted-01: a pilot is immune to tech actions other than scan and lock on', () => {
    expect(p.CombatController.ImmuneTo('tech', 'invade')).toBe(true)
    expect(p.CombatController.ImmuneTo('tech', 'scan')).toBe(false)
    expect(p.CombatController.ImmuneTo('tech', 'lock_on')).toBe(false)
  })

  it('T-ACTOR-unlicensed-01: a mech piloted without its license is impaired and slowed', () => {
    cc().SetUnlicensed(true)
    expect(cc().HasStatus('impaired')).toBe(true)
    expect(cc().HasStatus('slow')).toBe(true)

    cc().SetUnlicensed(false)
    expect(cc().HasStatus('impaired')).toBe(false)
    expect(cc().HasStatus('slow')).toBe(false)
  })

  it('T-NPC-actions-02: an NPC gets no benefit from being in overcharge', () => {
    const c = npc().CombatController
    c.StartOvercharge()
    expect(c.ActionPoolController.OverchargeApplies).toBe(false)
  })

  it('T-NPC-overwatch-01: an NPC takes overwatch on the same terms a player character does', () => {
    const c = npc().CombatController
    const rifle = { Tags: [{ ID: 'tg_ap' }] }
    const ordnance = { Tags: [{ ID: 'tg_ordnance' }] }

    expect(c.CanOverwatch(ordnance)).toBe(false)

    expect(c.TakeOverwatch(rifle)).toBe(true)
    expect(c.CanActivate('reaction')).toBe(false)

    c.StartRound()
    expect(c.CanOverwatch(rifle)).toBe(false)
  })

  it('T-NPC-actions-02: bracing is denied to an NPC as a rule, brace being available to a mech', () => {
    expect(mech().CombatController.CanActivate('brace')).toBe(true)
    expect(npc().CombatController.CanActivate('brace')).toBe(false)
  })

  it('T-NPC-actions-02: overcharging is denied to an NPC as a rule', () => {
    expect(npc().CombatController.CanActivate('overcharge')).toBe(false)
  })

  it('T-NPC-invade-01: the NPC invade deals 2 heat and impaired only, not impaired and slowed', () => {
    const target = mech().CombatController
    const heat = cur(target, StatKey.HEATCAP)

    npc().CombatController.NpcInvade(target)

    expect(cur(target, StatKey.HEATCAP)).toBe(heat + 2)
    expect(target.HasStatus('impaired')).toBe(true)
    expect(target.HasStatus('slow')).toBe(false)
  })

  it('T-NPC-fulltech-01: an NPC full tech takes one full tech option or two different quick tech options', () => {
    expect(npc().CombatController.UseFullTech(['scan', 'scan'])).toBe(false)
    expect(npc().CombatController.UseFullTech(['scan', 'lock_on'])).toBe(true)
    expect(npc().CombatController.UseFullTech(['invade'])).toBe(true)
  })

  it('T-NPC-grunt-01: external heat destroys a grunt outright, with no meltdown', () => {
    const u = npc()
    const c = u.CombatController
    vi.spyOn(c, 'IsGrunt', 'get').mockReturnValue(true)
    setMax(c, StatKey.HP, 10)
    set(c, StatKey.HP, 10)

    c.ApplyHeat(1, { external: true })

    expect(c.IsDestroyed).toBe(true)
    expect(c.ReactorDestroyed).toBe(false)
  })

  it('T-NPC-grunt-01: self-inflicted heat behaves normally for a grunt', () => {
    const u = npc()
    const c = u.CombatController
    vi.spyOn(c, 'IsGrunt', 'get').mockReturnValue(true)
    setMax(c, StatKey.HEATCAP, 6)
    setMax(c, StatKey.HP, 10)
    set(c, StatKey.HP, 10)

    c.ApplyHeat(1, { external: false })

    expect(c.IsDestroyed).toBe(false)
  })

  it('T-NPC-damage-01: an NPC cannot land a critical hit by default', () => {
    expect(npc().CombatController.CanCrit).toBe(false)
    expect(mech().CombatController.CanCrit).toBe(true)
  })

  it('T-STAT-npctier-01: every reader of a tiered tag value resolves it the same way', () => {
    const weapon = CompendiumStore().MechWeapons.find(w =>
      w.ActiveTags.some(t => t.ID === 'tg_reliable')
    )!
    const raw = String(weapon.ActiveTags.find(t => t.ID === 'tg_reliable')!.Value)

    expect(weapon.Reliable).toBe(Number(resolveTier(raw, 1)))
    expect(Number.isNaN(weapon.Reliable)).toBe(false)
  })

  it('T-STAT-npctier-01: a tiered stat resolves by tier index', () => {
    expect(StatController.resolveDefault('1/2/3', 0)).toBe(1)
    expect(StatController.resolveDefault('1/2/3', 2)).toBe(3)
  })

  it('T-STAT-grit-01: grit reaches every stat the errata lists, and no tech attack roll', () => {
    expect(p.AttackBonus).toBe(p.Grit)
    expect(m.MaxHP).toBeGreaterThanOrEqual(p.Grit)
    expect(m.SaveTarget).toBeGreaterThanOrEqual(p.Grit)
    expect(p.TechAttack).not.toBe(p.Grit)
  })

  it('T-TAG-npctags-01: a biological NPC takes heat as energy damage and refuses tech actions', () => {
    const u = npc()
    const c = u.CombatController
    vi.spyOn(c, 'IsBiological', 'get').mockReturnValue(true)
    setMax(c, StatKey.HEATCAP, 0)

    expect(c.ImmuneTo('tech', 'invade')).toBe(true)
    expect(c.ImmuneTo('tech', 'scan')).toBe(false)
    expect(c.ImmuneTo('tech', 'lock_on')).toBe(false)

    const hp = cur(c, StatKey.HP)
    c.TakeDamage(DamageType.Heat, 3)
    expect(cur(c, StatKey.HP)).toBe(hp - 3)
  })

  it('T-TAG-trait-01: a trait can never be destroyed by structure damage', () => {
    const u = npc()
    vi.spyOn(u.NpcFeatureController, 'Features', 'get').mockReturnValue([
      { FeatureType: 'Trait', IsSystem: false, Name: 'trait' },
      { FeatureType: 'System', IsSystem: true, Name: 'system' },
      { FeatureType: 'Weapon', IsSystem: false, Name: 'weapon' },
    ] as any)

    expect(
      structureDamageTargets(u.CombatController).some((f: any) => f.FeatureType === 'Trait')
    ).toBe(false)
  })

  it('T-TAG-system-01: only system-tagged NPC features are destroyable by structure damage', () => {
    const u = npc()
    vi.spyOn(u.NpcFeatureController, 'Features', 'get').mockReturnValue([
      { FeatureType: 'Trait', IsSystem: false, Name: 'trait' },
      { FeatureType: 'System', IsSystem: true, Name: 'system' },
      { FeatureType: 'Reaction', IsSystem: false, Name: 'reaction' },
    ] as any)

    const targets = structureDamageTargets(u.CombatController)
    expect(targets.map((f: any) => f.Name)).toEqual(['system'])
  })

  it('T-REPAIR-costs-01: repair costs are 1 for HP or one item, 2 for a structure or stress point, 4 for a destroyed mech', () => {
    expect(CombatController.RepairCost('hp')).toBe(1)
    expect(CombatController.RepairCost('item')).toBe(1)
    expect(CombatController.RepairCost('structure')).toBe(2)
    expect(CombatController.RepairCost('stress')).toBe(2)
    expect(CombatController.RepairCost('destroyed')).toBe(4)
  })

  it('T-REPAIR-rest-01: a full repair restores everything and resets the overcharge counter', () => {
    set(cc(), StatKey.HEATCAP, 4)
    cc().AddStatus('impaired')
    cc().IncreaseOverchargeLevel()

    cc().FullRepair()

    expect(cur(cc(), StatKey.HEATCAP)).toBe(0)
    expect(cc().HasStatus('impaired')).toBe(false)
    expect(cc().OverchargeLevel).toBe(0)
  })

  it("T-DMG-meltdown-01: a meltdown countdown ticks at the round boundary, when the character's next turn begins", () => {
    cc().StartSelfDestruct(cc().SelfDestructWindow[2])
    const before = cc().MeltdownCountdown
    expect(before).toBe(3)

    cc().EndRound(undefined)
    expect(cc().MeltdownCountdown).toBe(before - 1)
  })

  it('T-ACTION-selfdestruct-01: detonation defaults to the end of the next turn, the rest being a choice', () => {
    cc().StartSelfDestruct()

    expect(cc().MeltdownCountdown).toBe(1)
    expect(cc().SelfDestructWindow).toEqual([cc().Round + 1, cc().Round + 2, cc().Round + 3])
    expect(cc().SetSelfDestructRound(cc().Round + 3)).toBe(true)
    expect(cc().MeltdownCountdown).toBe(3)
  })

  it('T-DMG-bonus-01: bonus damage is kinetic, explosive, or energy only, and halves against multiple targets', () => {
    expect(bonusDamage('ranged', 4)).toEqual({ value: 4, type: DamageType.Kinetic })
    expect(bonusDamage('melee', 4, DamageType.Energy)).toEqual({
      value: 4,
      type: DamageType.Energy,
    })

    expect(bonusDamage('ranged', 4, DamageType.Heat)!.type).toBe(DamageType.Kinetic)

    expect(bonusDamage('ranged', 5, DamageType.Kinetic, 3)!.value).toBe(3)
    expect(bonusDamage('tech', 4)).toBeNull()
  })

  it('T-DMG-aoe-01: an area attack rolls every attack first, then applies one damage roll to each target', () => {
    const order: string[] = []
    const out = resolveAreaAttack(
      ['a', 'b', 'c'],
      t => {
        order.push(`attack:${t}`)
        return t !== 'b'
      },
      () => {
        order.push('damage')
        return 6
      }
    )

    expect(order).toEqual(['attack:a', 'attack:b', 'attack:c', 'damage'])
    expect(out.map(o => o.damage)).toEqual([6, 0, 6])
  })

  it('T-DMG-objects-01: an object defaults to 5 evasion and 10 HP per point of size', () => {
    expect(objectStats(1)).toEqual({ evasion: 5, hp: 10 })
    expect(objectStats(3)).toEqual({ evasion: 5, hp: 30 })

    expect(objectSections(3)).toEqual([
      { evasion: 5, hp: 10 },
      { evasion: 5, hp: 10 },
      { evasion: 5, hp: 10 },
    ])
  })

  it('T-RANGE-patterns-01: an area attack rolls once per target and halves bonus damage against several', () => {
    const attacks: string[] = []
    resolveAreaAttack(
      ['a', 'b'],
      t => {
        attacks.push(t)
        return true
      },
      () => 4
    )

    expect(attacks).toEqual(['a', 'b'])
    expect(bonusDamage('ranged', 5, DamageType.Kinetic, 2)!.value).toBe(3)
    expect(bonusDamage('ranged', 5, DamageType.Kinetic, 1)!.value).toBe(5)
  })
})

describe('reaction and NPC offered actions', () => {
  it('T-NPC-actions-02: brace is not offered to an NPC', () => {
    const u = npc()
    expect(u.CombatController.CanActivate('brace')).toBe(false)
    expect(u.CombatController.AvailableReactions).not.toContain('brace')
    expect(u.CombatController.AvailableReactions).toContain('overwatch')
  })

  it('T-ACTION-defaultreactions-01: a mech is offered both defaults', () => {
    expect(cc().AvailableReactions).toEqual(['brace', 'overwatch'])

    cc().UseReaction('brace')
    cc().RefreshReactions()
    expect(cc().AvailableReactions).toEqual(['overwatch'])
  })

  it('T-ACTION-defaultreactions-01: a granted reaction joins the offer list and the activation check', () => {
    vi.spyOn(cc(), 'AllActions').mockImplementation((activation: any) =>
      activation === 'Reaction' ? ([{ ID: 'act_test_reaction' }] as any) : []
    )

    expect(cc().ReactionOptions).toContain('act_test_reaction')
    expect(cc().CanActivate('act_test_reaction')).toBe(true)
    expect(cc().AvailableReactions).toContain('act_test_reaction')

    cc().UseReaction('act_test_reaction')
    expect(cc().AvailableReactions).not.toContain('act_test_reaction')
  })

  it('T-NPC-actions-02: an NPC granted brace by a feature may take it', () => {
    const u = npc()
    expect(u.CombatController.CanActivate('brace')).toBe(false)

    vi.spyOn(u.CombatController, 'GrantsAction').mockImplementation((id: string) => id === 'brace')
    expect(u.CombatController.CanActivate('brace')).toBe(true)
  })
})

describe('NPC template exceptions', () => {
  it('T-NPC-actions-01: an ordinary multi-turn NPC keeps its per-reaction round limit across turns', () => {
    const u = npc()
    const c = u.CombatController
    setMax(c, StatKey.ACTIVATIONS, 2)
    set(c, StatKey.ACTIVATIONS, 2)

    c.UseReaction('overwatch')
    c.EndTurn()

    expect(c.CanActivate('reaction')).toBe(true)
    expect(c.CanUseReaction('overwatch')).toBe(false)
  })

  it('T-NPC-actions-01: an Ultra refreshes its reactions on each of its turns', () => {
    const u = npc()
    const c = u.CombatController
    setMax(c, StatKey.ACTIVATIONS, 2)
    set(c, StatKey.ACTIVATIONS, 2)
    vi.spyOn(c, 'HasTemplate').mockImplementation((n: string) => n.toLowerCase() === 'ultra')

    c.UseReaction('overwatch')
    expect(c.CanUseReaction('overwatch')).toBe(false)

    c.EndTurn()

    expect(c.CanUseReaction('overwatch')).toBe(true)
  })
})

describe('C/C specific cases', () => {
  it('T-REPAIR-rest-01: repairing a destroyed mech returns it at one structure and one stress', () => {
    const c = mech().CombatController
    set(c, StatKey.STRUCTURE, 0)
    expect(c.IsDestroyed).toBe(true)

    expect(c.RepairDestroyed(4)).toBe(true)

    expect(c.IsDestroyed).toBe(false)
    expect(cur(c, StatKey.STRUCTURE)).toBe(1)
    expect(cur(c, StatKey.STRESS)).toBe(1)
    expect(cur(c, StatKey.HP)).toBe(max(c, StatKey.HP))
  })

  it('T-REPAIR-rest-01: it costs four repairs, and a reactor destroyed mech cannot be repaired at all', () => {
    const c = mech().CombatController
    set(c, StatKey.STRUCTURE, 0)
    expect(c.RepairDestroyed(3)).toBe(false)
    expect(c.IsDestroyed).toBe(true)

    const gone = mech().CombatController
    set(gone, StatKey.STRUCTURE, 0)
    gone.ReactorDestroyed = true
    expect(gone.RepairDestroyed(4)).toBe(false)
  })

  it('T-REPAIR-costs-01: the destroyed-mech cost is the one repair pilots may pool', () => {
    expect(CombatController.RepairCost('destroyed')).toBe(4)
  })

  it('T-TAG-ai-01: handing control to the AI costs a protocol and gives the mech its own pool', () => {
    const c = mech().CombatController
    const spender = c.RootActor.CombatController
    expect(spender.CanActivate('protocol')).toBe(true)

    c.Mounted = false
    c.SetAIControl(true)

    expect(spender.CanActivate('protocol')).toBe(false)
    expect(c.IsAIControlled).toBe(true)

    c.SetCombatAction('quick', false)
    expect(spender.CanActivate('quick')).toBe(true)
  })

  it('T-STATUS-slowed-01: dragging slows, lifting immobilizes, and neither permit reactions', () => {
    const c = mech().CombatController

    c.Carry('drag')
    expect(c.HasStatus('slow')).toBe(true)
    expect(c.CanUseReaction('brace')).toBe(false)
    expect(c.Carrying).toBe('drag')

    c.Carry('none')
    expect(c.HasStatus('slow')).toBe(false)
    expect(c.CanUseReaction('brace')).toBe(true)

    c.Carry('lift')
    expect(c.HasStatus('immobilized')).toBe(true)
    expect(c.CanUseReaction('brace')).toBe(false)
  })

  it('T-ACTION-stabilize-02: a condition taken on by carrying is self-inflicted and not clearable', () => {
    const c = mech().CombatController
    c.Carry('lift')

    expect(c.ClearableConditions().map(x => x.status.ID)).not.toContain('immobilized')
  })
})
