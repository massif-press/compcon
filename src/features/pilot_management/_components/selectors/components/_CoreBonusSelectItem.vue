<template>
  <cc-core-bonus-item :bonus="bonus" />
  <cc-button size="small"
    block
    :color="isSelected ? 'error' : 'success'"
    class="mb-6"
    :disabled="!isSelectable && !isSelected && !isSelectable"
    @click="$emit(isSelected ? 'remove' : 'add', bonus)">
    <span>
      <span v-if="isSelected">
        <v-icon start>cc:difficulty</v-icon>
        {{ $t('pm.common.removeName', { name: bonus.Name }) }}
      </span>
      <span v-else-if="isSelectable">
        <v-icon start>cc:accuracy</v-icon>
        {{ $t('pm.common.addName', { name: bonus.Name }) }}
      </span>
      <span v-else>
        <v-icon start>mdi-lock</v-icon>
        {{ $t('pm.selectors.unavailable') }}
      </span>
    </span>
  </cc-button>
</template>

<script setup lang="ts">
import type { Bonus } from '@/classes/components/feature/bonus/Bonus'
defineOptions({ name: 'CbItem' })

const props = defineProps<{
  bonus: Bonus
  color: string
  isSelected: boolean
  isSelectable: boolean
  id?: string
}>()

const emit = defineEmits<{
  'add': []
  'remove': []
}>()

function ttContent() {
      if (!props.isSelected && !props.isSelectable) return 'Locked';
      else if (props.isSelected) return `Remove ${props.bonus.Name}`;
      return `Add ${props.bonus.Name}`;
    }
</script>
