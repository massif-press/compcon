<template>
  <compendium-browser
    :headers="headers"
    :items="systems"
    title="Mech Systems"
  />
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
      { title: 'Source', align: 'left', value: 'Source' },
      { title: 'System', align: 'left', value: 'Name' },
      { title: 'License', align: 'left', value: 'License' },
      { title: 'License Level', align: 'left', value: 'LicenseLevel' },
      { title: 'SP Cost', align: 'left', value: 'SP' },
    ],
  }),
  computed: {
    systems(): MechEquipment[] {
      return [
        ...CompendiumStore().MechSystems,
        ...CompendiumStore().WeaponMods,
      ];
    },
  },
};
</script>
