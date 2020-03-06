<template>
  <v-row dense :class="`body-text pa-1 ${inset ? 'item-panel-inset' : transparent ? '' : 'light-panel clipped'}`">
    <v-col cols="auto">
      <v-icon x-large :color="color">
        mdi-swap-horizontal-bold
      </v-icon>
    </v-col>
    <v-col class="mt-n3">
      <span class="overline primary--text mb-n4" v-html="'WEAPON PROFILE'" />
      <div class="effect-text mt-n2">
        {{ effect.Name }}&nbsp;
        <cc-range-element v-if="effect.Range" :range="effect.Range" small class="d-inline" />
        <cc-slashes />
        <cc-damage-element v-if="effect.Damage" :damage="effect.Damage" small class="d-inline" />
      </div>
      <p v-if="effect.Detail" class="body-text mb-1" v-html="effect.Detail" />
      <cc-tags v-if="effect.Tags" :tags="effect.Tags" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'cc-item-profile-effect',
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
