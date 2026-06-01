<template>
  <div v-if="group === 'lcp'">
    <div class="text-center">
      <v-btn v-for="(lcp, i) in lcpFilter"
        :key="`lcp-btn-${i}`"
        :active="lcpTab === i"
        :color="lcpTab === i ? 'accent' : ''"
        variant="tonal"
        size="small"
        rounded="0"
        @click="lcpTab = i">
        {{ lcp }}
      </v-btn>
    </div>

    <v-window v-model="lcpTab">
      <v-window-item v-for="lcp in lcpFilter"
        :key="`lcp-win-${lcp}`"
        eager>
        <div class="heading mech"
          v-text="lcp" />
        <div :style="`height: calc(100vh - ${short ? '400px' : '180px'})`">
          <bar :options="options"
            :data="getChartData(getItems(undefined, lcp as string))" />
        </div>
      </v-window-item>
    </v-window>
  </div>

  <div v-else-if="group === 'source'">
    <div class="text-center">
      <v-btn v-for="(m, i) in manufacturers"
        :key="`mf-btn-${i}`"
        :active="mfTab === i"
        :color="mfTab === i ? 'primary' : ''"
        variant="tonal"
        size="small"
        rounded="0"
        @click="mfTab = i">
        <cc-logo v-if="m && m.LogoIsExternal"
          size="small"
          :source="m"
          :color="mfTab === i ? 'white' : 'black'" />
        <v-icon v-else-if="!!m"
          size="20"
          :icon="m.Icon" />
        &nbsp;
        {{ !m ? 'None' : m.Name }}
      </v-btn>
    </div>

    <v-window v-model="mfTab">
      <v-window-item v-for="manufacturer in manufacturers"
        :key="`mf-win-${manufacturer}`"
        eager>
        <v-row v-if="manufacturer"
          align="center">
          <v-col cols="auto">
            <cc-logo v-if="manufacturer.LogoIsExternal"
              :source="manufacturer"
              size="x-large"
              class="pt-3 mb-n1" />
            <v-icon v-else
              size="60"
              :icon="manufacturer.Icon"
              :color="manufacturer.GetColor($vuetify.theme.current.dark)" />
          </v-col>
          <v-col>
            <div class="heading mech"
              v-text="manufacturer.Name" />
          </v-col>
        </v-row>
        <div v-else>
          <div class="heading mech"
            v-text="'No Manufacturer'" />
        </div>
        <v-row class="mt-n8">
          <v-col style="height: calc(100vh - 225px)">
            <bar :data="getChartData(getItems(manufacturer))"
              :options="options" />
          </v-col>
        </v-row>
      </v-window-item>
    </v-window>
  </div>

  <div v-else-if="group === 'license'">
    <div class="text-center">
      <v-btn v-for="(l, i) in licenses"
        :key="`lic-btn-${i}`"
        :active="licenseTab === i"
        :color="licenseTab === i ? 'primary' : ''"
        variant="tonal"
        size="small"
        rounded="0"
        @click="licenseTab = i">
        {{ !l ? 'None' : l }}
      </v-btn>
    </div>

    <v-window v-model="licenseTab">
      <v-window-item v-for="l in licenses"
        :key="`lic-win-${l}`"
        eager>
        <div class="heading h2 text-primary mt-4"
          v-text="l" />
        <v-row class="mt-n8">
          <v-col style="height: calc(100vh - 225px)">
            <bar :data="getChartData(getLicenseItems(l as string))"
              :options="options" />
          </v-col>
        </v-row>
      </v-window-item>
    </v-window>
  </div>

  <div v-else
    :style="`height: calc(100vh - ${short ? '300px' : '130px'})`">
    <bar :data="getChartData(items)"
      :options="options" />
  </div>

  <v-footer class="pb-2 pt-3 px-5">
    <v-row>
      <v-col>
        <v-select v-model="xAxis"
          :items="axes"
          label="Metric"
          variant="outlined"
          return-object
          density="compact"
          hide-details />
      </v-col>
      <v-col cols="auto">
        <v-btn size="small"
          icon
          variant="plain"
          @click="sort = 'ascending'">
          <v-icon size="25"
            icon="mdi-sort-ascending" />
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn size="small"
          icon
          variant="plain"
          @click="sort = 'descending'">
          <v-icon size="25"
            icon="mdi-sort-descending" />
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn size="small"
          icon
          variant="plain"
          @click="sort = ''">
          <v-icon size="25"
            icon="mdi-sort-variant-off" />
        </v-btn>
      </v-col>
    </v-row>
  </v-footer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTheme } from 'vuetify'
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  CategoryScale,
  BarElement,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import annotationPlugin from 'chartjs-plugin-annotation';
