<template>
  <h1 class="heading h1 ml-5">MECHS</h1>
  <srd-view :content="mechs" :pre-scroll="preScroll" />
</template>

<script lang="ts">
import mechs from '@/assets/srd/lib/mechs.json';
import SrdView from './_components/SrdView.vue';

export default {
  name: 'mechs',
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
    mechs() {
      return mechs;
    },
  },
};
</script>
