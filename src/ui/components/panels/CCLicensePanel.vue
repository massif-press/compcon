<template>
  <v-row density="compact" justify="space-around" dense>
    <v-col
      v-for="n in license.MaxRank"
      :key="`rank-${n}`"
      v-show="license.Unlocks[n - 1].length"
      lg="4"
      md="6"
      cols="12"
      :class="{ locked: ranked && rank < n }">
      <div class="text-center">
        <span class="text-cc-overline text-disabled">
          RANK {{ 'I'.repeat(n) }}
          <v-icon v-if="ranked && rank < n" right>mdi-lock-outline</v-icon>
          <v-icon v-else-if="ranked && rank >= n" right>mdi-lock-open-outline</v-icon>
        </span>
        <div v-for="i in license.Unlocks[n - 1]" :key="i.ID">
          <cc-item-modal :item="i" block />
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
defineOptions({ name: 'cc-license-panel' })

const props = withDefaults(defineProps<{
  license: object
  ranked?: boolean
  rank?: number
}>(), {
  rank: 0
})

function align(n: number) {
      return n === 1 ? 'left' : n === 2 ? 'center' : 'right';
    }
</script>

<style scoped>
.locked {
  opacity: 0.35;
}
</style>
