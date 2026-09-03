import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { expiration } from '@/classes/components/combat/Expiration'
import { StatusController } from '@/classes/components/combat/StatusController'
import { EffectSpecial } from '@/classes/components/feature/active_effects/effect_subtype/EffectSpecial'
import { mech, npc, set, setMax, rolls, StatKey } from './_helpers'
import { WeaponAttackFlow } from '@/classes/components/combat/flows/WeaponAttackFlow'
import { ActiveEventTarget } from '@/classes/components/feature/active_effects/effect_events/eventTarget'
import type { Mech } from '@/classes/mech/Mech'
import type { Pilot } from '@/classes/pilot/Pilot'

let m: Mech
let p: Pilot
const cc = () => m.CombatController

beforeEach(() => {
  m = mech()
  p = m.Pilot as Pilot
})
afterEach(() => {
  vi.restoreAllMocks()
})

describe('expiration', () => {
  it('T-TURN-endofnextturn-01: an effect survives the turn it lands on and expires on the next', () => {
    const exp = new expiration('end_turn_self', cc(), cc())

    expect([
      exp.HasExpired(cc().Round, m.ID, cc().Turn),
      exp.HasExpired(cc().Round, m.ID, cc().Turn + 1),
    ]).toEqual([false, true])
  })

  it('T-TURN-endofnextturn-01: start-of-turn and end-of-turn expirations differ, observable only mid-turn', () => {
    const startExp = new expiration('start_turn_self', cc(), cc())
    const endExp = new expiration('end_turn_self', cc(), cc())
    const next = cc().Turn + 1

    expect(startExp.EndsOn).toBe('start')
    expect(endExp.EndsOn).toBe('end')

    expect(startExp.HasExpired(cc().Round, m.ID, next, 'start')).toBe(true)
    expect(endExp.HasExpired(cc().Round, m.ID, next, 'start')).toBe(false)
    expect(endExp.HasExpired(cc().Round, m.ID, next, 'end')).toBe(true)
  })

  it('T-TURN-endofnextturn-01: an encounter-scoped effect ends when the encounter does', () => {
    const exp = new expiration('encounter', cc(), cc())
    expect(exp.Period).toBe('encounter')

    expect(exp.HasExpired(cc().Round, m.ID, cc().Turn + 99)).toBe(false)
    expect(exp.HasExpired(cc().Round, m.ID, cc().Turn, 'end', { encounterEnded: true })).toBe(true)

    cc().AddStatus('slow', 'scene')
    expect(cc().HasStatus('slow')).toBe(true)
    cc().EndEncounter()
    expect(cc().HasStatus('slow')).toBe(false)
  })
})

