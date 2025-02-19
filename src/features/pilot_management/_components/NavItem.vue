<template>
  <v-btn
    size="small"
    variant="flat"
    rounded="0"
    :color="selected ? 'white' : 'primary'"
    :class="selected ? 'text-primary' : 'text-white'"
    :to="to"
    :disabled="disabled"
    @click="to ? '' : $emit('clicked')">
    <span class="unskew">
      <slot />
    </span>
  </v-btn>
</template>

<script lang="ts">
export default {
  name: 'nav-item',
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
};
</script>

<style scoped>
.unskew {
  transform: translateZ(0) skew(0.65rad);
}
</style>
