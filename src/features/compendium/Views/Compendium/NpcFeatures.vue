<template>
  <cc-compendium-browser ref="browser"
    :items="features"
    item-type="NpcFeature"
    :table-headers="headers"
    :options="options"
    view-key="cb-npc-features">
    <template #header>
      <div class="heading h3 text-center text-accent">{{ $t('compendium.categories.npcFeatures') }}</div>
    </template>
  </cc-compendium-browser>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { orderBy } from 'lodash-es';
import { CompendiumStore } from '@/stores';
import { NpcFeature } from '@/classes/npc/feature/NpcFeature';

const browser = ref<any>(null)

const selectedTier = ref(1)
const tieredView = ref(false)
const options = ref({
      views: ['single', 'table'],
      initialView: 'single',
      groups: ['lcp', 'featureType', 'origin', 'none'],
      initialGroup: 'origin',
    })

const features = computed(() => {
      return orderBy(CompendiumStore().NpcFeatures, ['FeatureType', 'Origin.Name', 'Name']);
    })
const headers = computed(() => {
      const h = [
        { title: 'Content Pack', key: 'LcpName' },
        { title: 'Origin', key: 'Origin' },
        { title: 'Name', key: 'Name' },
        { title: 'Tags', key: 'Tags' },
      ] as any[];
      return h;
    })
</script>
