<template>
  <v-menu
    open-on-hover
    :close-on-content-click="false"
    top
    nudge-top="10px"
    offset-y
    open-delay="100"
    close-delay="50"
    width="70vw"
    min-width="300px">
    <template #activator="{ props }">
      <span
        class="my-1 mx-3"
        style="position: relative; width: fit-content; display: inline-block"
        v-bind="props">
        <talent-emblem :url="talent.Image" :name="talent.Name" large />
        <span v-if="rank" class="triangle" />
        <div
          v-if="rank"
          class="text-white"
          style="position: absolute; bottom: 0px; right: 0px; z-index: 3">
          <v-icon color="white" size="30">cc:rank_{{ rank }}</v-icon>
        </div>
      </span>
    </template>

    <v-card height="100%" variant="flat" rounded="0">
      <v-toolbar flat density="compact" color="primary">
        <span class="heading h3 text-white px-3">{{ talent.Name }}</span>
        <v-spacer />
        <span v-if="talent.InLcp" class="heading h3 text-white mr-3">{{ talent.LcpName }}</span>
        <cc-tooltip v-if="hideLocked" :content="`${showAll ? 'Hide' : 'Show'} All`">
          <v-btn small icon variant="plain" @click="showAll = !showAll">
            <v-icon small>mdi-eye</v-icon>
          </v-btn>
        </cc-tooltip>
      </v-toolbar>
      <v-row no-gutters class="fill-height">
        <v-col
          v-for="n in 3"
          v-show="showFull || (!showFull && rank && Number(rank) >= n)"
          cols="12"
          md=""
          style="min-height: 100%">
          <v-card rounded="0" variant="outlined" min-height="100%">
            <v-toolbar
              density="compact"
              :color="selectable && Number(rank) + 1 === n ? 'secondary' : 'pilot'"
              class="px-3">
              <span
                :class="`heading h3 ${
                  !rank || Number(rank) >= (selectable ? n - 1 : n)
                    ? 'text-white'
                    : 'text-pilot text--lighten-2'
                }`">
                <v-icon
                  :color="
                    !rank || Number(rank) >= (selectable ? n - 1 : n) ? 'white' : 'pilot lighten-2'
                  ">
                  cc:rank_{{ n }}
                </v-icon>
                {{ talent.Rank(n).Name }}
              </span>
            </v-toolbar>
            <v-card-text style="min-height: 100%">
              <talent-rank-contents
                :talent-rank="talent.Rank(n)"
                :unlocked="!rank || Number(rank) >= (selectable ? n - 1 : n)"
                class="px-1" />
            </v-card-text>
            <v-divider v-if="selectable" class="mt-auto" />
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
        </v-col>
      </v-row>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import TalentRankContents from './_TalentRankContents.vue';
import TalentEmblem from './_TalentEmblem.vue';
export default {
  name: 'talent-small',
  components: { TalentRankContents, TalentEmblem },
  emits: ['add', 'remove'],
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
      if (this.hideLocked) return this.showAll;
      return true;
    },
  },
};
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
  border-color: transparent transparent rgb(var(--v-theme-primary)) transparent;
}
</style>
