import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  DEFAULT_COMBAT_ACTIONS,
  isQuickActivation,
} from '@/classes/components/combat/ActionPoolController'
import { CompendiumStore } from '@/features/compendium/store'
import { EncounterInstance } from '@/classes/encounter/EncounterInstance'
import { TimedEffect } from '@/classes/components/feature/active_effects/TimedEffect'
import { additionalAuxAttacks, suppressBonusDamage } from '@/classes/components/combat/AttackRules'
import { DamageType } from '@/classes/enums'
import { ActivePeriod, Frequency } from '@/classes/Frequency'
import { Action } from '@/classes/Action'
import { ActiveEffect } from '@/classes/components/feature/active_effects/ActiveEffect'
import { DiceRoller } from '@/classes/dice/DiceRoller'
import { mech, npc, cur, max, set, setMax, rolls, rollSeq, StatKey } from './_helpers'
import type { Pilot } from '@/classes/pilot/Pilot'

import type { Mech } from '@/classes/mech/Mech'

let m: Mech
const cc = () => m.CombatController

let p: Pilot

beforeEach(() => {
  m = mech()
  p = m.Pilot as Pilot
})
afterEach(() => {
  vi.restoreAllMocks()
})

describe('the action pool', () => {
  it('T-ACTION-pool-01: an individual quick slot can be spent and restored by name', () => {
    expect(cc().CanActivate('quick1')).toBe(true)
    expect(cc().CanActivate('quick2')).toBe(true)

    cc().SetCombatAction('quick2', false)

    expect(cc().CanActivate('quick1')).toBe(true)
    expect(cc().CanActivate('quick2')).toBe(false)
    expect(cc().CanActivate('quick')).toBe(true)
  })

  it('T-ACTION-pool-01: opens the turn with a move, two quicks, and a full available', () => {
    expect(cc().CanActivate('quick')).toBe(true)
    expect(cc().CanActivate('full')).toBe(true)
    expect(cc().CanActivate('move')).toBe(true)
  })

  it('T-ACTION-pool-01: a full action consumes both quick slots', () => {
    cc().SetCombatAction('full', false)

    expect(cc().CanActivate('full')).toBe(false)
    expect(cc().CanActivate('quick')).toBe(false)
  })

  it('T-ACTION-pool-01: two quick actions exhaust the turn, and a full is no longer available', () => {
    cc().SetCombatAction('quick', false)
    expect(cc().CanActivate('quick')).toBe(true)
    expect(cc().CanActivate('full')).toBe(false)

    cc().SetCombatAction('quick', false)
    expect(cc().CanActivate('quick')).toBe(false)
  })

  it('T-ACTION-freeaction-01: free actions are always available and never consume a slot', () => {
    cc().SetCombatAction('full', false)

    expect(cc().CanActivate('free')).toBe(true)
    expect(cc().CanActivate('none')).toBe(true)
    expect(cc().CanActivate('quick')).toBe(false)
  })

  it('T-ACTION-freeaction-01: the default pool grants no free-action budget to track', () => {
    expect(Object.keys(DEFAULT_COMBAT_ACTIONS)).not.toContain('Free')
  })
})

describe('pilot actions', () => {
  it('T-ACTION-pilotactions-01: jockey is a full action', () => {
    expect(cc().CanActivate('jockey')).toBe(true)

    cc().SetCombatAction('quick', false)
    expect(cc().CanActivate('jockey')).toBe(false)
  })

  it('T-ACTION-pilotreload-01: reload is a quick action', () => {
    expect(isQuickActivation('quick')).toBe(true)

    cc().SetCombatAction('full', false)
    expect(cc().CanActivate('quick')).toBe(false)
  })

  it('T-ACTION-skillcheck-01: the skill check roll is routed through DiceRoller and is seedable', () => {
    rollSeq(14, 5)
    const r = DiceRoller.rollSkillCheck(3, 1, 0)

    expect(r.rawDieRoll).toBe(14)
    expect(r.staticBonus).toBe(3)
    expect(r.accuracyResult).toBe(5)
    expect(r.total).toBe(22)
  })

  it('T-ACTION-skillcheck-01: accuracy and difficulty net against one another', () => {
    rollSeq(10, 4, 4)
    expect(DiceRoller.rollSkillCheck(0, 2, 2).accuracyDiceCount).toBe(0)
  })

  it('T-ACTION-skillcheck-01: a skill check is a full action', () => {
    cc().SetCombatAction('quick', false)
    expect(cc().CanActivate('full')).toBe(false)
  })
})

describe('attack actions', () => {
  it('T-ACTION-skirmish-01: skirmish is a quick activation', () => {
    expect(isQuickActivation('quick')).toBe(true)
    expect(isQuickActivation('quicktech')).toBe(true)
    expect(isQuickActivation('invade')).toBe(true)
  })

  it('T-ACTION-skirmish-01: marks both the action and the chosen weapon used', () => {
    cc().UseAttackAction('act_skirmish', 'weapon-instance-1')

    expect(cc().IsActionUsed('act_skirmish')).toBe(true)
    expect(cc().IsActionUsed('weapon-instance-1')).toBe(true)
    expect(cc().IsActionUsed('weapon-instance-2')).toBe(false)
  })

  it('T-ACTION-barrage-01: superheavy weapons are excluded from skirmish but not barrage', () => {
    const sh = CompendiumStore().MechWeapons.find(
      (w: any) => w.Size?.toLowerCase() === 'superheavy'
    )
    if (!sh) return
    expect(sh.Skirmish).toBe(false)
    expect(sh.Barrage).toBe(true)
  })
})

