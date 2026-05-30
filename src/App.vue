<template>
  <v-app id="app">
    <pwa-update-prompt />
    <cc-notify />
    <navbar />
    <div :style="`height: ${heightOffset}`"
      class="no-print" />
    <router-view :key="$route.fullPath" />
  </v-app>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useDisplay } from 'vuetify'
import CcNotify from '@/ui/notification/CCNotify.vue'
import Navbar from './features/nav/index.vue'
import PwaUpdatePrompt from '@/ui/components/PWAUpdatePrompt.vue'
import { UserStore } from './stores'

const _display = useDisplay()

defineOptions({ name: 'Compcon' })

document.documentElement.setAttribute('data-font', 'inter')
    window.addEventListener('beforeunload', UserStore().OnUnload)

const heightOffset = computed(() => {
      if (_display.xs.value) {
        return '24px'
      } else {
        return '41px'
      }
    })
const user = computed(() => {
      return UserStore().User
    })
</script>
