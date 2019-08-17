<template>
  <div>
    <div
      v-for="(r, i) in range"
      :key="`rng_${i}`"
      class="text-center mx-1"
      style="display: inline-block"
    >
      <cc-tooltip :title="r.Type" :content="r.Text">
        <div class="clip-icon">
          <v-icon x-large color="text">{{r.Icon}}</v-icon>
        </div>
      </cc-tooltip>
      <span v-if="!icon">{{r.Value}}</span>
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
    icon: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
})
</script>