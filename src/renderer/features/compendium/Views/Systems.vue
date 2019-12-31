<template>
  <v-container fluid>
    <compendium-table :headers="headers" :items="systems">Mech Systems</compendium-table>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import CompendiumTable from '../UI/CompendiumTable.vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'
import { MechSystem } from '@/class'

@Component({
  components: { CompendiumTable }
})
export default class Weapons extends Vue {

  public headers = [
    { text: 'Source', align: 'left', value: 'Source' },
    { text: 'System', align: 'left', value: 'Name' },
    { text: 'License', align: 'left', value: 'LicenseString' },
    { text: 'SP Cost', align: 'left', value: 'SP' },
  ]

  private compendium = getModule(CompendiumStore, this.$store)
  public get systems(): MechSystem[] {
    return this.compendium.MechSystems.filter(x => x.Source)
  }

}
</script>
