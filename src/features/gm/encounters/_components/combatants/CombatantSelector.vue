<template>
  <combatant-selector-list-view v-if="mode === 'list'"
    :encounter="encounter"
    @select="$emit('select', $event)" />
</template>

<script setup lang="ts">
import CombatantSelectorListView from './views/CombatantSelectorListView.vue'

withDefaults(defineProps<{
  mode?: string
  encounter: Record<string, any>
}>(), { mode: 'list' })
defineEmits<{ select: [value: any] }>()
</script>
