<template>
  <cc-tabs fixed modal>
    <template #tabs>
      <v-tab>{{ strings.tabSettings }}</v-tab>
      <v-tab>{{ strings.tabStorage }}</v-tab>
      <v-tab>{{ strings.tabLog }}</v-tab>
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
import { NAV_STRINGS } from '@/features/nav/strings'

const strings = NAV_STRINGS.optionsPage
</script>
