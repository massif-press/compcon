<template>
  <v-btn
    tile
    depressed
    :color="selected ? 'white' : 'primary'"
    :class="{
      'primary--text': selected
    }"
    :to="to"
    :disabled="disabled"
  >
    <span class="unskew">
      <slot />
    </span>
  </v-btn>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'nav-item',
  props: {
    to: {
      type: String,
      default: ''
    },
    selected: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  }
})
</script>

<style scoped>
.unskew {
  transform: skew(0.65rad);
}
</style>