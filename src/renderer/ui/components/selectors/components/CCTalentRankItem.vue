<template>
  <v-row :dense="small">
    <v-col cols="auto" class="text-center">
      <v-icon
        :class="{'mr-4' : small}"
        :size="small ? 40 : 80"
        :color="lock ? 'grey lighten-1' : 'primary'"
        v-html="`cci-rank-${rank}`"
      />
    </v-col>
    <v-col>
      <p class="body-text pt-2 mb-1 ml-n4" v-html="description" />
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
    small: {
      type: Boolean,
      required: false,
    },
  },
})
</script>