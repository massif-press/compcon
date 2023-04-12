<template>
  <v-container fluid>
    <compendium-browser :headers="headers" :items="weapons"
      >Mech Weapons</compendium-browser
    >
  </v-container>
</template>

<script lang="ts">
import _ from 'lodash';
import CompendiumBrowser from '../components/CompendiumBrowser.vue';

import { CompendiumStore, UserStore } from '@/stores';
import { MechWeapon } from '../../../classes/mech/components/equipment/MechWeapon';

export default {
  name: 'Weapons',
  components: { CompendiumBrowser },
  data: () => ({
    headers: [
      { text: 'Source', align: 'left', value: 'Source' },
      { text: 'Weapon', align: 'left', value: 'Name' },
      { text: 'License', align: 'left', value: 'LicenseString' },
      { text: 'Size', align: 'left', value: 'SizeInt' },
      { text: 'Type', align: 'left', value: 'WeaponType' },
      { text: 'Range', align: 'left', value: 'Range[0].Max' },
      { text: 'Damage', align: 'left', value: 'Damage[0].Max' },
    ],
  }),
  computed: {
    compendium(): CompendiumStore {
      return CompendiumStore();
    },
    user(): UserStore {
      return UserStore();
    },
    sourceIds(): string[] {
      return this.compendium.Manufacturers.map((x) => x.ID);
    },
    weapons(): MechWeapon[] {
      let arr = this.compendium.MechWeapons.filter(
        (x) => !x.IsHidden && !(!x.Source && !x.IsExotic)
      );
      // if (!this.user.GetView('showExotics')) {
      //   arr = arr.filter((x) => !x.IsExotic);
      // }

      return _.orderBy(arr, [
        (item) => this.sourceIds.indexOf(item.Source),
        'Name',
      ]);
    },
  },
};
</script>