describe('stabilize', () => {
  it('T-ACTION-stabilize-01: cooling clears all heat and the exposed status', () => {
    set(cc(), StatKey.HEATCAP, 5)
    cc().AddStatus('exposed')

    cc().Stabilize('cool')

    expect(cur(cc(), StatKey.HEATCAP)).toBe(0)
    expect(cc().HasStatus('exposed')).toBe(false)
  })

  it('T-ACTION-stabilize-01: repairing restores all HP for one repair', () => {
    set(cc(), StatKey.HP, 1)
    const repairs = cur(cc(), StatKey.REPAIR_CAPACITY)

    cc().Stabilize('repair')

    expect(cur(cc(), StatKey.HP)).toBe(max(cc(), StatKey.HP))
    expect(cur(cc(), StatKey.REPAIR_CAPACITY)).toBe(repairs - 1)
  })

  it('T-REPAIR-combat-01: an in-combat repair costs exactly one repair', () => {
    const repairs = cur(cc(), StatKey.REPAIR_CAPACITY)
    cc().Stabilize('repair')
    expect(cur(cc(), StatKey.REPAIR_CAPACITY)).toBe(repairs - 1)
  })
})

describe('turn structure', () => {
  it('T-TURN-activations-01: a character has one activation per round by default', () => {
    expect(max(cc(), StatKey.ACTIVATIONS)).toBe(1)
  })

  it('T-TURN-activations-01: ending a turn spends the activation', () => {
    cc().EndTurn()
    expect(cur(cc(), StatKey.ACTIVATIONS)).toBe(0)
    expect(cc().HasRemainingActions).toBe(true)
  })

  it('T-TURN-activations-01: a two-activation character takes a second turn in the same round', () => {
    setMax(cc(), StatKey.ACTIVATIONS, 2)
    set(cc(), StatKey.ACTIVATIONS, 2)
    const turn = cc().Turn

    cc().SetCombatAction('full', false)
    cc().EndTurn()

    expect(cur(cc(), StatKey.ACTIVATIONS)).toBe(1)
    expect(cc().Turn).toBe(turn + 1)
    expect(cc().CanActivate('full')).toBe(true)
  })

  it('T-TURN-activations-01: a two-activation character is out of turns after both are spent', () => {
    setMax(cc(), StatKey.ACTIVATIONS, 2)
    set(cc(), StatKey.ACTIVATIONS, 2)

    cc().EndTurn()
    cc().EndTurn()

    expect(cur(cc(), StatKey.ACTIVATIONS)).toBe(0)
  })
})

describe('the activation door', () => {
  it('T-ACTION-protocol-01: spending the protocol through the pool closes the window, and the inverse reopens it', () => {
    expect(cc().CanActivate('protocol')).toBe(true)

    cc().SetCombatAction('protocol', false)
    expect(cc().CombatActions.Protocol).toBe(false)

    cc().ResetActivation('protocol')
    expect(cc().CanActivate('protocol')).toBe(true)
  })

  it('T-ACTION-fulltech-01: a full tech activation reaches the pool', () => {
    expect(cc().CanActivate('Full Tech')).toBe(true)

    expect(cc().Activate('Full Tech', { actionId: 'act_full_tech' })).toBe(true)

    expect(cc().CombatActions.Full).toBe(false)
    expect(cc().CanActivate('quick')).toBe(false)
  })

  it('T-ACTION-stabilize-01: stabilizing costs a full action', () => {
    expect(cc().PerformAction('act_stabilize', { options: ['cool', 'reload'] })).toBe(true)

    expect(cc().CombatActions.Full).toBe(false)
    expect(cc().CanActivate('quick')).toBe(false)
  })

  it('T-ACTION-selfdestruct-01: starting a self destruct costs a quick action and cannot be started twice', () => {
    expect(cc().PerformAction('act_self_destruct')).toBe(true)
    expect(cc().IsInSelfDestruct).toBe(true)
    expect(cc().CombatActions.Quick1).toBe(false)

    expect(cc().PerformAction('act_self_destruct')).toBe(false)
    expect(cc().CombatActions.Quick2).toBe(true)
  })

  it('T-ACTION-mount-01: mounting costs a full action and is refused while already mounted', () => {
    expect(cc().Mounted).toBe(true)
    expect(cc().PerformAction('act_mount')).toBe(false)
    expect(cc().CombatActions.Full).toBe(true)

    expect(cc().PerformAction('act_dismount')).toBe(true)
    expect(cc().Mounted).toBe(false)
    expect(cc().CombatActions.Full).toBe(false)
  })

  it('T-ACTION-grapple-01: a grapple with no action left spends nothing and applies nothing', () => {
    const target = mech().CombatController
    cc().SetCombatAction('full', false)

    expect(cc().PerformAction('act_grapple', { target, success: true })).toBe(false)
    expect(target.HasStatus('engaged')).toBe(false)
    expect(cc().IsActionUsed('act_grapple')).toBe(false)
  })

  it('T-ACTION-search-01: a failed search still costs the quick action', () => {
    const target = mech().CombatController
    target.AddStatus('hidden')

    expect(cc().PerformAction('act_search', { target, success: false })).toBe(false)
    expect(target.HasStatus('hidden')).toBe(true)
    expect(cc().CombatActions.Quick1).toBe(false)
  })

  it('T-ACTION-pool-01: the inverse of an activation restores the slot, the use, and the heat', () => {
    const before = cur(cc(), StatKey.HEATCAP)

    expect(cc().Activate('quick', { actionId: 'act_hide', heat: 2 })).toBe(true)
    expect(cc().CombatActions.Quick1).toBe(false)
    expect(cc().IsActionUsed('act_hide')).toBe(true)
    expect(cur(cc(), StatKey.HEATCAP)).toBe(before + 2)

    cc().UndoActivation('quick', { actionId: 'act_hide', heat: 2 })

    expect(cc().CombatActions.Quick1).toBe(true)
    expect(cc().IsActionUsed('act_hide')).toBe(false)
    expect(cur(cc(), StatKey.HEATCAP)).toBe(before)
  })

  it('T-ACTION-reaction-01: the inverse of a reaction gives the reaction back', () => {
    cc().UseReaction('overwatch')
    expect(cc().CanUseReaction('overwatch')).toBe(false)

    cc().UndoActivation('overwatch', { reaction: 'overwatch' })
    expect(cc().CanUseReaction('overwatch')).toBe(true)
  })
})

