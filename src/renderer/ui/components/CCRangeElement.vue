<template>
  <div>
    <div
      v-for="(r, i) in range"
      :key="`rng_${i}`"
      class="text-center mx-1"
      style="display: inline-block"
    >
      <cc-tooltip :title="r.Type" :content="r.Text">
        <span v-if="small">
          <v-icon left color="text">{{ r.Icon }}</v-icon>
          <v-icon v-if="r.Override">mdi-information-outline</v-icon>
          <span v-else>{{ r.Value }}</span>
        </span>
        <div v-else class="clip-icon">
          <v-icon x-large color="text">{{ r.Icon }}</v-icon>
        </div>
      </cc-tooltip>
      <span v-if="!small">{{ r.Value }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'cc-range-element',
  props: {
    range: {
      type: Array,
      required: true,
    },
    small: {
      type: Boolean,
      required: false,
    },
  },
})
</script>
