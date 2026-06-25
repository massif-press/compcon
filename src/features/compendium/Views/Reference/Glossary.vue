<template>
  <cc-compendium-browser :items="items"
    item-type="Glossary"
    :options="options"
    view-key="cb-glossary">
    <template #header>
      <div class="heading h3 text-center text-accent">{{ $t('compendium.reference.glossary') }}
      </div>
    </template>
  </cc-compendium-browser>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { sortBy } from 'lodash-es';
import { glossary } from '@massif/lancer-data';
import { DEFAULT_LCP_NAME } from '@/classes/LcpItemMixin';
import { localize } from '@/i18n/localize';
import { glossaryId } from '@/i18n/contentKeys';

const options = ref({
  views: ['list'],
  initialView: 'list',
  groups: ['none'],
  initialGroup: 'none',
  noSource: true,
})

const items = computed(() => {
  return sortBy(glossary, [(x) => x.name]).map((e) => ({
    ID: glossaryId(e.name),
    Name: localize(glossaryId(e.name), 'name', e.name),
    Description: localize(glossaryId(e.name), 'description', e.description),
    ItemType: 'Glossary',
    Icon: 'mdi-book-open-variant',
    LcpName: DEFAULT_LCP_NAME,
  }));
})
</script>
