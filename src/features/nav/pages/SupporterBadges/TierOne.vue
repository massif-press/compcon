<template>
  <v-chip class="mx-1 my-1 font-weight-bold black--text" color="cyan lighten-4">
    <v-avatar left color="cyan darken-4">
      <v-icon color="white" size="18">cci-rank-1</v-icon>
    </v-avatar>
    {{ name }}
  </v-chip>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 't1-badge',
  props: {
    name: {
      type: String,
      required: true,
    },
  },
})
</script>
