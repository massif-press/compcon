<template>
  <v-card-text v-if="!classes.length"
    class="mt-n4">
    <v-container>
      <cc-missing-gm-lcp-text />
    </v-container>
  </v-card-text>
  <div v-else
    style="overflow-y: hidden">
    <cc-compendium-browser ref="browser"
      :items="classes"
      item-type="NpcClass"
      :table-headers="headers"
      :tier="selectedTier"
      :options="options"
      view-key="sel-npc-class"
      equippable
      @equip="SetClass($event)"
      @view-change="toggleTieredView">
      <template #header>
        <div class="heading h3 text-center text-accent">{{ $t('compendium.categories.npcClasses') }}</div>
        <v-slide-y-transition>
          <div v-if="tieredView"
            class="text-center my-n1">
            <v-btn-toggle v-model="selectedTier"
              density="compact"
              color="secondary-darken-3"
              mandatory
              style="height: 15px">
              <v-btn size="x-small"
                :value="1">{{ $t('common.tierN', { n: 1 }) }}</v-btn>
              <v-btn size="x-small"
                :value="2">{{ $t('common.tierN', { n: 2 }) }}</v-btn>
              <v-btn size="x-small"
                :value="3">{{ $t('common.tierN', { n: 3 }) }}</v-btn>
            </v-btn-toggle>
          </div>
        </v-slide-y-transition>
      </template>
    </cc-compendium-browser>
  </div>
</template>

<script setup lang="ts">
import type { Unit } from '@/classes/npc/unit/Unit'
import { useNpcClassSelector } from './useNpcClassSelector'

const props = defineProps<{
  item: Unit
}>()

const emit = defineEmits<{ close: [] }>()

const { selectedTier, tieredView, options, classes, headers, toggleTieredView } = useNpcClassSelector()

selectedTier.value = (props.item as any).NpcClassController?.Tier || 1

function getRoleIcon(role: string) {
  if (role.toLowerCase() === 'biological') return 'mdi-heart-pulse'
  return `cc:role_${role.toLowerCase()}`
}

function SetClass(c: any) {
  (props.item as any).NpcClassController.SetClass(c, (props.item as any).NpcClassController.Tier)
  emit('close')
}
</script>
