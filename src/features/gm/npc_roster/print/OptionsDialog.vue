<template>
  <print-options-base
    :options="options"
    :include-options="includeOptions"
    :extra-options="extraOptions" />
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import PrintOptionsBase from '@/shared/print/PrintOptionsBase.vue'

const props = defineProps<{ options: Record<string, any> }>()
const emit = defineEmits<{ set: [options: any] }>()

watch(() => props.options, (val) => emit('set', val), { deep: true })

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
        { title: 'GM Notes' },
        { title: 'Append Lined Section' },
        { title: 'Append Unlined Section' },
      ]
  }
})

const extraOptions = computed(() => [{ title: 'Relevant Tag Reference' }])
</script>
