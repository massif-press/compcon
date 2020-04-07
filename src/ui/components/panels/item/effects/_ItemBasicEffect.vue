<template>
  <effect-base :effect="effect" :inset="inset" :transparent="transparent" :print="print">
    <div :class="print ? 'caption' : 'effect-text mt-n2'" v-html="effect.Name" />
    <p class="pt-0 mb-1 body-text" v-html="effect.Detail" />
  </effect-base>
</template>

<script lang="ts">
import Vue from 'vue'
import EffectBase from '../_ItemEffectBase.vue'

export default Vue.extend({
  name: 'cc-item-basic-effect',
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
