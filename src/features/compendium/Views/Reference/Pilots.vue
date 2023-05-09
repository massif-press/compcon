<template>
  <h1 class="heading h1 ml-5">PILOTS</h1>
  <srd-view :content="pilots" :pre-scroll="preScroll" />
</template>

<script lang="ts">
import pilots from '@/assets/srd/lib/pilots.json';
import SrdView from './_components/SrdView.vue';

export default {
  name: 'pilots',
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
    pilots() {
      return pilots;
    },
  },
};
</script>
