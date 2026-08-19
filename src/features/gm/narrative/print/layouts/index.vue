<template>
  <div
    v-for="(n, i) in items"
    :key="(n as any).ID"
    class="py-1 mb-1"
  >
    <narrative-item-print
      :item="<any>n"
      :options="options"
    />
    <page-break v-if="i + 1 < items.length" />
  </div>
</template>

<script setup lang="ts">
  import type { GmPrintOptions } from '@/ui/print/types'
  import NarrativeItemPrint from './NarrativeItemPrint.vue'
  import PageBreak from '@/ui/components/print/PageBreak.vue'

  defineOptions({ name: 'NarrativePrintLayout' })

  const props = defineProps<{
    items: any[]
    options: GmPrintOptions
  }>()
</script>
