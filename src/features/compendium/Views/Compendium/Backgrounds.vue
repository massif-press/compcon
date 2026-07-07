<template>
  <cc-compendium-browser :items="backgrounds"
    item-type="Background"
    :table-headers="headers"
    :options="options"
    view-key="cb-backgrounds">
    <template #header>
      <div class="heading h3 text-center text-accent">{{ $t('compendium.categories.pilotBackground') }}</div>
    </template>
  </cc-compendium-browser>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { orderBy } from 'lodash-es';
import { Background } from '@/classes/Background'
import { CompendiumStore } from '@/stores';
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const options = ref({
      views: ['list', 'table'],
      initialView: 'list',
      groups: ['lcp', 'none'],
      initialGroup: 'lcp',
      noSource: true,
    })
const headers = ref([
      { title: t('compendium.titles.contentPack'), key: 'LcpName' },
      { title: 'Name', key: 'Name' },
      { title: '', key: 'Terse' },
    ])

const backgrounds = computed(() => {
      return orderBy(CompendiumStore().Backgrounds, 'Name');
    })
</script>
