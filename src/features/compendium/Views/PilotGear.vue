<template>
  <v-container fluid>
    <h1 class="heading">PILOT EQUIPMENT</h1>
    <v-tabs
      :vertical="$vuetify.display.mdAndUp"
      background-color="primary"
      :slider-size="12"
      slider-color="active"
      style="min-height: 80vh"
    >
      <v-tab ripple>ARMOR</v-tab>
      <v-tab ripple>WEAPONS</v-tab>
      <v-tab ripple>GEAR</v-tab>
      <v-tab-item :class="$vuetify.display.mdAndUp ? 'ml-4' : ''">
        <compendium-browser no-filter :headers="armor_headers" :items="armor" />
      </v-tab-item>
      <v-tab-item :class="$vuetify.display.mdAndUp ? 'ml-4' : ''">
        <compendium-browser
          no-filter
          :headers="weapon_headers"
          :items="weapons"
        />
      </v-tab-item>
      <v-tab-item :class="$vuetify.display.mdAndUp ? 'ml-4' : ''">
        <compendium-browser no-filter :headers="gear_headers" :items="gear" />
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>

<script lang="ts">
import CompendiumBrowser from '../components/CompendiumBrowser.vue';

import { CompendiumStore, UserStore } from '@/store';
import { ItemType, PilotArmor, PilotGear } from '@/class';
import { PilotWeapon } from '@/class';

export default {
  name: 'PilotGear',
  components: { CompendiumBrowser },
  data: () => ({
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
      { text: 'Range', align: 'left', value: 'Range[0].Max' },
      { text: 'Damage', align: 'left', value: 'Damage[0].Max' },
    ],
    gear_headers: [
      { text: 'Item', align: 'left', value: 'Name' },
      { text: 'Uses', align: 'center', value: 'MaxUses' },
    ],
  }),
  computed: {
    compendium(): CompendiumStore {
      return this.getModule(CompendiumStore);
    },
    user(): UserStore {
      return this.getModule(UserStore);
    },
    armor(): PilotArmor[] {
      let arr = this.compendium.PilotGear.filter(
        (x) => !x.IsHidden && x.ItemType === ItemType.PilotArmor
      );
      if (!this.user.GetView('showExotics'))
        arr = arr.filter((x) => !x.IsExotic);
      return arr as PilotArmor[];
    },
    weapons(): PilotWeapon[] {
      let arr = this.compendium.PilotGear.filter(
        (x) => !x.IsHidden && x.ItemType === ItemType.PilotWeapon
      );
      if (!this.user.GetView('showExotics'))
        arr = arr.filter((x) => !x.IsExotic);
      return arr as PilotWeapon[];
    },
    gear(): PilotGear[] {
      let arr = this.compendium.PilotGear.filter(
        (x) => !x.IsHidden && x.ItemType === ItemType.PilotGear
      );
      if (!this.user.GetView('showExotics'))
        arr = arr.filter((x) => !x.IsExotic);
      return arr as PilotGear[];
    },
  },
};
</script>
