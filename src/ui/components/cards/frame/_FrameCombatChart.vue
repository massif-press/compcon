<template>
  <v-row align="center"
    dense>
    <v-col v-if="!mobile"
      cols="6">
      <Radar :data="chartData"
        :options="chartOptions"
        style="max-height: 45vh" />
      <div class="px-4 mt-2">
        <v-row align="center"
          justify="space-around">
          <v-col>
            <cc-select autocomplete
              v-model="compareFrames"
              :items="getComparableFrames"
              item-title="Name"
              return-object
              label="Compare to"
              density="compact"
              hide-details
              clearable
              multiple
              style="min-width: 150px" />
          </v-col>
        </v-row>
      </div>
    </v-col>
    <v-col>
      <frame-statblock :frame="frame" />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDisplay, useTheme } from 'vuetify'
import { useCompendiumData } from '@/ui/providers'
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
import { Frame } from '@/classes/mech/components/frame/Frame'
import FrameStatblock from './_FrameStatblock.vue'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

const props = defineProps<{ frame: Frame }>()

const compendium = useCompendiumData()
const { smAndDown: mobile } = useDisplay()
const theme = useTheme()

const compareFrames = ref<Frame[]>([])

const labels = [
  'HP', 'Armor', 'Repair Capacity', 'Evasion', 'Speed',
  'E-Defense', 'Tech Attack', 'SP', 'Heat Capacity', 'Sensors', 'Save Target',
]
const statProps = [
  'HP', 'Armor', 'RepCap', 'Evasion', 'Speed',
  'EDefense', 'TechAttack', 'SP', 'HeatCap', 'SensorRange', 'SaveTarget',
]
const colors = ['#328E6E', '#ff00fa', '#4F1C51', '#F7374F', '#3A59D1', '#FF9B17', '#BBD8A3', '#C7D9DD']

const isDark = computed(() => theme.current.value.dark)

const frames = computed(() =>
  compendium.Frames.filter(
    (x) => x.Name !== props.frame.Name && !x.ID.startsWith('missing_')
  )
)

const getComparableFrames = computed(() => {
  if (compareFrames.value.length >= 6) return compareFrames.value
  return frames.value.filter((x) => x.ID !== props.frame.ID)
})

const chartOptions = computed(() => ({
  plugins: {
    datalabels: { display: false },
    tooltip: {
      callbacks: {
        label: (tooltipItem: any) => {
          const label = tooltipItem.dataset.label || ''
          const frame = compendium.Frames.find((x) => x.ID === tooltipItem.dataset.id)
          if (!frame) return label
          const value = (frame as any)[statProps[tooltipItem.dataIndex]]
          return `${label}: ${value}`
        },
      },
    },
  },
  layout: { padding: 4 },
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
  datasets: compareFrames.value.length
    ? [getDataset(props.frame), ...compareFrames.value.map((x, i) => getDataset(x, i, true))]
    : [getDataset(props.frame)],
}))

function getDataset(frame: any, idx?: number, compare?: boolean) {
  const accent = theme.current.value.colors.accent
  const dataset = {
    label: frame.Name,
    id: frame.ID,
    backgroundColor: compare ? colors[idx as number] + '1A' : accent + '80',
    borderColor: compare ? colors[idx as number] + 'CC' : accent + 'B7',
    data: [] as any[],
  }
  dataset.data = Object.values(frame.NormalizedStats())
  return dataset
}
</script>
