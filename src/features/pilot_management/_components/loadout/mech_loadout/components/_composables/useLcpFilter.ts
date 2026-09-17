import { ref, Ref } from 'vue'
import { flavorID } from '@/io/Generators'
import { Bonus, BonusId } from '@/classes/components/feature/bonus/Bonus'
import { Mech } from '@/classes/mech/Mech'
import { CompendiumStore } from '@/stores'
import type { Frame } from '@/classes/mech/components/frame/Frame'

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

  function isLicensed(x: { LicenseLevel?: number; License?: string; LicenseID?: string }): boolean {
    if (!x.LicenseLevel) return true

    if (x.LicenseID && mech.value.Pilot.has('License', x.LicenseID, x.LicenseLevel)) {
      return true
    }

    if (x.License) {
      if (mech.value.Pilot.has('License', x.License, x.LicenseLevel)) {
        return true
      }

      const frame =
        (x.LicenseID ? (CompendiumStore().referenceByID('Frames', x.LicenseID) as Frame) : null) ||
        CompendiumStore().Frames.find(
          f =>
            f.TrueName.toLowerCase() === x.License!.toLowerCase() ||
            f.Name.toLowerCase() === x.License!.toLowerCase()
        )
      if (frame && mech.value.Pilot.has('License', frame.Name, x.LicenseLevel)) {
        return true
      }
    }

    return false
  }

  function isAICapacityFull(): boolean {
    return (
      mech.value.MechLoadoutController.ActiveLoadout.AICount >=
      1 + Bonus.get(BonusId.AI_CAP, mech.value)
    )
  }

  return { showUnlicensed, showOverSP, fID, filterByLcp, isLicensed, isAICapacityFull }
}
