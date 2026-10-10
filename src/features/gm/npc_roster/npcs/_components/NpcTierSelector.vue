<template>
  <div>
    <v-row
      dense
      align="center"
      class="heading h3 mb-1"
      :class="readonly ? 'pb-4' : ''"
    >
      <v-col
        cols="auto"
        style="margin-bottom: -2px"
      >
        {{ $t('common.tier') }}
      </v-col>
      <v-col cols="auto">
        <v-btn
          v-for="i in 3"
          :key="`tier-${i}`"
          flat
          tile
          size="small"
          icon
          variant="tonal"
          :color="item.NpcClassController.Tier === i ? 'accent' : ''"
          @click="updateTier(i)"
        >
          <span class="heading h3">{{ i }}</span>
        </v-btn>
      </v-col>
    </v-row>

    <cc-dialog
      v-model="showConfirmation"
      :title="$t('gm.npcTierSelector.confirmTierChange')"
      icon="mdi-alert"
      min-width="600px"
      :close-on-click="false"
    >
      <div class="heading h3">{{ $t('gm.tier.changeTo', { n: stagedTier }) }}</div>
      <v-card-text>{{ $t('gm.tier.detectedEdits') }}</v-card-text>
      <v-card-actions class="flex-column align-stretch pa-4 ga-2">
        <cc-button
          block
          size="small"
          prepend-icon="mdi-delta"
          color="accent"
          :tooltip="$t('gm.npcTierSelector.tierChangeAdjustEdited')"
          @click="changeTier('project')"
        >
          {{ $t('gm.tier.projectEdits') }}
        </cc-button>
        <cc-button
          block
          size="small"
          prepend-icon="mdi-pin"
          color="primary"
          :tooltip="$t('gm.npcTierSelector.tierChangeKeepEdited')"
          @click="changeTier('preserve')"
        >
          {{ $t('gm.tier.preserveEdits') }}
        </cc-button>
        <cc-button
          block
          size="small"
          prepend-icon="mdi-refresh"
          :tooltip="$t('gm.npcTierSelector.tierChangeDiscardEdited')"
          color="warning"
          @click="changeTier('reset')"
        >
          {{ $t('gm.tier.resetStats') }}
        </cc-button>

        <cc-button
          block
          size="small"
          color="panel"
          @click="cancel()"
        >
          {{ $t('common.cancel') }}
        </cc-button>
      </v-card-actions>
    </cc-dialog>
  </div>
</template>

<script setup lang="ts">
  import type { Unit } from '@/classes/npc/unit/Unit'
  import { ref } from 'vue'
  import { statEdits, restoreEdits, type StatTable, type TierEdits } from '@/classes/npc/tierChange'

  const props = withDefaults(
    defineProps<{
      item: Unit
      readonly?: boolean
    }>(),
    {
      readonly: false,
    }
  )

  const emit = defineEmits<{
    update: []
  }>()

  const showConfirmation = ref(false)
  const stagedTier = ref(0)

  function classStats(): StatTable {
    return Object.fromEntries(
      (props.item.NpcClassController.getClassStats?.() ?? []).map(({ key, val }) => [key, val])
    )
  }
  function updateTier(tier: number) {
    if (tier === props.item.NpcClassController.Tier) return
    stagedTier.value = tier
    if (statEdits(props.item.StatController, classStats()).length) {
      showConfirmation.value = true
    } else {
      changeTier('reset')
    }
  }
  function changeTier(keep: TierEdits) {
    const edits = statEdits(props.item.StatController, classStats())
    props.item.NpcClassController.Tier = stagedTier.value
    restoreEdits(props.item.StatController, edits, keep)
    props.item.SaveController.save()
    cancel()
  }
  function cancel() {
    stagedTier.value = 0
    showConfirmation.value = false
  }
</script>
