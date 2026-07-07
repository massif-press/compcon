<template>
  <cc-compendium-browser :items="licenses"
    item-type="License"
    :table-headers="headers"
    :options="options"
    :manufacturers="manufacturers"
    view-key="cb-licenses">
    <template #header>
      <div class="heading h3 text-center text-accent">{{ $t('common.licenses') }}</div>
    </template>
  </cc-compendium-browser>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { CompendiumStore, UserStore } from '@/stores';
import License from '@/classes/pilot/components/license/License'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const headers = ref([
      { title: t('compendium.titles.manufacturer'), key: 'Source' },
      { title: 'Name', key: 'Name' },
      { title: t('compendium.titles.tierI'), key: 'T1', sortable: false },
      { title: t('compendium.titles.tierIi'), key: 'T2', sortable: false },
      { title: t('compendium.titles.tierIii'), key: 'T3', sortable: false },
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
