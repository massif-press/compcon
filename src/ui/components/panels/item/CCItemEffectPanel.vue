<template>
  <div class="my-1">
    <item-effect
      v-for="(e, n) in effects"
      :key="ie_key + n"
      :effect="e"
      :transparent="transparent"
      :inset="inset"
    />
  </div>
</template>

<script>
import ItemEffect from './_ItemEffectPanelBase.vue'

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
  },
  created() {
    this.ie_key = Math.random()
      .toString(36)
      .substring(2, 5)
  },
}
</script>
