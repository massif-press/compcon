<template>
  <print-options-base
    :options="options"
    :include-options="includeOptions" />
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
        { title: 'Additional Detail' },
        { title: 'Clocks' },
        { title: 'Tables' },
        { title: 'Append Lined Section' },
        { title: 'Append Unlined Section' },
      ]
  }
})
</script>
