<template>
  <cc-panel :variant="hideTitle ? 'flat' : 'outlined'" class="my-1" color="surface">
    <template v-if="!hideTitle" #toolbar>
      <v-toolbar color="primary" density="compact" style="position: relative">
        <v-row dense align="center" justify="space-between" style="font-size: calc(20px + 1vw)">
          <v-col cols="auto" class="pl-4 mr-1 py-2" style="position: relative">
            <talent-emblem :url="talent.Image" :name="talent.Name" />
          </v-col>
          <v-col>
            <div class="text-white heading">
              {{ talent.Name }}
            </div>
          </v-col>
          <v-col v-if="rank" cols="auto" class="ml-auto mr-3">
            <v-icon color="white">cc:rank_{{ rank }}</v-icon>
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
    <div style="position: relative">
      <v-card-text v-show="showFull" class="pa-0 mb-1">
        <i v-html-safe="talent.Description" />
      </v-card-text>
      <v-card-text class="px-0">
        <v-row
          v-for="n in 3"
          dense
          v-show="showFull || (!showFull && rank && Number(rank) >= n)"
          :style="!isUnlocked(n) && 'opacity: 0.35'">
          <v-col v-if="!mobile" cols="auto" style="position: relative">
            <v-icon size="40">cc:rank_{{ n }}</v-icon>
            <v-avatar
              v-if="isCurrentlyUnlockable(n)"
              color="accent"
              class="pulse"
              size="25"
              style="position: absolute; top: -3px; right: -3px">
              <v-icon size="18">mdi-lock-open</v-icon>
            </v-avatar>
            <v-icon
              v-else-if="!isUnlocked(n + (selectable ? 1 : 0))"
              icon="mdi-lock"
              style="position: absolute; top: 0; right: 0" />
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
              <v-col cols="12" md="auto" class="ml-auto">
                <v-icon v-if="!mobile && selectable && Number(rank) > n" color="primary" left>
                  mdi-lock-open
                </v-icon>
                <cc-button
                  v-else-if="selectable && Number(rank) + 1 === n"
                  :size="mobile ? 'x-small' : 'small'"
                  color="secondary"
                  :block="mobile"
                  prepend-icon="mdi-lock-open"
                  :disabled="!canAdd"
                  @click="$emit('add')">
                  Unlock
                </cc-button>
                <cc-button
                  v-else-if="selectable && Number(rank) === n"
                  :size="mobile ? 'x-small' : 'small'"
                  color="error"
                  :block="mobile"
                  prepend-icon="mdi-close"
                  @click="$emit('remove')">
                  Remove
                </cc-button>
              </v-col>
            </v-row>
            <talent-rank-contents :talent-rank="talent.Rank(n)" />
          </v-col>
        </v-row>
      </v-card-text>
      <div v-if="hideLocked" style="position: absolute; top: 0; right: -14px">
        <v-tooltip :text="`${showAll ? 'Hide' : 'Show'} All`">
          <template #activator="{ props }">
            <cc-button
              size="x-small"
              variant="text"
              :icon="showAll ? 'mdi-eye-off-outline' : 'mdi-eye'"
              v-bind="props"
              @click="showAll = !showAll"></cc-button>
          </template>
        </v-tooltip>
      </div>
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
      if (this.selectable) {
        if (rank === 1) return true;
        if (Number(this.rank) + 1 >= rank) return true;
        return false;
      }

      if (!this.rank) {
        return true;
      }

      return Number(this.rank) >= rank;
    },
    isCurrentlyUnlockable(rank: number) {
      if (this.selectable) {
        if (Number(this.rank) + 1 === rank) return true;
      }

      return false;
    },
  },
};
</script>

<style scoped>
.pulse {
  animation: talent-pulse 1.5s infinite;
}

@keyframes talent-pulse {
  0% {
    box-shadow: 0 0 0 0px rgb(var(--v-theme-accent));
  }
  100% {
    box-shadow: 0 0 0 6px rgba(0, 0, 0, 0);
  }
}
</style>
