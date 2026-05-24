<template>
  <div>
    <v-row dense
      align="center"
      class="heading h3 mb-1"
      :class="readonly ? 'pb-4' : ''">
      <v-col cols="auto"
        style="margin-bottom: -2px">Tier</v-col>
      <v-col cols="auto">
        <v-btn v-for="i in 3"
          :key="`tier-${i}`"
          flat
          tile
          size="small"
          icon
          variant="tonal"
          :color="item.NpcClassController.Tier === i ? 'accent' : ''"
          @click="updateTier(i)">
          <span class="heading h3">{{ i }}</span>
        </v-btn>
      </v-col>
    </v-row>

    <cc-solo-dialog v-model="showConfirmation"
      title="Confirm Tier Change"
      icon="mdi-alert"
      min-width="600px"
      :close-on-click="false">
      <div class="heading h3">Change to Tier {{ stagedTier }}</div>
      <v-card-text>
        COMP/CON has detected edited stat values. How would you like to proceed?
      </v-card-text>
      <v-card-actions class="flex-column align-stretch pa-4 ga-2">
        <cc-button block
          size="small"
          prepend-icon="mdi-delta"
          color="accent"
          tooltip="Change tier and adjust edited stats by the same amount as the default stat changes."
          @click="projectAndChange()">
          Change Tier and Project Edits
        </cc-button>
        <cc-button block
          size="small"
          prepend-icon="mdi-pin"
          color="primary"
          tooltip="Change tier and keep edited stat values, even if they fall below the new tier's defaults."
          @click="preserveAndChange()">
          Change Tier and Preserve Edits
        </cc-button>
        <cc-button block
          size="small"
          prepend-icon="mdi-refresh"
          tooltip="Change tier and discard all edited stat values."
          color="warning"
          @click="resetAndChange()">
          Change Tier and Reset Stats
        </cc-button>

        <cc-button block
          size="small"
          color="panel"
          @click="cancel()">
          Cancel
        </cc-button>
      </v-card-actions>
    </cc-solo-dialog>
  </div>
</template>

<script lang="ts">
export default {
  name: 'NpcTierSelector',
  props: { item: { type: Object, required: true }, readonly: { type: Boolean, default: false } },
  emits: ['update'],
  data: () => ({
    showConfirmation: false,
    stagedTier: 0,
  }),
  methods: {
    hasEditedStats(): boolean {
      const maxStats = this.item.StatController.MaxStats
      return this.item.NpcClassController.getClassStats?.().some(
        ({ key, val }) => maxStats[key] !== undefined && maxStats[key] !== val
      ) ?? false
    },
    updateTier(tier: number) {
      if (tier === this.item.NpcClassController.Tier) return
      this.stagedTier = tier
      if (this.hasEditedStats()) {
        this.showConfirmation = true
      } else {
        this.resetAndChange()
      }
    },
    resetAndChange() {
      this.item.NpcClassController.Tier = this.stagedTier
      this.cancel()
    },
    preserveAndChange() {
      const oldDefaults: Record<string, any> = {}
      this.item.NpcClassController.getClassStats?.().forEach(({ key, val }) => {
        oldDefaults[key] = val
      })
      const snapshot = { ...this.item.StatController.MaxStats }
      this.item.NpcClassController.Tier = this.stagedTier
      Object.keys(snapshot).forEach(key => {
        if (key in oldDefaults && snapshot[key] === oldDefaults[key]) return
        this.item.StatController.setMax(key, snapshot[key])
      })
      this.item.SaveController.save()
      this.cancel()
    },
    projectAndChange() {
      const oldDefaults: Record<string, any> = {}
      this.item.NpcClassController.getClassStats?.().forEach(({ key, val }) => {
        oldDefaults[key] = val
      })
      const snapshot = { ...this.item.StatController.MaxStats }
      this.item.NpcClassController.Tier = this.stagedTier
      const newDefaults: Record<string, any> = {}
      this.item.NpcClassController.getClassStats?.().forEach(({ key, val }) => {
        newDefaults[key] = val
      })
      Object.keys(snapshot).forEach(key => {
        if (!(key in oldDefaults) || snapshot[key] === oldDefaults[key]) return
        const diff = snapshot[key] - oldDefaults[key]
        this.item.StatController.setMax(key, (newDefaults[key] ?? snapshot[key]) + diff)
      })
      this.item.SaveController.save()
      this.cancel()
    },
    cancel() {
      this.stagedTier = 0
      this.showConfirmation = false
    },
  },
};
</script>
