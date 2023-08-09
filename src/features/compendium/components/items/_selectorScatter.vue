<template>
  <div>
    <div>
      <v-row no-gutters align="center">
        <v-col cols="auto">
          <div style="position: relative; width: 50px">
            <div
              style="position: absolute; transform: rotate(-90deg)"
              class="text-center text-caption"
            >
              <b>{{ yAxis.title }}</b>
            </div>
          </div>
        </v-col>
        <v-col style="height: calc(100vh - 180px)">
          <scatter ref="chart" :data="chartData" :options="options" />
        </v-col>
        <v-col cols="12" class="text-center text-caption"
          ><b>{{ xAxis.title }}</b></v-col
        >
      </v-row>
    </div>
    <v-row class="px-12 pt-2">
      <v-col>
        <v-select
          v-model="xAxis"
          :items="axes"
          label="X Axis"
          variant="outlined"
          return-object
          density="compact"
          hide-details
        />
      </v-col>
      <v-col cols="12" md="6">
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
import { Scatter } from 'vue-chartjs';
import _ from 'lodash';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { CompendiumItem, MechWeapon } from '@/class';
import { CompendiumStore } from '@/stores';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend, ChartDataLabels);

const ColorArr = [
  '#991E2A',
  '#aec7e8',
  '#ff7f0e',
  '#ffbb78',
  '#2ca02c',
  '#98df8a',
  '#d62728',
  '#ff9896',
  '#9467bd',
  '#c5b0d5',
  '#8c564b',
  '#c49c94',
  '#e377c2',
  '#f7b6d2',
  '#7f7f7f',
  '#c7c7c7',
  '#bcbd22',
  '#dbdb8d',
  '#17becf',
  '#9edae5',
  '#393b79',
  '#5254a3',
  '#636363',
  '#7b4173',
  '#ad494a',
  '#d6616b',
  '#31a354',
  '#74c476',
  '#a1d99b',
  '#756bb1',
  '#9e9ac8',
  '#bcbddc',
  '#dadaeb',
  '#636363',
  '#6b6ecf',
  '#9c9ede',
  '#cedb9c',
  '#e7cb94',
  '#bd9e39',
  '#e7ba52',
  '#843c39',
  '#ad494a',
  '#d6616b',
  '#e7969c',
  '#7b4173',
  '#a55194',
  '#ce6dbd',
  '#de9ed6',
];

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
  },
  components: { Scatter },
  data: () => ({
    xAxis: { title: '', value: '' },
    yAxis: { title: '', value: '' },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          offset: true,
          ticks: {
            stepSize: 1,
          },
          title: {
            display: false,
          },
        },
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
      legend: {
        display: false,
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
        datalabels: {
          color: '#fff',
          backgroundColor: 'rgba(0,0,0,0.6)',
          borderRadius: 4,
          clamp: true,
          align: 'bottom',
          offset: 8,
          font: {
            family: 'Helvetica',
            size: 15,
          },
        },
      },
    },
  }),
  mounted() {
    this.xAxis = this.axes[0];
    this.yAxis = this.axes[1];
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
    chartData() {
      let datasets = [
        {
          data: this.collateData(this.itemMap),
          backgroundColor: '#991E2A',
          label: 'All Items',
        },
      ] as any[];

      if (this.group === 'source' || this.group === 'license') {
        let bySource = _.groupBy(this.itemMap, 'source');

        datasets = Object.keys(bySource).map((key) => {
          return {
            id: key || 'None',
            label: key || 'None',
            data: this.collateData(bySource[key]),
            backgroundColor: this.mf(key).GetColor(),
          };
        });
      }

      if (this.group === 'lcp') {
        let byLcp = _.groupBy(this.itemMap, 'lcp');
        datasets = Object.keys(byLcp).map((key, i) => {
          return {
            id: key || 'None',
            label: key || 'None',
            data: this.collateData(byLcp[key]),
            backgroundColor: ColorArr[i],
          };
        });
      }

      return {
        datasets,
      };
    },
  },
  methods: {
    collateData(items: any[]) {
      const map = items
        .map((item: any) => {
          return {
            label: item.label,
            x: item.stats[this.xAxis.value] || 0,
            y: item.stats[this.yAxis.value] || 0,
          };
        })
        .reduce((result, obj) => {
          if (obj.label !== undefined && obj.x !== undefined && obj.y !== undefined) {
            const key = `${obj.x}-${obj.y}`;
            if (!result[key]) {
              result[key] = {
                label: obj.label,
                x: obj.x,
                y: obj.y,
              };
            } else {
              result[key].label += `\n${obj.label}`;
            }
          }
          return result;
        }, {});
      return Object.values(map);
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
  },
};
</script>
