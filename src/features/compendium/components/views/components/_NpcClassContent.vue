<template>
  <c-card-base :item="item" :small="small" :highlighted="highlighted" :hover="hover">
    <template #top>
      <div class="text-center mt-2 text-stark">
        <v-icon size="30" class="mt-n3" start>{{ item.Icon }}</v-icon>
        <span class="heading h3">{{ item.Role }}</span>
      </div>
      <v-divider class="my-2" />
      <div class="text-center">
        <v-tooltip v-for="s in stats" location="top" open-delay="300">
          <template #activator="{ props }">
            <v-chip v-bind="props" label color="stark" size="small" class="ma-1"
              ><span class="text-caption"
                ><v-icon :icon="s.icon" size="small" start /> {{ s.t[0] }}<cc-slashes />{{ s.t[1]
                }}<cc-slashes />{{ s.t[2] }}</span
              >
            </v-chip>
          </template>
          <div class="text-center">
            {{ s.title }}<br />
            <span v-for="i in 3" class="px-3"
              >T{{ i }}: <b>{{ s.t[i - 1] }}</b></span
            >
          </div>
        </v-tooltip>
      </div>
    </template>
    <template #overline> &mdash; NPC Class </template>
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
  name: 'frame-card-content',
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
}
</style>