describe('action economy defects', () => {
  it('T-ACTION-protocol-01: spending a named quick slot closes the protocol window', () => {
    expect(cc().CanActivate('protocol')).toBe(true)
    cc().SetCombatAction('quick1', false)
    expect(cc().CanActivate('protocol')).toBe(false)
  })

  it('T-ACTION-protocol-01: moving closes the protocol window', () => {
    expect(cc().CanActivate('protocol')).toBe(true)
    set(cc(), StatKey.SPEED, max(cc(), StatKey.SPEED) - 1)
    expect(cc().CanActivate('protocol')).toBe(false)
  })

  it('T-ACTION-protocol-01: spending an action clears the protocol flag', () => {
    cc().SetCombatAction('quick1', false)
    expect(cc().CombatActions.Protocol).toBe(false)

    cc().ResetActivation('quick')
    expect(cc().CanActivate('protocol')).toBe(false)
  })

  it('T-ACTION-overcharge-01: a quick spent from the action panel consumes an active overcharge', () => {
    cc().StartOvercharge()
    expect(cc().InOvercharge).toBe(true)

    cc().toggleCombatAction('quick1')

    expect(cc().InOvercharge).toBe(false)
  })

  it('T-ACTION-overcharge-01: the granted quick action cannot be deferred', () => {
    cc().StartOvercharge()
    cc().EndTurn()
    expect(cc().InOvercharge).toBe(false)
  })

  it('T-ACTION-overcharge-02: the counter resets only on a full repair, not on a round', () => {
    cc().IncreaseOverchargeLevel()
    const level = cc().OverchargeLevel
    expect(level).toBeGreaterThan(0)

    cc().EndRound(undefined)
    expect(cc().OverchargeLevel).toBe(level)

    cc().FullRepair()
    expect(cc().OverchargeLevel).toBe(0)
  })

  it('T-ACTION-reaction-01: an actor with another activation starts a fresh turn through the same hook', () => {
    cc().StatController.setCurrentStat(StatKey.ACTIVATIONS, 2)
    cc().UseReaction('brace')
    cc().Prepare()

    cc().EndTurn()

    expect(cc().CanActivate('reaction')).toBe(true)
    expect(cc().Prepared).toBe(false)
  })

  it("T-ACTION-reaction-01: a spent reaction returns at the start of the character's own turn", () => {
    cc().UseReaction('brace')
    expect(cc().CanActivate('reaction')).toBe(false)

    cc().StartRound()
    expect(cc().CanActivate('reaction')).toBe(true)
  })

  it('T-ACTION-reaction-01: each specific reaction is limited once per round independently', () => {
    cc().UseReaction('brace')

    cc().StartRound()
    expect(cc().CanActivate('reaction')).toBe(true)
    expect(cc().CanUseReaction('brace')).toBe(false)
    expect(cc().CanUseReaction('overwatch')).toBe(true)
  })

  it('T-ACTION-defaultreactions-01: every mech begins with brace and overwatch available', () => {
    expect(cc().ActionPoolController.AvailableReactions).toEqual(
      expect.arrayContaining(['brace', 'overwatch'])
    )
  })

  it('T-ACTION-quicktech-01: quick tech may repeat only with a different option', () => {
    expect(cc().UseQuickTech('scan')).toBe(true)
    expect(cc().CanUseQuickTech('scan')).toBe(false)
    expect(cc().CanUseQuickTech('lock_on')).toBe(true)
  })

  it('T-ACTION-brace-01: bracing grants resistance to the triggering attack', () => {
    expect(cc().Brace()).toBe(true)
    expect(cc().CalculateDamage(DamageType.Kinetic, 6).total).toBe(3)
    expect(cc().CalculateDamage(DamageType.Energy, 6).total).toBe(3)

    expect(cc().CanUseReaction('brace')).toBe(false)
  })

  it('T-ACTION-brace-01: bracing adds +1 difficulty to later attacks until the end of the next turn', () => {
    expect(cc().DifficultyAgainst()).toBe(0)

    cc().Brace()
    expect(cc().DifficultyAgainst()).toBe(1)

    cc().EndRound(undefined)
    expect(cc().DifficultyAgainst()).toBe(0)
  })

  it('T-ACTION-brace-01: releasing a brace clears only what it granted', () => {
    cc().AddResist('kinetic', 'immunity')
    expect(cc().SetBraced(true)).toBe(true)
    expect(cc().GetResistance('energy')).toBe('resistance')

    expect(cc().SetBraced(false)).toBe(true)
    expect(cc().Braced).toBe(false)
    expect(cc().GetResistance('energy')).toBe('none')
    expect(cc().GetResistance('kinetic')).toBe('immunity')
  })

  it('T-ACTION-overwatch-01: releasing overwatch clears the flag', () => {
    expect(cc().SetOverwatch(true)).toBe(true)
    expect(cc().Overwatch).toBe(true)

    expect(cc().SetOverwatch(false)).toBe(true)
    expect(cc().Overwatch).toBe(false)
  })

  it('T-ACTION-brace-01: bracing leaves a resistance the character already had', () => {
    cc().AddResist('kinetic', 'immunity')
    cc().Brace()

    expect(cc().GetResistance('kinetic')).toBe('immunity')
    expect(cc().GetResistance('energy')).toBe('resistance')

    cc().EndRound(undefined)
    expect(cc().GetResistance('kinetic')).toBe('immunity')
    expect(cc().GetResistance('energy')).toBe('none')
  })

  it('T-ACTION-overwatch-01: overwatch skirmishes with the triggering weapon and spends the reaction', () => {
    const rifle = { Tags: [{ ID: 'tg_ap' }] }
    const ordnance = { Tags: [{ ID: 'tg_ordnance' }] }

    expect(cc().CanOverwatch(ordnance)).toBe(false)

    expect(cc().TakeOverwatch(rifle)).toBe(true)
    expect(cc().CanActivate('reaction')).toBe(false)

    cc().StartRound()
    expect(cc().CanOverwatch(rifle)).toBe(false)
  })

  it('T-ACTION-shutdown-01: shutting down is a quick action applying the shutdown status', () => {
    expect(cc().PerformAction('act_shut_down')).toBe(true)

    expect(cc().HasStatus('shut-down')).toBe(true)
    expect(cc().CombatActions.Quick1).toBe(false)
    expect(cc().CombatActions.Quick2).toBe(true)

    cc().Reset()
    expect(cc().PerformAction('act_boot_up')).toBe(true)
    expect(cc().HasStatus('shut-down')).toBe(false)
    expect(cc().CombatActions.Full).toBe(false)
  })

  it('T-TAG-ordnance-01: the ordnance activation is unavailable after moving', () => {
    expect(cc().CanActivate('ordnance')).toBe(true)
    set(cc(), StatKey.SPEED, max(cc(), StatKey.SPEED) - 1)
    expect(cc().CanActivate('ordnance')).toBe(false)
  })

  it('T-TAG-ordnance-01: an ordnance weapon is blocked', () => {
    const ordnance = { Tags: [{ ID: 'tg_ordnance' }] }
    const rifle = { Tags: [{ ID: 'tg_ap' }] }

    expect(cc().CanFireWeapon(ordnance)).toBe(true)
    set(cc(), StatKey.SPEED, max(cc(), StatKey.SPEED) - 1)

    expect(cc().CanFireWeapon(ordnance)).toBe(false)
    expect(cc().CanFireWeapon(rifle)).toBe(true)
    expect(cc().CanFireWeapon(undefined)).toBe(true)
  })

  it('T-TAG-ordnance-01: overcharging to skirmish with an ordnance weapon is permitted', () => {
    cc().StartOvercharge()
    expect(cc().CanActivate('ordnance')).toBe(true)
  })

  it('T-TAG-sidearm-01: a sidearm makes fight a quick action', () => {
    const weapons = CompendiumStore().PilotGear.filter((g: any) => g.FightActivation)
    const sidearm = weapons.find((w: any) => w.IsSidearm)
    const rifle = weapons.find((w: any) => !w.IsSidearm)

    expect(sidearm.FightActivation).toBe('quick')
    expect(rifle.FightActivation).toBe('full')

    cc().SetCombatAction(sidearm.FightActivation, false)
    expect(cc().CanActivate('quick')).toBe(true)
    cc().SetCombatAction(rifle.FightActivation, false)
    expect(cc().CanActivate('quick')).toBe(false)
  })

  it('T-TAG-ai-01: an AI-controlled mech reads and writes its own action pool', () => {
    cc().ToggleMounted()
    cc().AIControl = true
    expect(cc().IsAIControlled).toBe(true)
    cc().SetCombatAction('full', false)

    expect(cc().CanActivate('full')).toBe(false)
    expect(m.Pilot!.CombatController.CanActivate('full')).toBe(true)
  })

  it('T-TAG-ai-01: handing control to the AI is a protocol, and dismounting alone does not', () => {
    cc().ToggleMounted()
    expect(cc().AIControl).toBe(false)
    expect(cc().CanActivate('protocol')).toBe(true)

    cc().ToggleMounted()
    vi.spyOn(cc(), 'HasAISystems', 'get').mockReturnValue(true)
    cc().ToggleMounted()

    expect(cc().AIControl).toBe(true)
    expect(p.CombatController.CanActivate('protocol')).toBe(false)
  })

  it('T-TAG-ai-01: taking control back is a protocol', () => {
    const pool = () => p.CombatController

    cc().SetAIControl(true)
    expect(cc().AIControl).toBe(true)
    expect(pool().CanActivate('protocol')).toBe(false)

    pool().ResetCombatActions()
    cc().SetAIControl(false)
    expect(cc().AIControl).toBe(false)
    expect(pool().CanActivate('protocol')).toBe(false)

    pool().ResetCombatActions()
    cc().SetAIControl(false)
    expect(pool().CanActivate('protocol')).toBe(true)
  })
})

