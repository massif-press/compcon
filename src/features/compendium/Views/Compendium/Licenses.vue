<template>
  <cc-compendium-browser :items="licenses"
    item-type="License"
    :table-headers="headers"
    :options="options"
    :manufacturers="manufacturers"
    view-key="cb-licenses">
    <template #header>
      <div class="heading h3 text-center text-accent">{{ $t('compendium.categories.licenses') }}</div>
    </template>
  </cc-compendium-browser>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { CompendiumStore, UserStore } from '@/stores';
import License from '@/classes/pilot/components/license/License'

const headers = ref([
      { title: 'Manufacturer', key: 'Source' },
      { title: 'Name', key: 'Name' },
      { title: 'Tier I', key: 'T1', sortable: false },
      { title: 'Tier II', key: 'T2', sortable: false },
      { title: 'Tier III', key: 'T3', sortable: false },
    ])
const options = ref({
      views: ['list', 'table'],
      initialView: 'list',
      groups: ['source', 'lcp', 'none'],
      initialGroup: 'source',
      noSource: true,
      showExotics: UserStore().User.Option('showExotics') as boolean,
    })

const manufacturers = computed(() => {
      return CompendiumStore().Manufacturers;
    })
const licenses = computed(() => {
      return CompendiumStore()
        .Licenses.filter((x) => !x.Hidden)
        .sort((a, b) => License.LicenseSort(a, b));
    })
</script>
