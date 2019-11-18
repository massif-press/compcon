<template>
  <v-container fluid>
    <compendium-table :headers="headers" :items="frames">Frames</compendium-table>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import CompendiumTable from '../UI/CompendiumTable.vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'
import { MechType } from '@/class'

export default Vue.extend({
  name: 'frames',
  components: { CompendiumTable },
  data: () => ({
    headers: [
      { text: 'Source', align: 'left', value: 'Source' },
      { text: 'Frame', align: 'left', value: 'Name' },
      { text: 'Size', align: 'left', value: 'Size' },
      { text: 'Armor', align: 'left', value: 'Armor' },
      { text: 'HP', align: 'left', value: 'HP' },
      { text: 'Evasion', align: 'left', value: 'Evasion' },
      { text: 'EDef', align: 'left', value: 'EDefense' },
      { text: 'HeatCap', align: 'left', value: 'HeatCap' },
      { text: 'RepCap', align: 'left', value: 'RepCap' },
      { text: 'Sensors', align: 'left', value: 'SensorRange' },
      { text: 'TechAtk', align: 'left', value: 'TechAttack' },
      { text: 'Save', align: 'left', value: 'SaveTarget' },
      { text: 'Speed', align: 'left', value: 'Speed' },
      { text: 'SP', align: 'left', value: 'SP' },
    ],
    frames: [],
    frameTypes: [],
  }),
  created() {
    const compendium = getModule(CompendiumStore, this.$store)
    this.frames = compendium.Frames
    this.frameTypes = Object.keys(MechType).sort() as MechType[]
  },
})
</script>
