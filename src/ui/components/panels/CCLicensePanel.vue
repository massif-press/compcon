<template>
  <v-row density="compact" justify="space-around">
    <v-col
      v-for="n in license.MaxRank"
      v-show="license.Unlocks[n - 1].length"
      lg="4"
      md="6"
      cols="12"
      :class="{ locked: ranked && rank < n }">
      <div class="text-center">
        <p class="pa-0">
          <span class="text-cc-overline text-disabled">
            RANK {{ 'I'.repeat(n) }}
            <v-icon v-if="ranked && rank < n" right>mdi-lock-outline</v-icon>
            <v-icon v-else-if="ranked && rank >= n" right>mdi-lock-open-outline</v-icon>
          </span>
        </p>
        <div v-for="i in license.Unlocks[n - 1]">
          <cc-item-modal :item="i" block />
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
export default {
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
      return n === 1 ? 'left' : n === 2 ? 'center' : 'right';
    },
  },
};
</script>

<style scoped>
.locked {
  opacity: 0.35;
}
</style>