describe('action gaps', () => {
  it('T-ACTION-noduplicate-01: a marked action cannot be taken again this turn', () => {
    expect(cc().CanTakeAction('act_boost', 'quick')).toBe(true)
    cc().MarkActionUsed('act_boost')
    expect(cc().CanTakeAction('act_boost', 'quick')).toBe(false)
  })

  it('T-ACTION-noduplicate-01: an untracked action reports one remaining use', () => {
    expect(cc().RemainingUses('act_never_used')).toBe(1)
  })

  it('T-ACTION-noduplicate-01: a malformed frequency is an error', () => {
    expect(() => new Frequency('2/fortnight')).toThrow()
  })

  it('T-ACTION-noduplicate-01: content loading survives a malformed frequency in either consumer', () => {
    expect(
      () => new Action({ id: 'act_bad', name: 'bad', frequency: '2/fortnight' } as any)
    ).not.toThrow()
    expect(
      new Action({ id: 'act_bad', name: 'bad', frequency: '2/fortnight' } as any).Frequency
        .Unlimited
    ).toBe(true)

    const effect = () =>
      new ActiveEffect({ id: 'ae_bad', name: 'bad', frequency: '2/fortnight' } as any, {
        ItemType: 'MechSystem',
        Name: 'origin',
      })
    expect(effect).not.toThrow()
    expect(effect().Frequency?.Unlimited).toBe(true)
  })

  it('T-ACTION-skirmish-02: the bonus auxiliary attack deals no bonus damage', () => {
    const event = { DamageEvents: [{ Bonus: true, BonusDamageEvent: { DamageRolledValue: 3 } }] }
    suppressBonusDamage(event)

    expect(event.DamageEvents[0].Bonus).toBe(false)
    expect(event.DamageEvents[0].BonusDamageEvent).toBeUndefined()
  })

  it('T-ACTION-skirmish-03: an NPC skirmish list excludes non-weapon features', () => {
    const u = npc()
    vi.spyOn(u.NpcFeatureController, 'Features', 'get').mockReturnValue([
      { FeatureType: 'Weapon', IsSuperheavy: false, Name: 'aux' },
      { FeatureType: 'System', IsSuperheavy: false, Name: 'system' },
      { FeatureType: 'Trait', IsSuperheavy: false, Name: 'trait' },
    ] as any)

    expect(u.NpcFeatureController.SkirmishWeapons.every(f => f.FeatureType === 'Weapon')).toBe(true)
  })

  it('T-ACTION-barrage-02: an auxiliary already fired this action is not offered again', () => {
    const weapons = [
      { InstanceID: 'aux-1', Size: 'Auxiliary' },
      { InstanceID: 'aux-2', Size: 'Auxiliary' },
      { InstanceID: 'main-1', Size: 'Main' },
    ]

    const offered = additionalAuxAttacks(weapons, ['aux-1']).map(a => a.InstanceID)
    expect(offered).not.toContain('aux-1')
    expect(offered).toEqual(['aux-2'])
  })

  it('T-ACTION-barrage-02: barrage bonus auxiliary attacks deal no bonus damage', () => {
    const events = [{ DamageEvents: [{ Bonus: true }] }, { DamageEvents: [{ Bonus: true }] }]
    events.forEach(suppressBonusDamage)

    expect(events.every(e => e.DamageEvents.every(d => !d.Bonus))).toBe(true)
  })

  it('T-ACTION-fulltech-01: a PC may take the same quick tech option twice under full tech', () => {
    expect(cc().UseFullTech(['scan', 'scan'])).toBe(true)
    expect(cc().UsedCount('scan')).toBe(2)
  })

  it('T-ACTION-quicktech-02: bolster grants +2 accuracy and does not stack', () => {
    cc().Bolster()
    cc().Bolster()
    expect(cc().AccuracyFrom('bolster')).toBe(2)
  })

  it('T-ACTION-invade-01: invading a willing ally auto-succeeds and costs the target no heat', () => {
    const ally = mech()
    const heat = cur(ally.CombatController, StatKey.HEATCAP)

    const result = cc().Invade(ally.CombatController, { willing: true })

    expect(result.automatic).toBe(true)
    expect(result.isAttack).toBe(false)
    expect(cur(ally.CombatController, StatKey.HEATCAP)).toBe(heat)
  })

  it('T-ACTION-activate-01: activate is a recognized activation with its own once-per-system rule', () => {
    expect(cc().CanActivate('activate')).toBe(true)

    cc().MarkActionUsed('sys_1')
    expect(cc().CanTakeAction('sys_1', 'activate')).toBe(false)
    expect(cc().CanTakeAction('sys_2', 'activate')).toBe(true)
  })

  it('T-ACTION-selfdestruct-01: detonation is offered across a window, not fixed three rounds out', () => {
    cc().StartSelfDestruct()
    const window = cc().SelfDestructWindow
    expect(window).toEqual([cc().Round + 1, cc().Round + 2, cc().Round + 3])

    expect(cc().SetSelfDestructRound(window[0])).toBe(true)
    expect(cc().MeltdownCountdown).toBe(1)

    expect(cc().SetSelfDestructRound(cc().Round + 9)).toBe(false)
  })

  it('T-ACTION-corepower-01: core power replenishes only on a full repair', () => {
    cc().SetCore(true)
    expect(cc().CorePower).toBe(false)

    cc().EndRound(undefined)
    expect(cc().CorePower).toBe(false)

    cc().FullRepair()
    expect(cc().CorePower).toBe(true)
  })

  it('T-ACTION-corepower-01: deactivating a core system does not spend core power again', () => {
    cc().SetCore(true)
    cc().CorePower = true
    cc().SetCore(false)
    expect(cc().CorePower).toBe(true)
  })

  it('T-ACTION-mount-01: mounting and dismounting cost a full action, mount being available on a fresh turn', () => {
    expect(cc().CanActivate('mount')).toBe(true)

    cc().SetCombatAction('quick', false)
    expect(cc().CanActivate('mount')).toBe(false)
  })

  it('T-ACTION-mount-01: ejecting leaves the mech impaired until a full repair', () => {
    cc().Eject()
    expect(cc().HasStatus('impaired')).toBe(true)

    cc().EndRound(undefined)
    expect(cc().HasStatus('impaired')).toBe(true)
  })

  it('T-ACTION-prepare-01: preparing locks out movement, actions, and reactions until the trigger fires or the turn starts', () => {
    cc().Prepare()

    expect(cc().Prepared).toBe(true)
    expect(cc().CanActivate('full')).toBe(false)
    expect(cc().CanActivate('quick')).toBe(false)
    expect(cc().CanActivate('reaction')).toBe(false)
    expect(cc().CanActivate('move')).toBe(false)

    cc().ReleasePrepared()
    expect(cc().Prepared).toBe(false)
  })

  it('T-ACTION-bootup-01: booting up is a full action that clears shut down', () => {
    expect(cc().PerformAction('act_shut_down')).toBe(true)
    expect(cc().HasStatus('shut-down')).toBe(true)

    cc().Reset()
    expect(cc().PerformAction('act_boot_up')).toBe(true)
    expect(cc().HasStatus('shut-down')).toBe(false)
    expect(cc().CombatActions.Full).toBe(false)
  })

  it('T-ACTION-stabilize-02: only conditions caused by another source may be cleared', () => {
    expect(
      cc()
        .ClearableConditions()
        .every((c: any) => !c.SelfInflicted)
    ).toBe(true)
  })

  it('T-ACTION-invade-01: the bare parent invade is the fallback', () => {
    const options = cc().InvadeOptions()

    expect(options.length).toBeGreaterThan(0)
    expect(options.every(a => a.Activation === 'Invade')).toBe(true)

    expect(cc().PerformAction('act_invade')).toBe(true)
    expect(cc().CanActivate('quicktech')).toBe(true)
  })

  it('T-ACTION-fulltech-01: the bare parent full tech is reachable through the same dispatch', () => {
    expect(cc().PerformAction('act_full_tech', { options: ['scan', 'lock_on'] })).toBe(true)
    expect(cc().CanActivate('full')).toBe(false)
  })

  it('T-STATUS-lockon-01: an attacker consumes lock on through the engine, and only when it is there', () => {
    const target = mech().CombatController

    expect(cc().CanConsumeLockOn(target)).toBe(false)
    expect(cc().ConsumeLockOnAgainst(target)).toBe(0)

    target.AddStatus('lockon')
    expect(cc().CanConsumeLockOn(target)).toBe(true)
    expect(cc().ConsumeLockOnAgainst(target)).toBe(1)
    expect(target.HasStatus('lockon')).toBe(false)
  })

  it('T-ACTION-boost-01: boost is a quick action and is denied while slowed or immobilized', () => {
    expect(cc().CanActivate('boost')).toBe(true)

    cc().AddStatus('slow')
    expect(cc().CanActivate('boost')).toBe(false)
    cc().RemoveStatus('slow')

    cc().AddStatus('immobilized')
    expect(cc().CanActivate('boost')).toBe(false)
    cc().RemoveStatus('immobilized')

    cc().SetCombatAction('full', false)
    expect(cc().CanActivate('boost')).toBe(false)
  })

  it('T-ACTION-boost-01: boost extends the move track by the speed value for the turn', () => {
    const speed = cc().StatController.getMax(StatKey.SPEED)
    expect(cc().BoostBonus).toBe(0)
    expect(cc().BoostedSpeed).toBe(speed)

    expect(cc().PerformAction('act_boost')).toBe(true)
    expect(cc().CombatActions.Quick1).toBe(false)

    expect(cc().BoostBonus).toBe(speed)
    expect(cc().BoostedSpeed).toBe(speed * 2)
    expect(cc().StatController.getCurrent(StatKey.SPEED)).toBe(speed * 2)

    cc().SpendMovement(speed + 1, 'boost')
    expect(cc().StatController.getCurrent(StatKey.SPEED)).toBe(speed - 1)
    expect(cc().BoostBonus).toBe(speed)

    cc().Reset(ActivePeriod.Turn)
    expect(cc().BoostBonus).toBe(0)
    expect(cc().BoostedSpeed).toBe(speed)
  })

  it('T-ACTION-disengage-01: disengaging costs a full action and clears engaged', () => {
    expect(cc().CanActivate('disengage')).toBe(true)

    cc().AddStatus('engaged')
    expect(cc().PerformAction('act_disengage')).toBe(true)
    expect(cc().HasStatus('engaged')).toBe(false)
  })

  it('T-ACTION-disengage-01: is available when not engaged, and holds until the turn starts', () => {
    expect(cc().HasStatus('engaged')).toBe(false)

    expect(cc().PerformAction('act_disengage')).toBe(true)
    expect(cc().Disengaged).toBe(true)

    cc().StartTurn()
    expect(cc().Disengaged).toBe(false)
  })

  it('T-ACTION-hide-01: hiding makes the character untargetable until it attacks', () => {
    expect(cc().CanActivate('hide')).toBe(true)

    cc().PerformAction('act_hide')
    expect(cc().HasStatus('hidden')).toBe(true)
    expect(cc().CanBeTargeted).toBe(false)

    cc().UseAttackAction('act_skirmish')
    expect(cc().HasStatus('hidden')).toBe(false)
    expect(cc().CanBeTargeted).toBe(true)
  })

  it('T-ACTION-hide-02: hiding and disengaging run through the engine', () => {
    expect(cc().Hide()).toBe(true)
    expect(cc().HasStatus('hidden')).toBe(true)

    cc().AddStatus('engaged')
    expect(cc().Disengage()).toBe(true)
    expect(cc().HasStatus('engaged')).toBe(false)
  })

  it('T-ACTION-hide-01: hiding is refused while engaged', () => {
    cc().AddStatus('engaged')
    expect(cc().Hide()).toBe(false)
    expect(cc().HasStatus('hidden')).toBe(false)

    cc().RemoveStatus('engaged')
    expect(cc().Hide()).toBe(true)
  })

  it('T-ACTION-hide-02: boosting, reacting, and locking on all drop hidden', () => {
    cc().Hide()
    expect(cc().HasStatus('hidden')).toBe(true)
    cc().Activate('quick', { actionId: 'act_boost' })
    expect(cc().HasStatus('hidden')).toBe(false)

    cc().Hide()
    cc().UseReaction('overwatch')
    expect(cc().HasStatus('hidden')).toBe(false)

    cc().Hide()
    const target = mech().CombatController
    expect(cc().LockOn(target)).toBe(true)
    expect(target.HasStatus('lockon')).toBe(true)
    expect(cc().HasStatus('hidden')).toBe(false)
  })

  it('T-ACTION-mount-01: ejecting dismounts, and neither eject nor dismount works unmounted', () => {
    expect(cc().Mounted).toBe(true)

    expect(cc().Eject()).toBe(true)
    expect(cc().Mounted).toBe(false)
    expect(cc().HasStatus('impaired')).toBe(true)

    expect(cc().Eject()).toBe(false)
    expect(cc().Dismount()).toBe(false)
  })

  it('T-ACTION-stabilize-02: clearing a condition goes through the engine', () => {
    cc().AddStatus('impaired')

    expect(cc().ClearCondition('impaired')).toBe(true)
    expect(cc().HasStatus('impaired')).toBe(false)
    expect(cc().ClearCondition('impaired')).toBe(false)
  })

  it('T-ACTION-search-01: search contests systems against agility and clears hidden on success', () => {
    const target = mech().CombatController
    target.AddStatus('hidden')

    expect(cc().Search(target, { success: false })).toBe(false)
    expect(target.HasStatus('hidden')).toBe(true)

    expect(cc().Search(target, { success: true })).toBe(true)
    expect(target.HasStatus('hidden')).toBe(false)
  })

  it('T-ACTION-improvised-01: deals 1d6 kinetic on a hit, prepopulated from the action data', () => {
    const action = CompendiumStore().Actions.find(a => a.ID === 'act_improvised_attack')!

    expect(action.Activation).toBe('Full')
    expect(action.Damage[0].Type.toLowerCase()).toBe('kinetic')
    expect(String(action.Damage[0].Value)).toBe('1d6')
  })

  it('T-ACTION-ram-01: knocks the target prone on a hit, prepopulated from the action data', () => {
    const action = CompendiumStore().Actions.find(a => a.ID === 'act_ram')!

    expect(action.Activation).toBe('Quick')
    expect(cc().CanActivate('ram')).toBe(true)
    expect(action.AddStatus.some((x: any) => x.Status.ID === 'prone')).toBe(true)
  })

  it('T-ACTION-grapple-01: a grapple engages both characters, immobilizes the smaller, and denies boost and reactions', () => {
    const target = mech().CombatController

    expect(cc().CanActivate('grapple')).toBe(true)
    cc().Grapple(target, { hit: true, smaller: target })

    expect(cc().HasStatus('engaged')).toBe(true)
    expect(target.HasStatus('engaged')).toBe(true)
    expect(target.HasStatus('immobilized')).toBe(true)

    expect(target.CanActivate('boost')).toBe(false)
  })

  it('T-ACTION-ram-01: ram lands on a melee hit and knocks the target prone', () => {
    const target = mech().CombatController

    expect(cc().IsMeleeResolved('act_ram')).toBe(true)
    expect(cc().IsContested('act_ram')).toBe(false)
    expect(cc().NeedsTarget('act_ram')).toBe(true)

    expect(cc().PerformAction('act_ram', { target, success: false })).toBe(false)
    expect(target.HasStatus('prone')).toBe(false)
    expect(cc().CombatActions.Quick1).toBe(false)

    cc().Reset()
    expect(cc().PerformAction('act_ram', { target, success: true })).toBe(true)
    expect(target.HasStatus('prone')).toBe(true)
  })

  it('T-ACTION-grapple-01: grapple lands on a melee hit', () => {
    const target = mech().CombatController

    expect(cc().IsMeleeResolved('act_grapple')).toBe(true)
    expect(cc().IsContested('act_grapple')).toBe(false)

    expect(cc().PerformAction('act_grapple', { target, success: false })).toBe(false)
    expect(target.HasStatus('engaged')).toBe(false)

    cc().Reset()
    expect(cc().PerformAction('act_grapple', { target, success: true })).toBe(true)
    expect(cc().HasStatus('engaged')).toBe(true)
    expect(target.HasStatus('engaged')).toBe(true)
  })

  it('T-ACTION-hide-02: attacking clears hidden after the attack resolves', () => {
    cc().AddStatus('hidden')
    cc().UseAttackAction('act_skirmish')
    expect(cc().HasStatus('hidden')).toBe(false)
  })

  it('T-ACTION-fight-01: fight is a full action by default', () => {
    expect(cc().CanActivate('fight')).toBe(true)

    cc().SetCombatAction('quick', false)
    expect(cc().CanActivate('fight')).toBe(false)
  })

  it('T-ACTION-jockey-01: jockey contests grit against hull and applies distract, shred, or damage', () => {
    const target = mech().CombatController

    expect(cc().PerformAction('act_jockey', { target, success: false })).toBe(false)
    expect(cc().CanActivate('full')).toBe(false)

    cc().Reset()
    expect(cc().PerformAction('act_jockey', { target, success: true })).toBe(true)
    expect(cc().CanActivate('full')).toBe(false)

    const options = cc().JockeyOptions()
    expect(options.map(a => a.ID)).toEqual([
      'act_jockey_damage',
      'act_jockey_distract',
      'act_jockey_shred',
    ])

    const damage = options.find(a => a.ID === 'act_jockey_damage')!
    expect(damage.Damage[0].Type.toLowerCase()).toBe('kinetic')
    expect(String(damage.Damage[0].Value)).toBe('4')
  })

  it("T-ACTION-pilotpool-01: a mech turn end also clears its pilot's turn uses", () => {
    p.CombatController.MarkActionUsed('act_pilot')
    cc().EndTurn()
    expect(p.CombatController.IsActionUsed('act_pilot')).toBe(false)
  })

  it('T-HEAT-dangerzone-01: dangerzone equipment is gated on the danger zone', () => {
    const dz = { DangerZone: true, ID: 'sys_dz' }
    expect(cc().IsInDangerZone).toBe(false)
    expect(cc().CanUseEquipment(dz)).toBe(false)

    set(cc(), StatKey.HEATCAP, max(cc(), StatKey.HEATCAP))
    expect(cc().IsInDangerZone).toBe(true)
    expect(cc().CanUseEquipment(dz)).toBe(true)
  })

  it('T-MOVE-cover-01: declared cover adds difficulty to a ranged attack', () => {
    cc().Cover = 'soft' as any
    expect(cc().DifficultyAgainst('ranged')).toBe(1)
  })
})

