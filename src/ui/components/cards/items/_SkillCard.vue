<template>
  <p v-html-safe="item.Detail"></p>
</template>

<script setup lang="ts">
import type { Skill } from '@/classes/pilot/components/skill/Skill'
defineProps<{
  item: Skill
}>()
</script>
