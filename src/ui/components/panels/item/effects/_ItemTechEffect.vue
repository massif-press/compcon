<template>
  <effect-base
    :effect="effect"
    :color="color"
    type="TECH"
    no-icon
    :inset="inset"
    :transparent="transparent"
    :print="print"
  >
    <div v-if="!print && effect.Options && effect.Options.length" class="flavor-text">
      Gain the following {{ effect.OptionSet }} options:
    </div>
    <div
      v-if="effect.Detail && effect.Options && effect.Options.length"
      :class="print ? 'overline' : 'body-text'"
      v-html="effect.Detail"
    />
    <v-alert
      v-for="o in effect.Options"
      :key="o.Name"
      dense
      outlined
      :color="color"
      class="py-1 mx-3 mb-1"
    >
      <effect-base
        :effect="o"
        :color="color"
        :type="`${o.Activation} Tech // ${effect.OptionSet.toUpperCase()}`"
        icon="mdi-console-network"
        :inset="inset"
        :transparent="transparent"
        :print="print"
      >
        <div
          :class="print ? 'caption font-weight-bold black--text' : 'effect-text mt-n2'"
          v-html="o.Name"
        />
        <p :class="print ? 'overline black--text mb-0' : 'body-text mb-1'" v-html="o.Detail" />
      </effect-base>
    </v-alert>
    <v-alert
      v-if="!effect.Options || !effect.Options.length"
      dense
      outlined
      :color="color"
      class="py-1 mx-3 mb-0"
    >
      <effect-base
        :effect="effect"
        :color="color"
        :type="`${effect.Activation} Tech`"
        icon="mdi-console-network"
        :inset="inset"
        :transparent="transparent"
        :print="print"
      >
        <div :class="print ? 'caption black--text' : 'effect-text mt-n2'" v-html="effect.Name" />
        <p :class="print ? 'overline black--text mb-0' : 'body-text mb-1'" v-html="effect.Detail" />
      </effect-base>
    </v-alert>
  </effect-base>
</template>

<script lang="ts">
import Vue from 'vue'
import EffectBase from '../_ItemEffectBase.vue'

export default Vue.extend({
  name: 'cc-item-tech-effect',
  components: { EffectBase },
  props: {
    effect: {
      type: Object,
      required: true,
    },
    color: {
      type: String,
      required: false,
      default: 'action--tech',
    },
    inset: { type: Boolean },
    transparent: { type: Boolean },
    print: { type: Boolean },
  },
})
</script>
