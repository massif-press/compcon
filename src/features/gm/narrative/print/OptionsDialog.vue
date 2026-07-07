<template>
  <print-options-base
    :options="options"
    :include-options="includeOptions" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import PrintOptionsBase from '@/shared/print/PrintOptionsBase.vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

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
