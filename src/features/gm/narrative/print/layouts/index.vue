<template>
  <div v-for="(n, i) in items" class="py-1 mb-1">
    <narrative-item-print :item="<any>n" :options="options" />
    <page-break v-if="i + 1 < items.length" />
  </div>
</template>

<script lang="ts">
import NarrativeItemPrint from './NarrativeItemPrint.vue';
import PageBreak from '../components/PageBreak.vue';

export default {
  name: 'combined-print',
  components: {
    PageBreak,
    NarrativeItemPrint,
  },
  props: {
    items: {
      type: Array,
      required: true,
    },
    options: {
      type: Object,
      required: true,
    },
  },
};
</script>
