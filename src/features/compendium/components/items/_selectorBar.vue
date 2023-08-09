<template>
  <div>
    <div class="heading h2 text-center text-primary">
      {{ group === 'none' ? 'All Items' : `By ${group}` }}
    </div>

    <div>
      <div v-if="group === 'lcp'">
        <div v-for="lcp in lcpFilter">
          <div class="heading mech" v-text="lcp" />
          <bar :options="options" :data="itemsByLcp[lcp]" />
        </div>
      </div>

      <div v-else-if="group === 'source'" style="height: calc(100vh - 180px)">
        <div v-for="manufacturer in (manufacturers as string[])">
          <v-row align="center">
            <v-col cols="auto">
              <cc-logo
                v-if="mf(manufacturer).LogoIsExternal"
                :source="mf(manufacturer)"
                size="x-large"
                class="pt-3 mb-n1"
              />
              <v-icon
                v-else
                size="60"
                :icon="mf(manufacturer).Icon"
                :color="mf(manufacturer).GetColor($vuetify.theme.current.dark)"
              />
            </v-col>
            <v-col>
              <div class="heading mech" v-text="manufacturer" />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <bar :data="getItems(manufacturer)" :options="options" />
            </v-col>
          </v-row>
        </div>
      </div>

      <div v-else-if="group === 'license'" style="height: calc(100vh - 180px)">
        <div v-for="license in licenses">
          <div class="heading h2 text-primary mt-4" v-text="license" />

          <v-row>
            <v-col>
              <bar :data="getLicenseItems(license)" :options="options" />
            </v-col>
          </v-row>
        </div>
      </div>

      <div v-else-if="group === 'type'" style="height: calc(100vh - 180px)">
        <div v-for="subtype in subtypes">
          <div class="heading h2 text-primary mt-4" v-text="subtype" />
          <v-row>
            <v-col>
              <bar :data="getSubtypeItems(subtype)" :options="options" />
            </v-col>
          </v-row>
        </div>
      </div>

      <div v-else style="height: calc(100vh - 180px)">
        <bar :data="getChartData()" :options="options" />
      </div>
    </div>

    <div>
      <v-row no-gutters align="center">
        <v-col style="height: calc(100vh - 180px)">
          <bar ref="chart" :data="chartData" :options="options" />
        </v-col>
      </v-row>
    </div>
    <v-row class="px-12 pt-1">
      <v-col>
        <v-select
          v-model="yAxis"
          :items="axes"
          label="Y Axis"
          variant="outlined"
          return-object
          density="compact"
          hide-details
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'vue-chartjs';
import _ from 'lodash';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { CompendiumItem, MechWeapon } from '@/class';
import { CompendiumStore } from '@/stores';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend, ChartDataLabels);

export default {
  name: 'SelectorScatter',
  props: {
    items: {
      type: Array,
      required: true,
    },
    group: {
      type: String,
      required: true,
      default: 'None',
    },
    manufacturers: {
      type: Array,
      required: true,
    },
    licenses: {
      type: Array,
      required: true,
    },
    lcpFilter: {
      type: Array,
      required: true,
    },
  },
  components: { Bar },
  data: () => ({
    xAxis: { title: '', value: '' },
    yAxis: { title: '', value: '' },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          offset: true,
          ticks: {
            stepSize: 1,
          },
          title: {
            display: false,
          },
        },
      },
      layout: {
        padding: 10,
      },

      elements: {
        point: {
          radius: 6,
          hoverRadius: 6,
          borderColor: '#fff',
          borderWidth: 2,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        datalabels: {
          color: '#fff',
          backgroundColor: 'rgba(0,0,0,0.6)',
          borderRadius: 4,
          clamp: true,
          anchor: 'start',
          offset: 8,
          font: {
            family: 'Helvetica',
            size: 12,
          },
        },
      },
    },
  }),
  mounted() {
    this.yAxis = this.axes[0];
  },
  computed: {
    itemMap() {
      let arr = [] as any[];
      if (this.items && (this.items[0] as any).StatsByProfile)
        arr = (this.items as MechWeapon[]).flatMap((x: MechWeapon) => x.StatsByProfile);
      else arr = this.items;

      return arr.map((x: any) => {
        return {
          label: x.Name,
          stats: { ...x.Stats },
          source: x.Source,
          lcp: x.LcpName,
        };
      });
    },
    axes() {
      switch ((this.items[0] as CompendiumItem).ItemType) {
        case 'Frame':
          return [
            { title: 'HP', value: 'hp' },
            { title: 'Evasion', value: 'evasion' },
            { title: 'Armor', value: 'armor' },
            { title: 'E-Defense', value: 'edef' },
            { title: 'Heat Capacity', value: 'heatcap' },
            { title: 'Repair Capacity', value: 'repcap' },
            { title: 'Sensors', value: 'sensor_range' },
            { title: 'Tech Attack', value: 'tech_attack' },
            { title: 'Save', value: 'save' },
            { title: 'Speed', value: 'speed' },
            { title: 'System Points', value: 'sp' },
          ];
        default:
          return [
            { title: 'Range', value: 'range' },
            { title: 'Total Damage', value: 'damage' },
            { title: 'Line', value: 'line' },
            { title: 'Blast', value: 'blast' },
            { title: 'Burst', value: 'burst' },
            { title: 'Cone', value: 'cone' },
            { title: 'Kinetic Damage', value: 'kineticDamage' },
            { title: 'Energy Damage', value: 'energyDamage' },
            { title: 'Heat Damage', value: 'heatDamage' },
            { title: 'Explosive Damage', value: 'explosiveDamage' },
            { title: 'Variable Damage', value: 'variableDamage' },
          ];
      }
    },
    subtypes() {
      return _.uniq(this.items.map((x: any) => x.Type));
    },
    itemsByLcp() {
      return _.groupBy(this.items, 'LcpName');
    },
  },
  methods: {
    getChartData() {
      const data = this.itemMap.map((x) => ({
        label: x.label,
        value: x.stats[this.yAxis.value],
        color: this.mf(x.source).GetColor(),
      }));

      return {
        labels: data.map((row) => row.label),
        datasets: [
          {
            label: this.yAxis.title,
            data: data.map((row) => row.value),
            backgroundColor: data.map((row) => row.color),
          },
        ],
      };
    },
    mf(id: string) {
      return (
        CompendiumStore().Manufacturers.find((x) => x.ID === id) || {
          GetColor: () => 'black',
          Name: 'err',
          LogoIsExternal: false,
          Icon: 'gms',
        }
      );
    },

    getItems(manufacturer: string, lcp?: string) {
      if (lcp) return this.itemsByLcp[lcp].filter((i: any) => i.Source === manufacturer);

      return this.items.filter((i: any) => i.Source === manufacturer);
    },
    getLicenseItems(license: string) {
      return this.items.filter((i: any) => i.License === license);
    },
    getSubtypeItems(t: string) {
      return this.items.filter((i: any) => i.Type === t);
    },
  },
};
</script>
