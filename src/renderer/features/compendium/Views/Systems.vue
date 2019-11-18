<template>
  <v-container fluid>
    <compendium-table :headers="headers" :items="systems">Mech Systems</compendium-table>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import CompendiumTable from '../UI/CompendiumTable.vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'

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
    const compendium = getModule(CompendiumStore, this.$store)
    this.systems = compendium.MechSystems.filter(x => x.Source)
  },
})
</script>
