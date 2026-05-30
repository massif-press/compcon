<template>
  <span v-if="tag.err">ERR: {{ tag.err.toUpperCase() }}</span>
  <cc-alert
    v-show="!tag.IsHidden"
    icon="mdi-label"
    :color="tag.isExotic ? 'exotic' : color"
    density="compact"
    :title="tag.GetName(bonus)"
    class="my-1">
    <div class="text-text" v-html-safe="tag.GetDescription(bonus)" />
  </cc-alert>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  tag: object
  color?: string
  bonus?: number
}>(), {
  bonus: 0
})
</script>
