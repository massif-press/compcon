<template>
  <compendium-browser
    :items="gear"
    item-type="PilotGear"
    :multi-headers="headers"
    :options="options"
  >
    <template #header> <div class="heading h3 text-center text-primary">Pilot Gear</div></template>
  </compendium-browser>
</template>

<script lang="ts">
import CompendiumBrowser from '../../components/CompendiumBrowser.vue';

import { CompendiumStore } from '@/stores';

export default {
  name: 'PilotGear',
  components: { CompendiumBrowser },
  data: () => ({
    headers: {
      PilotArmor: [
        { title: 'Content Pack', key: 'LcpName' },
        { title: 'Type', key: 'Type' },
        { title: 'Item', key: 'Name' },
        { title: 'Armor', key: 'ArmorString' },
        { title: 'HP Bonus', key: 'HpString' },
        { title: 'E-Defense', key: 'EdefString' },
        { title: 'Evasion', key: 'EvasionString' },
        { title: 'Speed', key: 'SpeedString' },
      ],
      PilotWeapon: [
        { title: 'Content Pack', key: 'LcpName' },
        { title: 'Type', key: 'Type' },
        { title: 'Item', key: 'Name' },
        { title: 'Range', key: 'Range' },
        { title: 'Damage', key: 'Damage' },
      ],
      PilotGear: [
        { title: 'Content Pack', key: 'LcpName' },
        { title: 'Type', key: 'Type' },
        { title: 'Item', key: 'Name' },
        { title: 'Uses', key: 'MaxUses' },
      ],
    },
    options: {
      views: ['list', 'table'],
      initialView: 'list',
      groups: ['lcp', 'type'],
      initialGroup: 'type',
      noSource: true,
    },
  }),
  computed: {
    gear(): any[] {
      return CompendiumStore().PilotGear.filter((x: any) => !x.IsHidden);
    },
  },
};
</script>
