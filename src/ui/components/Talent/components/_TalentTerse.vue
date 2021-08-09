<template>
  <v-row dense style="min-width: 100%" :class="$vuetify.breakpoint.smAndDown ? 'mb-3' : ''">
    <v-col v-if="$vuetify.breakpoint.mdAndUp" cols="auto">
      <div
        style="position: relative; border: 1px solid var(--v-primary-base); border-radius: 1px"
        class="pa-2"
      >
        <talent-emblem :url="talent.Image" :name="talent.Name" large />
      </div>
    </v-col>
    <v-col>
      <div class="sliced primary white--text pl-3 ml-n2 heading h2">
        <v-row no-gutters>
          <v-col cols="auto">
            {{ talent.Name }}
            <span v-if="rank" class="flavor-text white--text">
              <cc-slashes />
              RANK {{ 'I'.repeat(rank) }}
            </span>
          </v-col>
          <v-col v-if="talent.InLcp" cols="auto" align-self="center" class="heading h3 ml-auto mr-3 mt-n1">{{ talent.LcpName }}</v-col>
          <v-col cols="auto" class="mr-8 mt-n1">
            <v-btn icon color="white" class="fadeSelect" @click="$emit('expand', 'full')">
              <v-icon>mdi-arrow-expand</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </div>
      <div :class="$vuetify.breakpoint.mdAndUp ? 'box-outline px-2 py-1' : 'px-2'">
        <div v-if="showFull" class="flavor-text mb-2">{{ talent.Terse }}</div>
        <div v-else style="height: 30px" />
        <v-row align="center" justify="space-around" class="text-center" dense>
          <v-col
            v-for="n in 3"
            v-show="showFull || (!showFull && rank && parseInt(rank) >= n)"
            :key="`rank-btn-${n}`"
          >
            <v-menu open-on-hover top offset-y open-delay="100">
              <template v-slot:activator="{ on }">
                <v-btn :block="$vuetify.breakpoint.smAndDown" tile :color="rankColor(n)" v-on="on">
                  <v-icon v-if="!rank || (rank && parseInt(rank) >= n)" left>
                    cci-rank-{{ n }}
                  </v-icon>
                  <v-icon v-else-if="!rank || (rank && parseInt(rank) + 1 === n)" left>
                    mdi-lock-open
                  </v-icon>
                  <v-icon v-else left>mdi-lock</v-icon>
                  {{ talent.Rank(n).Name }}
                </v-btn>
              </template>
              <v-card>
                <v-toolbar flat dense tile color="pilot">
                  <span class="heading h3 white--text">
                    <v-icon left large color="white">cci-rank-{{ n }}</v-icon>
                    {{ talent.Rank(n).Name }}
                  </span>
                </v-toolbar>
                <v-card-text>
                  <talent-rank-contents
                    :talentRank="talent.Rank(n)"
                    :unlocked="!rank || parseInt(rank) >= (selectable ? n - 1 : n)"
                  />
                </v-card-text>
                <v-divider v-if="selectable" />
                <v-card-actions v-if="selectable">
                  <v-spacer />
                  <v-btn
                    v-if="n === parseInt(rank) + 1"
                    small
                    color="secondary"
                    :disabled="!canAdd"
                    @click="$emit('add')"
                  >
                    <v-icon left>mdi-lock-open</v-icon>
                    Unlock {{ talent.Rank(n).Name }}
                  </v-btn>
                  <v-btn v-else-if="n > parseInt(rank)" small disabled>
                    <v-icon left>mdi-lock</v-icon>
                    TALENT RANK LOCKED
                  </v-btn>
                  <v-btn
                    v-else-if="selectable && parseInt(rank) === n"
                    color="error"
                    outlined
                    class="fadeSelect"
                    @click="$emit('remove')"
                  >
                    <v-icon left>mdi-close</v-icon>
                    Remove
                  </v-btn>
                  <div v-else class="text-center">
                    <v-icon left>cci-rank-{{ n }}</v-icon>
                    UNLOCKED
                  </div>
                </v-card-actions>
              </v-card>
            </v-menu>
          </v-col>
        </v-row>
      </div>
    </v-col>
    <v-col v-if="hideLocked" cols="12" class="ma-0 pa-0 mt-n8 ml-n2">
      <v-row no-gutters>
        <v-col cols="auto" class="ml-auto">
          <cc-tooltip :content="`${showAll ? 'Hide' : 'Show'} All`">
            <v-btn small icon class="fadeSelect" @click="showAll = !showAll">
              <v-icon small>mdi-eye</v-icon>
            </v-btn>
          </cc-tooltip>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import TalentEmblem from './_TalentEmblem.vue'
import TalentRankContents from './_TalentRankContents.vue'
export default Vue.extend({
  name: 'talent-terse',
  components: { TalentEmblem, TalentRankContents },
  props: {
    hideLocked: { type: Boolean },
    talent: { type: Object, required: true },
    canAdd: { type: Boolean },
    selectable: { type: Boolean },
    rank: { type: [Number, String], required: false, default: null },
  },
  data: () => ({
    showAll: false,
  }),
  computed: {
    showFull() {
      if (this.hideLocked) return this.showAll
      return true
    },
  },
  methods: {
    rankColor(n) {
      if (!this.rank) return 'primary'
      const rank = parseInt(this.rank)
      if (n <= rank) return 'primary'
      if (this.selectable && n === rank + 1) return 'secondary'
      return 'grey'
    },
  },
})
</script>

<style scoped>
.box-outline {
  min-height: 95px;
  border-bottom: 1px solid var(--v-primary-base);
  border-right: 1px solid var(--v-primary-base);
  margin-left: -8px !important;
}
</style>
