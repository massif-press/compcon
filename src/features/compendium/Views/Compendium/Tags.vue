<template>
  <cc-compendium-browser :items="tags"
    item-type="Tag"
    :table-headers="headers"
    :options="options"
    view-key="cb-tags">
    <template #header>
      <div class="heading h3 text-center text-accent">Equipment Tags</div>
    </template>
  </cc-compendium-browser>
</template>

<script lang="ts">
import { sortBy } from 'lodash-es';

import { CompendiumStore } from '@/stores';

export default {
  name: 'Tags',

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
    tags() {
      return sortBy(
        CompendiumStore().Tags.filter((x) => !x.IsHidden),
        'Name'
      );
    },
  },
};
</script>