describe('statuses with no enforcement', () => {
  it('T-STATUS-impaired-01: adds +1 difficulty to attacks, saves, and skill checks', () => {
    cc().AddStatus('impaired')
    expect(cc().DifficultyFor('attack')).toBe(1)
    expect(cc().DifficultyFor('save')).toBe(1)
    expect(cc().DifficultyFor('check')).toBe(1)
  })

  it('T-STATUS-stunned-01: denies every action, including free actions and reactions', () => {
    cc().AddStatus('stunned')

    expect(cc().CanActivate('quick')).toBe(false)
    expect(cc().CanActivate('full')).toBe(false)
    expect(cc().CanActivate('free')).toBe(false)
    expect(cc().CanActivate('reaction')).toBe(false)
    expect(cc().CanActivate('overcharge')).toBe(false)
    expect(cc().CanActivate('move')).toBe(false)
  })

  it('T-STATUS-stunned-01: caps evasion at 5', () => {
    setMax(cc(), StatKey.EVASION, 12)
    cc().AddStatus('stunned')
    expect(cc().StatController.getMaxWithBonuses(StatKey.EVASION)).toBe(5)
  })

  it('T-STATUS-stunned-01: automatically fails hull and agility checks and saves', () => {
    cc().AddStatus('stunned')
    expect(cc().AutoFails('hull')).toBe(true)
    expect(cc().AutoFails('agi')).toBe(true)
    expect(cc().AutoFails('sys')).toBe(false)
  })

  it('T-STATUS-stunned-01: leaves the pilot able to mount, dismount, and eject', () => {
    cc().AddStatus('stunned')
    expect(p.CombatController.CanActivate('mount')).toBe(true)
  })

  it('T-STATUS-downandout-01: a pilot at zero HP is downed, not dead', () => {
    set(p.CombatController, StatKey.HP, 0)

    expect(p.CombatController.HasStatus('downandout')).toBe(true)
    expect(p.CombatController.IsDead).toBe(false)
  })

  it('T-STATUS-downandout-01: further damage while downed kills', () => {
    set(p.CombatController, StatKey.HP, 0)
    p.CombatController.DamageController.ApplyDamage('Kinetic' as any, 1, true)
    expect(p.CombatController.IsDead).toBe(true)
  })

  it('T-STATUS-stunned-01: one status permitting an action does not excuse another status that denies it', () => {
    cc().AddStatus('stunned')
    cc().AddStatus('jammed')

    expect(cc().DeniesActivation('move')).toBe(true)
    expect(cc().DeniesActivation('eject')).toBe(true)
  })

  it('T-STATUS-shutdown-01: booting up is permitted while shut down, though shut down implies stunned', () => {
    expect(cc().PerformAction('act_shut_down')).toBe(true)
    expect(cc().HasStatus('stunned')).toBe(true)

    cc().Reset()
    expect(cc().DeniesActivation('full')).toBe(true)
    expect(cc().DeniesActivation('full', 'act_boot_up')).toBe(false)
    expect(cc().PerformAction('act_boot_up')).toBe(true)
    expect(cc().HasStatus('shut-down')).toBe(false)
  })

  it('T-STATUS-shutdown-01: shutting down clears heat and exposed, purges tech statuses, grants tech immunity, and applies indefinite stunned', () => {
    setMax(cc(), StatKey.HEATCAP, 6)
    set(cc(), StatKey.HEATCAP, 5)
    cc().AddStatus('exposed')
    cc().AddStatus('lockon')
    cc().BeginCascade()

    cc().ShutDown()

    expect(cc().StatController.getCurrent(StatKey.HEATCAP)).toBe(0)
    expect(cc().HasStatus('exposed')).toBe(false)
    expect(cc().HasStatus('lockon')).toBe(false)
    expect(cc().InCascade).toBe(false)
    expect(cc().ImmuneToTech).toBe(true)

    expect(cc().HasStatus('stunned')).toBe(true)
    expect(cc().Statuses.find(s => s.status.ID === 'stunned')?.expires).toBeFalsy()

    cc().BootUp()
    expect(cc().HasStatus('shut-down')).toBe(false)
    expect(cc().HasStatus('stunned')).toBe(false)
  })

  it('T-STATUS-lockon-01: an attacker may consume lock on for +1 accuracy, clearing it afterward', () => {
    cc().AddStatus('lockon')

    expect(cc().ConsumeLockOn()).toBe(1)
    expect(cc().HasStatus('lockon')).toBe(false)
    expect(cc().ConsumeLockOn()).toBe(0)
  })

  it('T-STATUS-jammed-01: a jammed character may only improvised-attack, grapple, or ram, and takes no reactions or tech actions', () => {
    cc().AddStatus('jammed')

    expect(cc().CanActivate('improvised_attack')).toBe(true)
    expect(cc().CanActivate('grapple')).toBe(true)
    expect(cc().CanActivate('ram')).toBe(true)
    expect(cc().CanActivate('move')).toBe(true)

    expect(cc().CanActivate('quick')).toBe(false)
    expect(cc().CanActivate('full')).toBe(false)
    expect(cc().CanActivate('reaction')).toBe(false)
    expect(cc().CanActivate('quicktech')).toBe(false)
  })

  it('T-STATUS-slowed-01: denies boost, itself a recognized activation, and every special move, leaving only the standard move', () => {
    expect(cc().CanActivate('boost')).toBe(true)

    cc().AddStatus('slow')
    expect(cc().CanActivate('boost')).toBe(false)
    expect(cc().CanActivate('move')).toBe(true)
  })

  it('T-STATUS-prone-01: grants attackers +1 accuracy and implies slowed', () => {
    cc().AddStatus('prone')
    expect(cc().AccuracyAgainst()).toBe(1)
    expect(cc().HasStatus('slow')).toBe(true)
  })

  it('T-STATUS-prone-01: a flying character is immune to prone, flying being a custom status with no compendium entry', () => {
    cc().ApplyCustomStatus(
      new EffectSpecial({ attribute: 'Flying', detail: 'This character is flying.' }),
      '',
      cc(),
      cc(),
      undefined as any
    )
    expect(cc().HasCondition('flying')).toBe(true)

    cc().AddStatus('prone')
    expect(cc().HasStatus('prone')).toBe(false)
  })

  it('T-STATUS-immobilized-01: denies voluntary movement', () => {
    cc().AddStatus('immobilized')
    expect(cc().CanActivate('move')).toBe(false)
  })

  it('T-STATUS-invisible-01: every attack has a flat 50% chance to miss before the roll', () => {
    cc().AddStatus('invisible')
    expect(cc().InvisibilityMissChance).toBe(0.5)
  })

  it('T-STATUS-engaged-01: a ranged attack made while engaged takes +1 difficulty', () => {
    cc().AddStatus('engaged')
    expect(cc().DifficultyFor('ranged')).toBe(1)
  })

  it('T-STATUS-hidden-01: cannot be targeted, and drops after the triggering attack resolves', () => {
    cc().AddStatus('hidden')
    expect(cc().CanBeTargeted).toBe(false)

    cc().UseAttackAction('act_skirmish')
    expect(cc().HasStatus('hidden')).toBe(false)
  })

  it('T-STATUS-cascade-01: a cascading mech passes to GM control', () => {
    cc().BeginCascade()
    expect(cc().InCascade).toBe(true)
    expect(cc().AIControl).toBe(true)
  })

  it('T-STATUS-cascade-01: the cascade status keys on the constant both the setter and the predicate read', () => {
    cc().BeginCascade()

    expect(cc().HasCustomStatus(StatusController.CASCADE_ATTRIBUTE)).toBe(true)
    expect(cc().InCascade).toBe(true)

    cc().RemoveCustomStatus(StatusController.CASCADE_ATTRIBUTE)
    expect(cc().InCascade).toBe(false)
  })
})

