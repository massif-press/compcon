import { Flow, step } from './Flow'
import type { IFlowStep } from './Flow'
import { DiceRoller } from '@/classes/dice/DiceRoller'
import type { BlockedReason } from '../log/events'
import { combatLogHooks } from './logHooks'

export type HitResult = '' | 'miss' | 'hit' | 'crit'
export type TargetDefense = 'edef' | 'evasion'

interface IAttackActor {
  CanFireWeapon(weapon: unknown): boolean
  DropAttackRevealedStatuses(): void
  Tier?: number
}

interface IAttackDamageEvent {
  CalcFinalDamage(event: unknown, target: unknown): void
}

interface IAttackTarget {
  Combatant: { actor: { CombatController: any } } | null
  AttackRolledValue?: number
  HitResultOverride?: 'hit' | 'miss'
  MissedFromInvisibility?: boolean
  HeatExemptFor?: boolean
  DamageEvents?: IAttackDamageEvent[]
}

interface IAttackEvent {
  Attack?: string
  Accuracy?: number
  AoE?: boolean
  Initiator?: any
  ApplyAll?: () => void
}

interface IEffectRoute {
  event?: { Apply(target: IAttackTarget): void }
  targets(): IAttackTarget[]
}

export interface IWeaponAttackState {
  attacker: IAttackActor
  weapon?: any
  event?: IAttackEvent
  targets: IAttackTarget[]
  routes?: IEffectRoute[]
  followUps?: { ApplyAll(): void }[]
  applied: boolean
  force?: boolean
  attackType?: string
  accuracy?: number
  attackCount?: number
  selfHeat?: number
  blockedBy?: BlockedReason
}

export function targetDefenseFor(attackType?: string, declared?: TargetDefense): TargetDefense {
  return declared || (attackType === 'tech' ? 'edef' : 'evasion')
}

export function hitResultFor(rolled?: number, targetDefenseValue?: number): HitResult {
  if (rolled === undefined || !targetDefenseValue) return ''
  if (rolled >= 20) return 'crit'
  return rolled >= targetDefenseValue ? 'hit' : 'miss'
}

export function canCrit(attack: string | undefined, effectCanCrit: boolean): boolean {
  if (!effectCanCrit) return false
  return attack === 'melee' || attack === 'ranged'
}

export function critTriggers(
  rolled: number | undefined,
  attackType: string | undefined,
  effectCanCrit: boolean,
  attackerCanCrit = true
): boolean {
  return !!rolled && rolled >= 20 && attackerCanCrit && canCrit(attackType, effectCanCrit)
}

export function reliableIncoming(hitResult: string, rolled: number, reliable: number): number {
  return hitResult === 'miss' ? reliable || 0 : rolled
}

export function incomingDamage(opts: {
  hitResult: string
  rolled: number
  bonus: number
  reliable: number
  isAoE: boolean
  savedHalf: boolean
}): number {
  let incoming = reliableIncoming(opts.hitResult, 0, opts.reliable)
  if (opts.hitResult !== 'miss') {
    incoming += opts.rolled
    incoming += opts.isAoE ? Math.ceil(opts.bonus / 2) : opts.bonus
    if (opts.savedHalf) incoming = Math.ceil(incoming / 2)
  }
  return incoming
}

export function overkillHeatFor(overkill: boolean, rerolls: number): number {
  return overkill ? rerolls || 0 : 0
}

export function routesTo(hitResult: string): {
  onAttack: boolean
  onHit: boolean
  onCrit: boolean
  onMiss: boolean
} {
  const landed = hitResult === 'hit' || hitResult === 'crit'
  return {
    onAttack: landed,
    onHit: landed,
    onCrit: hitResult === 'crit',
    onMiss: hitResult === 'miss',
  }
}

