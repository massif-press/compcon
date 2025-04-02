<template>
  <v-row no-gutters style="min-width: 100%" class="my-2">
    <v-col v-if="!$vuetify.display.mdAndDown" cols="auto">
      <div
        style="
          position: relative;
          border: 1px solid rgb(var(--v-theme-primary));
          border-radius: 1px;
        "
        class="pa-3">
        <talent-emblem :talent="talent" size="large" />
      </div>
    </v-col>
    <v-col>
      <div
        class="sliced text-white heading h2 px-3 mt-n1 mb-1"
        style="background-color: rgb(var(--v-theme-primary))">
        <v-row dense align="center" class="mt-1">
          <v-col cols="auto">
            {{ talent.Name }}
            <span v-if="rank" class="flavor-text text-white pr-6">
              <cc-slashes />
              RANK {{ 'I'.repeat(Number(rank)) }}
            </span>
          </v-col>
          <v-col
            v-if="talent.InLcp"
            cols="auto"
            align-self="center"
            class="heading h3 ml-auto mr-3 mt-n1">
            {{ talent.LcpName }}
          </v-col>
          <v-col v-if="!hideChange" cols="auto" class="mr-8 mt-n1">
            <v-btn size="small" icon color="white" variant="plain" @click="$emit('expand', 'full')">
              <v-icon icon="mdi-arrow-expand" />
            </v-btn>
          </v-col>
        </v-row>
      </div>
      <div class="box-outline px-2">
        <div v-if="showFull" class="flavor-text mb-2 px-3">{{ talent.Terse }}</div>
        <div v-else style="height: 30px" />
        <v-row align="center" justify="space-around" class="text-center" density="compact">
          <v-col v-for="n in 3" v-show="showFull || (!showFull && rank && Number(rank) >= n)">
            <v-menu open-on-hover top offset-y open-delay="100">
              <template #activator="{ props }">
                <v-btn
                  :block="$vuetify.display.mdAndDown"
                  tile
                  :color="rankColor(n)"
                  v-bind="props">
                  <v-icon v-if="!rank || (rank && Number(rank) >= n)" start>cc:rank_{{ n }}</v-icon>
                  <v-icon v-else-if="!rank || (rank && Number(rank) + 1 === n)" left>
                    mdi-lock-open
                  </v-icon>
                  <v-icon v-else left>mdi-lock</v-icon>
                  {{ talent.Rank(n).Name }}
                </v-btn>
              </template>
              <v-card>
                <v-toolbar flat density="compact" tile color="pilot">
                  <span class="heading h3 text-white">
                    <v-icon start large color="white">cc:rank_{{ n }}</v-icon>
                    {{ talent.Rank(n).Name }}
                  </span>
                </v-toolbar>
                <v-card-text>
                  <talent-rank-contents
                    :talent-rank="talent.Rank(n)"
                    :unlocked="!rank || Number(rank) >= (selectable ? n - 1 : n)" />
                </v-card-text>
                <v-divider v-if="selectable" />
                <v-card-actions v-if="selectable">
                  <v-spacer />
                  <v-btn
                    v-if="n === Number(rank) + 1"
                    small
                    color="secondary"
                    :disabled="!canAdd"
                    @click="$emit('add')">
                    <v-icon start>mdi-lock-open</v-icon>
                    Unlock {{ talent.Rank(n).Name }}
                  </v-btn>
                  <v-btn v-else-if="n > Number(rank)" small disabled>
                    <v-icon start>mdi-lock</v-icon>
                    TALENT RANK LOCKED
                  </v-btn>
                  <v-btn
                    v-else-if="selectable && Number(rank) === n"
                    color="error"
                    variant="plain"
                    @click="$emit('remove')">
                    <v-icon start>mdi-close</v-icon>
                    Remove
                  </v-btn>
                  <div v-else class="text-center">
                    <v-icon start>cc:rank_{{ n }}</v-icon>
                    UNLOCKED
                  </div>
                </v-card-actions>
              </v-card>
            </v-menu>
          </v-col>
        </v-row>
      </div>
    </v-col>
    <v-col v-if="hideLocked" cols="12" style="position: relative">
      <div style="position: absolute; bottom: -4px; right: -4px">
        <cc-tooltip :content="`${showAll ? 'Hide' : 'Show'} All`">
          <v-btn size="small" icon variant="plain" @click="showAll = !showAll">
            <v-icon>mdi-eye</v-icon>
          </v-btn>
        </cc-tooltip>
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import TalentEmblem from './_TalentEmblem.vue';
import TalentRankContents from './_TalentRankContents.vue';

export default {
  name: 'talent-terse',
  components: { TalentEmblem, TalentRankContents },
  props: {
    hideLocked: { type: Boolean },
    talent: { type: Object, required: true },
    canAdd: { type: Boolean },
    selectable: { type: Boolean },
    hideChange: { type: Boolean },
    rank: { type: [Number, String], required: false, default: null },
  },
  emits: ['expand', 'add', 'remove'],
  data: () => ({
    showAll: false,
  }),
  computed: {
    showFull() {
      if (this.hideLocked) return this.showAll;
      return true;
    },
  },
  methods: {
    rankColor(n): string {
      if (!this.rank) return 'primary';
      const rank = Number(this.rank);
      if (n <= rank) return 'primary';
      if (this.selectable && n === rank + 1) return 'secondary';
      return 'grey';
    },
  },
};
</script>

<style scoped>
.box-outline {
  min-height: 95px;
  border-bottom: 1px solid rgb(var(--v-theme-primary));
  border-right: 1px solid rgb(var(--v-theme-primary));
  margin-left: -8px !important;
}
</style>
