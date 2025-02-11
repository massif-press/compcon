<template>
  <cc-panel :variant="hideTitle ? 'flat' : 'outlined'" class="my-1" color="surface">
    <template v-if="!hideTitle" #toolbar>
      <v-toolbar color="primary" density="compact" style="position: relative">
        <v-row dense align="center">
          <v-col cols="auto" class="pl-4 mr-1 py-2">
            <talent-emblem :url="talent.Image" :name="talent.Name" />
          </v-col>
          <v-col>
            <div class="text-white heading h1" style="line-height: 40px">{{ talent.Name }}</div>
          </v-col>
          <v-col v-if="rank" cols="auto" class="ml-auto mr-3">
            <v-icon size="45" color="white">cc:rank_{{ rank }}</v-icon>
          </v-col>
          <v-col cols="auto" align-self="start" class="pa-2">
            <v-tooltip v-if="talent.InLcp" bottom>
              <template #activator="{ props }">
                <v-icon v-bind="props" icon="cc:content_manager" />
              </template>
              <span>{{ talent.LcpName }}</span>
            </v-tooltip>
          </v-col>
          <v-col v-if="!hideChange" cols="auto" align-self="center" class="pr-4">
            <v-icon color="white" variant="plain" @click="$emit('expand', 'terse')">
              mdi-arrow-collapse
            </v-icon>
          </v-col>
        </v-row>
      </v-toolbar>
    </template>
    <v-card-text v-show="showFull" class="pa-0 mb-1">
      <i v-html-safe="talent.Description" />
    </v-card-text>
    <v-card-text class="px-0">
      <v-row
        v-for="n in 3"
        dense
        v-show="showFull || (!showFull && rank && Number(rank) >= n)"
        :class="rank && Number(rank) < n ? 'text--disabled' : 'text-stark'"
        :style="isUnlocked(n - 1) ? '' : 'opacity: 0.35'">
        <v-col v-if="!mobile" cols="auto">
          <v-icon size="40">cc:rank_{{ n }}</v-icon>
        </v-col>
        <v-col>
          <v-row no-gutters class="heading h3" align="center">
            <v-col cols="auto">
              <v-icon v-if="mobile">cc:rank_{{ n }}</v-icon>
              {{ talent.Rank(n).Name }}
            </v-col>
            <v-col>
              <v-divider class="mx-2" />
            </v-col>
            <v-col cols="auto" class="ml-auto">
              <v-icon v-if="selectable && Number(rank) > n" color="primary" left>
                mdi-lock-open
              </v-icon>
              <v-btn
                v-else-if="selectable && Number(rank) + 1 === n"
                small
                color="secondary"
                :disabled="!canAdd"
                @click="$emit('add')">
                <v-icon start small>mdi-lock-open</v-icon>
                Unlock
              </v-btn>
              <v-btn
                v-else-if="selectable && Number(rank) === n"
                small
                color="error"
                variant="plain"
                @click="$emit('remove')">
                <v-icon start>mdi-close</v-icon>
                Remove
              </v-btn>
            </v-col>
          </v-row>
          <talent-rank-contents :talent-rank="talent.Rank(n)" />
        </v-col>
      </v-row>
    </v-card-text>
    <div v-if="hideLocked" style="position: absolute; bottom: -4px; right: -4px">
      <cc-tooltip :content="`${showAll ? 'Hide' : 'Show'} All`">
        <v-btn size="small" icon variant="plain" @click="showAll = !showAll">
          <v-icon :icon="showAll ? 'mdi-eye-off-outline' : 'mdi-eye'" />
        </v-btn>
      </cc-tooltip>
    </div>
  </cc-panel>
</template>

<script lang="ts">
import TalentEmblem from './_TalentEmblem.vue';
import TalentRankContents from './_TalentRankContents.vue';

export default {
  name: 'talent-full',
  components: { TalentEmblem, TalentRankContents },
  emits: ['expand', 'add', 'remove'],
  props: {
    hideLocked: { type: Boolean },
    talent: { type: Object, required: true },
    selectable: { type: Boolean },
    canAdd: { type: Boolean },
    hideChange: { type: Boolean },
    hideTitle: { type: Boolean },
    inColumn: { type: Boolean },
    rank: { type: [Number, String], required: false, default: null },
  },
  data: () => ({
    showAll: false,
  }),
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
    showFull() {
      if (this.hideLocked) return this.showAll;
      return true;
    },
  },
  methods: {
    isUnlocked(rank: number) {
      // !rank || Number(rank) >= (selectable ? n - 1 : n)
      if (!this.rank) return true;
      return Number(this.rank) >= rank;
    },
  },
};
</script>
