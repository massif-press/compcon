<template>
  <h1 class="heading h1 ml-5">COMBAT</h1>
  <srd-view :content="combat" :pre-scroll="preScroll" />
</template>

<script lang="ts">
import combat from '@/assets/srd/lib/combat.json';
import SrdView from './_components/SrdView.vue';

export default {
  name: 'combat',
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
    combat() {
      return combat;
    },
  },
};
</script>
