<template>
  <div>
    <v-checkbox
      v-for="n in max"
      :key="`chk_${n - 1}`"
      v-model="model"
      :value="n - 1"
      :class="
        `fs-override d-inline ma-0 ${right ? 'mr-n2' : ''} ${left ? 'ml-n2' : ''} ${
          large ? 'mt-4 cb-lg' : small ? 'cb-sm' : 'cb-md'
        }`
      "
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

.fs-override i {
  font-size: inherit !important;
}

.cb-lg input,
.cb-lg .v-input input {
  width: 50px !important;
  height: 50px !important;
}

.cb-lg {
  font-size: 60px !important;
  padding-left: 20px;
}

.cb-md {
  font-size: 30px !important;
  padding-left: 5px;
}

.cb-sm {
  font-size: 20px !important;
}
</style>
