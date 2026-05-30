<template>
  <cc-compendium-browser :items="sitreps"
    item-type="Sitrep"
    :table-headers="headers"
    :options="options"
    view-key="cb-sitreps">
    <template #header>
      <div class="heading h3 text-center text-accent">Sitreps</div>
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

const sitreps = computed(() => {
      return orderBy(CompendiumStore().Sitreps, 'Name');
    })
</script>
