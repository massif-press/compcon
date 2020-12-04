<template>
  <v-container fluid>
    <h1 v-resize-text="{ maxFontSize: '36pt' }" class="heading">PILOT EQUIPMENT</h1>
    <v-tabs
      :vertical="$vuetify.breakpoint.mdAndUp"
      background-color="primary"
      :slider-size="12"
      slider-color="active"
      style="min-height: 80vh"
    >
      <v-tab ripple>ARMOR</v-tab>
      <v-tab ripple>WEAPONS</v-tab>
      <v-tab ripple>GEAR</v-tab>
      <v-tab-item class="ml-4">
        <compendium-browser no-filter :headers="armor_headers" :items="armor" />
      </v-tab-item>
      <v-tab-item class="ml-4">
        <compendium-browser no-filter :headers="weapon_headers" :items="weapons" />
      </v-tab-item>
      <v-tab-item class="ml-4">
        <compendium-browser no-filter :headers="gear_headers" :items="gear" />
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import CompendiumBrowser from '../components/CompendiumBrowser.vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'
import { ItemType, PilotArmor, PilotGear } from '@/class'
import { PilotWeapon } from '@/classes/pilot/PilotWeapon'

@Component({
  components: { CompendiumBrowser },
})
export default class PilotGearBrowser extends Vue {
  public armor_headers = [
    { text: 'Item', align: 'left', value: 'Name' },
    { text: 'Armor', align: 'center', value: 'Armor' },
    { text: 'HP Bonus', align: 'center', value: 'HPBonus' },
    { text: 'E-Defense', align: 'center', value: 'EDefense' },
    { text: 'Evasion', align: 'center', value: 'Evasion' },
    { text: 'Speed', align: 'center', value: 'Speed' },
  ]
  public weapon_headers = [
    { text: 'Item', align: 'left', value: 'Name' },
    { text: 'Range', align: 'left', value: 'Range[0].Max' },
    { text: 'Damage', align: 'left', value: 'Damage[0].Max' },
  ]
  public gear_headers = [
    { text: 'Item', align: 'left', value: 'Name' },
    { text: 'Uses', align: 'center', value: 'MaxUses' },
  ]

  // typing on these is wrong... look into fixing it
  private compendium = getModule(CompendiumStore, this.$store)
  get armor(): PilotArmor[] {
    return this.compendium.PilotGear.filter(x => {
      return x.ItemType === ItemType.PilotArmor
    }) as PilotArmor[]
  }
  get weapons(): PilotWeapon[] {
    return this.compendium.PilotGear.filter(
      x => x.ItemType === ItemType.PilotWeapon
    ) as PilotWeapon[]
  }
  get gear(): PilotGear[] {
    return this.compendium.PilotGear.filter(x => x.ItemType === ItemType.PilotGear) as PilotGear[]
  }
}
</script>
