<template>
  <cc-compendium-browser :items="statuses"
    item-type="Status"
    :table-headers="headers"
    :options="options"
    view-key="cb-statuses">
    <template #header>
      <div class="heading h3 text-center text-accent">{{ $t('compendium.categories.statusesConditions') }}</div>
    </template>
  </cc-compendium-browser>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { orderBy } from 'lodash-es';
import { CompendiumStore } from '@/stores';
import { Status } from '@/classes/Status';
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const headers = ref([
      { title: t('compendium.titles.contentPack'), key: 'LcpName' },
      { title: t('compendium.titles.icon'), key: 'Icon', sortable: false },
      { title: 'Name', key: 'Name' },
      { title: t('compendium.titles.type'), key: 'StatusType' },
      { title: '', key: 'Terse' },
    ])
const options = ref({
      views: ['list', 'table'],
      initialView: 'list',
      groups: ['lcp', 'none'],
      initialGroup: 'lcp',
      noSource: true,
    })

const statuses = computed(() => {
      return orderBy(CompendiumStore().Statuses, 'Name');
    })
</script>
