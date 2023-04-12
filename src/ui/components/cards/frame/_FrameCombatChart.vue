<template>
  <v-row align="center">
    <v-col cols="6">
      <Radar :data="chartData" :options="chartOptions" />
      <div>
        <v-row dense align="center" justify="space-around">
          <v-col cols="auto">
            <v-row align="center" class="text-overline" dense>
              <v-col cols="auto">
                Absolute
                <cc-tooltip inline content="Chart raw stat values ">
                  <v-icon size="small" class="fade-select"
                    >mdi-information-outline</v-icon
                  >
                </cc-tooltip></v-col
              >
              <v-col cols="auto">
                <v-switch v-model="relative" density="compact" hide-details />
              </v-col>
              <v-col cols="auto">
                Relative
                <cc-tooltip
                  inline
                  content="Chart stat values relative to all other frames in the Compendium."
                >
                  <v-icon size="small" class="fade-select"
                    >mdi-information-outline</v-icon
                  >
                </cc-tooltip>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="auto">
            <v-select
              v-model="compareFrames"
              :items="frames"
              item-title="Name"
              return-object
              label="Compare to"
              density="compact"
              hide-details
              clearable
              multiple
              style="min-width: 150px"
            />
          </v-col>
        </v-row>
      </div>
    </v-col>
    <v-divider vertical class="mx-2" />
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

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

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
    compareFrames: [] as Frame[],
    labels: [
      'HP',
      'Evasion',
      'E-Defense',
      'Heat Capacity',
      'Sensors',
      'Tech Attack',
      'Repair Capacity',
      'Save Target',
      'Speed',
      'SP',
    ],
  }),
  computed: {
    frames() {
      return CompendiumStore().Frames.filter(
        (x) => x.Name !== this.frame.Name && !x.ID.startsWith('missing_')
      );
    },
    chartOptions() {
      return this.relative
        ? {
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
                  display: true,
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
              ...this.compareFrames.map((x) => this.getDataset(x, true)),
            ]
          : [this.getDataset(this.frame)],
      };
    },
  },
  methods: {
    getColor() {
      const hexChars = '0123456789ABCDEF';
      let hex = '#';
      for (let i = 0; i < 6; i++) {
        hex += hexChars[Math.floor(Math.random() * 16)];
      }
      return hex;
    },
    getDataset(frame, compare?: boolean) {
      return {
        label: frame.Name,
        backgroundColor: compare ? this.getColor() + '1A' : '#673AB333',
        borderColor: compare ? this.getColor() + 'CC' : '#673AB7',

        data: [
          this.relative ? frame.Comparator.HP : frame.HP,
          this.relative ? frame.Comparator.Evasion : frame.Evasion,
          this.relative ? frame.Comparator.EDefense : frame.EDefense,
          this.relative ? frame.Comparator.HeatCap : frame.HeatCap,
          this.relative ? frame.Comparator.SensorRange : frame.SensorRange,
          this.relative ? frame.Comparator.TechAttack : frame.TechAttack,
          this.relative ? frame.Comparator.RepCap : frame.RepCap,
          this.relative ? frame.Comparator.SaveTarget : frame.SaveTarget,
          this.relative ? frame.Comparator.Speed : frame.Speed,
          this.relative ? frame.Comparator.SP : frame.SP,
        ],
      };
    },
  },
};
</script>
