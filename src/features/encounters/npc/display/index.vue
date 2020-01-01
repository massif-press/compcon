<template>
  <npc-card v-if="selectedNpc" :npc="selectedNpc" />
  <v-row v-else align="center" justify="center" style="width: 100%; height: 100%;">
    <v-col cols="auto">
      <span class="heading h1 grey--text text--lighten-2">no npc selected</span>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'npc-display',
  props: npcID,
})
</script>
