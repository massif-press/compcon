<template>
  <v-app id="app">
    <router-view />
  </v-app>
</template>

<script lang="ts">
  import Vue from "vue"

  export default Vue.extend({
    name: 'compcon',
    mounted() {
      const thisAny: any = this
      thisAny.$mousetrap.bind('g r', () => {
        this.$router.push('/pilot_management')
      })
      thisAny.$mousetrap.bind('g h', () => {
        this.$router.push('/hangar')
      })
      thisAny.$mousetrap.bind('g c', () => {
        this.$router.push('/compendium')
      })
      thisAny.$mousetrap.bind(['ctrl+left', 'backspace'], () => {
        this.$router.go(-1)
      })
      thisAny.$mousetrap.bind('ctrl+right', () => {
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

