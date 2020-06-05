<template>
  <v-alert dense outlined :color="color" class="pt-3 pb-n2">
    <effect-base
      :effect="effect"
      :color="color"
      type="WEAPON PROFILE"
      icon="cci-weapon-profile"
      :inset="inset"
      :transparent="transparent"
      :print="print"
    >
      <div :class="print ? 'caption font-weight-bold black--text mt-n1' : 'heading h3 mt-n2'">
        <span class="accent--text">{{ effect.Name }}</span>
        &nbsp;
        <cc-range-element v-if="effect.Range" :range="effect.Range" small class="d-inline" />
        <cc-slashes />
        <cc-damage-element v-if="effect.Damage" :damage="effect.Damage" small class="d-inline" />
      </div>
      <p
        v-if="effect.Detail"
        :class="print ? 'overline black--text mb-0 pb-0 mt-n1' : 'body-text mb-1'"
        v-html="effect.Detail"
      />
    </effect-base>
  </v-alert>
</template>

<script lang="ts">
import Vue from 'vue'
import EffectBase from '../_ItemEffectBase.vue'

export default Vue.extend({
  name: 'cc-item-profile-effect',
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
})
</script>
