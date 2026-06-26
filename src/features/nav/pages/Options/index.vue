<template>
  <cc-tabs fixed modal>
    <template #tabs>
      <v-tab>{{ $t('nav.optionsPage.tabSettings') }}</v-tab>
      <v-tab>{{ $t('nav.optionsPage.tabStorage') }}</v-tab>
      <v-tab>{{ $t('nav.optionsPage.tabLog') }}</v-tab>
    </template>
    <v-window-item>
      <settings />
    </v-window-item>
    <v-window-item>
      <storage />
    </v-window-item>
    <v-window-item>
      <log />
    </v-window-item>
  </cc-tabs>
</template>

<script setup lang="ts">
import Settings from './Settings.vue'
import Storage from './Storage.vue'
import Log from './Log.vue'

</script>
