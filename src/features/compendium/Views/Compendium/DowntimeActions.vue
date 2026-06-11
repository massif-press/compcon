<template>
  <cc-compendium-browser :items="downtimeActions"
    item-type="DowntimeAction"
    :table-headers="headers"
    :options="options"
    view-key="cb-downtime-actions">
    <template #header>
      <div class="heading h3 text-center text-accent">{{ $t('compendium.categories.downtimeActions') }}</div>
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
    ])
const options = ref({
      views: ['list', 'table'],
      initialView: 'list',
      groups: ['lcp', 'none'],
      initialGroup: 'none',
      noSource: true,
    })

const downtimeActions = computed(() => {
      return orderBy(CompendiumStore().DowntimeActions, 'Name');
    })
</script>
