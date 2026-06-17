<template>
  <div v-if="item.CombatController.TimedEffects.length"
    class="text-cc-overline text-disabled mt-2">{{ $t('active.timedEffect.pending') }}</div>
  <v-row v-for="(t, idx) in item.CombatController.TimedEffects"
    :key="`timed-${idx}`"
    dense
    align="center"
    :class="getRoundsRemaining(t) ? 'border-md  rounded-e-xl' : 'animated-gradient-border'"
    class="my-1">
    <v-col cols="auto"
      align-self="start">
      <v-icon size="40"
        :icon="getRoundsRemaining(t) ? 'mdi-timer-sand' : 'mdi-alert-decagram-outline'" />
    </v-col>
    <v-col>
      <div class="text-cc-overline">{{ t.Name }}<span v-if="t.Origin"> // {{ t.Origin }}</span></div>
      <div class="text-text">{{ t.Detail }}</div>
    </v-col>

    <v-col cols="auto"
      v-if="getRoundsRemaining(t) > 0">
      <v-menu>
        <template #activator="{ props }">
          <v-avatar v-bind="props"
            color="primary">
            <v-icon size="x-small"
              icon="mdi-timer-sand" />
            <span class="heading mr-1">
              {{ getRoundsRemaining(t) }}
            </span>
          </v-avatar>
        </template>
        <v-card class="pa-2"
          border>
          <div class="text-center pa-2">{{ $t('active.timedEffect.roundsRemaining', { n: getRoundsRemaining(t) }) }}<br>
          </div>
          <div class="text-cc-overline text-disabled pb-1">{{ $t('active.timedEffect.override') }}</div>
          <v-row dense>
            <v-col><v-btn color="success"
                size="x-small"
                flat
                block
                tile
                @click="apply(t, Number(idx))">
                {{ $t('active.common.apply') }}
              </v-btn></v-col>
            <v-col><v-btn color="error"
                size="x-small"
                flat
                block
                tile
                @click="dismiss(idx)">
                {{ $t('common.clear') }}
              </v-btn></v-col>
          </v-row>
        </v-card>
      </v-menu>
    </v-col>

    <v-col v-else
      cols="auto">
      <v-tooltip location="top"
        :text="$t('active.tooltips.apply')">
        <template #activator="{ props }">
          <v-btn icon
            v-bind="props"
            size="small"
            class="mx-2"
            color="success"
            @click="apply(t, Number(idx))">
            <v-icon size="x-large"
              icon="mdi-check" />
          </v-btn>
        </template>
      </v-tooltip>

      <v-tooltip location="top"
        :text="$t('active.tooltips.dismissWithoutApplying')">
        <template #activator="{ props }">
          <v-btn icon
            v-bind="props"
            size="small"
            color="error"
            @click="dismiss(idx)">
            <v-icon size="x-large"
              icon="mdi-close" />
          </v-btn>
        </template>
      </v-tooltip>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type { EncounterInstance } from '@/classes/encounter/EncounterInstance'
import { useEncounterContext } from '../encounterContext'
import type { ICombatant } from '@/classes/components/combat/ICombatant'
import { TimedEffect } from '@/classes/components/feature/active_effects/TimedEffect';

const { encounterInstance } = useEncounterContext()

const props = defineProps<{
  item: ICombatant;
}>();

function getRoundsRemaining(effect: TimedEffect) {
  return Math.max(effect.Round - encounterInstance.value.Round, 0);
}

function apply(effect: TimedEffect, index: number) {
  const e = effect.Apply;
  if (e) {
    if (e.damage) e.damage.forEach((d: any) => props.item.CombatController.TakeDamage(d.type, d.value));
    if (e.status) e.status.forEach((s: any) => props.item.CombatController.AddStatus(s));
    if (e.special) e.special.forEach((s: any) => props.item.CombatController.ApplySpecial(s.attribute, s.detail));
    if (e.resist) e.resist.forEach((r: any) => props.item.CombatController.AddResist(r.type, r.value));
    if (e.other === 'self_destruct') props.item.CombatController.CommitSelfDestruct();
  }
  const r = effect.Remove;
  if (r) {
    if (r.status) r.status.forEach((s: any) => props.item.CombatController.RemoveStatus(s));
    if (r.resist) r.resist.forEach((s: any) => props.item.CombatController.RemoveResist(s));
    if (r.special) r.special.forEach((s: any) => props.item.CombatController.RemoveCustomStatus(s.attribute));
  }
  dismiss(index);
}

function dismiss(index: number) {
  props.item.CombatController.TimedEffects.splice(index, 1);
}
</script>

<style scoped>
.animated-gradient-border {
  position: relative;
  background: linear-gradient(45deg, rgb(var(--v-theme-accent)), rgb(var(--v-theme-primary)), rgb(var(--v-theme-secondary)), rgb(var(--v-theme-primary)), rgb(var(--v-theme-accent)));
  background-size: 400% 400%;
  border-radius: 0 22px 22px 0;
  animation: gradient-move 6s ease-in-out infinite;
  padding: 2px;
}

.animated-gradient-border::before {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  right: 2px;
  bottom: 2px;
  background: rgb(var(--v-theme-background));
  border-radius: 0 22px 22px 0;
  z-index: 0;
}

.animated-gradient-border>* {
  position: relative;
  z-index: 1;
}

@keyframes gradient-move {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}
</style>
