<template>
  <c-card-base :item="item"
    :small="small"
    :highlighted="highlighted"
    :hover="hover">
    <template #top>
      <div class="text-text mt-2 px-1">
        <v-icon start
          class="mt-n1">{{ item.Icon }}</v-icon>
        <span class="heading h4">{{ item.Role }}</span>
      </div>
      <cc-panel variant="tonal">
        <p v-html-safe="item.Terse"
          class="pa-1 text-text" />
      </cc-panel>
    </template>
    <template #overline>&mdash; NPC Class</template>
  </c-card-base>
</template>

<script lang="ts">
import { Stats } from '@/classes/components/combat/stats/Stats';
import CCardBase from './_cCardBase.vue';

const keymap = {
  hull: 'Hull',
  agi: 'Agi',
  sys: 'Sys',
  eng: 'Eng',
  armor: 'Armor',
  hp: 'HP',
  heat: 'HeatCap',
  evasion: 'Evade',
  edef: 'E-Def',
  speed: 'Speed',
  sensorRange: 'Sensor',
  saveTarget: 'Save',
};

export default {
  name: 'FrameCardContent',
  components: { CCardBase },
  props: {
    item: { type: Object, required: true },
    small: { type: Boolean },
    hover: { type: Boolean },
    highlighted: { type: Boolean },
  },
  computed: {
    stats() {
      const s = [] as any[];
      for (const key in keymap) {
        s.push({
          title: keymap[key],
          t: [
            this.item.Stats.Stat(key, 1),
            this.item.Stats.Stat(key, 2),
            this.item.Stats.Stat(key, 3),
          ],
          icon: Stats.IconMap[key],
        });
      }
      return s;
    },
  },
};
</script>

<style scoped>
.card-effect {
  height: 75px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;

  -webkit-line-clamp: 3;
  line-clamp: 3;
}
</style>
