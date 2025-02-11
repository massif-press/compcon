<template>
  <switch-lang-temp class="fixed" :class="mobile && 'mobile'" />
  <srd-view title="Lancer Basics" :content="basics" :pre-scroll="preScroll" />
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
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
  },
};
</script>

<style scoped>
.fixed {
  position: fixed;
  top: 50px;
  right: 10px;
}

.fixed .mobile {
  top: 10px !important;
  right: 2px !important;
}
</style>
