<template>
  <v-btn
    tile
    depressed
    :color="selected ? 'white' : 'primary'"
    :class="selected ? 'primary--text' : 'white--text'"
    :to="to"
    :disabled="disabled"
    @click="to ? '' : $emit('clicked')"
  >
    <span class="unskew">
      <slot />
    </span>
  </v-btn>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'cc-nav-item',
  props: {
    to: {
      type: String,
      default: '',
    },
    selected: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
})
</script>

<style scoped>
.unskew {
  transform: skew(0.65rad);
}
</style>
