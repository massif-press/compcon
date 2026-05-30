<template>
  <srd-view title="combat" :content="combat" :pre-scroll="preScroll" />
</template>

<script setup lang="ts">
import combat from '@/assets/srd/lib/combat.json';
import SrdView from './_components/SrdView.vue';

const props = withDefaults(defineProps<{
  preScroll?: string
}>(), {
  preScroll: ''
})


</script>
