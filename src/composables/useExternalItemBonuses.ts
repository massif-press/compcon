import { BonusController } from '@/classes/components/feature/bonus/BonusController'

export const ITEM_BONUS_IDS = BonusController.ITEM_BONUS_IDS

export function externalItemBonuses(this: any): any[] {
  return BonusController.filterForItem(this.mech, this.item)
}

export function externalPilotItemBonuses(this: any): any[] {
  return BonusController.filterForItem(this.pilot, this.item)
}

export function externalUnitItemBonuses(this: any): any[] {
  return BonusController.filterForItem(this.unit, this.item)
}
