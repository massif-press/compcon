<template>
  <v-row dense align="center">
    <v-col cols="auto" class="text-center">
      <v-icon
        :class="{ 'mr-4': small }"
        :size="small ? 40 : 80"
        :color="lock ? 'grey lighten-1' : color"
        v-html="`cci-rank-${rank}`"
      />
    </v-col>
    <v-col>
      <p class="effect-text px-3 ma-0 ml-n2" v-html="description" />
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
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
  },
})
</script>
