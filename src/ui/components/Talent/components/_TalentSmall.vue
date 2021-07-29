<template>
  <v-col cols="auto">
    <v-menu
      open-on-hover
      :close-on-content-click="false"
      top
      nudge-top="10px"
      offset-y
      open-delay="100"
      close-delay="50"
      max-width="80vw"
      min-width="50vw"
    >
      <template v-slot:activator="{ on }">
        <div style="position: relative" v-on="on">
          <talent-emblem :url="talent.Image" :name="talent.Name" large />
          <div v-if="rank" class="triangle" />
          <div
            v-if="rank"
            class="white--text"
            style="position: absolute; bottom: 0px; right: 0px; z-index: 3"
          >
            <v-icon color="white" size="30">cci-rank-{{ rank }}</v-icon>
          </div>
        </div>
      </template>
      <v-card height="100%">
        <v-toolbar flat dense tile color="primary">
          <span class="heading h3 white--text">{{ talent.Name }}</span>
          <v-spacer />
          <cc-tooltip v-if="hideLocked" :content="`${showAll ? 'Hide' : 'Show'} All`">
            <v-btn small icon class="fadeSelect" @click="showAll = !showAll">
              <v-icon small>mdi-eye</v-icon>
            </v-btn>
          </cc-tooltip>
        </v-toolbar>
        <v-row no-gutters class="fill-height">
          <v-col
            v-for="n in 3"
            v-show="showFull || (!showFull && rank && parseInt(rank) >= n)"
            :key="`rank-col-${n}`"
            cols="12"
            md=""
            style="min-height: 100%"
          >
            <v-card flat tile outlined min-height="100%">
              <v-toolbar
                flat
                dense
                tile
                :color="selectable && parseInt(rank) + 1 === n ? 'secondary' : 'pilot'"
              >
                <span
                  :class="`heading h3 ${
                    !rank || parseInt(rank) >= (selectable ? n - 1 : n)
                      ? 'white--text'
                      : 'pilot--text text--lighten-2'
                  }`"
                >
                  <v-icon
                    left
                    large
                    :color="
                      !rank || parseInt(rank) >= (selectable ? n - 1 : n)
                        ? 'white'
                        : 'pilot lighten-2'
                    "
                  >
                    cci-rank-{{ n }}
                  </v-icon>
                  {{ talent.Rank(n).Name }}
                </span>
              </v-toolbar>
              <v-card-text style="min-height: 100%">
                <talent-rank-contents
                  :talentRank="talent.Rank(n)"
                  :unlocked="!rank || parseInt(rank) >= (selectable ? n - 1 : n)"
                />
              </v-card-text>
              <v-divider v-if="selectable" class="mt-auto" />
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
          </v-col>
        </v-row>
      </v-card>
    </v-menu>
  </v-col>
</template>

<script lang="ts">
import Vue from 'vue'
import TalentRankContents from './_TalentRankContents.vue'
import TalentEmblem from './_TalentEmblem.vue'
export default Vue.extend({
  components: { TalentRankContents, TalentEmblem },
  name: 'talent-small',
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
})
</script>

<style scoped>
.triangle {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 0 55px 55px;
  z-index: 2;
  border-color: transparent transparent var(--v-primary-base) transparent;
}
</style>