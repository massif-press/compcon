<template>
  <Radar :data="chartData" :options="chartOptions" style="max-height: 600px" />
  <div class="px-4 mt-2">
    <v-autocomplete
      v-model="<any>compareClasses"
      :items="npcClasses"
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
import { GenerateContrastingColors } from '@/util/Colors';

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
    relative: false,
    aggregate: false,
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
    colors: [] as string[],
  }),
  created() {
    this.colors = GenerateContrastingColors(this.npcClasses.length + 1);
  },
  computed: {
    npcClasses() {
      return CompendiumStore().NpcClasses;
    },
    chartOptions() {
      return this.relative
        ? {
            plugins: {
              datalabels: {
                display: false,
              },
            },
            layout: {
              padding: 0,
            },

            scales: {
              r: {
                angleLines: {
                  display: false,
                },
                suggestedMin: 0,
                suggestedMax: 100,
                beginAtZero: true,
                ticks: {
                  display: false,
                },
              },
            },
          }
        : {
            plugins: {
              datalabels: {
                display: false,
              },
            },
            layout: {
              padding: 0,
            },
            scales: {
              r: {
                angleLines: {
                  display: false,
                },
                suggestedMin: -3,
                beginAtZero: true,
                ticks: {
                  display: false,
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
        backgroundColor: compare
          ? this.colors[idx as number] + '1A'
          : this.$vuetify.theme.current.colors.accent + '33',
        borderColor: compare
          ? this.colors[idx as number] + 'CC'
          : this.$vuetify.theme.current.colors.accent + 'B7',
        data: [] as any[],
      };

      dataset.data = [
        this.relative ? npcClass.Comparator.Hull.norm : npcClass.Comparator.Hull.raw,
        this.relative ? npcClass.Comparator.Armor.norm : npcClass.Comparator.Armor.raw,
        this.relative ? npcClass.Comparator.HP.norm : npcClass.Comparator.HP.raw,
        this.relative ? npcClass.Comparator.Agi.norm : npcClass.Comparator.Agi.raw,
        this.relative ? npcClass.Comparator.Speed.norm : npcClass.Comparator.Speed.raw,
        this.relative ? npcClass.Comparator.Evasion.norm : npcClass.Comparator.Evasion.raw,
        this.relative ? npcClass.Comparator.Sys.norm : npcClass.Comparator.Sys.raw,
        this.relative ? npcClass.Comparator.EDefense.norm : npcClass.Comparator.EDefense.raw,
        this.relative ? npcClass.Comparator.Sensors.norm : npcClass.Comparator.Sensors.raw,
        this.relative ? npcClass.Comparator.Eng.norm : npcClass.Comparator.Eng.raw,
        this.relative ? npcClass.Comparator.HeatCap.norm : npcClass.Comparator.HeatCap.raw,
        this.relative ? npcClass.Comparator.SaveTarget.norm : npcClass.Comparator.SaveTarget.raw,
      ];

      return dataset;
    },
  },
};
</script>
