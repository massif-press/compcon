<template>
  <v-container fluid>
    <h1 class="heading">MECH WEAPONS</h1>
    <compendium-table :headers="headers" :items="weapons" />
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import CompendiumTable from '../UI/CompendiumTable.vue'
import { RangeElement, DamageElement, WeaponCard } from '@/features/pilot_management/components/UI'
import FilterPanel from '@/features/_shared/UI/FilterPanel.vue'
import ItemFilter from '@/features/_shared/utility/ItemFilter'
import { includesIgnoringAccentsCase } from '@/features/_shared/utility/accent_fold';
import { MechWeapon } from '@/class'

export default Vue.extend({
  name: 'weapons',
  components: { CompendiumTable, WeaponCard, RangeElement, DamageElement, FilterPanel },
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
