<template>
  <compendium-browser :items="frames" item-type="Frame" :table-headers="headers" :options="options">
    <template #header> <div class="heading h3 text-center text-primary">Frames</div></template>
  </compendium-browser>
</template>

<script lang="ts">
import CompendiumBrowser from '../../components/CompendiumBrowser.vue';
import CompendiumBrowser from '../../components/CompendiumBrowser.vue';
import { CompendiumStore } from '../../store';

export default {
  name: 'Frames',
  components: { CompendiumBrowser, CompendiumBrowser },
  data: () => ({
    options: {
      views: ['single', 'table', 'cards'],
      initialView: 'cards',
      groups: ['source', 'lcp', 'license'],
      initialGroup: 'source',
    },
    headers: [
      { title: 'Source', key: 'Source' },
      { title: 'Name', key: 'Name' },
      { title: 'Size', key: 'Size' },
      { title: 'Armor', key: 'Armor' },
      { title: 'HP', key: 'HP' },
      { title: 'Evasion', key: 'Evasion' },
      { title: 'EDef', key: 'EDefense' },
      { title: 'HeatCap', key: 'HeatCap' },
      { title: 'RepCap', key: 'RepCap' },
      { title: 'Sensors', key: 'SensorRange' },
      { title: 'TechAtk', key: 'TechAttack' },
      { title: 'Save', key: 'SaveTarget' },
      { title: 'Speed', key: 'Speed' },
      { title: 'SP', key: 'SP' },
    ],
  }),
  computed: {
    frames() {
      let items = CompendiumStore().Frames;

      // TODO: profile

      // const canShowExotics =
      //   this.profile && Object.keys(this.profile).length > 0 && this.profile.GetView('showExotics');

      // if (!canShowExotics) i = i.filter((x) => !x.IsExotic);

      return items.filter((x) => !x.IsHidden);
    },
  },
};
</script>
