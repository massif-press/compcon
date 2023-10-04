<template>
  <v-row align="center">
    <v-col cols="6">
      <Radar :data="chartData" :options="chartOptions" style="max-height: 600px" />
      <div class="px-4 mt-2">
        <v-row align="center" justify="space-around">
          <v-col cols="auto">
            <v-row align="center" class="text-overline" dense>
              <v-col cols="auto">
                Absolute
                <cc-tooltip inline content="Chart raw stat values ">
                  <v-icon size="small" variant="plain">mdi-information-outline</v-icon>
                </cc-tooltip></v-col
              >
              <v-col cols="auto">
                <v-switch v-model="relative" density="compact" hide-details />
              </v-col>
              <v-col cols="auto">
                Relative
                <cc-tooltip
                  inline
                  content="Chart stat values relative to all other frames in the Compendium"
                >
                  <v-icon size="small" variant="plain">mdi-information-outline</v-icon>
                </cc-tooltip>
              </v-col>
            </v-row>
            <!-- <v-row align="center" class="text-overline mt-n5" dense>
              <v-col cols="auto">
                Standard
                <cc-tooltip inline content="Chart standard Frame stats">
                  <v-icon size="small" variant="plain"
                    >mdi-information-outline</v-icon
                  >
                </cc-tooltip></v-col
              >
              <v-col cols="auto">
                <v-switch v-model="aggregate" density="compact" hide-details />
              </v-col>
              <v-col cols="auto">
                Aggregated*

                <cc-tooltip
                  inline
                  title="Experimental Feature"
                  content="Selecting this option aggregates Frame stats into aptitude ratings for Survivability, Mobility, Offense, and Utility. This is an experimental feature and may not be accurate, but is actively being developed into a more useful indicator of Frame capability."
                >
                  <v-icon size="small" color="warning" variant="plain"
                    >mdi-alert</v-icon
                  >
                </cc-tooltip>
              </v-col>
            </v-row> -->
          </v-col>
          <v-col>
            <v-autocomplete
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
    colors: [] as string[],
  }),
  mounted() {
    this.colors = Array.from(
      { length: this.frames.length },
      () => '#' + Math.floor(Math.random() * 16777215).toString(16)
    );
  },
  computed: {
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
          : this.$vuetify.theme.current.colors.primary + '33',
        borderColor: compare
          ? this.colors[idx as number] + 'CC'
          : this.$vuetify.theme.current.colors.primary + 'B7',
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
