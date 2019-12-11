<template>
  <v-container fluid>
    <h1 class="heading">PILOT EQUIPMENT</h1>
    <v-tabs
      vertical
      background-color="primary"
      :slider-size="12"
      slider-color="active"
      style="min-height: 80vh"
    >
      <v-tab ripple>ARMOR</v-tab>
      <v-tab ripple>WEAPONS</v-tab>
      <v-tab ripple>GEAR</v-tab>
      <v-tab-item transition="slide-y-transition" reverse-transition="slide-y-reverse-transition">
        <compendium-table no-filter :headers="armor_headers" :items="armor" />
      </v-tab-item>
      <v-tab-item transition="slide-y-transition" reverse-transition="slide-y-reverse-transition">
        <compendium-table no-filter :headers="weapon_headers" :items="weapons" />
      </v-tab-item>
      <v-tab-item transition="slide-y-transition" reverse-transition="slide-y-reverse-transition">
        <compendium-table no-filter :headers="gear_headers" :items="gear" />
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import CompendiumTable from '../UI/CompendiumTable.vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'
import { CompendiumItem, ItemType } from '@/class'

export default Vue.extend({
  name: 'pilot-gear',
  components: { CompendiumTable },
  data: () => ({
    armor: [],
    weapons: [],
    gear: [],
    armor_headers: [
      { text: 'Item', align: 'left', value: 'Name' },
      { text: 'Armor', align: 'center', value: 'Armor' },
      { text: 'HP Bonus', align: 'center', value: 'HPBonus' },
      { text: 'E-Defense', align: 'center', value: 'EDefense' },
      { text: 'Evasion', align: 'center', value: 'Evasion' },
      { text: 'Speed', align: 'center', value: 'Speed' },
    ],
    weapon_headers: [
      { text: 'Item', align: 'left', value: 'Name' },
      { text: 'Range', align: 'left', value: 'Range' },
      { text: 'Damage', align: 'left', value: 'Damage' },
    ],
    gear_headers: [
      { text: 'Item', align: 'left', value: 'Name' },
      { text: 'Uses', align: 'center', value: 'Uses' },
    ],
  }),
  created() {
    const compendium = getModule(CompendiumStore, this.$store)
    this.armor = compendium.PilotGear.filter(
      (x: CompendiumItem) => x.ItemType === ItemType.PilotArmor
    )
    this.weapons = compendium.PilotGear.filter(
      (x: CompendiumItem) => x.ItemType === ItemType.PilotWeapon
    )
    this.gear = compendium.PilotGear.filter(
      (x: CompendiumItem) => x.ItemType === ItemType.PilotGear
    )
  },
})
</script>
