<template>
  <v-card v-if="duration"
    style="width: 100%"
    flat
    tile
    variant="elevated"
    class="mt-1 pa-1"
    color="light-panel">
    <div class="text-text text-caption text-center">
      <span>{{ $t('ui.combat.until') }}&nbsp;</span>
      <b>{{ displayDuration }}</b>
    </div>
  </v-card>
</template>


<script setup lang="ts">
import { computed } from 'vue';
import { EffectDuration, EffectDurationText } from '@/classes/components/feature/active_effects/effect_subtype/EffectDuration';

const props = defineProps<{
  duration: string
}>()

const displayDuration = computed((): string => EffectDurationText(props.duration as EffectDuration))
</script>
