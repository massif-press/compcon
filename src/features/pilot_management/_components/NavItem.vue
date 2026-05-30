<template>
  <v-btn
    size="small"
    variant="flat"
    rounded="0"
    :color="selected ? 'white' : 'primary'"
    :class="selected ? 'text-primary' : 'text-white'"
    :to="to"
    :disabled="disabled"
    @click="to ? '' : $emit('clicked')">
    <span class="unskew">
      <slot />
    </span>
  </v-btn>
</template>

<script setup lang="ts">
defineOptions({ name: 'nav-item' })

const props = withDefaults(defineProps<{
  to?: string
  selected?: boolean
  disabled?: boolean
}>(), {
  to: '',
  selected: false,
  disabled: false
})
</script>

<style scoped>
.unskew {
  transform: translateZ(0) skew(0.65rad);
}
</style>
