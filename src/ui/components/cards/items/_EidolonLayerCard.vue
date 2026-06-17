<template>
  <v-card-text class="pt-0 mt-0">
    <div v-if="item.Appearance">
      <cc-panel :title="$t('ui.titles.reportedAppearances')">
        <p v-html-safe="item.Appearance" />
      </cc-panel>
    </div>
    <div v-if="item.Hints">
      <cc-panel :title="$t('ui.titles.hints')">
        <p v-html-safe="item.Hints" />
      </cc-panel>
    </div>
    <div v-if="item.Rules">
      <cc-panel :title="$t('ui.titles.rules')">
        <p v-html-safe="item.Rules" />
      </cc-panel>
    </div>

    <div v-if="item.Features.length > 0">
      <cc-titled-divider color="accent"
        :title="$t('common.features')"
        :subtitle="`(${item.Features.length})`"
        class="mt-2" />
      <cc-masonry-grid :items="item.Features">
        <template #default="{ item }">
          <cc-dense-card :item="item"
            class="my-1"
            :tier="tier" />
        </template>
      </cc-masonry-grid>
    </div>

    <div v-if="item.Shards"
      class="mt-2">
      <cc-titled-divider :title="$t('ui.titles.shards')"
        color="accent"
        :subtitle="`&emsp; New Shards: ${item.Shards.CountString}`" />
      <cc-panel :title="$t('ui.titles.reportedAppearances')">
        <p v-html-safe="item.Shards.Detail" />
      </cc-panel>
      <div v-if="item.Shards.Features.length > 0">
        <cc-titled-divider variant="tonal"
          :title="$t('ui.titles.shardFeatures')"
          :subtitle="`(${item.Shards.Features.length})`"
          class="mt-2" />
        <cc-dense-card v-for="b in item.Shards.Features"
          :key="b.ID"
          :item="b"
          class="my-1"
          :tier="tier" />
      </div>
    </div>
  </v-card-text>
</template>

<script setup lang="ts">
import type { EidolonLayer } from '@/classes/npc/eidolon/EidolonLayer'
defineProps<{
  item: EidolonLayer
  notes?: boolean
  smallTags?: boolean
  dense?: boolean
  charts?: boolean
  collapseActions?: boolean
  tier?: number
}>()
</script>
