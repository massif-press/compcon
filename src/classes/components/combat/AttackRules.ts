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

type WeaponUseMode = 'skirmish' | 'barrage' | 'fight'

function isSuperheavy(weapon: any): boolean {
  return !!weapon?.IsSuperheavy || String(weapon?.Size ?? '').toLowerCase() === 'superheavy'
}

function hasUsesRemaining(item: any): boolean {
  if (!item?.IsLimited) return true
  if (item.CanSetUses) return true
  return (item.Uses ?? 0) < (item.MaxUses ?? 0)
}

function isSelectableWeapon(w: any): boolean {
  if (!w) return false
  if (w.Destroyed) return false
  if (w.Used) return false
  return hasUsesRemaining(w)
}

function weaponPool(cc: any, mode: WeaponUseMode): any[] {
  const present = (list: any[]) => (list ?? []).filter(Boolean)
  if (mode === 'fight') return present(cc?.RootActor?.Loadout?.Weapons)
  const npc = cc?.ActiveActor?.NpcFeatureController
  if (npc) return present(mode === 'barrage' ? npc.BarrageWeapons : npc.SkirmishWeapons)
  const all = present(cc?.ActiveActor?.MechLoadoutController?.ActiveLoadout?.Weapons)
  return all.filter((w: any) => (mode === 'barrage' ? w.Barrage : w.Skirmish))
}

function mountWeapons(cc: any, weapon: any): any[] {
  const mounts = cc?.ActiveActor?.MechLoadoutController?.ActiveLoadout?.Mounts ?? []
  const mount = mounts.find((m: any) =>
    (m.Weapons ?? []).some((w: any) => w.InstanceID === weapon?.InstanceID)
  )
  return mount?.Weapons ?? []
}

function suppressBonusDamage(event: any): any {
  ;(event?.BaseEvent?.DamageEvents ?? event?.DamageEvents ?? []).forEach((d: any) => {
    d.Bonus = false
    d.BonusDamageEvent = undefined
  })
  return event
}

export {
  hasUsesRemaining,
  isSelectableWeapon,
  weaponPool,
  mountWeapons,
  isSuperheavy,
  additionalAuxAttacks,
  suppressBonusDamage,
  objectStats,
  objectSections,
  bonusDamage,
  resolveAreaAttack,
}
export type { WeaponUseMode }
