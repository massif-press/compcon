<template>
  <v-container fluid>
    <compendium-browser :headers="headers" :items="systems">Mech Systems</compendium-browser>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import _ from 'lodash'
import Component from 'vue-class-component'
import CompendiumBrowser from '../components/CompendiumBrowser.vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore, UserStore } from '@/store'
import { MechEquipment } from '@/class'

@Component({
  components: { CompendiumBrowser },
})
export default class Systems extends Vue {
  public headers = [
    { text: 'Source', align: 'left', value: 'Source' },
    { text: 'System', align: 'left', value: 'Name' },
    { text: 'License', align: 'left', value: 'LicenseString' },
    { text: 'License Level', align: 'left', value: 'LicenseLevel' },
    { text: 'SP Cost', align: 'left', value: 'SP' },
  ]

  private compendium = getModule(CompendiumStore, this.$store)
  private user = getModule(UserStore, this.$store).UserProfile
  private sourceIds = this.compendium.Manufacturers.map(x => x.ID)

  public get systems(): MechEquipment[] {
    let sys = this.compendium.MechSystems.filter(x => !x.IsHidden && !(!x.Source && !x.IsExotic))
    let mod = this.compendium.WeaponMods.filter(x => !x.IsHidden && !(!x.Source && !x.IsExotic))
    if (!this.user.GetView('showExotics')) {
      sys = sys.filter(x => !x.IsExotic)
      mod = mod.filter(x => !x.IsExotic)
    }

    return _.orderBy((sys as MechEquipment[]).concat(mod as MechEquipment[]), [
      item => this.sourceIds.indexOf(item.Source), 
      'Name'
    ])
  }
}
</script>