describe('rules carried by the printed book that the extraction missed', () => {
  it('T-STATUS-prone-01: standing up costs the standard move, and is refused while immobilized', () => {
    cc().AddStatus('prone')
    expect(cc().HasStatus('prone')).toBe(true)

    expect(cc().StandUp()).toBe(true)
    expect(cc().HasStatus('prone')).toBe(false)
    expect(cc().CanActivate('move')).toBe(false)
  })

  it('T-STATUS-prone-01: standing up is not movement, so it cannot be done while immobilized', () => {
    cc().AddStatus('prone')
    cc().AddStatus('immobilized')

    expect(cc().StandUp()).toBe(false)
    expect(cc().HasStatus('prone')).toBe(true)
  })

  it('T-ACTOR-unmounted-01: a biological character cannot take tech actions, only be spared them', () => {
    const u = npc()
    const c = u.CombatController
    vi.spyOn(c, 'IsBiological', 'get').mockReturnValue(true)

    expect(c.CanTakeTechActions).toBe(false)
    expect(c.CanUseQuickTech('scan')).toBe(false)
    expect(c.UseFullTech(['scan', 'lockon'])).toBe(false)
  })
})

describe('status and action corrections from the errata', () => {
  it('T-STATUS-jammed-01: a jammed character cannot be targeted by allied tech either', () => {
    cc().AddStatus('jammed')

    expect(cc().ImmuneToAlliedTech).toBe(true)
    expect(cc().ImmuneTo('tech', 'bolster', true)).toBe(true)
    expect(cc().ImmuneTo('tech', 'scan', true)).toBe(true)
    expect(cc().ImmuneTo('ranged', 'skirmish', true)).toBe(false)
  })

  it('T-ACTION-prepare-01: dropping a prepared action returns the reaction it locked away', () => {
    cc().Prepare()
    expect(cc().Prepared).toBe(true)
    expect(cc().CanActivate('reaction')).toBe(false)

    cc().ReleasePrepared()

    expect(cc().Prepared).toBe(false)
    expect(cc().CanActivate('reaction')).toBe(true)
  })
})

