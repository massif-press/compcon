<template>
  <div
    v-html-safe="item.Description"
    class="body-text"
  />
  <div v-if="item.SuggestedSkills.length">
    <v-divider class="my-1" />
    <div class="text-cc-overline text-accent">{{ $t('ui.card.suggestedSkills') }}</div>
    <cc-tooltip
      v-for="s in item.SuggestedSkills"
      :key="s.ID"
      location="top"
      max-width="400px"
    >
      <template #activator="{ props }">
        <cc-chip
          v-bind="props"
          icon="cc:skill"
          :label="s.Name"
          bg-color="primary"
          class="mr-2"
          variant="elevated"
        />
      </template>
      <div class="body-text">{{ s.Description }}</div>
    </cc-tooltip>
  </div>
</template>

<script setup lang="ts">
  import { useDisplay } from 'vuetify'
  import type { Background } from '@/classes/Background'

  const { smAndDown: mobile } = useDisplay()

  defineProps<{
    item: Background
    notes?: boolean
    smallTags?: boolean
    dense?: boolean
    charts?: boolean
    collapseActions?: boolean
    tier?: number
  }>()
</script>
