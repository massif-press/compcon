<template>
  <effect-base
    :effect="effect"
    :color="color"
    type="AI"
    icon="mdi-robot"
    :inset="inset"
    :transparent="transparent"
    :print="print"
  >
    <div :class="print ? 'overline black--text mb-2' : 'flavor-text'" v-html="effect.Detail" />
  </effect-base>
</template>

<script lang="ts">
import Vue from 'vue'
import EffectBase from '../_ItemEffectBase.vue'

export default Vue.extend({
  name: 'cc-item-ai-effect',
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
