<template>
  <v-container fluid>
    <compendium-browser :headers="headers" :items="frames">Frames</compendium-browser>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import _ from 'lodash'
import Component from 'vue-class-component'
import CompendiumBrowser from '../components/CompendiumBrowser.vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore, UserStore } from '@/store'
import { MechType, Frame } from '@/class'

@Component({
  components: { CompendiumBrowser },
})
export default class Frames extends Vue {
  public headers = [
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
  ]

  private compendium = getModule(CompendiumStore, this.$store)
  private user = getModule(UserStore, this.$store).UserProfile
  private sourceIds = this.compendium.Manufacturers.map(x => x.ID)

  public get frames(): Frame[] {
    let arr = this.compendium.Frames.filter(x => !x.IsHidden)
    if (!this.user.GetView('showExotics')) arr = arr.filter(x => !x.IsExotic)
    return _.sortBy(arr, [
      item => this.sourceIds.indexOf(item.Source), 
      'Name'
    ])
  }

  public frameTypes = Object.keys(MechType).sort() as MechType[]
}
</script>
