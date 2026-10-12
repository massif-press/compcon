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

    <tier-change-dialog
      v-model="showConfirmation"
      :tier="stagedTier"
      @keep="changeTier"
    />
  </div>
</template>

<script setup lang="ts">
  import type { Unit } from '@/classes/npc/unit/Unit'
  import { ref } from 'vue'
  import TierChangeDialog from './TierChangeDialog.vue'
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
    showConfirmation.value = false
  }
</script>
