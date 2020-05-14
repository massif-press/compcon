<template>
  <div :class="print ? '' : 'mt-1 mb-3'">
    <item-effect
      v-for="(e, n) in effects"
      :key="ie_key + n"
      :effect="e"
      :transparent="transparent"
      :inset="inset"
      :print="print"
    />
  </div>
</template>

<script>
import ItemEffect from './_ItemEffectWrapper.vue'

export default {
  name: 'cc-item-effect-panel',
  components: { ItemEffect },
  props: {
    effects: {
      type: [Array, Object],
      required: true,
    },
    inset: {
      type: Boolean,
    },
    transparent: {
      type: Boolean,
    },
    print: {
      type: Boolean,
    },
  },
  created() {
    this.ie_key = Math.random()
      .toString(36)
      .substring(2, 5)
  },
}
</script>
