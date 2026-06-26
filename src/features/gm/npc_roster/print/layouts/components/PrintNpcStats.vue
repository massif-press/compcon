<template>
  <v-row justify="space-around" class="text-center mt-n3">
    <v-col v-for="s in item.StatController.TrackableStats" :key="s.key" cols="auto" class="no-print-break">
      <div class="text-caption mb-n1 text-uppercase">{{ s.title }}</div>
      <blank-line :height="20" :width="60" class="d-inline-block mb-n1" />
      <b class="flavor-text pt-3 text-black" v-text="`/${getBonusVal(s.key)}`" />
    </v-col>
  </v-row>

  <div class="text-center">
    <span v-for="s in item.StatController.NonTrackableStats" :key="s.key">
      <v-chip
        v-if="!hideZero || (hideZero && getBonusVal(s.key) !== 0)"
        class="mx-1"
        size="x-small">
        <span class="text-caption text-uppercase">{{ s.title }}</span>
        <span class="heading pl-2" style="font-size: 16px" v-text="getBonusVal(s.key)" />
      </v-chip>
    </span>
  </div>
</template>

<script setup lang="ts">
import type { Unit } from '@/classes/npc/unit/Unit'
import BlankLine from '../../components/blank/line.vue';
import { Bonus } from '@/classes/components/feature/bonus/Bonus';

defineOptions({ name: 'npc-stat-print' })

const props = withDefaults(defineProps<{
  item: Unit
  bonuses?: Bonus[]
  tier?: number
  hideZero?: boolean
}>(), {
  bonuses: () => [],
  tier: 1,
  hideZero: false
})

function getBonusVal(key: string) {
      const baseVal = props.item.StatController.getMax(key);
      const bonuses = (props.bonuses as Bonus[]).filter((x) => x.ID === key);
      if (bonuses.some((b) => b.Overwrite)) return bonuses.find((b) => b.Overwrite)!.Value;
      let bonusVal = 0;
      bonuses.forEach((b) => {
        if (Array.isArray(b.Value)) {
          bonusVal += Number(b.Value[props.tier]);
        } else {
          bonusVal += Number(b.Value);
        }
      });
      return (baseVal || 0) + bonusVal;
    }
</script>
