<template>
  <new-compendium-browser
    :items="talents"
    item-type="Skill"
    :table-headers="headers"
    :options="options"
  >
    <template #header>
      <div class="heading h3 text-center text-primary">Pilot Talents</div></template
    >
  </new-compendium-browser>
</template>

<script lang="ts">
import { CompendiumStore } from '@/stores';
import { Talent } from '@/class';
import NewCompendiumBrowser from '../../components/NewCompendiumBrowser.vue';

export default {
  name: 'Talents',
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
      hideTitle: true,
    },
  }),
  computed: {
    talents(): Talent[] {
      return CompendiumStore().Talents.filter((x) => !x.IsHidden);
    },
  },
};
</script>