export function attackModifiers(
  attacker?: any,
  target?: any,
  attackType: string = 'ranged'
): number {
  return (
    (target?.AccuracyAgainst?.() ?? 0) -
    (attacker?.DifficultyFor?.(attackType) ?? 0) -
    (target?.DifficultyAgainst?.(attackType) ?? 0)
  )
}

export function missesFromInvisibility(target?: { InvisibilityMissChance?: number }): boolean {
  const chance = target?.InvisibilityMissChance ?? 0
  if (chance <= 0) return false
  return DiceRoller.rollDie(100) <= Math.round(chance * 100)
}

function controllerOf(target?: IAttackTarget): any {
  return target?.Combatant?.actor?.CombatController
}

const eligibility: IFlowStep<IWeaponAttackState> = {
  Name: 'weapon-eligibility',
  Run: s => {
    if (s.force || s.attacker.CanFireWeapon(s.weapon)) return 'continue'
    s.blockedBy = 'ordnance'
    return 'halt'
  },
}

export function isFriendly(a: any, b: any): boolean {
  if (!a || !b) return false
  if (a === b || (a.id && a.id === b.id)) return false
  if (a.side && b.side) return a.side === b.side
  return false
}

export function heatExempt(attackType: string | undefined, initiator: any, target: any): boolean {
  return attackType === 'tech' && isFriendly(initiator, target)
}

export function accuracyFor(weapon: any, effectAccuracy = 0): number {
  return effectAccuracy + (Number(weapon?.Accuracy) || 0)
}

export function consumeWeaponUses(weapon: any): void {
  if (weapon?.IsLoading) weapon.Used = true
}

export function applyAttackDamage(target: any, damageEvent: any, event: any): void {
  if (!target) return
  if (
    damageEvent.DamageType.toLowerCase() === 'heat' &&
    heatExempt(event.Attack, event.Initiator, target.Combatant)
  )
    return

  damageEvent.CalcFinalDamage(event, target)

  const attacker = event.Initiator.actor.CombatController
  const defender = target.Combatant?.actor.CombatController
  const wasDestroyed = !!defender?.IsDestroyed

  attacker.Record('damage', {
    targetId: defender?.RootActor?.ID,
    damageType: damageEvent.DamageType,
    incoming: target.FinalDamageValue,
    armorReduced: target.TotalArmorReduction ?? 0,
    resisted: [],
    conditions: [],
    final: target.FinalDamageValue,
    overkillHeat: damageEvent.OverkillHeat || undefined,
    taken: !!target.TookDamage,
    targetMounted: defender?.Mounted,
  })

  if (target.TookDamage) defender?.ApplyDamage(damageEvent.DamageType, target.FinalDamageValue)
  if (damageEvent.OverkillHeat) attacker.ApplyHeat(damageEvent.OverkillHeat)

  if (defender && !wasDestroyed && defender.IsDestroyed)
    attacker.Record('actor.destroy', { targetId: defender.RootActor?.ID })
}

const attackType = step<IWeaponAttackState>('attack-type', s => {
  s.attackType = s.event?.Attack ?? (s.weapon as any)?.Attack
})

const targetEligibility: IFlowStep<IWeaponAttackState> = {
  Name: 'target-eligibility',
  Run: s => {
    if (s.event?.AoE) return 'continue'
    const legal = s.targets.filter(t => controllerOf(t)?.CanBeTargeted !== false)
    if (legal.length === s.targets.length) return 'continue'

    s.targets = legal
    if (legal.length) return 'continue'

    s.blockedBy = 'untargetable'
    return 'halt'
  },
  ReportHalt: true,
}

const invisibility = step<IWeaponAttackState>('invisibility', s => {
  s.targets.forEach(t => {
    if (t.AttackRolledValue !== undefined || t.MissedFromInvisibility) return
    if (missesFromInvisibility(controllerOf(t))) t.MissedFromInvisibility = true
  })
})

const accuracy = step<IWeaponAttackState>('accuracy', s => {
  s.accuracy = accuracyFor(s.weapon, s.event?.Accuracy ?? 0)
})

