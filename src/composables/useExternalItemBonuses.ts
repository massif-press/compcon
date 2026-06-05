import type { Bonus } from '@/classes/components'
import { BonusController } from '@/classes/components/feature/bonus/BonusController'
import type { CompendiumItem } from '@/classes/CompendiumItem'
import type { IFeatureController } from '@/classes/components/feature/IFeatureController'

export const ITEM_BONUS_IDS = BonusController.ITEM_BONUS_IDS

export function externalItemBonuses(mech: IFeatureController, item: CompendiumItem): Bonus[] {
  return BonusController.filterForItem(mech, item)
}

export function externalPilotItemBonuses(pilot: IFeatureController, item: CompendiumItem): Bonus[] {
  return BonusController.filterForItem(pilot, item)
}

export function externalUnitItemBonuses(unit: IFeatureController, item: CompendiumItem): Bonus[] {
  return BonusController.filterForItem(unit, item)
}
