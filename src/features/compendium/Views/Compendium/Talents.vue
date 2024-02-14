<template>
  <cc-compendium-browser
    :items="talents"
    item-type="Skill"
    :table-headers="headers"
    :options="options">
    <template #header>
      <div class="heading h3 text-center text-accent">Pilot Talents</div></template
    >
  </cc-compendium-browser>
</template>

<script lang="ts">
import _ from 'lodash';
import { CompendiumStore } from '@/stores';
import { Talent } from '@/class';

export default {
  name: 'Talents',

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
      hideTitle: true,
    },
  }),
  computed: {
    talents(): Talent[] {
      return _.orderBy(
        CompendiumStore().Talents.filter((x) => !x.IsHidden),
        'Name'
      );
    },
  },
};
</script>
