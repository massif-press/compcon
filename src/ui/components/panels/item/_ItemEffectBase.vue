<template>
  <div>
    <v-row dense :class="rowClass" align="center">
      <v-col v-if="!print && !noIcon" cols="auto">
        <v-icon x-large :color="color">
          {{ icon }}
        </v-icon>
      </v-col>
      <v-col class="mt-n2">
        <div class="overline font-weight-bold primary--text pb-1" v-html="type" />
        <slot />
      </v-col>
    </v-row>
    <cc-item-effect-panel
      v-if="effect.Abilities"
      :effects="effect.Abilities"
      inset
      :print="print"
      class="mt-1"
    />
    <cc-tags v-if="effect.Tags" :tags="effect.Tags" :print="print" :bonus="limitedBonus" small />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'cc-item-effect-base',
  props: {
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
    effect: {
      type: Object,
      required: true,
    },
    icon: {
      type: String,
      required: false,
      default: 'cci-trait',
    },
    type: {
      type: String,
      required: false,
      default: 'EFFECT',
    },
    limitedBonus: {
      type: Number,
      required: false,
      default: 0,
    },
    noIcon: { type: Boolean },
    inset: { type: Boolean },
    transparent: { type: Boolean },
    print: { type: Boolean },
  },
  computed: {
    rowClass() {
      if (this.print) {
        const c = 'py-0 px-1 caption'
        if (this.inset) return c + ' mb-1 mt-n2'
        return c
      }
      let c = 'pa-1'
      c += ' body-text'
      if (this.inset) c += ' item-panel-inset'
      if (!this.transparent) c += 'light-panel clipped'
      return c
    },
  },
})
</script>

<style>
.item-panel-inset {
  border: 1px solid;
  border-color: var(--v-primary-base) !important;
  border-radius: 3px;
  background-color: var(--v-light-panel-base) !important;
  width: 96%;
}
</style>
