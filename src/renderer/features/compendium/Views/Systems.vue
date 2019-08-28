<template>
  <v-container fluid>
    <h1 class="heading">MECH SYSTEMS</h1>
    <compendium-table :headers="headers" :items="systems" />
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import CompendiumTable from '../UI/CompendiumTable.vue'
import {MechSystem} from '@/class'

export default Vue.extend({
  name: 'systems',
  components: { CompendiumTable },
  data: () => ({
    search: null,
    detailFilter: {},
    headers: [
      { text: 'Source', align: 'left', value: 'Source' },
      { text: 'System', align: 'left', value: 'Name' },
      { text: 'License', align: 'left', value: 'LicenseString' },
      { text: 'SP Cost', align: 'left', value: 'SP' },
    ],
    systems: [],
  }),
  created() {
    this.systems = this.$store.getters
      .getItemCollection('MechSystems')
      .filter((x: MechSystem) => x.Source) as MechSystem[]
  },
})
</script>
