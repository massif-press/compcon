<template>
  <div class="pa-2 mt-3">
    <div class="text-overline text-primary"
      style="line-height: 15px">
      {{ encounter.Name }}
      <span class="text-black">&mdash; {{ $t('gm.encPrint.npcTracking') }}</span>
    </div>
  </div>

  <v-row dense>
    <v-col>
      <div class="text-caption">{{ $t('gm.encPrint.enemies') }}</div>
      <npc-tracker v-for="c in Enemies"
        :key="c.id"
        :combatant="c" />
    </v-col>
    <v-col>
      <div class="text-caption">{{ $t('gm.encPrint.pcsAllies') }}</div>
      <npc-tracker v-for="c in Allies"
        :key="c.id"
        :combatant="c" />
    </v-col>
  </v-row>
  <div v-if="Neutral.length > 0">
    <div class="text-caption mt-1">{{ $t('gm.fields.neutral') }}</div>
    <v-row dense>
      <v-col cols="auto"
        v-for="c in Neutral"
        :key="c.id"
        style="min-width: 30vw">
        <npc-tracker :combatant="c" />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { sortBy } from 'lodash-es'
import NpcTracker from '../components/NpcTracker.vue'

const props = defineProps<{ encounter: Record<string, any> }>()

const SortedCombatants = computed(() =>
  sortBy(props.encounter.Combatants, (x: any) => x.playerCount).filter(
    (x: any) => x.npc && x.actor.ItemType.toLowerCase() !== 'eidolon'
  )
)
const Enemies = computed(() => SortedCombatants.value.filter((x: any) => x.side === 'enemy'))
const Allies = computed(() => SortedCombatants.value.filter((x: any) => x.side === 'ally'))
const Neutral = computed(() => SortedCombatants.value.filter((x: any) => x.side === 'neutral'))
</script>

<style scoped>
@import '@/ui/style/print-common.css';
</style>
