<template>
  <v-chip
    :color="color"
    :size="size"
    :variant="variant"
    :closable="closable"
    :prepend-icon="icon"
    flat
    tile
    rounded="0"
    class="text-cc-overline px-2"
    @click:close="emit('click:close')">
    <slot />
  </v-chip>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  color?: string
  size?: string
  variant?: string
  icon?: string
  closable?: boolean
}>(), {
  color: 'primary',
  size: 'small',
  variant: 'tonal',
  closable: false,
})

const emit = defineEmits<{
  'click:close': []
}>()
</script>
