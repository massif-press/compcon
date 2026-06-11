<template>
  <v-snackbar v-model="needRefresh" :timeout="-1" color="primary" location="bottom">
    {{ $t('ui.pwa.updateAvailable') }}
    <template #actions>
      <v-btn variant="text" @click="close">{{ $t('ui.pwa.later') }}</v-btn>
      <v-btn variant="flat" color="white" @click="updateSW">{{ $t('ui.pwa.updateNow') }}</v-btn>
    </template>
  </v-snackbar>

  <v-snackbar v-model="offlineReady" :timeout="5000" color="success" location="bottom">
    {{ $t('ui.pwa.offlineReady') }}
  </v-snackbar>
</template>

<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue'

const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW()

      function updateSW() {
        updateServiceWorker()
      }

      function close() {
        offlineReady.value = false
        needRefresh.value = false
      }
</script>
