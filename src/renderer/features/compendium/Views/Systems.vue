<template>
  <v-container fluid>
    <h1 class="heading">MECH SYSTEMS</h1>
    <compendium-table :headers="headers" :items="systems" />
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import CompendiumTable from '../UI/CompendiumTable.vue'
import { SystemCard } from '@/features/pilot_management/components/UI'
import { WeaponMod, MechSystem, MechEquipment } from '@/class'
import FilterPanel from '@/features/_shared/UI/FilterPanel.vue'
import ItemFilter from '@/features/_shared/utility/ItemFilter'
import { includesIgnoringAccentsCase } from '@/features/_shared/utility/accent_fold';

export default Vue.extend({
  name: 'systems',
  components: { CompendiumTable, SystemCard, FilterPanel },
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
  },
})
</script>
