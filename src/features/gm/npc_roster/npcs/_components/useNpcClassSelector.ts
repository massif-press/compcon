import { computed, ref } from 'vue'
import { CompendiumStore } from '@/stores'
import { NpcClass } from '@/classes/npc/class/NpcClass'
import * as _ from 'lodash-es'

export const keymap: Record<string, string> = {
  hull: 'Hull', agi: 'Agi', sys: 'Sys', eng: 'Eng', armor: 'Armor',
  hp: 'HP', heat: 'HeatCap', evasion: 'Evade', edef: 'E-Def', speed: 'Speed',
  sensorRange: 'Sensor', saveTarget: 'Save',
}

function useNpcClassSelector() {
  const selectedTier = ref(1)
  const tieredView = ref(false)
  const options = ref({
    views: ['single', 'table', 'cards', 'scatter', 'bar', 'compare'],
    initialView: 'single',
    groups: ['lcp', 'role', 'none'],
    initialGroup: 'role',
  })

  const classes = computed((): NpcClass[] =>
    _.orderBy(CompendiumStore().NpcClasses, ['Role', 'Name'])
  )

  const headers = computed(() => {
    const h = [
      { title: 'Content Pack', key: 'LcpName' },
      { title: 'Role', key: 'Icon' },
      { title: 'Name', key: 'Name' },
    ] as any[]
    for (const key in keymap) {
      h.push({
        title: keymap[key], key,
        tier: selectedTier.value,
        sortRaw: (a: NpcClass, b: NpcClass) =>
          Number(a.Stats.Stat(key, selectedTier.value)) -
          Number(b.Stats.Stat(key, selectedTier.value)),
        align: 'center',
      })
    }
    return h
  })

  function toggleTieredView(evt: string) {
    tieredView.value = evt === 'table' || evt === 'scatter' || evt === 'bar' || evt === 'compare'
  }

  return { selectedTier, tieredView, options, classes, headers, toggleTieredView }
}

export { useNpcClassSelector }
