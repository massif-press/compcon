<template>
  <v-col class="text-center flavor-text">
    <v-card flat tile class="ma-1 clipped" color="panel darken-1">
      <v-card-text
        class="white--text heading h3 pa-0"
        :style="`letter-spacing: 3px; background-color: ${color}`"
      >
        <contributor
          :label="attr"
          :value="signed ? (val > -1 ? '+' : '-') + val : val"
          :contributors="contributors"
        />
      </v-card-text>
      <v-card-text class="pt-2 pb-0">
        <span class="text--text font-weight-black" style="font-size: 32px">
          <span v-if="signed">{{ val > -1 ? '+' : '-' }}</span>
          {{ Math.abs(val) }}
        </span>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script lang="ts">
import Vue from 'vue'
import Contributor from './Contributor.vue'

export default Vue.extend({
  name: 'statblock-item',
  components: { Contributor },
  props: {
    attr: { type: String, required: true },
    val: { type: Number, required: true },
    signed: { type: Boolean, required: false },
    contributors: {
      type: Array,
      required: true,
    },
    color: {
      type: String,
      required: false,
      default: '#bdbdbd',
    },
  },
})
</script>
