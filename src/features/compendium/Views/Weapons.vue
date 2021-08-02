<template>
  <v-container fluid>
    <compendium-browser :headers="headers" :items="weapons">Mech Weapons</compendium-browser>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import _ from 'lodash'
import Component from 'vue-class-component'
import CompendiumBrowser from '../components/CompendiumBrowser.vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore, UserStore } from '@/store'
import { MechWeapon } from '../../../classes/mech/MechWeapon'

@Component({
  components: { CompendiumBrowser },
})
export default class Weapons extends Vue {
  public headers = [
    { text: 'Source', align: 'left', value: 'Source' },
    { text: 'Weapon', align: 'left', value: 'Name' },
    { text: 'License', align: 'left', value: 'LicenseString' },
    { text: 'Size', align: 'left', value: 'SizeInt' },
    { text: 'Type', align: 'left', value: 'WeaponType' },
    { text: 'Range', align: 'left', value: 'Range[0].Max' },
    { text: 'Damage', align: 'left', value: 'Damage[0].Max' },
  ]

  private compendium = getModule(CompendiumStore, this.$store)
  private user = getModule(UserStore, this.$store).UserProfile
  private sourceIds = this.compendium.Manufacturers.map(x => x.ID)

  public get weapons(): MechWeapon[] {
    let arr = this.compendium.MechWeapons.filter(x => !x.IsHidden && !(!x.Source && !x.IsExotic))
    if (!this.user.GetView('showExotics')) {
      arr = arr.filter(x => !x.IsExotic)
    }

    return _.orderBy(arr, [
      item => this.sourceIds.indexOf(item.Source), 
      'Name'
    ])
  }
}
</script>
