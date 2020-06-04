<template>
  <v-row dense justify="center" align="center">
    <v-col
      v-for="n in 3"
      :key="`r_${n}`"
      lg="4"
      md="6"
      sm="12"
      :class="{ locked: ranked && rank < n }"
    >
      <div
        :class="
          `${
            $vuetify.breakpoint.lgAndUp
              ? `text-${n === 1 ? 'left' : n === 2 ? 'center' : 'right'}`
              : 'text-center'
          }`
        "
      >
        <p class="pt-1 mb-1">
          <span class="stat-text subtle--text text--darken-1">
            RANK {{ 'I'.repeat(n) }}
            <v-icon v-if="ranked && rank < n" right>mdi-lock-outline</v-icon>
            <v-icon v-else-if="ranked && rank >= n" right>mdi-lock-open-outline</v-icon>
          </span>
        </p>
        <div v-for="i in license.Unlocks[n - 1]" :key="i.id" class="my-2">
          <cc-item-modal :item="i" :small-btn="$vuetify.breakpoint.mdAndDown" />
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
