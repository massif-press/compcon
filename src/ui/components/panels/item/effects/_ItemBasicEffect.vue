<template>
  <v-row dense :class="`body-text pa-1 ${inset ? 'item-panel-inset' : transparent ? '' : 'light-panel clipped'}`">
    <v-col cols="auto">
      <v-icon x-large :color="color">
        cci-trait
      </v-icon>
    </v-col>
    <v-col class="mt-n3">
      <span class="overline primary--text mb-n2">EFFECT</span>
      <div class="effect-text mt-n2">
        {{ effect.Name }}
      </div>
      <p class="pt-0 mb-1" v-html="effect.Detail" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'cc-item-basic-effect',
  props: {
    effect: {
      type: Object,
      required: true,
    },
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
    inset: {
      type: Boolean,
    }, transparent: { type: Boolean }
  },
})
</script>
