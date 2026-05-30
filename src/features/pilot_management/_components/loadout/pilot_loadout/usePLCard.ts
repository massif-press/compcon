import { computed } from 'vue'
import { CompendiumStore } from '@/stores'
import { PilotEquipment } from '@/classes/pilot/components/Loadout/equipment/PilotEquipment'
import { flavorID } from '@/io/Generators'

function usePLCard(props: { pilot: any }) {
  const allGear = computed((): PilotEquipment[] => {
    if (!props.pilot.LcpConfig) return CompendiumStore().PilotGear as PilotEquipment[]
    return CompendiumStore().PilotGear.filter(
      (x: any) =>
        !x.InLcp ||
        props.pilot.LcpConfig?.packList.some((y: any) => y.packID === x.Brew?.LcpId) ||
        props.pilot.LcpConfig?.packList.some((y: any) => y.packName === x.Brew?.LcpName)
    ) as PilotEquipment[]
  })

  function fID(template: string): string {
    return flavorID(template)
  }

  return { allGear, fID }
}

export { usePLCard }
