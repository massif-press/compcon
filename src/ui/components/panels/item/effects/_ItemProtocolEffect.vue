<template>
  <effect-base
    :effect="effect"
    :color="color"
    type="PROTOCOL"
    icon="cci-protocol"
    :inset="inset"
    :transparent="transparent"
    :print="print"
  >
    <div class="effect-text mt-n2">
      {{ effect.Name }}
    </div>
    <p :class="print ? 'overline' : 'body-text mt-n1 mb-1'" v-html="effect.Detail" />
  </effect-base>
</template>

<script lang="ts">
import Vue from 'vue'
import EffectBase from '../_ItemEffectBase.vue'

export default Vue.extend({
  name: 'cc-item-protocol-effect',
  components: { EffectBase },
  props: {
    effect: {
      type: Object,
      required: true,
    },
    color: {
      type: String,
      required: false,
      default: 'action--protocol',
    },
    inset: { type: Boolean },
    transparent: { type: Boolean },
    print: { type: Boolean },
  },
})
</script>
