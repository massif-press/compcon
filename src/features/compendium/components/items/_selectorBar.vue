<template>
  <div>
    <div>
      <div>
        <div v-if="group === 'lcp'">
          <div class="text-center">
            <v-btn
              v-for="(lcp, i) in (lcpFilter as string[])"
              :active="lcpTab === i"
              :color="lcpTab === i ? 'primary' : ''"
              variant="tonal"
              size="small"
              rounded="0"
              @click="lcpTab = i"
            >
              {{ lcp }}
            </v-btn>
          </div>

          <v-window v-model="lcpTab">
            <v-window-item v-for="lcp in lcpFilter">
              <div class="heading mech" v-text="lcp" />
              <div style="height: calc(100vh - 250px)">
                <bar :options="options" :data="getChartData(getItems(undefined, lcp as string))" />
              </div>
            </v-window-item>
          </v-window>
        </div>

        <div v-else-if="group === 'source'">
          <div class="text-center">
            <v-btn
              v-for="(m, i) in (manufacturers as string[])"
              :active="mfTab === i"
              :color="mfTab === i ? 'primary' : ''"
              variant="tonal"
              size="small"
              rounded="0"
              @click="mfTab = i"
            >
              <cc-logo
                v-if="m && mf(m).LogoIsExternal"
                size="small"
                :source="mf(m)"
                :color="mfTab == i ? 'white' : 'black'"
              />
              <v-icon v-else-if="!!m" size="20" :icon="mf(m).Icon" />

              {{ !m ? 'None' : mf(m).Name }}
            </v-btn>
          </div>

          <v-window v-model="mfTab">
            <v-window-item v-for="manufacturer in (manufacturers as string[])">
              <v-row v-if="manufacturer" align="center">
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
              <div v-else>
                <div class="heading mech" v-text="'No Manufacturer'" />
              </div>
              <v-row class="mt-n8">
                <v-col style="height: calc(100vh - 225px)">
                  <bar :data="getChartData(getItems(manufacturer))" :options="options" />
                </v-col>
              </v-row>
            </v-window-item>
          </v-window>
        </div>

        <div v-else-if="group === 'license'">
          <div class="text-center">
            <v-btn
              v-for="(l, i) in (licenses as string[])"
              :active="licenseTab === i"
              :color="licenseTab === i ? 'primary' : ''"
              variant="tonal"
              size="small"
              rounded="0"
              @click="licenseTab = i"
            >
              {{ !l ? 'None' : l }}
            </v-btn>
          </div>

          <v-window v-model="licenseTab">
            <v-window-item v-for="l in (licenses as string[])">
              <div class="heading h2 text-primary mt-4" v-text="l" />
              <v-row class="mt-n8">
                <v-col style="height: calc(100vh - 225px)">
                  <bar :data="getChartData(getLicenseItems(l))" :options="options" />
                </v-col>
              </v-row>
            </v-window-item>
          </v-window>
        </div>

        <div v-else style="height: calc(100vh - 130px)">
          <bar :data="getChartData(items)" :options="options" />
        </div>
      </div>
    </div>
  </div>
  <v-footer
    border
    class="bg-primary pb-2 pt-3 px-5"
    app
    style="margin-left: 325px; width: calc(100vw - 335px)"
  >
    <v-row>
      <v-col>
        <v-select
          v-model="xAxis"
          :items="axes"
          label="Metric"
          variant="outlined"
          return-object
          density="compact"
          hide-details
        />
      </v-col>
      <v-col cols="auto">
        <v-btn size="small" icon variant="plain" @click="sort = 'ascending'">
          <v-icon size="25" icon="mdi-sort-ascending" />
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn size="small" icon variant="plain" @click="sort = 'descending'">
          <v-icon size="25" icon="mdi-sort-descending" />
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn size="small" icon variant="plain" @click="sort = ''">
          <v-icon size="25" icon="mdi-sort-variant-off" />
        </v-btn>
      </v-col>
    </v-row>
  </v-footer>
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
    mfTab: 0,
    lcpTab: 0,
    licenseTab: 0,
    sort: '',
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
    this.xAxis = this.axes[0];
  },
  computed: {
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
    sortItems(items) {
      if (this.sort === 'ascending') {
        return _.sortBy(items, (x: any) => x.stats[this.xAxis.value]);
      }
      if (this.sort === 'descending') {
        return _.sortBy(items, (x: any) => x.stats[this.xAxis.value]).reverse();
      }
      return items;
    },
    getChartData(items) {
      const data = this.mapItems(items).map((x) => ({
        label: x.label,
        value: x.stats[this.xAxis.value],
        color: this.mf(x.source).GetColor(),
      }));

      return {
        labels: data.map((row) => row.label),
        datasets: [
          {
            label: this.xAxis.title,
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
    mapItems(items) {
      let arr = [] as any[];
      if (items && (items[0] as any).StatsByProfile)
        arr = (items as MechWeapon[]).flatMap((x: MechWeapon) => x.StatsByProfile);
      else arr = items;

      return this.sortItems(
        arr.map((x: any) => {
          return {
            label: x.Name,
            stats: { ...x.Stats },
            source: x.Source,
            lcp: x.LcpName,
          };
        })
      );
    },

    getItems(manufacturer?: string, lcp?: string) {
      if (lcp) return this.itemsByLcp[lcp].filter((i: any) => i.LcpName === lcp);

      return this.items.filter((i: any) => i.Source === manufacturer);
    },
    getSubtypeItems(t: string) {
      return this.items.filter((i: any) => i.Type === t);
    },
    getLicenseItems(license: string) {
      return this.items.filter((i: any) => i.License === license);
    },
  },
};
</script>
