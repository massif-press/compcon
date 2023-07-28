<template>
  <simple-compendium-browser :items="statuses" item-type="Skill" title="Statuses & Conditions" />
</template>

<script lang="ts">
import { CompendiumStore } from '@/stores';
import SimpleCompendiumBrowser from '../../components/SimpleCompendiumBrowser.vue';

export default {
  name: 'statuses',
  components: { SimpleCompendiumBrowser },
  computed: {
    statuses(): Status[] {
      return CompendiumStore().Statuses;
    },
  },
};
</script>
