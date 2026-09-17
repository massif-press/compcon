<template>
  <v-tooltip
    :open-delay="400"
    location="top"
    max-width="300"
  >
    <template #activator="{ props }">
      <v-card
        v-bind="props"
        :color="active ? 'primary' : 'panel'"
        :class="`px-${layout.padX} py-${layout.padY} text-center d-flex flex-column align-center justify-center`"
        :style="{ minHeight: `${layout.tileHeight}px`, height: '100%' }"
        flat
        tile
        @click="$emit('click')"
      >
        <v-icon
          v-if="layout.showIcon"
          :icon="status.Icon"
          :size="layout.tileIconSize"
        />
        <div
          v-if="layout.showLabel || mobile"
          class="text-cc-overline status-label"
        >
          {{ status.Name }}
        </div>
      </v-card>
    </template>
    <div class="heading h3">{{ status.Name }}</div>
    <v-card
      v-if="appliedDetail"
      flat
      tile
      class="pa-1 text-center text-cc-overline"
      color="primary"
    >
      {{ appliedDetail }}
    </v-card>
    {{ status.Terse || status.Effects }}
  </v-tooltip>
</template>

<script setup lang="ts">
  import type { Status } from '@/classes/Status'
  import { useDisplay } from 'vuetify'
  import { useLayoutOptions } from '@/features/active_mode/layoutOptions'

  defineProps<{
    status: Status
    active: boolean
    appliedDetail?: string | null
  }>()

  defineEmits<{ click: [] }>()

  const { smAndDown: mobile } = useDisplay()
  const { layout } = useLayoutOptions()
</script>

<style scoped>
  .status-label {
    line-height: 1.1;
    text-align: center;
  }
</style>
