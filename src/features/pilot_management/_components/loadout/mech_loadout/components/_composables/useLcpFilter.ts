import { ref, Ref } from 'vue'
import { flavorID } from '@/io/Generators'
import { Bonus, BonusId } from '@/classes/components/feature/bonus/Bonus'
import { Mech } from '@/classes/mech/Mech'

export function useLcpFilter(mech: Ref<Mech>) {
  const showUnlicensed = ref(false)
  const showOverSP = ref(false)

  function fID(template: string): string {
    return flavorID(template)
  }

  function filterByLcp<T extends { InLcp?: boolean; Brew?: { LcpId?: string; LcpName?: string } }>(
    items: T[]
  ): T[] {
    if (!mech.value.Parent.LcpConfig) return items
    return items.filter(
      x =>
        !x.InLcp ||
        mech.value.Parent.LcpConfig?.packList.some(y => y.packID === x.Brew?.LcpId) ||
        mech.value.Parent.LcpConfig?.packList.some(y => y.packName === x.Brew?.LcpName)
    )
  }

  function isLicensed(x: { LicenseLevel?: number; License?: string }): boolean {
    return !x.LicenseLevel || mech.value.Pilot.has('License', x.License ?? '', x.LicenseLevel)
  }

  function isAICapacityFull(): boolean {
    return (
      mech.value.MechLoadoutController.ActiveLoadout.AICount >=
      1 + Bonus.get(BonusId.AI_CAP, mech.value)
    )
  }

  return { showUnlicensed, showOverSP, fID, filterByLcp, isLicensed, isAICapacityFull }
}
