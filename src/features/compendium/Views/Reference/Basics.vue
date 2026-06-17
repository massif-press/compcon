<template>
  <switch-lang-temp class="fixed" :class="mobile && 'mobile'" />
  <srd-view :title="$t('compendium.titles.lancerBasics')" :content="basics" :pre-scroll="preScroll" />
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'
import basics from '@/assets/srd/lib/basics.json';
import SrdView from './_components/SrdView.vue';
import SwitchLangTemp from './_components/SwitchLangTEMP.vue';

const props = defineProps({
    preScroll: {
      type: String,
      default: '',
    },
  })

const { smAndDown: mobile, xs: portrait } = useDisplay()

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
