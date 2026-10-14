<template>
  <srd-view
    :title="$t('compendium.reference.lancerBasics')"
    :content="basics"
    :pre-scroll="preScroll"
  />
</template>

<script setup lang="ts">
  import basics from '@/assets/srd/lib/basics.json'
  import SrdView from './_components/SrdView.vue'

  defineProps({
    preScroll: {
      type: String,
      default: '',
    },
  })
</script>
