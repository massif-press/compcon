<template>
  <compendium-card :item="item"
    :highlighted="highlighted"
    :selectable="selectable"
    @select="$emit('select')" />
</template>

<script setup lang="ts">
import CompendiumCard from '@/features/compendium/components/views/CompendiumCard.vue'

defineProps<{
  item: Record<string, any>
  highlighted?: boolean
  selectable?: boolean
}>()

defineEmits<{ select: [] }>()
</script>
