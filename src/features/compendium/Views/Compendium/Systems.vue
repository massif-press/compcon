<template>
  <cc-compendium-browser
    :items="systems"
    item-type="MechSystem"
    :table-headers="headers"
    :options="options"
  >
    <template #header> <div class="heading h3 text-center text-accent">Mech Systems</div></template>
  </cc-compendium-browser>
</template>

<script lang="ts">
import _ from 'lodash';

import { CompendiumStore, UserStore } from '@/stores';
import { MechEquipment } from '@/class';

export default {
  name: 'Systems',

  data: () => ({
    options: {
      views: ['single', 'table', 'cards'],
      initialView: 'single',
      groups: ['source', 'lcp', 'license'],
      initialGroup: 'license',
    },
    headers: [
      { title: 'Source', align: 'left', key: 'Source' },
      { title: 'System', align: 'left', key: 'Name' },
      { title: 'License', align: 'left', key: 'License' },
      { title: 'License Level', align: 'left', key: 'LicenseLevel' },
      { title: 'SP Cost', align: 'left', key: 'SP' },
    ],
  }),
  computed: {
    systems(): MechEquipment[] {
      return [...CompendiumStore().MechSystems, ...CompendiumStore().WeaponMods].filter(
        (x) => !x.IsHidden
      );
    },
  },
};
</script>
