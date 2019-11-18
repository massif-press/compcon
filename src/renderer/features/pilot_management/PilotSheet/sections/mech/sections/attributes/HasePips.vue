<template>
  <cc-tooltip simple :content="`${attr.toUpperCase()}: ${val}`">
    <span class="overline no-height ml-n1">{{ attr }}</span>
    <br />
    <div class="mt-n2 ml-1">
      <span class="no-height ml-n1">
        <v-icon
          v-for="n in val"
          :key="`hase_${attr}-${n}`"
          small
          :color="color"
          v-html="'mdi-hexagon'"
        />
      </span>
      <span :class="`no-height ${val ? 'ml-n1' : ''}`">
        <v-icon
          v-for="n in 6 - val"
          :key="`hase_${attr}-n${n}`"
          small
          color="grey"
          v-html="'mdi-hexagon-outline'"
        />
      </span>
    </div>
  </cc-tooltip>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'hase-pips',
  props: {
    attr: {
      type: String,
      required: true,
    },
    val: {
      type: Number,
      required: true,
    },
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
  },
  data: () => ({
    // TODO: get from rules
    maxHASE: 6,
  }),
})
</script>

<style scoped>
.no-height {
  line-height: 0;
}
</style>
