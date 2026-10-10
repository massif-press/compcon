<template>
  <div class="text-overline mt-3">{{ $t('gm.eidolonTier.heading') }}</div>
  <v-row
    dense
    align="center"
  >
    <v-col cols="auto">
      <v-btn
        v-for="i in 3"
        :key="`tier-${i}`"
        :variant="item.Tier === i ? 'tonal' : 'text'"
        :color="item.Tier === i ? 'accent' : ''"
        class="mx-1"
        @click="updateTier(i)"
      >
        <v-icon start>cc:rank_1</v-icon>
        {{ $t('common.tierN', { n: i }) }}
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
</template>

<script setup lang="ts">
  import type { Eidolon } from '@/classes/npc/eidolon/Eidolon'
  import type { TierEdits } from '@/classes/npc/tierChange'
  import { ref } from 'vue'

  defineOptions({ name: 'LayerTierSelector' })

  const props = defineProps<{
    item: Eidolon
  }>()

  const showConfirmation = ref(false)
  const stagedTier = ref(0)

  function updateTier(tier: number) {
    if (tier === props.item.Tier) return
    stagedTier.value = tier
    if (props.item.HasEditedStats) showConfirmation.value = true
    else changeTier('reset')
  }
  function changeTier(keep: TierEdits) {
    props.item.ChangeTier(stagedTier.value, keep)
    cancel()
  }
  function cancel() {
    stagedTier.value = 0
    showConfirmation.value = false
  }
</script>
