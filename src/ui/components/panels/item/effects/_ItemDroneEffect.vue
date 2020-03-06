<template>
  <v-row dense :class="`body-text pa-1 ${inset ? 'item-panel-inset' : transparent ? '' : 'light-panel clipped'}`">
    <v-col cols="auto">
      <v-icon x-large :color="color">
        mdi-camera-control
      </v-icon>
    </v-col>
    <v-col class="mt-n3">
      <span class="overline primary--text mb-n4" v-html="'DRONE'" />
      <div class="effect-text mt-n2">
        <cc-tooltip simple inline :content="`Size ${effect.Size === 0.5 ? '½' : effect.Size}`">
          <v-icon>cci-size-{{ effect.Size === 0.5 ? 'half' : effect.Size }}</v-icon>
        </cc-tooltip>
        <cc-slashes />
        <cc-tooltip v-if="effect.HP" simple inline delay :content="`${effect.HP} HP`">
          <v-icon>mdi-heart</v-icon>
          {{ effect.HP }}
        </cc-tooltip>
        <cc-tooltip v-if="effect.Armor" simple inline delay :content="`${effect.Armor} Armor`">
          <v-icon>mdi-shield</v-icon>
          {{ effect.Armor }}
        </cc-tooltip>
        <cc-tooltip
          v-if="effect.Evasion"
          simple
          inline
          delay
          :content="`${effect.Evasion} Evasion`"
        >
          <v-icon>mdi-arrow-decision</v-icon>
          {{ effect.Evasion }}
        </cc-tooltip>
        <cc-tooltip v-if="effect.EDef" simple inline delay :content="`${effect.EDef} E-Defense`">
          <v-icon>cci-marker</v-icon>
          {{ effect.EDef }}
        </cc-tooltip>
      </div>
      <p class="body-text mb-1" v-html="effect.Detail" />
      <cc-item-effect-panel v-if="effect.Abilities" :effects="effect.Abilities" inset />
      <cc-tags v-if="effect.Tags" :tags="effect.Tags" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'cc-item-drone-effect',
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
