<template>
  <switch-lang-temp class="fixed" :class="mobile && 'mobile'" />
  <srd-view title="Lancer Basics" :content="basics" :pre-scroll="preScroll" />
</template>

<script setup lang="ts">
import { useMobile } from '@/composables/useMobile'
import basics from '@/assets/srd/lib/basics.json';
import SrdView from './_components/SrdView.vue';
import SwitchLangTemp from './_components/SwitchLangTEMP.vue';

const props = defineProps({
    preScroll: {
      type: String,
      default: '',
    },
  })

const { mobile, portrait } = useMobile()

</script>

<style scoped>
.fixed {
  position: fixed;
  top: 50px;
  right: 10px;
}

.fixed .mobile {
  top: 10px !important;
  right: 2px !important;
}
</style>
