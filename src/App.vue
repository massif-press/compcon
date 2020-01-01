<template>
  <v-app id="app">
    <!-- <global-snackbar /> -->
    <nav />
    <v-slide-x-transition mode="out-in">
      <router-view />
    </v-slide-x-transition>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
// import GlobalSnackbar from './UI/GlobalSnackbar.vue'

export default Vue.extend({
  name: 'compcon',
  // components: { GlobalSnackbar },
  mounted() {
    const vm = this as any
    vm.$mousetrap.bind('g r', () => {
      this.$router.push('/pilot_management')
    })
    vm.$mousetrap.bind('g h', () => {
      this.$router.push('/hangar')
    })
    vm.$mousetrap.bind('g c', () => {
      this.$router.push('/compendium')
    })
    vm.$mousetrap.bind(['ctrl+left', 'backspace'], () => {
      this.$router.go(-1)
    })
    vm.$mousetrap.bind('ctrl+right', () => {
      this.$router.go(1)
    })
  },
})
</script>

<style>
html {
  scroll-behavior: smooth;
}
</style>
