<template>
  <v-app id="app">
    <global-confirm ref="confirm" />
    <global-notifier ref="notifier" />
    <navbar />
    <router-view />
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import GlobalConfirm from '@/ui/GlobalConfirm.vue'
import GlobalNotifier from '@/ui/GlobalNotifier.vue'
import Navbar from '@/features/nav/index.vue'
import { getModule } from 'vuex-module-decorators'
import { NavStore } from '@/store'

export default Vue.extend({
  name: 'compcon',
  components: {
    GlobalConfirm,
    GlobalNotifier,
    Navbar,
  },
  computed: {
    dark(): boolean {
      const d = getModule(NavStore, this.$store).DarkMode
      return d
    },
  },
  watch: {
    dark(val) {
      this.$vuetify.theme.dark = val
    },
  },
  mounted() {
    this.$vuetify.theme.dark = getModule(NavStore, this.$store).DarkMode

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
    Vue.prototype.$notify = this.$refs.notifier.notify.bind(this.$refs.notifier)
    Vue.prototype.$notifyError = this.$refs.notifier.notifyError.bind(this.$refs.notifier)
  },
})
</script>

<style>
html {
  scroll-behavior: smooth;
}
</style>
