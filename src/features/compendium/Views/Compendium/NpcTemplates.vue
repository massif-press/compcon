<template>
  <cc-compendium-browser
    :items="templates"
    :itemType="'NpcTemplate'"
    :table-headers="headers"
    :options="options">
    <template #header>
      <div class="heading h3 text-center text-accent">NPC Templates</div></template
    >
  </cc-compendium-browser>
</template>

<script lang="ts">
import _ from 'lodash';
import { CompendiumStore } from '@/stores';
import { NpcTemplate } from '@/classes/npc/template/NpcTemplate';

export default {
  name: 'NpcTemplates',

  data: () => ({
    headers: [
      { title: 'Content Pack', key: 'LcpName' },
      { title: 'Name', key: 'Name' },
    ],
    options: {
      views: ['single', 'table', 'list'],
      initialView: 'single',
      groups: ['lcp'],
      initialGroup: 'lcp',
      noSource: true,
    },
  }),
  computed: {
    templates(): NpcTemplate[] {
      return _.orderBy(CompendiumStore().NpcTemplates, 'Name');
    },
  },
};
</script>
