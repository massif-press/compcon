<template>
  <cc-core-bonus-item :bonus="bonus" />
  <cc-button size="small"
    block
    class="mb-n1"
    :color="isSelected ? 'error' : 'success'"
    :disabled="!isSelectable && !isSelected"
    @click="isSelected ? $emit('remove', bonus) : $emit('add', bonus)">
    <span>
      <span v-if="isSelected">
        <v-icon start>cc:difficulty</v-icon>
        {{ $t('common.removeName', { name: bonus.Name }) }}
      </span>
      <span v-else-if="isSelectable">
        <v-icon start>cc:accuracy</v-icon>
        {{ $t('common.addName', { name: bonus.Name }) }}
      </span>
      <span v-else>
        <v-icon start>mdi-lock</v-icon>
        {{ $t('pm.selectors.unavailable') }}
      </span>
    </span>
  </cc-button>
</template>

<script setup lang="ts">
import type { CoreBonus } from '@/classes/pilot/components/corebonus/CoreBonus'

defineProps<{
  bonus: CoreBonus
  isSelected: boolean
  isSelectable: boolean
}>()

defineEmits<{
  'add': [payload: CoreBonus]
  'remove': [payload: CoreBonus]
}>()
</script>
