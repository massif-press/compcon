<template>
  <Bar :data="chartData" :options="chartOptions" style="max-height: 600px" />
  <!-- <div>
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
        <v-row align="center" class="text-overline mt-n5" dense>
          <v-col cols="auto">
            Standard
            <cc-tooltip inline content="Chart standard MechWeapon stats">
              <v-icon size="small" class="fade-select">mdi-information-outline</v-icon>
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
              content="Selecting this option aggregates Mech Weapon stats into aptitude ratings for Survivability, Mobility, Offense, and Utility. This is an experimental feature and may not be accurate, but is actively being developed into a more useful indicator of MechWeapon capability."
            >
              <v-icon size="small" color="warning" class="fade-select">mdi-alert</v-icon>
            </cc-tooltip>
          </v-col>
        </v-row>
      </v-col>
      <v-col>
        <v-select
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
  </div> -->
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
    mechWeapon: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    relative: false,
    aggregate: false,
    compareMechWeapons: [] as MechWeapon[],
    chartData: {
      labels: ['January', 'February', 'March'],
      datasets: [{ data: [40, 20, 12] }],
    },
    standardLabels: [
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
    aggregateLabels: ['Survivability', 'Mobility', 'Offense', 'Utility'],
  }),
  computed: {
    labels() {
      return this.aggregate ? this.aggregateLabels : this.standardLabels;
    },
    mechWeapons() {
      return CompendiumStore().MechWeapons.filter(
        (x) => x.Name !== this.mechWeapon.Name && !x.ID.startsWith('missing_')
      );
    },
    chartOptions() {
      return {
        responsive: true,
        scales: {
          xAxes: [
            {
              ticks: {
                beginAtZero: true, // Start the X-axis at 0
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                autoSkip: false, // To display all Y-axis labels without skipping
              },
            },
          ],
        },
      };
    },
    // chartData() {
    //   return {
    //     labels: this.labels,
    //     datasets: this.compareMechWeapons.length
    //       ? [
    //           this.getDataset(this.mechWeapon),
    //           ...this.compareMechWeapons.map((x) => this.getDataset(x, true)),
    //         ]
    //       : [this.getDataset(this.mechWeapon)],
    //   };
    // },
  },
  // methods: {
  //   getColor() {
  //     const hexChars = '0123456789ABCDEF';
  //     let hex = '#';
  //     for (let i = 0; i < 6; i++) {
  //       hex += hexChars[Math.floor(Math.random() * 16)];
  //     }
  //     return hex;
  //   },
  //   getDataset(mechWeapon, compare?: boolean) {
  //     const dataset = {
  //       label: mechWeapon.Name,
  //       backgroundColor: compare ? this.getColor() + '1A' : '#673AB333',
  //       borderColor: compare ? this.getColor() + 'CC' : '#673AB7',
  //       data: [] as any[],
  //     };

  //     dataset.data = this.aggregate
  //       ? [
  //           this.relative ? mechWeapon.Comparator.Survivability : mechWeapon.SurvivabilityRaw,
  //           this.relative ? mechWeapon.Comparator.Mobility : mechWeapon.MobilityRaw,
  //           this.relative ? mechWeapon.Comparator.Offense : mechWeapon.OffenseRaw,
  //           this.relative ? mechWeapon.Comparator.Utility : mechWeapon.UtilityRaw,
  //         ]
  //       : [
  //           this.relative ? mechWeapon.Comparator.HP : mechWeapon.HP,
  //           this.relative ? mechWeapon.Comparator.Evasion : mechWeapon.Evasion,
  //           this.relative ? mechWeapon.Comparator.EDefense : mechWeapon.EDefense,
  //           this.relative ? mechWeapon.Comparator.HeatCap : mechWeapon.HeatCap,
  //           this.relative ? mechWeapon.Comparator.SensorRange : mechWeapon.SensorRange,
  //           this.relative ? mechWeapon.Comparator.TechAttack : mechWeapon.TechAttack,
  //           this.relative ? mechWeapon.Comparator.RepCap : mechWeapon.RepCap,
  //           this.relative ? mechWeapon.Comparator.SaveTarget : mechWeapon.SaveTarget,
  //           this.relative ? mechWeapon.Comparator.Speed : mechWeapon.Speed,
  //           this.relative ? mechWeapon.Comparator.SP : mechWeapon.SP,
  //         ];

  //     return dataset;
  //   },
  // },
};
</script>
