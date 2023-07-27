<template>
  <!-- <compendium-browser :headers="headers" :items="systems" title="Mech Systems" /> -->
  <compendium-browser-new
    :items="systems"
    :hidden-items="[]"
    item-type="MechSystem"
    :table-headers="headers"
    initial-group="license"
    initial-view="list"
  />
</template>

<script lang="ts">
import _ from 'lodash';
import CompendiumBrowserNew from '../../components/CompendiumBrowserNew.vue';

import { CompendiumStore, UserStore } from '@/stores';
import { MechEquipment } from '@/class';

export default {
  name: 'Systems',
  components: { CompendiumBrowserNew },
  data: () => ({
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
