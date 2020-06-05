<template>
  <effect-base
    :effect="effect"
    :color="color"
    type="DEPLOYABLE"
    icon="cci-deployable"
    :inset="inset"
    :transparent="transparent"
    :print="print"
  >
    <div :class="print ? 'caption' : 'effect-text mt-n2 mb-2'">
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
      <cc-tooltip v-if="effect.Evasion" simple inline delay :content="`${effect.Evasion} Evasion`">
        <v-icon>cci-evasion</v-icon>
        {{ effect.Evasion }}
      </cc-tooltip>
      <cc-tooltip v-if="effect.EDef" simple inline delay :content="`${effect.EDef} E-Defense`">
        <v-icon>cci-marker</v-icon>
        {{ effect.EDef }}
      </cc-tooltip>
    </div>
    <p :class="print ? 'overline' : 'body-text mb-1'" v-html="effect.Detail" />
  </effect-base>
</template>

<script lang="ts">
import Vue from 'vue'
import EffectBase from '../_ItemEffectBase.vue'

export default Vue.extend({
  name: 'cc-item-deployable-effect',
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
