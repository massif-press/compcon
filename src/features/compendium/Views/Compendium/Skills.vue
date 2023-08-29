<template>
  <cc-compendium-browser
    :items="skills"
    item-type="Skill"
    :table-headers="headers"
    :options="options"
  >
    <template #header>
      <div class="heading h3 text-center text-primary">Pilot Skill Triggers</div></template
    >
  </cc-compendium-browser>
</template>

<script lang="ts">
import { Skill } from '@/class';

import { CompendiumStore } from '@/stores';

export default {
  name: 'skills',

  data: () => ({
    headers: [
      { title: 'Content Pack', key: 'LcpName' },
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
