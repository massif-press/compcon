<template>
  <v-row>
    <v-col cols="auto" class="text-center">
      <v-icon size="80" :color="lock ? 'grey lighten-1' : 'primary'" v-html="`cci-rank-${rank}`" />
    </v-col>
    <v-col>
      <p class="body-text pt-2 ml-n4" v-html="description" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'cc-talent-rank-item',
  props: {
    rank: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    lock: {
      type: Boolean,
      required: false,
    },
  },
})
</script>