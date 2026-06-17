<template>
  <srd-view :title="$t('compendium.titles.usingCompcon')" :content="using_compcon" :pre-scroll="preScroll" />
</template>

<script setup lang="ts">
import using_compcon from '@/assets/srd/lib/using_compcon.json'
import SrdView from './_components/SrdView.vue'

defineOptions({ name: 'using-compcon', inheritAttrs: false })

withDefaults(defineProps<{
  preScroll?: string
}>(), {
  preScroll: '',
})
</script>
