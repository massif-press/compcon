<template>
  <srd-view title="pilots" :content="pilots" :pre-scroll="preScroll" />
</template>

<script setup lang="ts">
import pilots from '@/assets/srd/lib/pilots.json';
import SrdView from './_components/SrdView.vue';

const props = withDefaults(defineProps<{
  preScroll?: string
}>(), {
  preScroll: ''
})


</script>
