import { computed, onScopeDispose, ref } from 'vue'
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

  let drainTimer: ReturnType<typeof setInterval> | null = null

  function stopDrain() {
    if (drainTimer) clearInterval(drainTimer)
    drainTimer = null
  }

  function drainBattery() {
    if (batteryIndex.value > 0) {
      props.item.CombatController.CorePower = false
      stopDrain()
      drainTimer = setInterval(() => {
        batteryIndex.value--
        if (batteryIndex.value <= 0) {
          batteryIndex.value = 0
          stopDrain()
        }
      }, 60)
    } else {
      stopDrain()
      props.item.CombatController.CorePower = true
      batteryIndex.value = 3
    }
  }

  onScopeDispose(stopDrain, true)

  return { batteryIcons, batteryIndex, overchargeTrack, getIcon, drainBattery }
}

export { useTrackableStats }
