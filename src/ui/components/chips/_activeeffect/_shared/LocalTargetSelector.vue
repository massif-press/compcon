<template>
  <div :class="mobile ? 'px-2 pt-1' : 'py-5 pr-3'">
    <v-row v-for="(t, idx) in event.Targets"
      :key="`target-${idx}`"
      no-gutters>
      <v-col cols="auto"
        class="mt-1 mr-2">
        <div v-if="idx === 0"
          class="d-inline"
          style="position: relative;">
          <v-tooltip location="top">
            <template #activator="{ props }">
              <cc-button size="small"
                color="primary"
                :icon="event.AoeIcon"
                v-bind="props"
                @click="event.AoE = !event.AoE">
              </cc-button>
            </template>

            <div v-if="event.AoE">
              {{ $t('ui.combat.areaOfEffect') }}
              <span v-if="typeof event.AoE === 'string'">
                <cc-slashes />
                {{ event.AoE }}
              </span>
              <div>
                <i class="text-caption text-disabled">{{ $t('ui.combat.clickToOverride') }}</i>
              </div>
            </div>

            <div v-else
              class="text-center">
              {{ $t('ui.combat.singleTarget') }}
              <div>
                <i class="text-caption text-disabled">{{ $t('ui.combat.clickToOverride') }}</i>
              </div>
            </div>
          </v-tooltip>
        </div>
        <div v-else
          style="width: 28px"></div>
      </v-col>

      <v-col>
        <v-btn-toggle v-if="idx === 0 && event.TargetType === 'self'"
          :model-value="event.LocalTargetIsSelf ? 'self' : 'target'"
          mandatory
          divided
          density="compact"
          variant="outlined"
          color="primary"
          class="mb-1 w-100"
          @update:model-value="v => event.LocalTargetIsSelf = v === 'self'">
          <v-btn value="target"
            size="small"
            class="flex-grow-1">{{ $t('ui.combat.target') }}</v-btn>
          <v-btn value="self"
            size="small"
            class="flex-grow-1">{{ $t('ui.combat.self') }}</v-btn>
        </v-btn-toggle>
        <v-card v-else
          :key="`targetSel_${idx}`"
          class="mb-1 px-3 pa-1 text-center"
          :class="!mobile ? 'heading h3' : 'font-weight-bold text-caption'"
          color="panel"
          flat
          tile>
          <template v-if="event.AoE">{{ getOrdinal(Number(idx) + 1) }} </template>{{ $t('ui.combat.target') }}
          <v-btn v-if="event.Targets?.length > 1"
            icon
            size="20"
            variant="text"
            class="mr-n2"
            flat
            tile>
            <v-icon size="20"
              icon="mdi-close"
              @click="event.Targets.splice(idx, 1)" />
          </v-btn>
        </v-card>
        <v-btn v-if="event.AoE && idx === event.Targets?.length - 1"
          size="x-small"
          block
          flat
          tile
          color="primary"
          class="mt-1"
          @click="event.AddTarget()">
          {{ $t('ui.combat.addTarget') }}
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import type { ActiveEffectEvent } from '@/classes/components/feature/active_effects/ActiveEffectEvent'
import { useDisplay } from 'vuetify';

const { smAndDown: mobile } = useDisplay()

const props = defineProps<{
  event: ActiveEffectEvent
}>()

function getOrdinal(n) {
  const s = ["th", "st", "nd", "rd"],
    v = n % 100;
  return `${n + (s[(v - 20) % 10] || s[v] || s[0])} `;
}
</script>
