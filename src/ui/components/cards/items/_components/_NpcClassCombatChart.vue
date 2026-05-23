<template>
  <Radar :data="chartData" :options="chartOptions" style="max-height: 600px" />
  <div class="px-4 mt-2">
    <v-autocomplete
      v-model="<any>compareClasses"
      :items="getComparableClasses"
      item-title="Name"
      return-object
      label="Compare to"
      density="compact"
      hide-details
      clearable
      multiple
      style="min-width: 150px" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTheme } from 'vuetify'
import { NpcClass } from '@/classes/npc/class/NpcClass'
import { Radar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Legend,
  Tooltip,
} from 'chart.js'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

const props = defineProps<{ npcClass: Record<string, any>; npcClasses: NpcClass[] }>()

const theme = useTheme()
const compareClasses = ref<NpcClass[]>([])

const labels = ['Hull', 'Armor', 'HP', 'Agi', 'Speed', 'Evasion', 'Sys', 'EDefense', 'Sensors', 'Eng', 'HeatCap', 'SaveTarget']
const colors = ['#328E6E', '#ff00fa', '#4F1C51', '#F7374F']

const isDark = computed(() => theme.current.value.dark)

const getComparableClasses = computed(() => {
  if (compareClasses.value.length >= 4) return compareClasses.value
  return props.npcClasses.filter(x => x.ID !== props.npcClass.ID)
})

const chartOptions = computed(() => ({
  plugins: {
    datalabels: { display: false },
    tooltip: {
      callbacks: {
        label: (tooltipItem: any) => {
          const label = tooltipItem.dataset.label || ''
          const npc = props.npcClasses.find(x => x.ID === tooltipItem.dataset.id)
          if (!npc) return label
          const value = npc.Comparator[labels[tooltipItem.dataIndex]]
          return `${label}: ${value}`
        },
      },
    },
  },
  layout: { padding: 0 },
  scales: {
    r: {
      beginAtZero: true,
      angleLines: { display: false },
      ticks: { display: false },
      grid: { color: isDark.value ? '#FFFFFF33' : '#00000033' },
      pointLabels: { color: isDark.value ? '#FFFFFF66' : '#00000066' },
    },
  },
}))

const chartData = computed(() => ({
  labels,
  datasets: compareClasses.value.length
    ? [getDataset(props.npcClass), ...compareClasses.value.map((x, i) => getDataset(x, i, true))]
    : [getDataset(props.npcClass)],
}))

function getDataset(npcClass: any, idx?: number, compare?: boolean) {
  const accent = theme.current.value.colors.accent
  const dataset = {
    label: npcClass.Name,
    id: npcClass.ID,
    backgroundColor: compare ? colors[idx as number] + '1A' : accent + '33',
    borderColor: compare ? colors[idx as number] + 'CC' : accent + 'B7',
    data: [] as any[],
  }
  dataset.data = Object.values(npcClass.NormalizedStats())
  return dataset
}
</script>
