<template>
  <v-snackbar v-model="needRefresh" :timeout="-1" color="primary" location="bottom">
    A new version of COMP/CON is available.
    <template #actions>
      <v-btn variant="text" @click="close">Later</v-btn>
      <v-btn variant="flat" color="white" @click="updateSW">Update Now</v-btn>
    </template>
  </v-snackbar>

  <v-snackbar v-model="offlineReady" :timeout="5000" color="success" location="bottom">
    COMP/CON is ready for offline use.
  </v-snackbar>
</template>

<script lang="ts">
  import { useRegisterSW } from 'virtual:pwa-register/vue'

  export default {
    name: 'PWAUpdatePrompt',
    setup() {
      const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW()

      function updateSW() {
        updateServiceWorker()
      }

      function close() {
        offlineReady.value = false
        needRefresh.value = false
      }

      return { offlineReady, needRefresh, updateSW, close }
    },
  }
</script>