function awaitingRolls(s: IWeaponAttackState): number[] {
  if (!s.attackType) return []
  return s.targets
    .map((t, i) =>
      t.AttackRolledValue === undefined &&
      t.HitResultOverride === undefined &&
      !t.MissedFromInvisibility
        ? i
        : -1
    )
    .filter(i => i !== -1)
}

const damageRoll: IFlowStep<IWeaponAttackState> = {
  Name: 'damage-roll',
  Run: (s, input) => {
    const rolls = (input ?? {}) as Record<number, number>
    awaitingRolls(s).forEach(i => {
      if (typeof rolls[i] === 'number') s.targets[i].AttackRolledValue = rolls[i]
    })
    return awaitingRolls(s).length ? 'await' : 'continue'
  },
  Request: s => ({ kind: 'roll', label: 'attackRoll', targets: awaitingRolls(s) }),
}

const damageTypeResolution = step<IWeaponAttackState>('damage-type-resolution', s => {
  s.targets.forEach(t => {
    t.HeatExemptFor = heatExempt(s.attackType, s.event?.Initiator, t.Combatant)
  })
})

const damageCalculation = step<IWeaponAttackState>('damage-calculation', s => {
  s.targets.forEach(t => (t.DamageEvents || []).forEach(de => de.CalcFinalDamage(s.event, t)))
})

export function applicationGuard<
  S extends { applied: boolean; blockedBy?: BlockedReason },
>(): IFlowStep<S> {
  return {
    Name: 'application-guard',
    Run: s => {
      if (s.applied) {
        s.blockedBy = 'already_applied'
        return 'halt'
      }
      s.applied = true
      return 'continue'
    },
  }
}

const damageApplication = step<IWeaponAttackState>('damage-application', s => {
  if (s.event?.ApplyAll) {
    s.event.ApplyAll()
    return
  }
  s.targets.forEach(t => (t.DamageEvents || []).forEach(de => applyAttackDamage(t, de, s.event)))
})

export function attackCountFor(weapon: any, tier: number): number {
  return typeof weapon?.getAttacks === 'function' ? weapon.getAttacks(tier) : 1
}

const additionalAttacks = step<IWeaponAttackState>('additional-attacks', s => {
  s.attackCount = attackCountFor(s.weapon, s.attacker?.Tier ?? 1)
})

const consumeUses = step<IWeaponAttackState>('consume-uses', s => {
  consumeWeaponUses(s.weapon)
})

export function selfHeatFor(weapon: any): number {
  return Number(weapon?.HeatCost) || 0
}

export function applySelfHeat(attacker: any, weapon: any): number {
  const heat = selfHeatFor(weapon)
  if (heat) attacker.ApplyHeat(heat)
  return heat
}

const heatApplication = step<IWeaponAttackState>('heat-application', s => {
  s.selfHeat = applySelfHeat(s.attacker, s.weapon)
})

const effectRouting = step<IWeaponAttackState>('effect-routing', s => {
  ;(s.routes || []).forEach(route => {
    if (!route.event) return
    route.targets().forEach(t => {
      if (t) route.event!.Apply(t)
    })
  })
  ;(s.followUps || []).forEach(f => f.ApplyAll())
})

const postAttack = step<IWeaponAttackState>('post-attack', s => {
  s.attacker.DropAttackRevealedStatuses()
})

export const WeaponAttackFlow = new Flow<IWeaponAttackState>(
  'WeaponAttackFlow',
  [
    eligibility,
    attackType,
    targetEligibility,
    invisibility,
    accuracy,
    damageRoll,
    damageTypeResolution,
    damageCalculation,
    applicationGuard<IWeaponAttackState>(),
    damageApplication,
    additionalAttacks,
    consumeUses,
    heatApplication,
    effectRouting,
    postAttack,
  ],
  combatLogHooks
)