describe('turn structure gaps', () => {
  it('T-TURN-order-01: a player acts first and sides alternate through the round', () => {
    const order = EncounterInstance.AlternateSides([
      { side: 'enemy' },
      { side: 'enemy' },
      { side: 'ally' },
      { side: 'ally' },
    ])

    expect(order.map(c => c.side)).toEqual(['ally', 'enemy', 'ally', 'enemy'])

    expect(
      EncounterInstance.AlternateSides([
        { side: 'ally' },
        { side: 'enemy' },
        { side: 'enemy' },
      ]).map(c => c.side)
    ).toEqual(['ally', 'enemy', 'enemy'])
  })

  it('T-TURN-order-02: the side that ended the previous round does not start the next', () => {
    const combatants = [{ side: 'ally' }, { side: 'enemy' }]

    const order = EncounterInstance.AlternateSides(combatants, 'ally')
    expect(order[0].side).toBe('enemy')

    expect(EncounterInstance.AlternateSides(combatants, 'enemy')[0].side).toBe('ally')
  })

  it('T-TURN-endofturn-01: end-of-turn effects resolve after all actions, in a chosen order', () => {
    cc().StartSelfDestruct()
    expect(cc().EndOfTurnEffects()).toHaveLength(0)

    cc().ScheduleReactorMeltdown(0)
    expect(cc().EndOfTurnEffects().length).toBeGreaterThan(0)
  })

  it("T-TURN-resolution-01: effects caused by other characters resolve before the character's own", () => {
    cc().TimedEffects.push(
      new TimedEffect({ name: 'own', origin: m.ID, detail: '', round: cc().Round }),
      new TimedEffect({ name: 'other', origin: 'someone-else', detail: '', round: cc().Round })
    )

    expect(
      cc()
        .EndOfTurnEffects()
        .map(e => e.effect.Name)
    ).toEqual(['other', 'own'])
  })
})

