<template>
  <cc-compendium-browser :items="manufacturers"
    item-type="Manufacturer"
    :table-headers="headers"
    :options="options"
    :manufacturers="manufacturers"
    view-key="cb-manufacturers">
    <template #header>
      <div class="heading h3 text-center text-accent">{{ $t('compendium.categories.manufacturers')
        }}</div>
    </template>
  </cc-compendium-browser>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { CompendiumStore } from '@/stores';

const headers = ref([
  { title: 'Name', key: 'Name' },
])

const options = ref({
  views: ['list', 'table'],
  initialView: 'list',
  groups: ['lcp', 'none'],
  initialGroup: 'none',
  noSource: true,
})

const manufacturers = computed(() => {
  return CompendiumStore().Manufacturers;
})

</script>
