<template>
  <cc-compendium-browser :items="tags" item-type="Tag" :table-headers="headers" :options="options">
    <template #header>
      <div class="heading h3 text-center text-primary">Equipment Tags</div></template
    >
  </cc-compendium-browser>
</template>

<script lang="ts">
import _ from 'lodash';

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
      groups: ['lcp'],
      initialGroup: 'lcp',
      noSource: true,
    },
  }),
  computed: {
    tags() {
      return _.sortBy(
        CompendiumStore().Tags.filter((x) => !x.IsHidden),
        'Name'
      );
    },
  },
};
</script>
