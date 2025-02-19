<template>
  <srd-view title="narrative play" :content="narrative" :pre-scroll="preScroll" />
</template>

<script lang="ts">
import narrative from '@/assets/srd/lib/narrative_play.json';
import SrdView from './_components/SrdView.vue';

export default {
  name: 'narrative',
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
    narrative() {
      return narrative;
    },
  },
};
</script>
