import { DamageType } from '../../enums'

function objectStats(size: number): { evasion: number; hp: number } {
  return { evasion: 5, hp: Math.max(1, size) * 10 }
}

function objectSections(size: number): { evasion: number; hp: number }[] {
  return Array.from({ length: Math.max(1, size) }, () => objectStats(1))
}

function bonusDamage(
  attack: string | undefined,
  value: number,
  type?: DamageType | string,
  targetCount = 1
): { value: number; type: DamageType } | null {
  if (attack !== 'melee' && attack !== 'ranged') return null
  const resolved =
    [DamageType.Kinetic, DamageType.Explosive, DamageType.Energy].find(
      t => t.toLowerCase() === String(type ?? '').toLowerCase()
    ) ?? DamageType.Kinetic
  const scaled = targetCount > 1 ? Math.ceil(value / 2) : value
  return { value: scaled, type: resolved }
}

function resolveAreaAttack<T>(
  targets: T[],
  rollAttack: (target: T) => boolean,
  rollDamageOnce: () => number
): { target: T; hit: boolean; damage: number }[] {
  const rolls = targets.map(target => ({ target, hit: rollAttack(target) }))
  const damage = rollDamageOnce()
  return rolls.map(r => ({ ...r, damage: r.hit ? damage : 0 }))
}

function additionalAuxAttacks(weapons: any[], firedInstanceIds: string[] = []): any[] {
  return (weapons || []).filter(
    w =>
      String(w?.Size ?? '').toLowerCase() === 'auxiliary' &&
      !firedInstanceIds.includes(w.InstanceID)
  )
}

function suppressBonusDamage(event: any): any {
  ;(event?.BaseEvent?.DamageEvents ?? event?.DamageEvents ?? []).forEach((d: any) => {
    d.Bonus = false
    d.BonusDamageEvent = undefined
  })
  return event
}

export {
  additionalAuxAttacks,
  suppressBonusDamage,
  objectStats,
  objectSections,
  bonusDamage,
  resolveAreaAttack,
}
