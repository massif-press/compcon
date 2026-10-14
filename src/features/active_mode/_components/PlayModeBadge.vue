<template>
  <v-chip
    size="x-small"
    variant="elevated"
    :color="mode === 'simple' ? 'accent' : 'panel'"
    :prepend-icon="mode === 'simple' ? 'mdi-feather' : 'mdi-cog-outline'"
  >
    {{ mode === 'simple' ? $t('active.playMode.simple') : $t('active.playMode.full') }}
  </v-chip>
</template>

<script setup lang="ts">
  import type { PlayMode } from '@/classes/encounter/EncounterInstance'

  defineOptions({ name: 'PlayModeBadge' })

  defineProps<{ mode: PlayMode }>()
</script>
