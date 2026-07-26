<template>
  <cc-compendium-browser
    :items="reserves"
    item-type="Reserve"
    :table-headers="headers"
    :options="options"
    view-key="cb-reserves"
  >
    <template #header>
      <div class="heading h3 text-center text-accent">{{ $t('common.reserves') }}</div>
    </template>
  </cc-compendium-browser>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { CompendiumStore } from '@/stores'
  import { orderBy } from 'lodash-es'
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n()

  const headers = ref([
    { title: t('compendium.titles.contentPack'), key: 'LcpName' },
    { title: t('common.name'), key: 'Name' },
    { title: t('common.type'), key: 'Type' },
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
      CompendiumStore().Reserves.filter(x => !x.IsHidden),
      'Name'
    )
  })
</script>
