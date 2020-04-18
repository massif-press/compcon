<template>
  <v-col cols="auto">
    <v-avatar
      size="65px"
      left
      color="teal darken-4"
      style="z-index:1; margin-right: -75px!important"
    >
      <v-icon
        color="white"
        size="45"
        style="margin-left: -2px!important; margin-bottom: -4px!important"
      >
        cci-rank-3
      </v-icon>
    </v-avatar>
    <v-chip x-large pill class="mx-3 my-1" color="light-green darken-4">
      <span class="pl-4 pr-4 heading h3 yellow--text text--lighten-2">&emsp;&emsp;{{ name }}</span>
    </v-chip>
  </v-col>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 't3-badge',
  props: {
    name: {
      type: String,
      required: true,
    },
  },
})
</script>
