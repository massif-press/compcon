<template>
  <v-card flat class="pt-0">
    <v-card-text class="pt-0">
      <v-row class="text-center">
        <v-col v-for="n in 3" :key="`r_${n}`" xs4 :class="{ locked: rank && rank < n }">
          <p class="text-center pt-2 subheading font-weight-bold">
            <span class="grey-text">
              RANK {{ 'I'.repeat(n) }}
              <v-icon v-if="rank && rank < n" right>mdi-lock-outline</v-icon>
              <v-icon v-else-if="rank && rank >= n" right>mdi-lock-open-outline</v-icon>
            </span>
          </p>
          <div v-for="i in license.Unlocks[n - 1]" :key="i.id" class="my-2">
            <cc-item-modal :item="i" />
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
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
    rank: {
      type: Number,
      required: true,}
  },
})
</script>

<style scoped>
.locked {
  background-color: var(--v-panel-base);
}
</style>
