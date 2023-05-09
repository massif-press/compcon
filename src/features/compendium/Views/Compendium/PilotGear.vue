<template>
  <v-container fluid>
    <v-row class="mt-1 mb-n10">
      <v-col cols="auto">
        <h1 class="heading">PILOT EQUIPMENT</h1>
      </v-col>
      <v-col cols="auto">
        <v-tabs v-model="tab" background-color="primary" slider-color="active">
          <v-tab>ARMOR</v-tab>
          <v-tab>WEAPONS</v-tab>
          <v-tab>GEAR</v-tab>
        </v-tabs>
      </v-col>
    </v-row>

    <v-window v-model="tab" style="height: 90vh; y-overflow: auto">
      <v-window-item :class="$vuetify.display.mdAndUp ? 'ml-4' : ''">
        <compendium-browser no-filter :headers="armor_headers" :items="armor" />
      </v-window-item>
      <v-window-item :class="$vuetify.display.mdAndUp ? 'ml-4' : ''">
        <compendium-browser no-filter :headers="weapon_headers" :items="weapons" />
      </v-window-item>
      <v-window-item :class="$vuetify.display.mdAndUp ? 'ml-4' : ''">
        <compendium-browser no-filter :headers="gear_headers" :items="gear" />
      </v-window-item>
    </v-window>
  </v-container>
</template>

<script lang="ts">
import CompendiumBrowser from '../../components/CompendiumBrowser.vue';

import { CompendiumStore, UserStore } from '@/stores';
import { ItemType, PilotArmor, PilotGear } from '@/class';
import { PilotWeapon } from '@/class';

export default {
  name: 'PilotGear',
  components: { CompendiumBrowser },
  data: () => ({
    tab: 0,
    armor_headers: [
      { title: 'Item', align: 'left', value: 'Name' },
      { title: 'Armor', align: 'center', value: 'Armor' },
      { title: 'HP Bonus', align: 'center', value: 'HPBonus' },
      { title: 'E-Defense', align: 'center', value: 'EDefense' },
      { title: 'Evasion', align: 'center', value: 'Evasion' },
      { title: 'Speed', align: 'center', value: 'Speed' },
    ],
    weapon_headers: [
      { title: 'Item', align: 'left', value: 'Name' },
      { title: 'Range', align: 'left', value: 'Range[0].Max' },
      { title: 'Damage', align: 'left', value: 'Damage[0].Max' },
    ],
    gear_headers: [
      { title: 'Item', align: 'left', value: 'Name' },
      { title: 'Uses', align: 'center', value: 'MaxUses' },
    ],
  }),
  computed: {
    armor(): PilotArmor[] {
      return CompendiumStore().PilotGear.filter(
        (x: any) => x.ItemType === ItemType.PilotArmor
      ) as PilotArmor[];
    },
    weapons(): PilotWeapon[] {
      return CompendiumStore().PilotGear.filter(
        (x: any) => x.ItemType === ItemType.PilotWeapon
      ) as PilotWeapon[];
    },
    gear(): PilotGear[] {
      return CompendiumStore().PilotGear.filter(
        (x: any) => x.ItemType === ItemType.PilotGear
      ) as PilotGear[];
    },
  },
};
</script>
