<template>
  <new-compendium-browser
    :items="systems"
    item-type="MechSystem"
    :table-headers="headers"
    :options="options"
  >
    <template #header>
      <div class="heading h3 text-center text-primary">Mech Systems</div></template
    >
  </new-compendium-browser>
</template>

<script lang="ts">
import _ from 'lodash';
import NewCompendiumBrowser from '../../components/NewCompendiumBrowser.vue';

import { CompendiumStore, UserStore } from '@/stores';
import { MechEquipment } from '@/class';

export default {
  name: 'Systems',
  components: { NewCompendiumBrowser },
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
