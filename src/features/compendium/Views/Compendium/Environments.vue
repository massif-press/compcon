<template>
  <cc-compendium-browser :items="environments"
    item-type="Environment"
    :table-headers="headers"
    :options="options"
    view-key="cb-environments">
    <template #header>
      <div class="heading h3 text-center text-accent">Environments</div>
    </template>
  </cc-compendium-browser>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { orderBy } from 'lodash-es';
import { CompendiumStore } from '@/stores';

const headers = ref([
      { title: 'Content Pack', key: 'LcpName' },
      { title: 'Name', key: 'Name' },
    ])
const options = ref({
      views: ['list', 'table'],
      initialView: 'list',
      groups: ['lcp', 'none'],
      initialGroup: 'lcp',
      noSource: true,
    })

const environments = computed(() => {
      return orderBy(CompendiumStore().Environments, 'Name');
    })
</script>
