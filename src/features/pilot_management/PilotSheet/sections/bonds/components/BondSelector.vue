<template>
  <cc-compendium-browser
    :items="bonds"
    item-type="Bond"
    :options="options"
    equippable
    @equip="$emit('set', $event)"
  >
    <template #header> <div class="heading h3 text-center text-accent">Pilot Bonds</div></template>
  </cc-compendium-browser>
</template>

<script lang="ts">
import { CompendiumStore } from '@/stores';

export default {
  name: 'bond-selector',
  data: () => ({
    options: {
      views: ['single', 'table'],
      initialView: 'single',
      groups: ['lcp'],
      initialGroup: 'lcp',
      noSource: true,
      hideTitle: true,
    },
  }),
  computed: {
    bonds() {
      return CompendiumStore().Bonds;
    },
  },
};
</script>
