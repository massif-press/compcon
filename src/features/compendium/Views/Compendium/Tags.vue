<template>
  <compendium-browser :items="tags" item-type="Tag" :table-headers="headers" :options="options">
    <template #header>
      <div class="heading h3 text-center text-primary">Equipment Tags</div></template
    >
  </compendium-browser>
</template>

<script lang="ts">
import _ from 'lodash';
import CompendiumBrowser from '../../components/CompendiumBrowser.vue';

import { CompendiumStore } from '@/stores';

export default {
  name: 'Tags',
  components: { CompendiumBrowser },
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
