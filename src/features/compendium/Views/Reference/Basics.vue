<template>
  <div style="position: fixed; top: 60px; right: 30px">
    <switch-lang-temp />
  </div>
  <h1 class="heading h1 ml-5">LANCER BASICS</h1>
  <srd-view :content="basics" :pre-scroll="preScroll" />
</template>

<script lang="ts">
import basics from '@/assets/srd/lib/basics.json';
import SrdView from './_components/SrdView.vue';
import SwitchLangTemp from './_components/SwitchLangTEMP.vue';

export default {
  name: 'basics',
  inheritAttrs: false,
  components: {
    SrdView,
    SwitchLangTemp,
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
