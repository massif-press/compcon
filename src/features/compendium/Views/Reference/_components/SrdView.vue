<template>
  <component :is="component" v-bind="$props" />
</template>

<script lang="ts">
import { NavStore } from '@/stores';
import SrdViewMobile from './SrdViewMobile.vue';
import SrdViewDesktop from './SrdViewDesktop.vue';
import { useMobile } from '@/composables/useMobile';


export default {
  mixins: [useMobile],
  name: 'using-compcon',
  props: {
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
  },
  computed: {
    component() {
      return this.mobile ? SrdViewMobile : SrdViewDesktop;
    },
  },
};
</script>
