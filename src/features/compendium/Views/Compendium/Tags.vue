<template>
  <cc-compendium-browser :items="tags"
    item-type="Tag"
    :table-headers="headers"
    :options="options"
    view-key="cb-tags">
    <template #header>
      <div class="heading h3 text-center text-accent">Equipment Tags</div>
    </template>
  </cc-compendium-browser>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { sortBy } from 'lodash-es';
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

const tags = computed(() => {
      return sortBy(
        CompendiumStore().Tags.filter((x) => !x.IsHidden),
        'Name'
      );
    })
</script>
