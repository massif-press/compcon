import { Flow } from './Flow'
import type { IFlowStep } from './Flow'

type HitResult = '' | 'miss' | 'hit' | 'crit'
type TargetDefense = 'edef' | 'evasion'

interface IWeaponAttackState {
  attacker: any
  weapon?: any
  event?: any
  targets: any[]
  eligible: boolean
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

function isFriendly(c: any): boolean {
  return !!c && (c.type === 'pilot' || c.side === 'ally')
}

function heatExempt(attackType: string | undefined, initiator: any, target: any): boolean {
  return attackType === 'tech' && isFriendly(initiator) && isFriendly(target)
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
  if (target.FinalDamageValue > 0)
    target.Combatant.actor.CombatController.ApplyDamage(
      damageEvent.DamageType,
      target.FinalDamageValue
    )
  attacker.RootActor.CombatController.CombatLog.DealDamage(
    target.FinalDamageValue,
    damageEvent.DamageType
  )
  if (damageEvent.OverkillHeat) attacker.ApplyHeat(damageEvent.OverkillHeat)
}

const attackType: IFlowStep<IWeaponAttackState> = {
  Name: 'attack-type',
  Run: s => {
    s.attackType = s.event?.Attack ?? s.weapon?.Attack
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

const damageRoll: IFlowStep<IWeaponAttackState> = {
  Name: 'damage-roll',
  Run: s => (s.targets.some(t => t.AttackRolledValue === undefined) ? 'await' : 'continue'),
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
    s.targets.forEach(t =>
      (t.DamageEvents || []).forEach((de: any) => de.CalcFinalDamage(s.event, t))
    )
    return 'continue'
  },
}

const damageApplication: IFlowStep<IWeaponAttackState> = {
  Name: 'damage-application',
  Run: s => {
    s.targets.forEach(t =>
      (t.DamageEvents || []).forEach((de: any) => applyAttackDamage(t, de, s.event))
    )
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
  accuracy,
  damageRoll,
  damageTypeResolution,
  damageCalculation,
  damageApplication,
  additionalAttacks,
  consumeUses,
  heatApplication,
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
  accuracyFor,
  consumeWeaponUses,
  applyAttackDamage,
  selfHeatFor,
  applySelfHeat,
}
export type { IWeaponAttackState, HitResult, TargetDefense }
