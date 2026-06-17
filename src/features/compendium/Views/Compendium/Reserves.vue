<template>
  <cc-compendium-browser :items="reserves"
    item-type="Reserve"
    :table-headers="headers"
    :options="options"
    view-key="cb-reserves">
    <template #header>
      <div class="heading h3 text-center text-accent">{{ $t('common.reserves') }}</div>
    </template>
  </cc-compendium-browser>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { CompendiumStore } from '@/stores';
import { orderBy } from 'lodash-es';

const headers = ref([
      { title: 'Content Pack', key: 'LcpName' },
      { title: 'Name', key: 'Name' },
      { title: 'Type', key: 'Type' },
    ])
const options = ref({
      views: ['list', 'table'],
      initialView: 'list',
      groups: ['lcp', 'type', 'none'],
      initialGroup: 'type',
      noSource: true,
    })

const reserves = computed(() => {
      return orderBy(
        CompendiumStore().Reserves.filter((x) => !x.IsHidden),
        'Name'
      );
    })
</script>
