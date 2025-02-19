<template>
  <component :is="component" v-bind="$props" />
</template>

<script lang="ts">
import { NavStore } from '@/stores';
import SrdViewMobile from './SrdViewMobile.vue';
import SrdViewDesktop from './SrdViewDesktop.vue';

export default {
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
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
    component() {
      return this.mobile ? SrdViewMobile : SrdViewDesktop;
    },
  },
};
</script>
