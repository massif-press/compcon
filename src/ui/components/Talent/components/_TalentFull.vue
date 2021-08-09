<template>
  <v-card flat tile class="my-1" width="100%">
    <v-toolbar flat color="primary">
      <v-row no-gutters align="center">
        <v-col cols="auto">
          <talent-emblem :url="talent.Image" :name="talent.Name" white />
        </v-col>
        <v-col>
          <div class="white--text heading h1 ml-2">{{ talent.Name }}</div>
        </v-col>
        <v-col v-if="rank" cols="auto" class="ml-auto mr-3">
          <v-icon size="45" color="white">cci-rank-{{ rank }}</v-icon>
        </v-col>
        <v-col v-if="talent.InLcp" cols="auto" class="mr-3">
          <div class="white--text heading h3">{{ talent.LcpName }}</div>
        </v-col>
        <v-col cols="auto" align-self="center">
          <v-icon color="white" class="fadeSelect mr-n2" @click="$emit('expand', 'terse')">
            mdi-arrow-collapse
          </v-icon>
        </v-col>
      </v-row>
    </v-toolbar>
    <v-card-text v-show="showFull" class="mb-0 pb-0">
      <div class="flavor-text" v-html-safe="talent.Description" />
    </v-card-text>
    <v-card-text>
      <v-row
        v-for="n in 3"
        v-show="showFull || (!showFull && rank && parseInt(rank) >= n)"
        :key="`rank-layout-${n}`"
        dense
        :class="rank && parseInt(rank) < n ? 'text--disabled' : 'stark--text'"
      >
        <v-col cols="auto">
          <v-icon x-large>cci-rank-{{ n }}</v-icon>
        </v-col>
        <v-col>
          <v-row no-gutters class="heading h3" align="center">
            <v-col cols="auto">
              {{ talent.Rank(n).Name }}
            </v-col>
            <v-col>
              <v-divider class="mx-2" />
            </v-col>
            <v-col cols="auto" class="ml-auto">
              <v-icon v-if="selectable && parseInt(rank) > n" color="primary" left>
                mdi-lock-open
              </v-icon>
              <v-btn
                v-else-if="selectable && parseInt(rank) + 1 === n"
                small
                color="secondary"
                :disabled="!canAdd"
                @click="$emit('add')"
              >
                <v-icon left small>mdi-lock-open</v-icon>
                Unlock
              </v-btn>
              <v-btn
                v-else-if="selectable && parseInt(rank) === n"
                small
                color="error"
                outlined
                class="fadeSelect"
                @click="$emit('remove')"
              >
                <v-icon left>mdi-close</v-icon>
                Remove
              </v-btn>
            </v-col>
          </v-row>
          <talent-rank-contents
            :talentRank="talent.Rank(n)"
            :unlocked="!rank || parseInt(rank) >= (selectable ? n - 1 : n)"
          />
        </v-col>
      </v-row>
    </v-card-text>
    <v-row v-if="hideLocked" no-gutters>
      <v-col cols="auto" class="ml-auto">
        <cc-tooltip :content="`${showAll ? 'Hide' : 'Show'} All`">
          <v-btn small icon class="fadeSelect" @click="showAll = !showAll">
            <v-icon small>mdi-eye</v-icon>
          </v-btn>
        </cc-tooltip>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import TalentEmblem from './_TalentEmblem.vue'
import TalentRankContents from './_TalentRankContents.vue'

export default Vue.extend({
  name: 'talent-full',
  components: { TalentEmblem, TalentRankContents },
  data: () => ({
    showAll: false,
  }),
  computed: {
    showFull() {
      if (this.hideLocked) return this.showAll
      return true
    },
  },
  props: {
    hideLocked: { type: Boolean },
    talent: { type: Object, required: true },
    selectable: { type: Boolean },
    canAdd: { type: Boolean },
    rank: { type: [Number, String], required: false, default: null },
  },
})
</script>
