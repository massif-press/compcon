<template>
  <v-container fluid class="mt-9" style="height: 100%">
    <slot name="title" />
    <v-row>
      <v-col cols="4" class="mt-n4" style="min-height: 87vh; max-height: 87vh; overflow-y: scroll;">
        <slot name="left" />
      </v-col>
      <v-divider vertical />
      <v-col id="scrollTarget" class="bordered-view">
        <slot name="right" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'panel-view',
  methods: {
    resetScroll() {
      document.getElementById('scrollTarget').scrollTop = 0
    },
  },
})
</script>

<style scoped>
.bordered-view {
  min-height: 87vh;
  max-height: 87vh;
  overflow-y: scroll;
  border: 1px solid darkgrey;
  border-radius: 3px;
}
</style>
