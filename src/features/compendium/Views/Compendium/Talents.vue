<template>
  <simple-compendium-browser :items="talents" item-type="Talent" title="Pilot Talents" />
</template>

<script lang="ts">
import { CompendiumStore } from '@/stores';
import { Talent } from '@/class';
import SimpleCompendiumBrowser from '../../components/SimpleCompendiumBrowser.vue';

export default {
  name: 'Talents',
  data: () => ({
    ctype: 'full',
  }),
  components: { SimpleCompendiumBrowser },
  computed: {
    talents(): Talent[] {
      return CompendiumStore().Talents.filter((x) => !x.IsHidden);
    },
  },
};
</script>
