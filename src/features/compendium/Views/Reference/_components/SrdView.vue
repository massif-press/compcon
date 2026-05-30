<template>
  <component :is="component" v-bind="$props" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMobile } from '@/composables/useMobile'
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

const { mobile, portrait } = useMobile()

const component = computed(() => mobile.value ? SrdViewMobile : SrdViewDesktop)
</script>
