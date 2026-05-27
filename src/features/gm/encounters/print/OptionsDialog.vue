<template>
  <print-options-base
    :options="options"
    :include-options="includeOptions"
    :extra-options="extraOptions" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import PrintOptionsBase from '@/shared/print/PrintOptionsBase.vue'

const props = defineProps<{ options: Record<string, any> }>()

const includeOptions = computed(() => {
  switch (props.options.layout.title) {
    case 'Minimal':
      return []
    default:
      return [
        { title: 'Include Image' },
        { title: 'Include Map' },
        { title: 'Append Lined Section' },
        { title: 'Append Unlined Section' },
      ]
  }
})

const extraOptions = computed(() => [
  { title: 'GM Tracker' },
  { title: 'Tag Reference' },
  { title: 'Combat Quick Reference' },
  { title: 'Action Reference' },
])
</script>
