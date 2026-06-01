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

    <cc-dialog v-model="showConfirmation"
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
    </cc-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(defineProps<{
  item: object
  readonly?: boolean
}>(), {
  readonly: false
})

const emit = defineEmits<{
  'update': []
}>()

const showConfirmation = ref(false)
const stagedTier = ref(0)

function hasEditedStats() {
      const maxStats = props.item.StatController.MaxStats
      return props.item.NpcClassController.getClassStats?.().some(
        ({ key, val }) => maxStats[key] !== undefined && maxStats[key] !== val
      ) ?? false
    }
function updateTier(tier: number) {
      if (tier === props.item.NpcClassController.Tier) return
      stagedTier.value = tier
      if (hasEditedStats()) {
        showConfirmation.value = true
      } else {
        resetAndChange()
      }
    }
function resetAndChange() {
      props.item.NpcClassController.Tier = stagedTier.value
      cancel()
    }
function preserveAndChange() {
      const oldDefaults: Record<string, any> = {}
      props.item.NpcClassController.getClassStats?.().forEach(({ key, val }) => {
        oldDefaults[key] = val
      })
      const snapshot = { ...props.item.StatController.MaxStats }
      props.item.NpcClassController.Tier = stagedTier.value
      Object.keys(snapshot).forEach(key => {
        if (key in oldDefaults && snapshot[key] === oldDefaults[key]) return
        props.item.StatController.setMax(key, snapshot[key])
      })
      props.item.SaveController.save()
      cancel()
    }
function projectAndChange() {
      const oldDefaults: Record<string, any> = {}
      props.item.NpcClassController.getClassStats?.().forEach(({ key, val }) => {
        oldDefaults[key] = val
      })
      const snapshot = { ...props.item.StatController.MaxStats }
      props.item.NpcClassController.Tier = stagedTier.value
      const newDefaults: Record<string, any> = {}
      props.item.NpcClassController.getClassStats?.().forEach(({ key, val }) => {
        newDefaults[key] = val
      })
      Object.keys(snapshot).forEach(key => {
        if (!(key in oldDefaults) || snapshot[key] === oldDefaults[key]) return
        const diff = snapshot[key] - oldDefaults[key]
        props.item.StatController.setMax(key, (newDefaults[key] ?? snapshot[key]) + diff)
      })
      props.item.SaveController.save()
      cancel()
    }
function cancel() {
      stagedTier.value = 0
      showConfirmation.value = false
    }
</script>
