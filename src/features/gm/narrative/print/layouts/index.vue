<template>
  <div v-for="(n, i) in items" :key="(n as any).ID" class="py-1 mb-1">
    <narrative-item-print :item="<any>n" :options="options" />
    <page-break v-if="i + 1 < items.length" />
  </div>
</template>

<script setup lang="ts">
import NarrativeItemPrint from './NarrativeItemPrint.vue';
import PageBreak from '@/features/pilot_management/Print/components/PageBreak.vue';

defineOptions({ name: 'combined-print' })

const props = defineProps<{
  items: any[]
  options: object
}>()
</script>
