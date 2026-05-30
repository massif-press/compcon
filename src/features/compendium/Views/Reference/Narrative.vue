<template>
  <srd-view title="narrative play" :content="narrative" :pre-scroll="preScroll" />
</template>

<script setup lang="ts">
import narrative from '@/assets/srd/lib/narrative_play.json';
import SrdView from './_components/SrdView.vue';

const props = withDefaults(defineProps<{
  preScroll?: string
}>(), {
  preScroll: ''
})


</script>
