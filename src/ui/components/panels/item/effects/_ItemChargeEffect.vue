<template>
  <effect-base
    :effect="effect"
    :color="color"
    no-icon
    type="CHARGE"
    :inset="inset"
    :transparent="transparent"
    :print="print"
  >
    <div v-if="!print" class="flavor-text">Expend a charge for one of the following effects:</div>
    <v-alert
      v-for="(c, n) in effect.Charges"
      :key="c.Name + n"
      dense
      outlined
      :color="color"
      class="py-0 mx-3"
    >
      <v-row dense align="center" class="mt-n2">
        <v-col v-if="!print" cols="auto">
          <v-icon x-large :color="color" class="ml-n2">
            {{ icon(c.ChargeType) }}
          </v-icon>
        </v-col>
        <v-col>
          <span class="overline font-weight-bold mb-n4" v-html="c.ChargeType" />
          <div :class="print ? 'caption font-weight-bold black--text' : 'effect-text mt-n2'">
            {{ c.Name }}&nbsp;
            <cc-range-element v-if="c.Range" small :range="c.Range" class="d-inline" />
            <cc-damage-element v-if="c.Damage" small :damage="c.Damage" class="d-inline" />
          </div>
          <p
            :class="print ? 'overline black--text mb-0' : 'body-text mt-n1 mb-1'"
            v-html="c.Detail"
          />
          <div class="mt-n2">
            <cc-tags v-if="c.Tags" :tags="c.Tags" :print="print" :bonus="0" small />
          </div>
        </v-col>
      </v-row>
    </v-alert>
  </effect-base>
</template>

<script lang="ts">
import Vue from 'vue'
import EffectBase from '../_ItemEffectBase.vue'

export default Vue.extend({
  name: 'cc-item-charge-effect',
  components: { EffectBase },
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
    inset: { type: Boolean },
    transparent: { type: Boolean },
    print: { type: Boolean },
  },
  methods: {
    icon(ctype: string) {
      if (ctype === 'Grenade') return 'cci-grenade'
      return 'cci-mine'
    },
  },
})
</script>
