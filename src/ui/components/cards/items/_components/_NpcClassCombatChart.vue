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

<script lang="ts">
import { CompendiumStore } from '@/stores';
import { NpcClass } from '@/classes/npc/class/NpcClass';
import { Radar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Legend,
  Tooltip,
} from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default {
  name: 'NpcCombatChart',
  components: { Radar },
  props: {
    npcClass: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    compareClasses: [] as NpcClass[],
    labels: [
      'Hull',
      'Armor',
      'HP',
      'Agi',
      'Speed',
      'Evasion',
      'Sys',
      'EDefense',
      'Sensors',
      'Eng',
      'HeatCap',
      'SaveTarget',
    ],
  }),

  computed: {
    getComparableClasses() {
      if (this.compareClasses.length >= 4) return this.compareClasses;
      return this.npcClasses.filter((x) => x.ID !== this.npcClass.ID);
    },
    colors() {
      return ['#328E6E', '#ff00fa', '#4F1C51', '#F7374F'];
    },
    npcClasses() {
      return CompendiumStore().NpcClasses;
    },
    isDark() {
      return this.$vuetify.theme.current.dark;
    },
    chartOptions() {
      return {
        plugins: {
          datalabels: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                const label = tooltipItem.dataset.label || '';
                const npc = CompendiumStore().NpcClasses.find(
                  (x) => x.ID === tooltipItem.dataset.id
                );
                if (!npc) return label;
                const value = npc.Comparator[this.labels[tooltipItem.dataIndex]];
                return `${label}: ${value}`;
              },
            },
          },
        },
        layout: {
          padding: 0,
        },

        scales: {
          r: {
            beginAtZero: true,

            angleLines: {
              display: false,
            },
            ticks: {
              display: false,
            },
            grid: {
              color: this.isDark ? '#FFFFFF33' : '#00000033',
            },
            pointLabels: {
              color: this.isDark ? '#FFFFFF66' : '#00000066',
            },
          },
        },
      };
    },
    chartData() {
      return {
        labels: this.labels,
        datasets: this.compareClasses.length
          ? [
              this.getDataset(this.npcClass),
              ...this.compareClasses.map((x, i) => this.getDataset(x, i, true)),
            ]
          : [this.getDataset(this.npcClass)],
      };
    },
  },
  methods: {
    getDataset(npcClass, idx?: number, compare?: boolean) {
      const dataset = {
        label: npcClass.Name,
        id: npcClass.ID,
        backgroundColor: compare
          ? this.colors[idx as number] + '1A'
          : this.$vuetify.theme.current.colors.accent + '33',
        borderColor: compare
          ? this.colors[idx as number] + 'CC'
          : this.$vuetify.theme.current.colors.accent + 'B7',
        data: [] as any[],
      };

      const compStats = npcClass.NormalizedStats();

      dataset.data = Object.values(compStats);
      return dataset;
    },
  },
};
</script>
