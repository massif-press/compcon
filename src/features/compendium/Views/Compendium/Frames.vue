<template>
  <cc-compendium-browser :items="frames"
    item-type="Frame"
    :table-headers="headers"
    :options="options"
    :manufacturers="manufacturers"
    view-key="cb-frames">
    <template #header>
      <div class="heading h3 text-center text-accent">{{ $t('compendium.categories.frames') }}</div>
    </template>
  </cc-compendium-browser>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { orderBy } from 'lodash-es';
import { CompendiumStore } from '../../store';
import { UserStore } from '@/stores';

const options = ref({
      views: ['single', 'table', 'cards', 'scatter', 'bar', 'compare'],
      initialView: 'cards',
      groups: ['source', 'lcp', 'none'],
      initialGroup: 'source',
      showExotics: UserStore().User.Option('showExotics') as boolean,
    })
const headers = ref([
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
    ])

const manufacturers = computed(() => {
      return CompendiumStore().Manufacturers;
    })
const frames = computed(() => {
      const items = CompendiumStore().Frames;
      return orderBy(
        items.filter((x) => !x.IsHidden),
        'Name'
      );
    })
</script>

<style>
.v-data-table-header th {
  white-space: nowrap;
}
</style>
