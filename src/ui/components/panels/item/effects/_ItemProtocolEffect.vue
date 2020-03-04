<template>
  <v-row dense :class="`body-text pa-1 ${inset ? 'item-panel-inset' : transparent ? '' : 'light-panel clipped'}`">
    <v-col cols="auto">
      <v-icon x-large :color="color">
        mdi-location-enter
      </v-icon>
    </v-col>
    <v-col class="mt-n3">
      <span class="overline action--protocol--text mb-n2">PROTOCOL</span>
      <div class="effect-text mt-n2">
        {{ effect.Name }}
      </div>
      <p class="body-text mt-n1 mb-1" v-html="effect.Detail" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'cc-item-protocol-effect',
  props: {
    effect: {
      type: Object,
      required: true,
    },
    color: {
      type: String,
      required: false,
      default: 'action--protocol',
    },
    inset: {
      type: Boolean,
    }, transparent: { type: Boolean }
  },
})
</script>
