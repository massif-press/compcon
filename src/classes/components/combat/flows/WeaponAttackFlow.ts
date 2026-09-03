import { Flow } from './Flow'
import type { IFlowStep } from './Flow'
import { DiceRoller } from '@/classes/dice/DiceRoller'

type HitResult = '' | 'miss' | 'hit' | 'crit'
type TargetDefense = 'edef' | 'evasion'

interface IAttackActor {
  CanFireWeapon(weapon: unknown): boolean
  ApplyHeat(value: number, opts?: { external?: boolean }): void
  DropAttackRevealedStatuses(): void
  Tier?: number
}

interface IAttackWeapon {
  Accuracy?: unknown
  HeatCost?: number
  IsLoading?: boolean
  Used?: boolean
  getAttacks?: (tier: number) => number
}

interface IAttackDamageEvent {
  DamageType: string
  OverkillHeat: number
  CalcFinalDamage(event: unknown, target: unknown): void
}

interface IAttackTarget {
  Combatant: { actor: { CombatController: any } } | null
  AttackRolledValue?: number
  HitResult?: string
  MissedFromInvisibility?: boolean
  HeatExemptFor?: boolean
  AttackAccuracy?: number
  DamageEvents?: IAttackDamageEvent[]
  FinalDamageValue?: number
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

interface IWeaponAttackState {
  attacker: IAttackActor
  weapon?: IAttackWeapon
  event?: IAttackEvent
  targets: IAttackTarget[]
  routes?: IEffectRoute[]
  followUps?: { ApplyAll(): void }[]
  eligible: boolean
  applied: boolean
  attackType?: string
  accuracy?: number
  attackCount?: number
  selfHeat?: number
  blockedBy?: string
}

function targetDefenseFor(attackType?: string, declared?: TargetDefense): TargetDefense {
  return declared || (attackType === 'tech' ? 'edef' : 'evasion')
}

function hitResultFor(rolled?: number, targetDefenseValue?: number): HitResult {
  if (rolled === undefined || !targetDefenseValue) return ''
  if (rolled >= 20) return 'crit'
  return rolled >= targetDefenseValue ? 'hit' : 'miss'
}

function canCrit(attack: string | undefined, effectCanCrit: boolean): boolean {
  if (!effectCanCrit) return false
  return attack === 'melee' || attack === 'ranged'
}

function critTriggers(
  rolled: number | undefined,
  attackType: string | undefined,
  effectCanCrit: boolean,
  attackerCanCrit = true
): boolean {
  return !!rolled && rolled >= 20 && attackerCanCrit && canCrit(attackType, effectCanCrit)
}

function reliableIncoming(hitResult: string, rolled: number, reliable: number): number {
  return hitResult === 'miss' ? reliable || 0 : rolled
}

function incomingDamage(opts: {
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

function overkillHeatFor(overkill: boolean, rerolls: number): number {
  return overkill ? rerolls || 0 : 0
}

function routesTo(hitResult: string): {
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

function attackModifiers(attacker?: any, target?: any, attackType: string = 'ranged'): number {
  return (
    (target?.AccuracyAgainst?.() ?? 0) -
    (attacker?.DifficultyFor?.(attackType) ?? 0) -
    (target?.DifficultyAgainst?.(attackType) ?? 0)
  )
}

function missesFromInvisibility(target?: { InvisibilityMissChance?: number }): boolean {
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
    if (!s.attacker.CanFireWeapon(s.weapon)) {
      s.eligible = false
      s.blockedBy = 'ordnance'
      return 'halt'
    }
    s.eligible = true
    return 'continue'
  },
}

function isFriendly(a: any, b: any): boolean {
  if (!a || !b) return false
  if (a === b || (a.id && a.id === b.id)) return false
  if (a.side && b.side) return a.side === b.side
  return false
}

function heatExempt(attackType: string | undefined, initiator: any, target: any): boolean {
  return attackType === 'tech' && isFriendly(initiator, target)
}

function accuracyFor(weapon: any, effectAccuracy = 0): number {
  return effectAccuracy + (Number(weapon?.Accuracy) || 0)
}

function consumeWeaponUses(weapon: any): void {
  if (weapon?.IsLoading) weapon.Used = true
}

function applyAttackDamage(target: any, damageEvent: any, event: any): void {
  if (!target?.Combatant) return
  if (
    damageEvent.DamageType.toLowerCase() === 'heat' &&
    heatExempt(event.Attack, event.Initiator, target.Combatant)
  )
    return

  damageEvent.CalcFinalDamage(event, target)

  const attacker = event.Initiator.actor.CombatController
  const defender = target.Combatant.actor.CombatController
  if (target.TookDamage) defender.ApplyDamage(damageEvent.DamageType, target.FinalDamageValue)
  attacker.RootActor.CombatController.CombatLog.DealDamage(
    target.FinalDamageValue,
    damageEvent.DamageType
  )
  if (damageEvent.OverkillHeat) attacker.ApplyHeat(damageEvent.OverkillHeat)
}

const attackType: IFlowStep<IWeaponAttackState> = {
  Name: 'attack-type',
  Run: s => {
    s.attackType = s.event?.Attack ?? (s.weapon as any)?.Attack
    return 'continue'
  },
}

const targetEligibility: IFlowStep<IWeaponAttackState> = {
  Name: 'target-eligibility',
  Run: s => {
    if (s.event?.AoE) return 'continue'
    const legal = s.targets.filter(t => controllerOf(t)?.CanBeTargeted !== false)
    if (legal.length === s.targets.length) return 'continue'

    s.targets = legal
    if (legal.length) return 'continue'

    s.eligible = false
    s.blockedBy = 'untargetable'
    return 'halt'
  },
}

const invisibility: IFlowStep<IWeaponAttackState> = {
  Name: 'invisibility',
  Run: s => {
    s.targets.forEach(t => {
      if (t.AttackRolledValue !== undefined || t.MissedFromInvisibility) return
      if (missesFromInvisibility(controllerOf(t))) t.MissedFromInvisibility = true
    })
    return 'continue'
  },
}

const accuracy: IFlowStep<IWeaponAttackState> = {
  Name: 'accuracy',
  Run: s => {
    s.accuracy = accuracyFor(s.weapon, s.event?.Accuracy ?? 0)
    return 'continue'
  },
}

function awaitingRolls(s: IWeaponAttackState): number[] {
  return s.targets
    .map((t, i) => (t.AttackRolledValue === undefined && !t.MissedFromInvisibility ? i : -1))
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
  Request: s => ({ kind: 'roll', label: 'attack roll', targets: awaitingRolls(s) }),
}

const damageTypeResolution: IFlowStep<IWeaponAttackState> = {
  Name: 'damage-type-resolution',
  Run: s => {
    s.targets.forEach(t => {
      t.HeatExemptFor = heatExempt(s.attackType, s.event?.Initiator, t.Combatant)
    })
    return 'continue'
  },
}

const damageCalculation: IFlowStep<IWeaponAttackState> = {
  Name: 'damage-calculation',
  Run: s => {
    s.targets.forEach(t => (t.DamageEvents || []).forEach(de => de.CalcFinalDamage(s.event, t)))
    return 'continue'
  },
}

const applicationGuard: IFlowStep<IWeaponAttackState> = {
  Name: 'application-guard',
  Run: s => {
    if (s.applied) {
      s.blockedBy = 'applied'
      return 'halt'
    }
    s.applied = true
    return 'continue'
  },
}

const damageApplication: IFlowStep<IWeaponAttackState> = {
  Name: 'damage-application',
  Run: s => {
    if (s.event?.ApplyAll) {
      s.event.ApplyAll()
      return 'continue'
    }
    s.targets.forEach(t => (t.DamageEvents || []).forEach(de => applyAttackDamage(t, de, s.event)))
    return 'continue'
  },
}

function attackCountFor(weapon: any, tier: number): number {
  return typeof weapon?.getAttacks === 'function' ? weapon.getAttacks(tier) : 1
}

const additionalAttacks: IFlowStep<IWeaponAttackState> = {
  Name: 'additional-attacks',
  Run: s => {
    s.attackCount = attackCountFor(s.weapon, s.attacker?.Tier ?? 1)
    return 'continue'
  },
}

const consumeUses: IFlowStep<IWeaponAttackState> = {
  Name: 'consume-uses',
  Run: s => {
    consumeWeaponUses(s.weapon)
    return 'continue'
  },
}

function selfHeatFor(weapon: any): number {
  return Number(weapon?.HeatCost) || 0
}

function applySelfHeat(attacker: any, weapon: any): number {
  const heat = selfHeatFor(weapon)
  if (heat) attacker.ApplyHeat(heat)
  return heat
}

const heatApplication: IFlowStep<IWeaponAttackState> = {
  Name: 'heat-application',
  Run: s => {
    s.selfHeat = applySelfHeat(s.attacker, s.weapon)
    return 'continue'
  },
}

const effectRouting: IFlowStep<IWeaponAttackState> = {
  Name: 'effect-routing',
  Run: s => {
    ;(s.routes || []).forEach(route => {
      if (!route.event) return
      route.targets().forEach(t => {
        if (t) route.event!.Apply(t)
      })
    })
    ;(s.followUps || []).forEach(f => f.ApplyAll())
    return 'continue'
  },
}

const postAttack: IFlowStep<IWeaponAttackState> = {
  Name: 'post-attack',
  Run: s => {
    s.attacker.DropAttackRevealedStatuses()
    return 'continue'
  },
}

const WeaponAttackFlow = new Flow<IWeaponAttackState>('WeaponAttackFlow', [
  eligibility,
  attackType,
  targetEligibility,
  invisibility,
  accuracy,
  damageRoll,
  damageTypeResolution,
  damageCalculation,
  applicationGuard,
  damageApplication,
  additionalAttacks,
  consumeUses,
  heatApplication,
  effectRouting,
  postAttack,
])

export {
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
  heatExempt,
  isFriendly,
  accuracyFor,
  attackModifiers,
  missesFromInvisibility,
  consumeWeaponUses,
  applyAttackDamage,
  selfHeatFor,
  applySelfHeat,
}
export type {
  IWeaponAttackState,
  IAttackActor,
  IAttackWeapon,
  IAttackTarget,
  IAttackEvent,
  IEffectRoute,
  HitResult,
  TargetDefense,
}
