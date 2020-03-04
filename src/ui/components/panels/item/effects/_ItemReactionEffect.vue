<template>
  <v-row dense :class="`body-text pa-1 ${inset ? 'item-panel-inset' : transparent ? '' : 'light-panel clipped'}`">
    <v-col cols="auto">
      <v-icon x-large :color="color">
        mdi-redo-variant
      </v-icon>
    </v-col>
    <v-col class="mt-n2">
      <div v-if="effect.Init" class="flavor-text" v-html="effect.Init" />
      <div class="overline action--reaction--text mb-n2">REACTION</div>
      <span class="effect-text mt-n2">{{ effect.Name }}</span>
      <cc-slashes />
      <span class="flavor-text mt-n2">{{ effect.Frequency }}</span>
      <div class="mt-n1 ml-2">
        <div v-if="effect.init" class="overline mb-n2 ml-2 action--reaction--text">INIT</div>
        <p v-if="effect.init" class="body-text mt-n1 mb-0" v-html="effect.init" />
        <div class="overline mb-n2 ml-2 action--reaction--text">TRIGGER</div>
        <p class="body-text mt-n1 mb-0" v-html="effect.Trigger" />
        <div class="overline mb-n2 ml-2 action--reaction--text">EFFECT</div>
        <p class="body-text mt-n1 mb-1" v-html="effect.Detail" />
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'cc-item-reaction-effect',
  props: {
    effect: {
      type: Object,
      required: true,
    },
    color: {
      type: String,
      required: false,
      default: 'action--reaction',
    },
    inset: {
      type: Boolean,
    }, transparent: { type: Boolean }
  },
})
</script>