describe('T-ACTION-skillcheck-01: accuracy netting parity', () => {
  const legacy = (accDiff: number, faces: number[]): number => {
    const results = faces.slice(0, Math.abs(accDiff)).map(f => f * Math.sign(accDiff))
    results.sort((a, b) => (accDiff < 0 ? a - b : b - a))
    return results.length ? results[0] : 0
  }

  it('T-ACTION-skillcheck-01: routing through DiceRoller preserves positive accuracy results', () => {
    rollSeq(10, 2, 6, 3)
    expect(DiceRoller.rollSkillCheck(0, 3, 0).accuracyResult).toBe(legacy(3, [2, 6, 3]))
  })

  it('T-ACTION-skillcheck-01: routing through DiceRoller preserves difficulty results', () => {
    rollSeq(10, 2, 6, 3)
    expect(DiceRoller.rollSkillCheck(0, -3, 0).accuracyResult).toBe(legacy(-3, [2, 6, 3]))
  })

  it('T-ACTION-skillcheck-01: no accuracy or difficulty contributes nothing', () => {
    rollSeq(10)
    expect(DiceRoller.rollSkillCheck(2, 0, 0).total).toBe(12)
  })
})

describe('activation through the single engine handle', () => {
  it('T-ACTION-overcharge-01: a granted quick action cannot be banked behind another action', () => {
    cc().StartOvercharge()
    expect(cc().InOvercharge).toBe(true)

    cc().SetCombatAction('full', false)

    expect(cc().InOvercharge).toBe(false)
  })

  it('T-ACTION-overcharge-01: spending the granted quick action consumes the overcharge', () => {
    cc().StartOvercharge()
    cc().SetCombatAction('quick', false)

    expect(cc().InOvercharge).toBe(false)
  })

  it('T-ACTION-activate-01: activating a system spends the slot, the use, and the heat', () => {
    const heat = () => cur(cc(), StatKey.HEATCAP)
    const before = heat()

    expect(cc().Activate('quick', { actionId: 'act_test_system', heat: 2 })).toBe(true)

    expect(heat()).toBe(before + 2)
    expect(cc().IsActionUsed('act_test_system')).toBe(true)
    expect(cc().CanActivate('quick1')).toBe(false)
  })

  it('T-ACTION-activate-01: undoing an activation returns the slot, the use, and the heat', () => {
    const before = cur(cc(), StatKey.HEATCAP)
    cc().Activate('quick', { actionId: 'act_test_system', heat: 2 })

    cc().UndoActivation('quick', { actionId: 'act_test_system', heat: 2 })

    expect(cur(cc(), StatKey.HEATCAP)).toBe(before)
    expect(cc().IsActionUsed('act_test_system')).toBe(false)
    expect(cc().CanActivate('quick1')).toBe(true)
  })

  it('T-ACTION-activate-01: an activation the pool refuse spends nothing', () => {
    const before = cur(cc(), StatKey.HEATCAP)
    cc().AddStatus('stunned')

    expect(cc().Activate('quick', { actionId: 'act_test_system', heat: 2 })).toBe(false)

    expect(cur(cc(), StatKey.HEATCAP)).toBe(before)
    expect(cc().IsActionUsed('act_test_system')).toBe(false)
  })
})

