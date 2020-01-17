<template>
  <v-app id="app">
    <global-confirm ref="confirm" />
    <nav />
    <v-slide-x-transition mode="out-in">
      <router-view />
    </v-slide-x-transition>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import GlobalConfirm from '@/ui/GlobalConfirm.vue'

export default Vue.extend({
  name: 'compcon',
  components: {
    GlobalConfirm,
  },
  mounted() {
    this.$mousetrap.bind('g r', () => {
      this.$router.push('/pilot_management')
    })
    this.$mousetrap.bind('g h', () => {
      this.$router.push('/hangar')
    })
    this.$mousetrap.bind('g c', () => {
      this.$router.push('/compendium')
    })
    this.$mousetrap.bind(['ctrl+left', 'backspace'], () => {
      this.$router.go(-1)
    })
    this.$mousetrap.bind('ctrl+right', () => {
      this.$router.go(1)
    })

    Vue.prototype.$confirm = this.$refs.confirm.open
  },
})
</script>

<style>
html {
  scroll-behavior: smooth;
}
</style>
