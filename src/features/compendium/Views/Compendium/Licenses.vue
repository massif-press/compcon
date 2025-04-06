<template>
  <cc-compendium-browser
    :items="licenses"
    item-type="License"
    :table-headers="headers"
    :options="options">
    <template #header><div class="heading h3 text-center text-accent">Licenses</div></template>
  </cc-compendium-browser>
</template>

<script lang="ts">
import _ from 'lodash';
import { CompendiumStore } from '@/stores';
import { License } from '@/class';

export default {
  name: 'licenses',

  data: () => ({
    headers: [
      { title: 'Manufacturer', key: 'Source' },
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
      return CompendiumStore()
        .Licenses.filter((x) => !x.Hidden)
        .sort((a, b) => License.LicenseSort(a, b));
    },
  },
};
</script>
