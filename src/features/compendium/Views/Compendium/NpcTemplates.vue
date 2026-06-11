<template>
  <cc-compendium-browser :items="templates"
    :itemType="'NpcTemplate'"
    :table-headers="headers"
    :options="options"
    view-key="cb-npc-templates">
    <template #header>
      <div class="heading h3 text-center text-accent">{{ $t('compendium.categories.npcTemplates') }}</div>
    </template>
  </cc-compendium-browser>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { orderBy } from 'lodash-es';
import { CompendiumStore } from '@/stores';
import { NpcTemplate } from '@/classes/npc/template/NpcTemplate';

const headers = ref([
      { title: 'Content Pack', key: 'LcpName' },
      { title: 'Name', key: 'Name' },
      { title: '', key: 'Terse' },
    ])
const options = ref({
      views: ['single', 'table', 'list'],
      initialView: 'single',
      groups: ['lcp', 'none'],
      initialGroup: 'lcp',
      noSource: true,
    })

const templates = computed(() => {
      return orderBy(CompendiumStore().NpcTemplates, 'Name');
    })
</script>
