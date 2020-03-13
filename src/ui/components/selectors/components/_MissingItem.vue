<template>
  <v-row>
    <v-col cols="auto">
      <span class="subtle--text">// MISSING DATA //</span>
    </v-col>
    <v-col cols="auto">
      <v-btn icon text color="error" @click="$emit('remove')">
        <v-icon>delete</v-icon>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'missing-item',
})
</script>
