<template>
  <srd-view title="mechs" :content="mechs" :pre-scroll="preScroll" />
</template>

<script setup lang="ts">
import mechs from '@/assets/srd/lib/mechs.json';
import SrdView from './_components/SrdView.vue';

const props = withDefaults(defineProps<{
  preScroll?: string
}>(), {
  preScroll: ''
})


</script>
