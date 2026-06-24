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
    <template #overline>&mdash; {{ $t('gm.npcBuilder.npcClass') }}</template>
  </c-card-base>
</template>

<script setup lang="ts">
import { computed } from 'vue'
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

defineOptions({ name: 'FrameCardContent' })

const props = defineProps<{
  item: object
  small?: boolean
  hover?: boolean
  highlighted?: boolean
}>()

const stats = computed(() => {
      const s = [] as any[];
      for (const key in keymap) {
        s.push({
          title: keymap[key],
          t: [
            props.item.Stats.Stat(key, 1),
            props.item.Stats.Stat(key, 2),
            props.item.Stats.Stat(key, 3),
          ],
          icon: Stats.IconMap[key],
        });
      }
      return s;
    })
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
