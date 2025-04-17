<template>
  <v-row align="center" dense>
    <v-col v-if="!mobile" cols="6">
      <Radar :data="chartData" :options="chartOptions" style="max-height: 45vh" />
      <div class="px-4 mt-2">
        <v-row align="center" justify="space-around">
          <v-col>
            <cc-select
              autocomplete
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

<script lang="ts">
import { CompendiumStore } from '@/stores';
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
import { Frame } from '@/class';
import FrameStatblock from './_FrameStatblock.vue';
import { GenerateContrastingColors } from '@/util/Colors';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default {
  name: 'FrameCombatChart',
  components: { Radar, FrameStatblock },
  props: {
    frame: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    relative: false,
    aggregate: false,
    compareFrames: [] as Frame[],
    standardLabels: [
      'HP',
      'Armor',
      'Repair Capacity',
      'Evasion',
      'Speed',
      'E-Defense',
      'Tech Attack',
      'SP',
      'Heat Capacity',
      'Sensors',
      'Save Target',
    ],
    aggregateLabels: ['Survivability', 'Mobility', 'Offense', 'Utility'],
  }),
  computed: {
    getComparableFrames() {
      if (this.compareFrames.length >= 6) return this.compareFrames;
      return this.frames.filter((x) => x.ID !== this.frame.ID);
    },
    colors() {
      return [
        '#328E6E',
        '#ff00fa',
        '#4F1C51',
        '#F7374F',
        '#3A59D1',
        '#FF9B17',
        '#BBD8A3',
        '#C7D9DD',
      ];
    },
    mobile(): boolean {
      return this.$vuetify.display.smAndDown;
    },
    labels() {
      return this.aggregate ? this.aggregateLabels : this.standardLabels;
    },
    frames() {
      return CompendiumStore().Frames.filter(
        (x) => x.Name !== this.frame.Name && !x.ID.startsWith('missing_')
      );
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
        datasets: this.compareFrames.length
          ? [
              this.getDataset(this.frame),
              ...this.compareFrames.map((x, i) => this.getDataset(x, i, true)),
            ]
          : [this.getDataset(this.frame)],
      };
    },
  },
  methods: {
    getDataset(frame, idx?: number, compare?: boolean) {
      const dataset = {
        label: frame.Name,
        backgroundColor: compare
          ? this.colors[idx as number] + '1A'
          : this.$vuetify.theme.current.colors.accent + '80',
        borderColor: compare
          ? this.colors[idx as number] + 'CC'
          : this.$vuetify.theme.current.colors.accent + 'B7',
        data: [] as any[],
      };

      dataset.data = this.aggregate
        ? [
            this.relative ? frame.Comparator.Survivability : frame.SurvivabilityRaw,
            this.relative ? frame.Comparator.Mobility : frame.MobilityRaw,
            this.relative ? frame.Comparator.Offense : frame.OffenseRaw,
            this.relative ? frame.Comparator.Utility : frame.UtilityRaw,
          ]
        : [
            this.relative ? frame.Comparator.HP : frame.HP,
            this.relative ? frame.Comparator.Armor : frame.Armor,
            this.relative ? frame.Comparator.RepCap : frame.RepCap,
            this.relative ? frame.Comparator.Evasion : frame.Evasion,
            this.relative ? frame.Comparator.Speed : frame.Speed,
            this.relative ? frame.Comparator.EDefense : frame.EDefense,
            this.relative ? frame.Comparator.TechAttack : frame.TechAttack,
            this.relative ? frame.Comparator.SP : frame.SP,
            this.relative ? frame.Comparator.HeatCap : frame.HeatCap,
            this.relative ? frame.Comparator.SensorRange : frame.SensorRange,
            this.relative ? frame.Comparator.SaveTarget : frame.SaveTarget,
          ];

      return dataset;
    },
  },
};
</script>
