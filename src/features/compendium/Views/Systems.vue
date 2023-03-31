<template>
  <v-container fluid>
    <compendium-browser :headers="headers" :items="systems"
      >Mech Systems</compendium-browser
    >
  </v-container>
</template>

<script lang="ts">
import _ from 'lodash';
import CompendiumBrowser from '../components/CompendiumBrowser.vue';

import { CompendiumStore, UserStore } from '@/stores';
import { MechEquipment } from '@/class';

export default {
  name: 'Systems',
  components: { CompendiumBrowser },
  data: () => ({
    headers: [
      { text: 'Source', align: 'left', value: 'Source' },
      { text: 'System', align: 'left', value: 'Name' },
      { text: 'License', align: 'left', value: 'LicenseString' },
      { text: 'License Level', align: 'left', value: 'LicenseLevel' },
      { text: 'SP Cost', align: 'left', value: 'SP' },
    ],
  }),
  computed: {
    compendium(): CompendiumStore {
      return CompendiumStore();
    },
    user(): UserStore {
      return UserStore().UserProfile;
    },
    sourceIds(): string[] {
      return this.compendium.Manufacturers.map((x) => x.ID);
    },
    systems(): MechEquipment[] {
      let sys = this.compendium.MechSystems.filter(
        (x) => !x.IsHidden && !(!x.Source && !x.IsExotic)
      );
      let mod = this.compendium.WeaponMods.filter(
        (x) => !x.IsHidden && !(!x.Source && !x.IsExotic)
      );
      if (!this.user.GetView('showExotics')) {
        sys = sys.filter((x) => !x.IsExotic);
        mod = mod.filter((x) => !x.IsExotic);
      }

      return _.orderBy(sys.concat(mod), [
        (item) => this.sourceIds.indexOf(item.Source),
        'Name',
      ]);
    },
  },
};
</script>
