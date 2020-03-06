<template>
  <v-row dense :class="`body-text pa-1 ${inset ? 'item-panel-inset' : transparent ? '' : 'light-panel clipped'}`">
    <v-col cols="auto">
      <v-icon x-large :color="color">
        mdi-robot
      </v-icon>
    </v-col>
    <v-col class="mt-n2">
      <div class="overline primary--text" v-html="'AI'" />
      <div class="flavor-text" v-html="effect.Detail" />
      <cc-item-effect-panel :effects="effect.Abilities" inset />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'cc-item-ai-effect',
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
