<template>
  <v-row justify="space-around" class="text-center mt-n3">
    <v-col v-for="s in item.StatController.TrackableStats" cols="auto" class="no-print-break">
      <div class="text-caption mb-n1 text-uppercase">{{ s.title }}</div>
      <blank-line :height="20" :width="60" class="d-inline-block mb-n1" />
      <b class="flavor-text pt-3 text-black" v-text="`/${getBonusVal(s.key)}`" />
    </v-col>
  </v-row>

  <div class="text-center">
    <span v-for="s in item.StatController.NonTrackableStats">
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

<script lang="ts">
import line from '../../components/blank/line.vue';
import { Bonus } from '@/classes/components';

export default {
  name: 'npc-stat-print',
  components: { blankLine: line },
  props: {
    item: { type: Object, required: true },
    bonuses: { type: Array, default: () => [] },
    tier: { type: Number, default: 1 },
    hideZero: { type: Boolean, default: false },
  },
  methods: {
    getBonusVal(key: string) {
      const baseVal = this.item.StatController.getStat(key);
      const bonuses = (this.bonuses as Bonus[]).filter((x) => x.ID.includes(key));
      if (bonuses.some((b) => b.Overwrite)) return bonuses.find((b) => b.Overwrite)!.Value;
      let bonusVal = 0;
      bonuses.forEach((b) => {
        if (Array.isArray(b.Value)) {
          bonusVal += Number(b.Value[this.tier]);
        } else {
          bonusVal += Number(b.Value);
        }
      });
      return (baseVal || 0) + bonusVal;
    },
  },
};
</script>
