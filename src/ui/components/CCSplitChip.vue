<template>
  <v-chip size="x-small" label class="pa-0">
    <span :class="`bg-${color} pa-2`">{{ label.title }}</span>
    <span v-if="label.value" class="px-2">{{ label.value }}</span>
  </v-chip>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  label: { title: string; value?: string | number }
  color?: string
}>(), {
  color: 'primary'
})
</script>
