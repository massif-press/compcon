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
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

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
      { title: t('compendium.titles.size'), key: 'SizeIcon', align: 'center', sortRaw: (a: any, b: any) => a.Size - b.Size },
      { title: t('compendium.titles.mounts'), key: 'Mounts' },
      { title: t('compendium.titles.armor'), key: 'Armor', align: 'center' },
      { title: 'HP', key: 'HP', align: 'center' },
      { title: t('compendium.titles.evasion'), key: 'Evasion', align: 'center' },
      { title: t('compendium.titles.edef'), key: 'EDefense', align: 'center' },
      { title: t('compendium.titles.heatcap'), key: 'HeatCap', align: 'center' },
      { title: t('compendium.titles.repcap'), key: 'RepCap', align: 'center' },
      { title: t('compendium.titles.sensors'), key: 'SensorRange', align: 'center' },
      { title: t('compendium.titles.techatk'), key: 'TechAttack', align: 'center' },
      { title: t('compendium.titles.save'), key: 'SaveTarget', align: 'center' },
      { title: t('compendium.titles.speed'), key: 'Speed', align: 'center' },
      { title: t('compendium.titles.sp'), key: 'SP', align: 'center' },
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
