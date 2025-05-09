<template>
  <cc-compendium-browser
    :items="frames"
    item-type="Frame"
    :table-headers="headers"
    :options="options">
    <template #header><div class="heading h3 text-center text-accent">Frames</div></template>
  </cc-compendium-browser>
</template>

<script lang="ts">
import _ from 'lodash';
import { CompendiumStore } from '../../store';

export default {
  name: 'Frames',

  data: () => ({
    options: {
      views: ['single', 'table', 'cards', 'scatter', 'bar', 'compare'],
      initialView: 'cards',
      groups: ['source', 'lcp'],
      initialGroup: 'source',
    },
    headers: [
      { title: '', key: 'Source' },
      { title: 'Name', key: 'Name' },
      { title: 'Size', key: 'SizeIcon', align: 'center' },
      { title: 'Mounts', key: 'Mounts' },
      { title: 'Armor', key: 'Armor', align: 'center' },
      { title: 'HP', key: 'HP', align: 'center' },
      { title: 'Evasion', key: 'Evasion', align: 'center' },
      { title: 'EDef', key: 'EDefense', align: 'center' },
      { title: 'HeatCap', key: 'HeatCap', align: 'center' },
      { title: 'RepCap', key: 'RepCap', align: 'center' },
      { title: 'Sensors', key: 'SensorRange', align: 'center' },
      { title: 'TechAtk', key: 'TechAttack', align: 'center' },
      { title: 'Save', key: 'SaveTarget', align: 'center' },
      { title: 'Speed', key: 'Speed', align: 'center' },
      { title: 'SP', key: 'SP', align: 'center' },
    ],
  }),
  computed: {
    frames() {
      let items = CompendiumStore().Frames;
      console.log(
        'frames',
        items.map((x) => x.Name)
      );

      return _.orderBy(
        items.filter((x) => !x.IsHidden),
        'Name'
      );
    },
  },
};
</script>

<style>
.v-data-table-header th {
  white-space: nowrap;
}
</style>
