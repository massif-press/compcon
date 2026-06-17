<template>
  <v-card-text class="pt-0"
    :class="{ 'px-0': mobile }">
    <cc-panel v-if="item.Description"
      :title="$t('common.description')"      class="mb-2">
      <p v-html-safe="item.Description" />
    </cc-panel>

    <cc-panel v-if="item.Tactics"
      :title="$t('ui.titles.tactics')"      class="mb-2">
      <p v-html-safe="item.Tactics" />
    </cc-panel>

    <cc-panel v-if="item.ClassFeatureSelectionInfo || item.FeatureSelectionInfo"
      :title="$t('ui.titles.featureSelection')"      class="mb-2">
      <p v-html-safe="item.ClassFeatureSelectionInfo" />
      <p v-html-safe="item.FeatureSelectionInfo" />
    </cc-panel>

    <div v-if="item.BaseFeatures.length > 0">
      <cc-heading small
        line
        dense>
        {{ $t('ui.card.templateBaseFeatures') }}
        <span class="text-caption text-disabled">({{ item.BaseFeatures.length }})</span>
      </cc-heading>

      <cc-masonry-grid :items="item.BaseFeatures">
        <template #default="{ item }">
          <cc-dense-card :item="item" />
        </template>
      </cc-masonry-grid>
    </div>

    <div v-if="item.OptionalFeatures.length > 0">
      <cc-heading small
        line
        dense>
        {{ $t('ui.card.templateOptionalFeatures') }}
        <span class="text-caption text-disabled">({{ item.OptionalFeatures.length }})</span>
      </cc-heading>

      <cc-masonry-grid :items="item.OptionalFeatures">
        <template #default="{ item }">
          <cc-dense-card :item="item" />
        </template>
      </cc-masonry-grid>
    </div>
  </v-card-text>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'
import type { NpcTemplate } from '@/classes/npc/template/NpcTemplate'

const { smAndDown: mobile } = useDisplay()

defineProps<{
  item: NpcTemplate
  notes?: boolean
  smallTags?: boolean
  dense?: boolean
  charts?: boolean
  collapseActions?: boolean
  tier?: number
}>()
</script>
