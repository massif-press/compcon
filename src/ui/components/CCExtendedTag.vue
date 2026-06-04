<template>
  <cc-alert v-show="!tag.IsHidden"
    icon="mdi-label"
    :color="tag.IsExotic ? 'exotic' : color"
    density="compact"
    :title="tag.GetName(bonus)"
    class="my-1">
    <div v-html-safe="tag.GetDescription(bonus)" />
  </cc-alert>
</template>

<script setup lang="ts">
import Tag from '@/classes/Tag';

withDefaults(defineProps<{
  tag: Tag
  color?: string
  bonus?: number
}>(), {
  bonus: 0,
  color: ''
})
</script>
