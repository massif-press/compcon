<template>
  <div :class="`pa-1 ${inset ? 'item-panel-inset' : transparent ? '' : 'light-panel clipped'}`">
    <div class="flavor-text">Expend a charge for one of the following effects:</div>
    <v-alert
      v-for="(c, n) in effect.Charges"
      :key="c.Name + n"
      dense
      outlined
      :color="color"
      class="py-0 mx-3"
    >
      <v-row dense align="center" class="mt-n2">
        <v-col cols="auto">
          <v-icon x-large :color="color" class="ml-n2">
            {{ icon(c.ChargeType) }}
          </v-icon>
        </v-col>
        <v-col>
          <span class="overline mb-n4" v-html="c.ChargeType" />
          <div class="effect-text mt-n2">
            {{ c.Name }}&nbsp;
            <cc-range-element v-if="c.Range" small :range="c.Range" class="d-inline" />
            <cc-damage-element v-if="c.Damage" small :damage="c.Damage" class="d-inline" />
          </div>
          <p class="body-text mt-n1 mb-1" v-html="c.Detail" />
        </v-col>
      </v-row>
      <cc-tags v-if="effect.Tags" :tags="effect.Tags" />
    </v-alert>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'cc-item-charge-effect',
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
  methods: {
    icon(ctype: string) {
      if (ctype === 'Grenade') return 'mdi-bomb'
      return 'mdi-mine'
    },
  },
})
</script>
