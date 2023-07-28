<template>
  <simple-compendium-browser
    :items="backgrounds"
    item-type="Background"
    title="Pilot Backgrounds"
  />
</template>

<script lang="ts">
import { Background } from '@/class';
import SimpleCompendiumBrowser from '../../components/SimpleCompendiumBrowser.vue';

import { CompendiumStore } from '@/stores';

export default {
  name: 'backgrounds',
  components: { SimpleCompendiumBrowser },
  computed: {
    backgrounds(): Background[] {
      return CompendiumStore().Backgrounds;
    },
  },
};
</script>