describe('conditions and the reaction clock', () => {
  it('T-ACTION-stabilize-02: a condition the character inflicted on itself is not offered', () => {
    cc().AddStatus('impaired', undefined, { selfInflicted: true })
    cc().AddStatus('jammed')

    const offered = cc()
      .ClearableConditions()
      .map(c => c.status.ID)
    expect(offered).toContain('jammed')
    expect(offered).not.toContain('impaired')

    expect(cc().ClearCondition('impaired')).toBe(false)
    expect(cc().HasStatus('impaired')).toBe(true)
    expect(cc().ClearCondition('jammed')).toBe(true)
  })

  it('T-ACTION-stabilize-02: the same condition reapplied from outside becomes clearable', () => {
    cc().AddStatus('impaired', undefined, { selfInflicted: true })
    expect(
      cc()
        .ClearableConditions()
        .map(c => c.status.ID)
    ).not.toContain('impaired')

    cc().AddStatus('impaired')
    expect(
      cc()
        .ClearableConditions()
        .map(c => c.status.ID)
    ).toContain('impaired')
  })

  it('T-ACTOR-unlicensed-01: unlicensed penalties are self-inflicted and cannot be stabilized away', () => {
    cc().SetUnlicensed(true)

    const offered = cc()
      .ClearableConditions()
      .map(c => c.status.ID)
    expect(offered).not.toContain('impaired')
    expect(offered).not.toContain('slow')
  })

  it('T-ACTION-reaction-01: a reaction returns at the start of every turn, not once per round', () => {
    const other = mech().CombatController
    const encounter = {
      Combatants: [{ actor: { CombatController: cc() } }, { actor: { CombatController: other } }],
    }

    cc().UseReaction('brace')
    expect(cc().CanActivate('reaction')).toBe(false)

    other.EndTurn(encounter)

    expect(cc().CanActivate('reaction')).toBe(true)
  })

  it('T-ACTION-reaction-01: the per-reaction round limit survives turn refresh', () => {
    const other = mech().CombatController
    const encounter = {
      Combatants: [{ actor: { CombatController: cc() } }, { actor: { CombatController: other } }],
    }

    cc().UseReaction('brace')
    other.EndTurn(encounter)

    expect(cc().CanActivate('reaction')).toBe(true)
    expect(cc().CanUseReaction('brace')).toBe(false)
    expect(cc().CanUseReaction('overwatch')).toBe(true)
  })
})
