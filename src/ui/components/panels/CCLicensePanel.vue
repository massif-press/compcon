<template>
  <v-row>
    <v-col v-for="n in 3" :key="`r_${n}`" cols="4" :class="{ locked: ranked && rank < n }">
      <div :class="`text-${n === 1 ? 'left' : n === 2 ? 'center' : 'right'}`">
        <p class="pt-1">
          <span class="stat-text grey--text text--darken-1">
            RANK {{ 'I'.repeat(n) }}
            <v-icon v-if="ranked && rank < n" right>mdi-lock-outline</v-icon>
            <v-icon v-else-if="ranked && rank >= n" right>mdi-lock-open-outline</v-icon>
          </span>
        </p>
        <div v-for="i in license.Unlocks[n - 1]" :key="i.id" class="my-2">
          <cc-item-modal :item="i" />
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'cc-license-panel',
  props: {
    license: {
      type: Object,
      required: true,
    },
    ranked: {
      type: Boolean,
      required: false,
    },
    rank: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  methods: {
    align(n: number): string {
      return n === 1 ? 'left' : n === 2 ? 'center' : 'right'
    },
  },
})
</script>

<style scoped>
.locked {
  background-color: var(--v-panel-base);
}
</style>
