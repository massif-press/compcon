<template>
  <v-container fluid>
    <compendium-browser :headers="headers" :items="systems">Mech Systems</compendium-browser>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import CompendiumBrowser from '../components/CompendiumBrowser.vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'
import { MechEquipment } from '@/class'

@Component({
  components: { CompendiumBrowser },
})
export default class Weapons extends Vue {
  public headers = [
    { text: 'Source', align: 'left', value: 'Source' },
    { text: 'System', align: 'left', value: 'Name' },
    { text: 'License', align: 'left', value: 'LicenseString' },
    { text: 'SP Cost', align: 'left', value: 'SP' },
  ]

  private compendium = getModule(CompendiumStore, this.$store)
  public get systems(): MechEquipment[] {
    return (this.compendium.MechSystems as MechEquipment[])
      .filter(x => x.Source)
      .concat(this.compendium.WeaponMods as MechEquipment[])
  }
}
</script>
