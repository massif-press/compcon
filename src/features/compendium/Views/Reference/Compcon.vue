<template>
  <h1 class="heading h1 ml-5">USING COMP/CON</h1>
  <srd-view :content="using_compcon" :pre-scroll="preScroll" />
</template>

<script lang="ts">
import using_compcon from '@/assets/srd/lib/using_compcon.json';
import SrdView from './_components/SrdView.vue';

export default {
  name: 'using-compcon',
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
    using_compcon() {
      return using_compcon;
    },
  },
};
</script>
