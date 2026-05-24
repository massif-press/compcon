<template>
  <cc-compendium-browser :items="sitreps"
    item-type="Sitrep"
    :table-headers="headers"
    :options="options"
    view-key="cb-sitreps">
    <template #header>
      <div class="heading h3 text-center text-accent">Sitreps</div>
    </template>
  </cc-compendium-browser>
</template>

<script lang="ts">
import { orderBy } from 'lodash-es';
import { CompendiumStore } from '@/stores';

export default {
  name: 'Sitreps',

  data: () => ({
    headers: [
      { title: 'Content Pack', key: 'LcpName' },
      { title: 'Name', key: 'Name' },
    ],
    options: {
      views: ['list', 'table'],
      initialView: 'list',
      groups: ['lcp', 'none'],
      initialGroup: 'lcp',
      noSource: true,
    },
  }),
  computed: {
    sitreps() {
      return orderBy(CompendiumStore().Sitreps, 'Name');
    },
  },
};
</script>