import * as _ from 'lodash-es';
import { CompendiumItem } from '@/classes/CompendiumItem'
import { Manufacturer } from '@/classes/Manufacturer'
import { MechWeapon } from '@/classes/mech/components/equipment/MechWeapon'
import { NpcClass } from '@/classes/npc/class/NpcClass';
import { getChartAxes, findManufacturer } from './_selectorUtils';

ChartJS.register(
  LinearScale, PointElement, LineElement, Tooltip, Legend,
  CategoryScale, BarElement, ChartDataLabels, annotationPlugin
);

defineOptions({ name: 'SelectorBar' })

const theme = useTheme()

const props = withDefaults(defineProps<{
  items: any[]
  group: string
  manufacturers: Manufacturer[]
  licenses: any[]
  lcpFilter: any[]
  selected?: object
  short?: boolean
  tier?: number
}>(), {
  group: 'None',
  short: false,
  tier: 1,
})

const xAxis = ref({ title: '', value: '' })
const mfTab = ref(0)
const lcpTab = ref(0)
const licenseTab = ref(0)
const sort = ref('')

const axes = computed(() => getChartAxes((props.items[0] as CompendiumItem).ItemType))
const subtypes = computed(() => _.uniq(props.items.map((x: any) => x.Type)))
const itemsByLcp = computed(() => _.groupBy(props.items, 'LcpName'))
const options = computed((): any => {
  const o = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { offset: true, ticks: { stepSize: 1 }, title: { display: false } },
    },
    layout: { padding: 10 },
    elements: { point: { radius: 6, hoverRadius: 6, borderColor: '#fff', borderWidth: 2 } },
    plugins: {
      legend: { display: false },
      annotation: { annotations: {} as any },
      datalabels: {
        color: '#fff',
        backgroundColor: 'rgba(0,0,0,0.8)',
        borderRadius: 4,
        anchor: 'start',
        offset: 8,
        font: { family: 'Helvetica', size: 12 },
      },
    },
  };

  if (props.selected) {
    const s = props.selected as any;
    let stats = s.Stats ? s.Stats : s.StatsByProfile[0].Stats;
    if (s.ItemType === 'NpcClass') stats = s.Stats.AllStats(props.tier);
    o.plugins.annotation.annotations = {
      line1: {
        type: 'line',
        yMin: stats[xAxis.value.value] || 0,
        yMax: stats[xAxis.value.value] || 0,
        borderColor: theme.themes.value['gms']?.colors?.primary,
        borderDash: [4, 4],
        label: {
          content: `${s.Source || ''} ${s.Name} (${stats[xAxis.value.value]} ${xAxis.value.title})`,
          display: true,
        },
      },
    };
  }

  return o;
})

xAxis.value = axes.value[0]

function sortItems(items: any[]) {
  if (sort.value === 'ascending') return _.sortBy(items, (x: any) => x.stats[xAxis.value.value]);
  if (sort.value === 'descending') return _.sortBy(items, (x: any) => x.stats[xAxis.value.value]).reverse();
  return items;
}
function getChartData(items: any[]) {
  const data = mapItems(items).map((x: any) => ({
    label: x.label,
    value: x.stats[xAxis.value.value],
    color: theme.current.value.colors.primary,
  }));
  return {
    labels: data.map((row: any) => row.label),
    datasets: [{
      label: xAxis.value.title,
      data: data.map((row: any) => row.value),
      backgroundColor: data.map((row: any) => row.color),
    }],
  };
}
function mf(id: string) {
  return findManufacturer(props.manufacturers as Manufacturer[], id);
}
function mapItems(items: any[]) {
  let arr = [] as any[];
  if (items && items.length > 0 && (items[0] as any).StatsByProfile)
    arr = (items as MechWeapon[]).flatMap((x: MechWeapon) => x.StatsByProfile);
  else if (
    props.items.length > 0 &&
    (props.items[0] as any).ItemType === 'NpcClass' &&
    items && items.length > 0 &&
    (items[0] as NpcClass).Stats
  ) {
    arr = items.map((x: any) => ({
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
  } else arr = items;

  return sortItems(arr.map((x: any) => ({
    label: x.Name,
    stats: { ...x.Stats },
    source: x.Source,
    lcp: x.LcpName,
    id: x.ID,
    color: x.ManufacturerColor || x.Color,
  })));
}
function getItems(manufacturer?: Manufacturer, lcp?: string) {
  if (lcp) return itemsByLcp.value[lcp].filter((i: any) => i.LcpName === lcp);
  return props.items.filter((i: any) => i.Source === manufacturer?.ID);
}
function getLicenseItems(license: string) {
  return props.items.filter((i: any) => i.License === license);
}
</script>
