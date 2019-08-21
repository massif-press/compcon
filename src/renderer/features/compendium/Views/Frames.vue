<template>
  <v-container fluid>
    <h1 class="heading">FRAMES</h1>
    <compendium-table :headers="headers" :items="frames" />
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import CompendiumTable from '../UI/CompendiumTable.vue'
import { MechType, Frame } from '@/class'

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
      { text: 'Save', align: 'left', value: 'Save' },
      { text: 'Speed', align: 'left', value: 'Speed' },
      { text: 'SP', align: 'left', value: 'SP' },
    ],
    frames: [],
    frameTypes: [],
  }),
  // computed: {
  //   frames() {
  //     var vm = this as any
  //     let i = vm.$store.getters.getItemCollection('Frames')

  //     if (vm.search)
  //       i = i.filter((x: Frame) => x.Name.toUpperCase().includes(vm.search.toUpperCase()))

  //     if (vm.filter.length) {
  //       i = i.filter((x: Frame) => x.Mechtype.some(y => vm.filter.includes(y)))
  //     }

  //     return i
  //   },
  // },
  created() {
    this.frames = this.$store.getters.getItemCollection('Frames')
    this.frameTypes = Object.keys(MechType).sort() as MechType[]
  },
})
</script>
