<template>
  <v-card variant="outlined" class="pa-2">
    <Bar :data="chartData" :options="chartOptions" style="max-height: 600px" />

    <div>
      <v-row align="center" justify="space-around">
        <v-col cols="auto">
          <v-row align="center" class="text-overline" dense>
            <v-col cols="auto">
              Absolute
              <cc-tooltip inline content="Chart raw stat values ">
                <v-icon size="small" class="fade-select">mdi-information-outline</v-icon>
              </cc-tooltip></v-col
            >
            <v-col cols="auto">
              <v-switch v-model="relative" density="compact" hide-details />
            </v-col>
            <v-col cols="auto">
              Relative
              <cc-tooltip
                inline
                content="Chart stat values relative to all other Mech Weapons in the Compendium"
              >
                <v-icon size="small" class="fade-select">mdi-information-outline</v-icon>
              </cc-tooltip>
            </v-col>
          </v-row>
        </v-col>
        <v-col>
          <v-autocomplete
            v-model="compareMechWeapons"
            :items="mechWeapons"
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
  </v-card>
</template>

<script lang="ts">
import { CompendiumStore } from '@/stores';
import { MechWeapon } from '@/class';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import { Bar } from 'vue-chartjs';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default {
  name: 'MechWeaponCombatChart',
  components: { Bar },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    relative: false,
    aggregate: false,
    compareMechWeapons: [] as MechWeapon[],
    labels: [
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
    ],
    colors: [] as string[],
  }),
  mounted() {
    this.colors = Array.from(
      { length: this.mechWeapons.length },
      () => '#' + Math.floor(Math.random() * 16777215).toString(16)
    );
  },
  computed: {
    usedLabels() {
      const allItems = [this.item, ...this.compareMechWeapons];
      return this.labels.filter((l) =>
        allItems.some((i) => i.StatsByProfile[0].Stats[l.value] > 0)
      );
    },
    chartData() {
      console.log(this.colors);
      const datasets = [
        {
          label: this.item.Name,
          data: this.usedLabels.map((x) => this.item.StatsByProfile[0].Stats[x.value]),
          backgroundColor: this.$vuetify.theme.current.colors.primary,
        },
        ...this.compareMechWeapons.map((x, i) => ({
          label: x.Name,
          data: this.usedLabels.map((y) => x.StatsByProfile[0].Stats[y.value]),
          backgroundColor: this.colors[i],
        })),
      ];

      return {
        labels: this.usedLabels.map((x) => x.title),
        datasets,
      };
    },
    mechWeapons() {
      return CompendiumStore().MechWeapons.filter(
        (x) => x.Name !== this.item.Name && !x.ID.startsWith('missing_')
      );
    },
    chartOptions() {
      return {
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
      };
    },
  },
};
</script>
