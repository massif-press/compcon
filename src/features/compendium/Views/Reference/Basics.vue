<template>
  <h1 class="heading h1 ml-5">LANCER BASICS</h1>
  <srd-view :content="basics" :pre-scroll="preScroll" />
</template>

<script lang="ts">
import basics from '@/assets/srd/lib/basics.json';
import SrdView from './_components/SrdView.vue';

export default {
  name: 'basics',
  inheritAttrs: false,
  components: {
    SrdView,
  },
  props: {
    preScroll: {
      type: String,
      default: '',
    },
  },
  computed: {
    basics() {
      return basics;
    },
  },
};
</script>
