// todo: refactor into bonuscontroller

export const ITEM_BONUS_IDS = new Set([
  'range',
  'damage',
  'limited_bonus',
  'knockback',
  'threat',
  'attack',
  'melee',
  'accuracy',
  'min_range',
  'min_damage',
  'no_mods',
  'deployable_hp',
  'deployable_size',
  'deployable_charges',
  'deployable_armor',
  'deployable_evasion',
  'deployable_edef',
  'deployable_heatcap',
  'deployable_repcap',
  'deployable_sensor_range',
  'deployable_tech_attack',
  'deployable_save',
  'deployable_speed',
  'deployable_resist',
  'drone_hp',
  'drone_size',
  'drone_charges',
  'drone_armor',
  'drone_evasion',
  'drone_edef',
  'drone_heatcap',
  'drone_repcap',
  'drone_sensor_range',
  'drone_tech_attack',
  'drone_save',
  'drone_speed',
  'drone_resist',
])

function filterBonuses(actor: any, item: any): any[] {
  if (!actor?.FeatureController) return []

  const itemBonuses = new Set(item.Bonuses)
  const hasWeaponTypes = Array.isArray(item.WeaponTypes) && item.WeaponTypes.length > 0

  const deployables: any[] = item.Deployables ?? []
  const hasDrones = deployables.some((d: any) => d.Type?.toLowerCase() === 'drone')
  const hasDeployables = deployables.some((d: any) => d.Type?.toLowerCase() !== 'drone')
  const isIntegrated = item.IsIntegrated

  return actor.FeatureController.Bonuses.filter((b: any) => {
    if (itemBonuses.has(b)) return false
    if (!ITEM_BONUS_IDS.has(b.ID)) return false
    if (b.ID.startsWith('drone_') && !hasDrones) return false
    if (b.ID.startsWith('deployable_') && !hasDeployables) return false
    if (b.ID === 'no_mods' && isIntegrated) return true
    else if (b.ID === 'no_mods' && !isIntegrated) return false
    if (b.WeaponTypes.length || b.WeaponSizes.length || b.DamageTypes.length) {
      if (!hasWeaponTypes || !item.Size) return false
      if (
        b.WeaponTypes.length &&
        !b.WeaponTypes.some((wt: string) => item.WeaponTypes.includes(wt))
      )
        return false
      if (b.WeaponSizes.length && !b.WeaponSizes.some((ws: string) => item.Size === ws))
        return false
      if (
        b.DamageTypes.length &&
        !b.DamageTypes.some((dt: string) => item.DamageType?.some((x: string) => x === dt))
      )
        return false
    }
    return true
  })
}

export function externalItemBonuses(this: any): any[] {
  return filterBonuses(this.mech, this.item)
}

export function externalPilotItemBonuses(this: any): any[] {
  return filterBonuses(this.pilot, this.item)
}

export function externalUnitItemBonuses(this: any): any[] {
  return filterBonuses(this.unit, this.item)
}
