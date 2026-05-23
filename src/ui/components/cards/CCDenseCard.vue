<template>
  <cc-panel :title="item.FlavorName || item.Name"
    :title-color="item.Color"
    :icon="item.Icon"
    class="mb-2">
    <template #title-prepend>
      <slot name="title-prepend" />
    </template>
    <template #toolbar-items>
      <span v-if="item.FeatureType"
        class="heading text-caption font-weight-bold text-uppercase pr-2">
        {{ item.WeaponType ? item.WeaponType : item.FeatureType }}
      </span>
      <span class="text-cc-overline text-right">
        <v-tooltip :open-on-hover="!mobile"
          :open-on-click="mobile"
          max-width="350px">
          <template #activator="{ props }">
            <v-icon icon="cc:content_manager"
              class="mr-2"
              v-bind="props" />
          </template>
          {{ item.LcpName }}
        </v-tooltip>
      </span>
    </template>
    <v-card-text class="px-0 pb-1 py-0"
      style="position: relative;">
      <slot name="pre" />
      <cc-item-card :item="item"
        dense
        small-tags
        :tier="tier" />
      <slot name="extra" />
    </v-card-text>
  </cc-panel>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'

const { smAndDown: mobile } = useDisplay()

withDefaults(defineProps<{
  item: Record<string, any>
  fullHeight?: boolean
  collapseActions?: boolean
  minWidth?: string
  tier?: number
}>(), {
  fullHeight: false,
  collapseActions: false,
  minWidth: '20vw',
})
</script>
