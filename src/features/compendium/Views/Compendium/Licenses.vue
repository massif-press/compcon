<template>
  <compendium-browser
    :items="licenses"
    item-type="License"
    :table-headers="headers"
    :options="options"
  >
    <template #header> <div class="heading h3 text-center text-primary">Licenses</div></template>
  </compendium-browser>
</template>

<script lang="ts">
import _ from 'lodash';
import { CompendiumStore } from '@/stores';
import CompendiumBrowser from '../../components/CompendiumBrowser.vue';

export default {
  name: 'licenses',
  components: { CompendiumBrowser },
  data: () => ({
    headers: [
      { title: 'Source', key: 'Source' },
      { title: 'Name', key: 'Name' },
      { title: 'Tier I', key: 'T1', sortable: false },
      { title: 'Tier II', key: 'T2', sortable: false },
      { title: 'Tier III', key: 'T3', sortable: false },
    ],
    options: {
      views: ['list', 'table'],
      initialView: 'list',
      groups: ['source', 'lcp'],
      initialGroup: 'source',
      noSource: true,
    },
  }),
  computed: {
    licenses() {
      return CompendiumStore().Licenses.filter((x) => !x.Hidden);
    },
  },
};
</script>
