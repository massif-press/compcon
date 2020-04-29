<template>
  <v-col cols="auto">
    <v-avatar
      size="50px"
      left
      color="teal darken-3"
      style="z-index:1; margin-right: -60px!important"
    >
      <v-icon color="white" large>cci-rank-2</v-icon>
    </v-avatar>
    <v-chip large pill class="mx-2 my-1 font-weight-bold" color="teal accent-4">
      <span class="pl-10 pr-2 body-text black--text">&emsp;{{ name }}</span>
    </v-chip>
  </v-col>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 't2-badge',
  props: {
    name: {
      type: String,
      required: true,
    },
  },
})
</script>
