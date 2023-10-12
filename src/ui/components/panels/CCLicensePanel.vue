<template>
  <v-row dense justify="center" align="center">
    <v-col
      v-for="n in license.MaxRank"
      v-show="license.Unlocks[n - 1].length"
      :key="`r_${n}`"
      lg="4"
      md="6"
      sm="12"
      :class="{ locked: ranked && rank < n }"
    >
      <div class="text-center">
        <p class="pt-1 mb-1">
          <span class="stat-text subtle--text text--darken-1">
            RANK {{ 'I'.repeat(n) }}
            <v-icon v-if="ranked && rank < n" right>mdi-lock-outline</v-icon>
            <v-icon v-else-if="ranked && rank >= n" right>mdi-lock-open-outline</v-icon>
          </span>
        </p>
        <div v-for="i in getLicense.Unlocks[n - 1]" :key="i.ID" class="my-2">
          <cc-item-modal :item="i" :small-btn="$vuetify.breakpoint.mdAndDown" />
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'

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
  computed: {
    getLicense() {
      const licenseData = getModule(CompendiumStore, this.$store).Licenses.find(
        x => x.FrameID === this.license.FrameID
      )
      return licenseData
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
  opacity: 0.35;
}
</style>
