<template>
  <div>
    <v-checkbox
      v-for="n in max"
      :key="`chk_${n - 1}`"
      v-model="model"
      :value="n - 1"
      :class="`d-inline ma-0 ${right ? 'mr-n2' : ''} ${left ? 'ml-n2' : ''}`"
      :ripple="false"
      :off-icon="emptyIcon"
      :on-icon="fullIcon"
      dense
      hide-details
      :small="small"
      :large="large"
      :color="color"
      @click.native.stop
      @change="$emit('set', model.length)"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'cc-item-uses',
  props: {
    current: {
      type: Number,
      required: false,
      default: 0,
    },
    max: {
      type: Number,
      required: true,
    },
    small: {
      type: Boolean,
      required: false,
    },
    large: {
      type: Boolean,
      required: false,
    },
    right: {
      type: Boolean,
      required: false,
    },
    left: {
      type: Boolean,
      required: false,
    },
    emptyIcon: {
      type: String,
      required: false,
      default: 'mdi-hexagon-outline',
    },
    fullIcon: {
      type: String,
      required: false,
      default: 'mdi-hexagon-slice-6',
    },
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
  },
  data: () => ({
    model: [],
  }),
  created() {
    for (let i = 0; i < this.current; i++) {
      this.model.push(i)
    }
  },
})
</script>

<style>
.d-inline .v-input__slot {
  display: inline !important;
}

.d-inline .v-input__control {
  display: inline !important;
}
</style>