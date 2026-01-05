<template>
  <v-app id="app">
    <cc-notify />
    <navbar />
    <div :style="`height: ${heightOffset}`" class="no-print" />
    <router-view :key="$route.fullPath" />
  </v-app>
</template>

<script lang="ts">
import CcNotify from '@/ui/notification/CCNotify.vue';
import Navbar from './features/nav/index.vue';
import { UserStore } from './stores';

export default {
  name: 'compcon',
  components: {
    CcNotify,
    Navbar,
  },
  watch: {
    'user.Theme': {
      handler: function (newVal) {
        if (!newVal) return;
        // @ts-ignore
        this.$vuetify.theme.global.name = newVal;
      },
      immediate: true,
    },
  },
  computed: {
    heightOffset() {
      if (this.$vuetify.display.xs) {
        return '24px';
      } else {
        return '41px';
      }
    },
    user() {
      return UserStore().User;
    },
  },
  created() {
    window.addEventListener('beforeunload', UserStore().OnUnload);
  },
};
</script>