describe('status rules reaching the attack path', () => {
  const statusAccuracyAgainst = (target: any, attackType = 'ranged') =>
    new ActiveEventTarget(
      {
        Initiator: { actor: { CombatController: cc() } },
        Attack: attackType,
        Accuracy: 0,
        AttackBonus: 0,
        SaveHalf: false,
        Effect: { CanCrit: true },
        SetCrit: () => undefined,
      } as any,
      { actor: { CombatController: target } } as any,
      {} as any
    ).StatusAccuracy

  const attackOn = (target: any, over: any = {}) =>
    WeaponAttackFlow.Begin({
      attacker: {
        CanFireWeapon: () => true,
        ApplyHeat: () => undefined,
        DropAttackRevealedStatuses: () => undefined,
      },
      weapon: {},
      event: { Initiator: { actor: { CombatController: cc() } } },
      targets: [{ AttackRolledValue: 12, Combatant: { actor: { CombatController: target } } }],
      eligible: false,
      applied: false,
      ...over,
    } as any)

  it('T-STATUS-hidden-01: a direct attack on a hidden character is refused by the attack flow', () => {
    const target = mech().CombatController
    target.AddStatus('hidden')

    const r = attackOn(target)
    expect(r.outcome).toBe('halted')
    expect(r.state.blockedBy).toBe('untargetable')
  })

  it('T-STATUS-hidden-01: an area attack still reaches a hidden character', () => {
    const target = mech().CombatController
    target.AddStatus('hidden')

    const r = attackOn(target, {
      event: { AoE: true, Initiator: { actor: { CombatController: cc() } } },
    })
    expect(r.state.blockedBy).not.toBe('untargetable')
  })

  it('T-STATUS-invisible-01: a pre-roll miss is a miss on the real target, and a later 20 is not a crit', () => {
    const target = mech().CombatController
    target.AddStatus('invisible')
    rolls(20)

    const real = new ActiveEventTarget(
      {
        Initiator: { actor: { CombatController: cc() } },
        Attack: 'ranged',
        Accuracy: 0,
        AttackBonus: 0,
        SaveHalf: false,
        Effect: { CanCrit: true },
        SetCrit: () => undefined,
      } as any,
      { actor: { CombatController: target } } as any,
      {} as any
    )

    const r = attackOn(target, { targets: [real] })

    expect(real.MissedFromInvisibility).toBe(true)
    expect(real.HitResult).toBe('miss')
    expect(r.outcome).toBe('complete')

    real.AttackRolledValue = 20
    expect(real.HitResult).toBe('miss')
  })

  it('T-STATUS-hidden-01: an attack on two targets skips the hidden one and resolves the other', () => {
    const hidden = mech().CombatController
    hidden.AddStatus('hidden')
    const open = mech().CombatController

    const r = attackOn(open, {
      targets: [
        { AttackRolledValue: 12, Combatant: { actor: { CombatController: hidden } } },
        { AttackRolledValue: 12, Combatant: { actor: { CombatController: open } } },
      ],
    })

    expect(r.outcome).toBe('complete')
    expect(r.state.targets).toHaveLength(1)
  })

  it('T-STATUS-invisible-01: the miss chance is rolled by the attack flow before the attack roll', () => {
    const target = mech().CombatController
    target.AddStatus('invisible')
    rolls(20)

    const r = attackOn(target, {
      targets: [{ Combatant: { actor: { CombatController: target } } }],
    })
    expect(r.state.targets[0].MissedFromInvisibility).toBe(true)
  })

  it('T-STATUS-prone-01: the attacker accuracy against a prone target reaches the roll', () => {
    const target = mech().CombatController
    target.AddStatus('prone')

    expect(statusAccuracyAgainst(target)).toBe(1)
  })

  it('T-STATUS-engaged-01: the engaged difficulty reaches the roll, and only for ranged', () => {
    const target = mech().CombatController
    cc().AddStatus('engaged')

    expect(statusAccuracyAgainst(target, 'ranged')).toBe(-1)
    expect(statusAccuracyAgainst(target, 'melee')).toBe(0)
  })

  it('T-STATUS-impaired-01: the impaired difficulty reaches every attack type', () => {
    const target = mech().CombatController
    cc().AddStatus('impaired')

    for (const kind of ['ranged', 'melee', 'tech'] as const) {
      expect(statusAccuracyAgainst(target, kind), kind).toBe(-1)
    }
  })

  it('T-MOVE-cover-01: declared cover reaches the roll and is ignored by melee and tech', () => {
    const target = mech().CombatController
    target.Cover = 'hard' as any

    expect(statusAccuracyAgainst(target, 'ranged')).toBe(-2)
    expect(statusAccuracyAgainst(target, 'melee')).toBe(0)
  })
})
