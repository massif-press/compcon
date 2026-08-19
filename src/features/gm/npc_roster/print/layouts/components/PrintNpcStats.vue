<template>
  <v-row
    justify="space-around"
    class="text-center mt-n3"
  >
    <v-col
      v-for="s in item.StatController.TrackableStats"
      :key="s.key"
      cols="auto"
      class="no-print-break"
    >
      <div class="text-caption mb-n1 text-uppercase">{{ s.title }}</div>
      <blank-line
        :height="20"
        :width="60"
        class="d-inline-block mb-n1"
      />
      <b
        class="flavor-text pt-3 text-black"
        v-text="`/${getBonusVal(s.key)}`"
      />
    </v-col>
  </v-row>

  <div class="text-center">
    <span
      v-for="s in item.StatController.NonTrackableStats"
      :key="s.key"
    >
      <v-chip
        v-if="!hideZero || (hideZero && getBonusVal(s.key) !== 0)"
        class="mx-1"
        size="x-small"
      >
        <span class="text-caption text-uppercase">{{ s.title }}</span>
        <span
          class="heading pl-2"
          style="font-size: 16px"
          v-text="getBonusVal(s.key)"
        />
      </v-chip>
    </span>
  </div>
</template>

<script setup lang="ts">
  import type { StatController } from '@/classes/components/combat/stats/StatController'
  import BlankLine from '@/ui/components/print/BlankLine.vue'

  defineOptions({ name: 'npc-stat-print' })

  const props = withDefaults(
    defineProps<{
      item: { StatController: StatController }
      hideZero?: boolean
    }>(),
    {
      hideZero: false,
    }
  )

  function getBonusVal(key: string) {
    return props.item.StatController.getMaxWithBonuses(key)
  }
</script>
