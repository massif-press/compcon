<template>
  <component :is="component" v-bind="$props" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import { NavStore } from '@/stores';
import SrdViewMobile from './SrdViewMobile.vue';
import SrdViewDesktop from './SrdViewDesktop.vue';

const props = defineProps({
    title: {
      type: String,
    },
    content: {
      type: Array,
      default: () => [],
    },
    preScroll: {
      type: String,
      default: '',
    },
  })

const { smAndDown: mobile, xs: portrait } = useDisplay()

const component = computed(() => mobile.value ? SrdViewMobile : SrdViewDesktop)
</script>
