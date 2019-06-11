<template>
  <v-expansion-panel-content>
    <v-toolbar-title slot="header" v-if="talent.err" dense>
      <span class="subheading grey--text">// MISSING DATA //</span>
      &emsp;
    </v-toolbar-title>

    <v-toolbar-title slot="header" v-else dense>
      <v-icon
        v-if="pilotTalent"
        color="primary"
        v-html="`cc-rank-${pilotTalent.Rank}`"
      />
      <span>{{ talent.name }}</span>
    </v-toolbar-title>

    <div v-if="!talent.err">
      <v-card>
        <v-card-title>
          <p class="fluff-text mb-0 pb-0 pt-0" v-html="talent.description" />
        </v-card-title>
      </v-card>
      <v-card
        v-for="(r, index) in talent.Ranks"
        :key="r.name + index + rank()"
        :color="isLocked(index) ? 'grey lighten-4' : ''"
      >
        <v-card-title primary-title class="pb-0 pt-0 mb-0">
          <div style="width:100%">
            <div class="title">
              <v-icon
                class="mt-2"
                :color="isLocked(index) ? 'grey darken-2' : 'primary'"
                v-html="
                  isLocked(index) ? `mdi-lock-outline` : `cc-rank-${index + 1}`
                "
              />
              {{ r.name }}
            </div>
            <p class="pl-4 effect-text" v-html="r.description" />
            <div v-if="(newPilot && index === 0) || !newPilot">
              <div class="ma-2 mr-5 ml-5" v-if="selectable">
                <v-btn
                  v-if="available && rank() === index"
                  block
                  color="primary"
                  @click="addTalent()"
                >
                  Unlock {{ talent.name }} Rank {{ roman(index + 1) }}:
                  {{ r.name }}
                </v-btn>
                <v-btn
                  v-else-if="rank() === index + 1"
                  block
                  flat
                  color="warning"
                  @click="removeTalent()"
                >
                  Unlearn {{ talent.name }} Rank {{ roman(index + 1) }}:
                  {{ r.name }}
                </v-btn>
              </div>
            </div>
          </div>
        </v-card-title>
      </v-card>
    </div>
  </v-expansion-panel-content>
</template>

<script lang="ts">
import Vue from 'vue'
import { PilotTalent, Talent } from '@/class'

export default Vue.extend({
  name: 'talent-item',
  props: {
    pilotTalent: PilotTalent,
    talent: Talent,
    newPilot: Boolean,
    selectable: Boolean,
    available: Boolean,
  },
  methods: {
    isLocked(target: number): boolean {
      return !(this.rank() >= target + 1)
    },
    addTalent() {
      this.$emit('add')
    },
    removeTalent() {
      this.$emit('remove')
    },
    rank(): number {
      return this.pilotTalent ? this.pilotTalent.Rank : 0
    },
    roman(int: number): string {
      return 'I'.repeat(int)
    },
  },
})
</script>

<style scoped>
.locked {
  background-color: lightgray;
  cursor: not-allowed;
}
</style>
