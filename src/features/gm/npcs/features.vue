<template>
  <v-container>
    <npc-feature-alerts :item="item" />
    <npc-feature-selector :npc="item" />
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { NpcFeatureAlerts, NpcFeatureSelector } from './_components'

export default Vue.extend({
  name: 'npc-builder-content',
  components: {
    NpcFeatureAlerts,
    NpcFeatureSelector,
  },
  props: {
    item: { type: Object, required: true },
  },
})
</script>
