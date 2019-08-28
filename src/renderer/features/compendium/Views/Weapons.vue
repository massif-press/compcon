<template>
  <v-container fluid>
    <h1 class="heading">MECH WEAPONS</h1>
    <compendium-table :headers="headers" :items="weapons" />
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import CompendiumTable from '../UI/CompendiumTable.vue'
import { MechWeapon } from '@/class'

export default Vue.extend({
  name: 'weapons',
  components: { CompendiumTable },
  data: () => ({
    headers: [
      { text: 'Source', align: 'left', value: 'Source' },
      { text: 'Weapon', align: 'left', value: 'Name' },
      { text: 'License', align: 'left', value: 'LicenseString' },
      { text: 'Size', align: 'left', value: 'Size' },
      { text: 'Type', align: 'left', value: 'Type' },
      { text: 'Range', align: 'left', value: 'Range' },
      { text: 'Damage', align: 'left', value: 'Damage' },
    ],
    weapons: [],
  }),
  created() {
    this.weapons = this.$store.getters
      .getItemCollection('MechWeapons')
      .filter((x: MechWeapon) => x.Source) as MechWeapon[]
  },
})
</script>
