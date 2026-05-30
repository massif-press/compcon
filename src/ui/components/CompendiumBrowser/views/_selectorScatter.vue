<template>
  <div>
    <div>
      <v-row no-gutters
        align="center">
        <v-col cols="auto">
          <div style="position: relative; width: 50px">
            <div style="position: absolute; transform: rotate(-90deg)"
              class="text-center text-caption">
              <b>{{ yAxis.title }}</b>
            </div>
          </div>
        </v-col>
        <v-col :style="`height: calc(100vh - ${short ? '300px' : '180px'})`">
          <scatter ref="chart"
            :data="chartData"
            :options="options" />
        </v-col>
        <v-col cols="12"
          class="text-center text-caption">
          <b>{{ xAxis.title }}</b>
        </v-col>
      </v-row>
    </div>
    <v-row class="px-12 pt-2">
      <v-col>
        <v-select v-model="xAxis"
          :items="axes"
          label="X Axis"
          variant="outlined"
          return-object
          density="compact"
          hide-details />
      </v-col>
      <v-col cols="12"
        md="6">
        <v-select v-model="yAxis"
          :items="axes"
          label="Y Axis"
          variant="outlined"
          return-object
          density="compact"
          hide-details />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTheme } from 'vuetify'
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Scatter } from 'vue-chartjs';
import * as _ from 'lodash-es';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { CompendiumItem } from '@/classes/CompendiumItem'
import { Manufacturer } from '@/classes/Manufacturer'
import { MechWeapon } from '@/classes/mech/components/equipment/MechWeapon'
import { NpcClass } from '@/classes/npc/class/NpcClass';
import { getChartAxes, findManufacturer } from './_selectorUtils';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend, ChartDataLabels);

defineOptions({ name: 'SelectorScatter' })

const theme = useTheme()

const props = withDefaults(defineProps<{
  items: any[]
  group: string
  selected?: object
  short?: boolean
  tier?: number
  manufacturers?: Manufacturer[]
}>(), {
  group: 'None',
  short: false,
  tier: 1,
  manufacturers: () => [],
})

const xAxis = ref({ title: '', value: '' })
const yAxis = ref({ title: '', value: '' })
const colors = ref([] as string[])

const axes = computed(() => getChartAxes((props.items[0] as CompendiumItem).ItemType, { includeSize: true, heatCapKey: 'heat' }))
const itemMap = computed(() => {
  let arr = [] as any[];
  if (props.items && (props.items[0] as any).StatsByProfile)
    arr = (props.items as MechWeapon[]).flatMap((x: MechWeapon) => x.StatsByProfile);
  else if (
    props.items &&
    (props.items[0] as any).ItemType === 'NpcClass' &&
    (props.items[0] as NpcClass).Stats
  ) {
    arr = props.items.map((x: any) => ({
      ID: x.ID,
      Name: x.Name,
      Source: x.Source,
      LcpName: x.LcpName,
      Color:
        x.ItemType === 'NpcClass'
          ? theme.themes.value['gms']?.colors?.[x.Color]
          : mf(x.Source).GetColor(),
      Stats: x.Stats.AllStats(props.tier),
    }));
  } else arr = props.items;

  return arr.map((x: any) => ({
    label: x.Name,
    stats: { ...x.Stats },
    source: x.Source,
    lcp: x.LcpName,
  }));
})
const chartData = computed(() => {
  let datasets = [
    {
      data: collateData(itemMap.value),
      backgroundColor: '#991E2A',
      label: 'All Items',
    },
  ] as any[];

  if (props.group === 'source' || props.group === 'license') {
    const bySource = _.groupBy(itemMap.value, 'source');
    datasets = Object.keys(bySource).map((key) => ({
      id: key || 'None',
      label: key || 'None',
      data: collateData(bySource[key]),
      backgroundColor: mf(key).GetColor(),
    }));
  }

  if (props.group === 'lcp') {
    const byLcp = _.groupBy(itemMap.value, 'lcp');
    datasets = Object.keys(byLcp).map((key, i) => ({
      id: key || 'None',
      label: key || 'None',
      data: collateData(byLcp[key]),
      backgroundColor: colors.value[i],
    }));
  }

  return { datasets };
})
const options = computed(() => {
  const o = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { offset: true, ticks: { stepSize: 1 }, title: { display: false } },
      y: { offset: true, ticks: { stepSize: 1 }, title: { display: false } },
    },
    layout: { padding: 10 },
    legend: { display: false },
    elements: { point: { radius: 6, hoverRadius: 6, borderColor: '#fff', borderWidth: 2 } },
    plugins: {
      annotation: { annotations: {} as any },
      datalabels: {
        color: '#fff',
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 4,
        clamp: true,
        align: 'bottom',
        offset: 8,
        font: { family: 'Helvetica', size: 15 },
      },
    },
  } as any;

  if (props.selected) {
    const s = props.selected as any;
    let stats = s.Stats ? s.Stats : s.StatsByProfile[0].Stats;
    if (s.ItemType === 'NpcClass') stats = s.Stats.AllStats(props.tier);
    o.plugins.annotation.annotations = {
      point1: {
        type: 'point',
        xValue: stats[xAxis.value.value] || 0,
        yValue: stats[yAxis.value.value] || 0,
        radius: 18,
        backgroundColor: 'rgba(153, 30, 42, 0.25)',
        borderWidth: 4,
        borderColor: '#991E2A',
      },
    };
  }

  return o;
})

xAxis.value = axes.value[0]
yAxis.value = axes.value[1]
colors.value = Array.from(
  { length: props.items.length },
  () => '#' + Math.floor(Math.random() * 16777215).toString(16)
)

function collateData(items: any[]) {
  const map = items
    .map((item: any) => ({
      label: item.label,
      x: item.stats[xAxis.value.value] || 0,
      y: item.stats[yAxis.value.value] || 0,
    }))
    .reduce((result: any, obj) => {
      if (obj.label !== undefined && obj.x !== undefined && obj.y !== undefined) {
        const key = `${obj.x}-${obj.y}`;
        if (!result[key]) {
          result[key] = { label: obj.label, x: obj.x, y: obj.y };
        } else {
          result[key].label += `\n${obj.label}`;
        }
      }
      return result;
    }, {});
  return Object.values(map);
}
function mf(id: string) {
  return findManufacturer(props.manufacturers as Manufacturer[], id);
}
</script>
