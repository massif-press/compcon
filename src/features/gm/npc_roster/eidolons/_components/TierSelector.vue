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

  <tier-change-dialog
    v-model="showConfirmation"
    :tier="stagedTier"
    @keep="changeTier"
  />
</template>

<script setup lang="ts">
  import type { Eidolon } from '@/classes/npc/eidolon/Eidolon'
  import type { TierEdits } from '@/classes/npc/tierChange'
  import { ref } from 'vue'
  import TierChangeDialog from '@/features/gm/npc_roster/npcs/_components/TierChangeDialog.vue'

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
    showConfirmation.value = false
  }
</script>
