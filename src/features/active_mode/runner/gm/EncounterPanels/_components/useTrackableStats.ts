import { computed, ref } from 'vue'
import { Rules } from '@/classes/utility/Rules'

function useTrackableStats(props: { item: any }) {
  const batteryIcons = ref([
    'mdi-battery-outline', 'mdi-battery-low', 'mdi-battery-medium', 'mdi-battery-high',
  ])
  const batteryIndex = ref(3)

  const overchargeTrack = computed(() =>
    props.item.OverchangeTrack ? props.item.OverchangeTrack : Rules.Overcharge
  )

  function getIcon(stat: string) {
    const icons: Record<string, string> = {
      structure: 'cc:structure', armor: 'mdi-shield-outline', hp: 'mdi-heart-outline',
      reactor: 'cc:reactor', heat: 'cc:heat', repair: 'cc:repair', techAttack: 'cc:quick_tech',
    }
    return icons[stat]
  }

  function drainBattery() {
    if (batteryIndex.value > 0) {
      props.item.CombatController.CorePower = false
      const interval = setInterval(() => {
        batteryIndex.value--
        if (batteryIndex.value === 0) clearInterval(interval)
      }, 60)
    } else {
      props.item.CombatController.CorePower = true
      batteryIndex.value = 3
    }
  }

  return { batteryIcons, batteryIndex, overchargeTrack, getIcon, drainBattery }
}

export { useTrackableStats }
