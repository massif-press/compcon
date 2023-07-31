<template>
  <new-compendium-browser
    :items="skills"
    item-type="Skill"
    :table-headers="headers"
    :options="options"
  >
    <template #header>
      <div class="heading h3 text-center text-primary">Pilot Skill Triggers</div></template
    >
  </new-compendium-browser>
</template>

<script lang="ts">
import { Skill } from '@/class';
import NewCompendiumBrowser from '../../components/NewCompendiumBrowser.vue';

import { CompendiumStore } from '@/stores';

export default {
  name: 'skills',
  components: { NewCompendiumBrowser },
  data: () => ({
    headers: [
      { title: 'Source', key: 'Source' },
      { title: 'Name', key: 'Name' },
    ],
    options: {
      views: ['list', 'table'],
      initialView: 'list',
      groups: ['lcp'],
      initialGroup: 'lcp',
      noSource: true,
    },
  }),
  computed: {
    skills(): Skill[] {
      return CompendiumStore().Skills;
    },
  },
};
</script>
