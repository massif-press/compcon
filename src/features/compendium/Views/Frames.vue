<template>
  <v-container fluid>
    <compendium-browser :headers="headers" :items="frames"
      >Frames</compendium-browser
    >
  </v-container>
</template>

<script lang="ts">
import _ from 'lodash';
import CompendiumBrowser from '../components/CompendiumBrowser.vue';

import { CompendiumStore, UserStore } from '@/stores';
import { MechType, Frame } from '@/class';

export default {
  name: 'Frames',
  components: { CompendiumBrowser },
  data: () => ({
    headers: [
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
    ],
  }),
  computed: {
    compendium() {
      return CompendiumStore();
    },
    user() {
      return UserStore().UserProfile;
    },
    sourceIds() {
      return this.compendium.Manufacturers.map((x) => x.ID);
    },
    frames() {
      let arr = this.compendium.Frames.filter((x) => !x.IsHidden);
      // TODO: re-enable exotics

      // if (!this.user.GetView('showExotics'))
      //   arr = arr.filter((x) => !x.IsExotic);
      return _.sortBy(arr, [
        (item) => this.sourceIds.indexOf(item.Source),
        'Name',
      ]);
    },
    frameTypes() {
      return Object.keys(MechType).sort() as MechType[];
    },
  },
};
</script>
