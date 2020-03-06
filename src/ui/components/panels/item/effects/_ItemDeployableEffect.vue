<template>
  <v-row dense :class="`body-text pa-1 ${inset ? 'item-panel-inset' : transparent ? '' : 'light-panel clipped'}`">
    <v-col cols="auto">
      <v-icon x-large :color="color">
        mdi-arrow-expand-all
      </v-icon>
    </v-col>
    <v-col class="mt-n3">
      <span class="overline primary--text mb-n4" v-html="'DEPLOYABLE'" />
      <div class="effect-text mt-n2">
        <cc-tooltip
          v-for="n in effect.Count"
          :key="effect.Detail + n"
          simple
          inline
          :content="`Size ${effect.Size === 0.5 ? '½' : effect.Size}`"
        >
          <v-icon>cci-size-{{ effect.Size === 0.5 ? 'half' : effect.Size }}</v-icon>
        </cc-tooltip>
        <cc-slashes />
        <cc-tooltip v-if="effect.HP" simple inline delay :content="`${effect.HP} HP`">
          <v-icon>mdi-heart</v-icon>
          {{ effect.HP }}
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
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'cc-item-deployable-effect',
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
