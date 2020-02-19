<template>
  <v-container fluid>
    <compendium-table :headers="headers" :items="features" no-filter>NPC Features</compendium-table>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import CompendiumTable from '../components/CompendiumTable.vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'
import { NpcFeature } from '@/class'

@Component({
  components: { CompendiumTable },
})
export default class Weapons extends Vue {
  public headers = [
    { text: 'Feature', align: 'left', value: 'Name' },
    { text: 'Type', align: 'left', value: 'FeatureType' },
    { text: 'Origin', align: 'left', value: 'Origin' },
  ]

  private compendium = getModule(CompendiumStore, this.$store)
  public get features(): NpcFeature[] {
    return this.compendium.NpcFeatures
  }
}
</script>
